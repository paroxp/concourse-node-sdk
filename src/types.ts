import { AxiosProxyConfig } from 'axios';

export type ClientConfiguration = {
  readonly apiEndpoint: string;
  readonly password: string;
  readonly proxy?: ProxyConfiguration;
  readonly username: string;
};

export type ProxyConfiguration = AxiosProxyConfig;

export namespace Config {
  namespace Step {
    export type Get = {
      readonly get: string;
      readonly params?: { readonly [key: string]: string | number | boolean | object; }
      readonly passed?: readonly string[];
      readonly resource?: string;
      readonly trigger?: boolean;
    };

    export type Put = {
      readonly get_params?: { readonly [key: string]: string | number | boolean | object; }
      readonly inputs?: 'all' | 'detect' | readonly string[];
      readonly params?: { readonly [key: string]: string | number | boolean | object; }
      readonly put: string;
      readonly resource?: string;
    };

    export type Task = {
      readonly config?: {
        readonly container_limits?: {
          readonly cpu?: number;
          readonly memory?: number;
        };
        readonly image_resource: {
          readonly source: {
            readonly repository: string;
            readonly tag?: string;
          };
          readonly type: string;
        };
        readonly inputs?: readonly string[];
        readonly outputs?: readonly string[];
        readonly params?: { readonly [key: string]: string; }
        readonly platform: 'linux' | 'darwin' | 'windows';
        readonly run: {
          readonly path: string;
          readonly args?: readonly string[];
        };
      };
      readonly input_mapping?: { readonly [key: string]: string; };
      readonly output_mapping?: { readonly [key: string]: string; };
      readonly params?: { readonly [key: string]: string; }
      readonly task: string;
    };
  }

  type Step = Step.Task | Step.Get | Step.Put;

  export type Job = {
    readonly name: string;
    readonly plan: readonly Step[];
  };

  export type Resource = {
    readonly icon?: string;
    readonly name: string;
    readonly source: {
      readonly branch?: string;
      readonly interval?: string;
      readonly uri?: string;
    };
    readonly type: string;
  };
}

export type TeamAuthConfiguration = {
  readonly [config: string]: {
    readonly groups?: readonly string[];
    readonly users?: readonly string[];
  };
};

type BuildStatus = 'started' | 'pending' | 'succeeded' | 'failed' | 'errored' | 'aborted';

  export type Token = {
    readonly access_token: string;
  };

  export type Info = {
    readonly external_url: string;
    readonly version: string;
    readonly worker_version: string;
  };

  export type Team = {
    readonly auth: TeamAuthConfiguration;
    readonly id: number;
    readonly name: string;
  };

  export type Pipeline = {
    readonly id: number;
    readonly name: string;
    readonly paused: boolean;
    readonly public: boolean;
    readonly archived: boolean;
    readonly team_name: string;
    readonly last_updated: number;
  };

  export type PipelineConfig = {
    readonly jobs: readonly Config.Job[];
    readonly resources: readonly Config.Resource[];
  };

  export type PipelineConfigFailures = {
    readonly errors?: readonly string[];
    readonly warnings?: readonly {
      readonly message: string;
      readonly type: string;
    }[];
  };

  export type Build = {
    readonly api_url: string;
    readonly end_time: number;
    readonly id: number;
    readonly job_name?: string;
    readonly name: string;
    readonly pipeline_name: string;
    readonly start_time: number;
    readonly status: BuildStatus;
    readonly team_name: string;
  };

  export type Builds = readonly Build[];
