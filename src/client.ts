import { IncomingMessage } from 'http';

import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { ResourceOwnerPassword } from 'simple-oauth2';

import {
  Build,
  Builds,
  ClientConfiguration,
  Info,
  Pipeline,
  PipelineConfig,
  PipelineConfigFailures,
  ProxyConfiguration,
  Team,
  TeamAuthConfiguration,
} from './types';

const DEFAULT_TIMEOUT = 30000;

export class Client {
  /**
   * Concourse URI
   */
  public readonly apiEndpoint: string;

  private readonly credentials: {
    readonly password: string;
    readonly username: string;
  };
  private readonly proxy?: ProxyConfiguration;
  private token?: string;

  /**
   * Setup the client with custom configuration.
   *
   * @param config Client configuration object, containing credentials, Concourse URI and proxy configuration
   *
   * @example
   * ```typescript
   * const client = new Client({
   *   apiEndpoint: 'https://concourse.example.com',
   *   username: 'admin',
   *   password: 'secr3t;',
   * });
   * ```
   */
  constructor(config: ClientConfiguration) {
    this.apiEndpoint = config.apiEndpoint;
    this.credentials = config;
    this.proxy = config.proxy;
  }

  private async authenticate(): Promise<string> {
    const client = new ResourceOwnerPassword({
      auth: {
        tokenHost: this.apiEndpoint,
        tokenPath: '/sky/issuer/token',
      },
      client: {
        id: 'fly',
        secret: 'Zmx5',
      },
    });

    const response = await client.getToken({
      password: this.credentials.password,
      scope: ['openid', 'profile', 'email', 'federated:id', 'groups'],
      username: this.credentials.username,
    });

    return response.token.access_token;
  }

  private async request<T>(method: Method, url: string, opts?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (!this.token) {
      this.token = await this.authenticate();
    }

    const response = await axios.request<T>({
      baseURL: this.apiEndpoint,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      method,
      proxy: this.proxy,
      timeout: DEFAULT_TIMEOUT,
      url,
      validateStatus: (status: number) => status > 0 && status <= 400,

      ...opts,
    });

    return response;
  }

  /**
   * Obtain information about the concourse.
   *
   * @returns Concourse information object
   *
   * @example
   * ```typescript
   * const info = await client.getInfo();
   * ```
   */
  async getInfo(): Promise<Info> {
    const response = await this.request<Info>('get', '/api/v1/info');

    return response.data;
  }

  /**
   * Obtain a specific team.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Team's name
   *
   * @returns Team object
   *
   * @example
   * ```typescript
   * const team = await client.getTeam({ name: 'main' });
   * ```
   */
  async getTeam({ name }: { name: string }): Promise<Team>
  async getTeam({ name }: Team): Promise<Team> {
    const response = await this.request<Team>('get', `/api/v1/teams/${name}`);

    return response.data;
  }

  /**
   * Create or Update new concourse team.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param auth Auth configuration in accordance with https://concourse-ci.org/configuring-auth.html
   * @param name Team's name
   *
   * @returns Team object
   *
   * @example
   * ```typescript
   * const team = await client.getTeam({
   *   name: 'new-team',
   *   auth: {
   *     github: {
   *       users: [ 'octocat' ],
   *     },
   *   },
   * });
   * ```
   */
  async setTeam({ auth, name }: { auth: TeamAuthConfiguration, name: string }): Promise<Team>
  async setTeam({ auth, name }: Team): Promise<Team> {
    const response = await this.request<{ readonly team: Team; }>('put', `/api/v1/teams/${name}`, {
      data: {
        auth,
      },
    });

    return response.data.team;
  }

  /**
   * Delete an existing concourse team.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Team's name
   *
   * @returns Concourse responds with an empty string or null
   *
   * @example
   * ```typescript
   * await client.deleteTeam({ name: 'existing-team' });
   * ```
   */
  async deleteTeam({ name }: { name: string }): Promise<void>
  async deleteTeam({ name }: Team): Promise<void> {
    await this.request('delete', `/api/v1/teams/${name}`);
  }

  /**
   * Retreive metadata regarding particular pipeline.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   *
   * @returns Pipeline metadata. Does not include pipeline configuration
   *
   * @example
   * ```typescript
   * const pipeline = await client.getPipeline({ name: 'info', team_name: 'main' });
   * ```
   */
  async getPipeline({ name, team_name }: { name: string, team_name: string }): Promise<Pipeline>;
  async getPipeline({ name, team_name }: Pipeline): Promise<Pipeline> {
    const response = await this.request<Pipeline>('get', `/api/v1/teams/${team_name}/pipelines/${name}`);

    return response.data;
  }

  /**
   * Delete an existing pipeline.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   *
   * @returns Concourse responds with an empty string or null
   *
   * @example
   * ```typescript
   * await client.deletePipeline({ name: 'info', team_name: 'main' });
   * ```
   */
  async deletePipeline({ name, team_name }: { name: string, team_name: string }): Promise<void>;
  async deletePipeline({ name, team_name }: Pipeline): Promise<void> {
    await this.request('delete', `/api/v1/teams/${team_name}/pipelines/${name}`);
  }

