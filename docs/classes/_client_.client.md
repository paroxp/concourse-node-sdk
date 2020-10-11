**[Concourse SDK - v0.0.1](../README.md)**

> [Globals](../README.md) / ["client"](../modules/_client_.md) / Client

# Class: Client

## Hierarchy

* **Client**

## Index

### Constructors

* [constructor](_client_.client.md#constructor)

### Properties

* [apiEndpoint](_client_.client.md#apiendpoint)

### Methods

* [buildEvents](_client_.client.md#buildevents)
* [createJobBuild](_client_.client.md#createjobbuild)
* [deletePipeline](_client_.client.md#deletepipeline)
* [deleteTeam](_client_.client.md#deleteteam)
* [getInfo](_client_.client.md#getinfo)
* [getPipeline](_client_.client.md#getpipeline)
* [getPipelineConfig](_client_.client.md#getpipelineconfig)
* [getTeam](_client_.client.md#getteam)
* [listPipelineBuilds](_client_.client.md#listpipelinebuilds)
* [pausePipeline](_client_.client.md#pausepipeline)
* [setPipelineConfig](_client_.client.md#setpipelineconfig)
* [setTeam](_client_.client.md#setteam)
* [unpausePipeline](_client_.client.md#unpausepipeline)

## Constructors

### constructor

\+ **new Client**(`config`: [ClientConfiguration](../modules/_types_.md#clientconfiguration)): [Client](_client_.client.md)

Setup the client with custom configuration.

**`example`** 
```typescript
const client = new Client({
  apiEndpoint: 'https://concourse.example.com',
  username: 'admin',
  password: 'secr3t;',
});
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`config` | [ClientConfiguration](../modules/_types_.md#clientconfiguration) | Client configuration object, containing credentials, Concourse URI and proxy configuration  |

**Returns:** [Client](_client_.client.md)

## Properties

### apiEndpoint

• `Readonly` **apiEndpoint**: string

Concourse URI

## Methods

### buildEvents

▸ **buildEvents**(`__namedParameters`: { id: number  }): Promise\<IncomingMessage>

Start the stream of events from build.

Concourse does not stop sending the events - which could cause your IncomingMessage to never emit `end` event.

**`example`** 
```typescript
const stream = await client.buildEvents({ id: 123 });

const buffer = await new Promise((resolve, reject) => {
  const events: Buffer[] = [];

  response.on('data', (chunk: Buffer) => {
    events.push(chunk);

    const data = Buffer.concat(events).toString();
    if (data.includes('event: end')) {
      return response.emit('end');
    }
  });
  response.on('error', reject);
  response.on('end', () => resolve(Buffer.concat(events)));
});
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { id: number  } | An object containing fined team configuration |

**Returns:** Promise\<IncomingMessage>

Stream of incoming events

___

### createJobBuild

▸ **createJobBuild**(`__namedParameters`: { job_name: string ; pipeline_name: string ; team_name: string  }): Promise\<[Build](../modules/_types_.md#build)>

Trigger the pipeline's job to run.

**`example`** 
```typescript
const build = await client.createJobBuild({
  job_name: 'test',
  pipeline_name: 'info',
  team_name: 'main',
});
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { job_name: string ; pipeline_name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<[Build](../modules/_types_.md#build)>

Created build object

___

### deletePipeline

▸ **deletePipeline**(`__namedParameters`: { name: string ; team_name: string  }): Promise\<void>

Delete an existing pipeline.

**`example`** 
```typescript
await client.deletePipeline({ name: 'info', team_name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<void>

Concourse responds with an empty string or null

___

### deleteTeam

▸ **deleteTeam**(`__namedParameters`: { name: string  }): Promise\<void>

Delete an existing concourse team.

**`example`** 
```typescript
await client.deleteTeam({ name: 'existing-team' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string  } | An object containing fined team configuration |

**Returns:** Promise\<void>

Concourse responds with an empty string or null

___

### getInfo

▸ **getInfo**(): Promise\<[Info](../modules/_types_.md#info)>

Obtain information about the concourse.

**`example`** 
```typescript
const info = await client.getInfo();
```

**Returns:** Promise\<[Info](../modules/_types_.md#info)>

Concourse information object

___

### getPipeline

▸ **getPipeline**(`__namedParameters`: { name: string ; team_name: string  }): Promise\<[Pipeline](../modules/_types_.md#pipeline)>

Retreive metadata regarding particular pipeline.

**`example`** 
```typescript
const pipeline = await client.getPipeline({ name: 'info', team_name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<[Pipeline](../modules/_types_.md#pipeline)>

Pipeline metadata. Does not include pipeline configuration

___

### getPipelineConfig

▸ **getPipelineConfig**(`__namedParameters`: { name: string ; team_name: string  }): Promise\<{ config: [PipelineConfig](../modules/_types_.md#pipelineconfig) ; version: string  }>

Obtain pipeline configuration.

**`example`** 
```typescript
const pipelineConfig = await client.getPipelineConfig({ name: 'info', team_name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<{ config: [PipelineConfig](../modules/_types_.md#pipelineconfig) ; version: string  }>

Pipeline's configuration and config version

___

### getTeam

▸ **getTeam**(`__namedParameters`: { name: string  }): Promise\<[Team](../modules/_types_.md#team)>

Obtain a specific team.

**`example`** 
```typescript
const team = await client.getTeam({ name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string  } | An object containing fined team configuration |

**Returns:** Promise\<[Team](../modules/_types_.md#team)>

Team object

___

### listPipelineBuilds

▸ **listPipelineBuilds**(`__namedParameters`: { name: string ; team_name: string  }): Promise\<[Builds](../modules/_types_.md#builds)>

List all pipeline builds thus far.

**`example`** 
```typescript
const builds = await client.listPipelineBuilds({ name: 'info', team_name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<[Builds](../modules/_types_.md#builds)>

List of build objects in order of latest to oldest

___

### pausePipeline

▸ **pausePipeline**(`__namedParameters`: { name: string ; team_name: string  }): Promise\<void>

Pause specific pipeline.

**`example`** 
```typescript
await client.pausePipeline({ name: 'info', team_name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<void>

Concourse responds with an empty string or null

___

### setPipelineConfig

▸ **setPipelineConfig**(`__namedParameters`: { name: string ; team_name: string  }, `config`: [PipelineConfig](../modules/_types_.md#pipelineconfig), `version?`: undefined \| string): Promise\<[PipelineConfigFailures](../modules/_types_.md#pipelineconfigfailures)>

Update specific pipeline's configuration or Create new pipeline with specified configuration.

**`example`** 
```typescript
// create pipeline
const issues = await client.setPipelineConfig({ name: 'info', team_name: 'main' }, pipelineConfig);

// update pipeline
const issues = await client.setPipelineConfig({ name: 'info', team_name: 'main' }, pipelineConfig, version);
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |
`config` | [PipelineConfig](../modules/_types_.md#pipelineconfig) | Pipeline's configuration |
`version?` | undefined \| string | Pipeline's configuration version  |

**Returns:** Promise\<[PipelineConfigFailures](../modules/_types_.md#pipelineconfigfailures)>

Possible warnings or errors with pipeline configuration

___

### setTeam

▸ **setTeam**(`__namedParameters`: { auth: [TeamAuthConfiguration](../modules/_types_.md#teamauthconfiguration) ; name: string  }): Promise\<[Team](../modules/_types_.md#team)>

Create or Update new concourse team.

**`example`** 
```typescript
const team = await client.getTeam({
  name: 'new-team',
  auth: {
    github: {
      users: [ 'octocat' ],
    },
  },
});
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { auth: [TeamAuthConfiguration](../modules/_types_.md#teamauthconfiguration) ; name: string  } | An object containing fined team configuration |

**Returns:** Promise\<[Team](../modules/_types_.md#team)>

Team object

___

### unpausePipeline

▸ **unpausePipeline**(`__namedParameters`: { name: string ; team_name: string  }): Promise\<void>

Unpause specific pipeline.

**`example`** 
```typescript
await client.unpausePipeline({ name: 'info', team_name: 'main' });
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`__namedParameters` | { name: string ; team_name: string  } | An object containing fined team configuration |

**Returns:** Promise\<void>

Concourse responds with an empty string or null
