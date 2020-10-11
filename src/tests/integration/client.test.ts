import nock from 'nock';

import { Client } from '../../client';
import { ClientConfiguration, PipelineConfig } from '../../types';

const config: ClientConfiguration = {
  apiEndpoint: process.env['CONCOURSE_API'] || 'http://localhost:8080',
  password: process.env['CONCOURSE_PASSWORD'] || 'test',
  username: process.env['CONCOURSE_USERNAME'] || 'test',
};

const team_name = 'integration';
const pipeline_name = 'test';
const job_name = 'hello';

const team = {
  auth: {
    local: {
      users: [ config.username ],
    },
  },
  name: team_name,
};

const pipeline = {
  name: pipeline_name,
  team_name,
};

const build = {
  job_name,
  pipeline_name,
  team_name,
};

const pipelineConfig: PipelineConfig = {
  jobs: [
    {
      name: job_name,
      plan: [
        { get: 'timer-1m', trigger: true },
        {
          config: {
            image_resource: { source: { repository: 'alpine' }, type: 'docker-image' },
            params: { NAME: 'world' },
            platform: 'linux',
            run: { args: [ '-e', '-u', '-c', 'echo "Hello, ${NAME}!"' ], path: 'sh' },
          },
          task: 'say-hello',
        },
      ],
    },
  ],
  resources: [
    { name: 'timer-1m', source: { interval: '1m' }, type: 'time' },
  ],
};

describe(Client, () => {
  const client = new Client(config);

  let nockConcourse: nock.Scope;

  beforeEach(() => {
    nockConcourse = nock(config.apiEndpoint);
  });

  afterEach(() => {
    nockConcourse.done();

    nock.cleanAll();
  });

  describe('authenticate', () => {
    it('should successfully authenticate with Concourse', async () => {
      const response = await client.getInfo();

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('external_url');
    });

    it('should fail to authenticate with Concourse due to invalid credentials', async () => {
      const faultyClient = new Client({
        apiEndpoint: process.env['CONCOURSE_API'] || 'http://localhost:8080',
        password: 'THIS_USERNAME_SHOULD_NOT_HAVE_SUCH_PASSWORD',
        username: 'THIS_USERNAME_SHOULD_NOT_EXIST',
      });

      await expect(faultyClient.getInfo()).rejects.toThrowError();
    });
  });

  describe(Client.prototype.getInfo, () => {
    it('should successfully make the api call', async () => {
      const response = await client.getInfo();

      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('external_url');
    });
  });

  describe(Client.prototype.setTeam, () => {
    it('should successfully create a team', async () => {
      const response = await client.setTeam({ ...team, auth: { local: { users: [ 'config.username' ] } } });

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('auth');
      expect(response.auth).toHaveProperty('local');
      expect(response.auth.local).toHaveProperty('users');
      expect(response.auth.local.users).not.toContain(config.username);
    });

    it('should successfully update the team', async () => {
      const response = await client.setTeam(team);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name');
    });
  });

  describe(Client.prototype.getTeam, () => {
    it('should successfully make the api call', async () => {
      const response = await client.getTeam(team);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('auth');
      expect(response.auth).toHaveProperty('local');
      expect(response.auth.local).toHaveProperty('users');
      expect(response.auth.local.users).toContain(config.username);
    });
  });

  describe(Client.prototype.setPipelineConfig, () => {
    it('should successfully make the api call', async () => {
      const response = await client.setPipelineConfig(pipeline, pipelineConfig);

      expect(response).not.toHaveProperty('errors');
      expect(response).not.toHaveProperty('warnings');
    });
  });

  describe(Client.prototype.getPipeline, () => {
    it('should successfully make the api call', async () => {
      const response = await client.getPipeline(pipeline);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name');
    });
  });

  describe(Client.prototype.getPipelineConfig, () => {
    it('should successfully make the api call', async () => {
      const response = await client.getPipelineConfig(pipeline);

      expect(response).toHaveProperty('jobs');
      expect(response).toHaveProperty('resources');
    });
  });

  describe(Client.prototype.pausePipeline, () => {
    it('should successfully make the api call', async () => {
      await expect(client.pausePipeline(pipeline)).resolves.not.toThrowError();
    });
  });

  describe(Client.prototype.unpausePipeline, () => {
    it('should successfully make the api call', async () => {
      await expect(client.unpausePipeline(pipeline)).resolves.not.toThrowError();
    });
  });

  describe(Client.prototype.createJobBuild, () => {
    it('should successfully make the api call', async () => {
      const response = await client.createJobBuild(build);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('team_name');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('job_name');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('pipeline_name');
    });
  });

  describe(Client.prototype.listPipelineBuilds, () => {
    it('should successfully make the api call', async () => {
      const response = await client.listPipelineBuilds(pipeline);

      expect(response.length).toBeGreaterThan(0);
      expect(response[0]).toHaveProperty('id');
      expect(response[0]).toHaveProperty('team_name');
      expect(response[0]).toHaveProperty('name');
      expect(response[0]).toHaveProperty('status');
      expect(response[0]).toHaveProperty('pipeline_name');
    });
  });

  describe(Client.prototype.buildEvents, () => {
    it('should successfully make the api call', async done => {
      const builds = await client.listPipelineBuilds(pipeline);

      expect(builds.length).toBeGreaterThan(0);
      expect(builds[0]).toHaveProperty('id');

      const response = await client.buildEvents(builds[0]);

      new Promise((resolve, reject) => {
        // eslint-disable-next-line functional/prefer-readonly-type
        const events: Buffer[] = [];

        response.on('data', (chunk: Buffer) => {
          events.push(chunk);

          const data = chunk.toString();
          if (data.includes('event: end')) {
            response.emit('end');

            return;
          }
        });
        response.on('error', reject);
        response.on('end', () => resolve(Buffer.concat(events)));
      })
        .then(buffer => {
          expect((buffer as Buffer).toString('utf-8')).toContain('Hello, world!');
          done();
        })
        .catch(err => {
          expect(err).toBeUndefined();
        });
    }, 1000 * 60 * 5); // 5 minute timeout
  });

  describe(Client.prototype.deletePipeline, () => {
    it('should successfully make the api call', async () => {
      await expect(client.deletePipeline(pipeline)).resolves.not.toThrowError();
    });
  });

  describe(Client.prototype.deleteTeam, () => {
    it('should successfully make the api call', async () => {
      await expect(client.deleteTeam(team)).resolves.not.toThrowError();
    });
  });
});