  /**
   * Obtain pipeline configuration.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   *
   * @returns Pipeline's configuration
   *
   * @example
   * ```typescript
   * const pipelineConfig = await client.getPipelineConfig({ name: 'info', team_name: 'main' });
   * ```
   */
  async getPipelineConfig({ name, team_name }: { name: string, team_name: string }): Promise<Pipeline>;
  async getPipelineConfig({ name, team_name }: Pipeline): Promise<Pipeline> {
    const response = await this.request<{
      readonly config: Pipeline;
    }>('get', `/api/v1/teams/${team_name}/pipelines/${name}/config`);

    return response.data.config;
  }

  /**
   * Update specific pipeline's configuration or Create new pipeline with specified configuration.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   * @param config Pipeline's configuration
   *
   * @returns Possible warnings or errors with pipeline configuration
   *
   * @example
   * ```typescript
   * const issues = await client.setPipelineConfig({ name: 'info', team_name: 'main' }, pipelineConfig);
   * ```
   */
  async setPipelineConfig(
    { name, team_name }: {
      name: string, team_name: string,
    },
    config: PipelineConfig,
  ): Promise<PipelineConfigFailures>;
  async setPipelineConfig({ name, team_name }: Pipeline, config: PipelineConfig): Promise<PipelineConfigFailures> {
    const response = await this.request<PipelineConfigFailures>(
      'put',
      `/api/v1/teams/${team_name}/pipelines/${name}/config`,
      { data: config });

    return response.data;
  }

  /**
   * Pause specific pipeline.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   *
   * @returns Concourse responds with an empty string or null
   *
   * @example
   * ```typescript
   * await client.pausePipeline({ name: 'info', team_name: 'main' });
   * ```
   */
  async pausePipeline({ name, team_name }: { name: string, team_name: string }): Promise<void>;
  async pausePipeline({ name, team_name }: Pipeline): Promise<void> {
    await this.request('put', `/api/v1/teams/${team_name}/pipelines/${name}/pause`);
  }

  /**
   * Unpause specific pipeline.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   *
   * @returns Concourse responds with an empty string or null
   *
   * @example
   * ```typescript
   * await client.unpausePipeline({ name: 'info', team_name: 'main' });
   * ```
   */
  async unpausePipeline({ name, team_name }: { name: string, team_name: string }): Promise<void>;
  async unpausePipeline({ name, team_name }: Pipeline): Promise<void> {
    await this.request('put', `/api/v1/teams/${team_name}/pipelines/${name}/unpause`);
  }

  /**
   * List all pipeline builds thus far.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param name Pipeline's name
   * @param team_name Team's name
   *
   * @returns List of build objects in order of latest to oldest
   *
   * @example
   * ```typescript
   * const builds = await client.listPipelineBuilds({ name: 'info', team_name: 'main' });
   * ```
   */
  async listPipelineBuilds({ name, team_name }: { name: string, team_name: string }): Promise<Builds>;
  async listPipelineBuilds({ name, team_name }: Pipeline): Promise<Builds> {
    const response = await this.request<Builds>('get', `/api/v1/teams/${team_name}/pipelines/${name}/builds`);

    return response.data;
  }

  /**
   * Trigger the pipeline's job to run.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param job_name Jobs's name
   * @param pipeline_name Pipeline's name
   * @param team_name Team's name
   *
   * @returns Created build object
   *
   * @example
   * ```typescript
   * const build = await client.createJobBuild({
   *   job_name: 'test',
   *   pipeline_name: 'info',
   *   team_name: 'main',
   * });
   * ```
   */
  async createJobBuild({ job_name, pipeline_name, team_name }: {
    job_name: string,
    pipeline_name: string,
    team_name: string,
  }): Promise<Build>;
  async createJobBuild({ job_name, pipeline_name, team_name }: Build & { job_name: string }): Promise<Build> {
    const response = await this.request<Build>(
      'post',
      `/api/v1/teams/${team_name}/pipelines/${pipeline_name}/jobs/${job_name}/builds`,
    );

    return response.data;
  }

  /**
   * Start the stream of events from build.
   *
   * Concourse does not stop sending the events - which could cause your IncomingMessage to never emit `end` event.
   *
   * @param __namedParameters An object containing fined team configuration
   * @param id Build's ID
   *
   * @returns Stream of incoming events
   *
   * @example
   * ```typescript
   * const stream = await client.buildEvents({ id: 123 });
   *
   * const buffer = await new Promise((resolve, reject) => {
   *   const events: Buffer[] = [];
   *
   *   response.on('data', (chunk: Buffer) => {
   *     events.push(chunk);
   *
   *     const data = Buffer.concat(events).toString();
   *     if (data.includes('event: end')) {
   *       return response.emit('end');
   *     }
   *   });
   *   response.on('error', reject);
   *   response.on('end', () => resolve(Buffer.concat(events)));
   * });
   * ```
   */
  async buildEvents({ id }: { id: number }): Promise<IncomingMessage>;
  async buildEvents({ id }: Build): Promise<IncomingMessage> {
    const response = await this.request<IncomingMessage>(
      'get',
      `/api/v1/builds/${id}/events`,
      { responseType: 'stream' },
    );

    return response.data;
  }
}
