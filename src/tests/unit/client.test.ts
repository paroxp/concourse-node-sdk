import nock from 'nock';

import { Client } from '../../client';
import { ClientConfiguration } from '../../types';

describe(Client, () => {
  let client: Client;
  let nockConcourse: nock.Scope;

  const config: ClientConfiguration = {
    apiEndpoint: 'https://example.com',
    password: 'admin',
    username: 'password',
  };

  beforeEach(() => {
    nock.cleanAll();

    client = new Client(config);
    nockConcourse = nock(config.apiEndpoint);
  });

  afterEach(() => {
    nockConcourse.done();

    nock.cleanAll();
  });

  describe(Client.prototype.getInfo, () => {
    it('should only call for token once', async () => {
      nockConcourse
        .post('/sky/issuer/token')
        .times(1)
        .reply(200, { access_token: 'qwertyuiop' })

        .get('/api/v1/info')
        .times(3)
        .reply(200);

      await client.getInfo();
      await client.getInfo();
      await client.getInfo();
    });
  });
});
