**[Concourse SDK - v0.0.1](../README.md)**

> [Globals](../README.md) / "types"

# Module: "types"

## Index

### Namespaces

* [Config](_types_.config.md)

### Type aliases

* [Build](_types_.md#build)
* [Builds](_types_.md#builds)
* [ClientConfiguration](_types_.md#clientconfiguration)
* [Info](_types_.md#info)
* [Pipeline](_types_.md#pipeline)
* [PipelineConfig](_types_.md#pipelineconfig)
* [PipelineConfigFailures](_types_.md#pipelineconfigfailures)
* [ProxyConfiguration](_types_.md#proxyconfiguration)
* [Team](_types_.md#team)
* [TeamAuthConfiguration](_types_.md#teamauthconfiguration)
* [Token](_types_.md#token)

## Type aliases

### Build

Ƭ  **Build**: { api_url: string ; end_time: number ; id: number ; job_name?: undefined \| string ; name: string ; pipeline_name: string ; start_time: number ; status: BuildStatus ; team_name: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`api\_url` | string |
`end\_time` | number |
`id` | number |
`job\_name?` | undefined \| string |
`name` | string |
`pipeline\_name` | string |
`start\_time` | number |
`status` | BuildStatus |
`team\_name` | string |

___

### Builds

Ƭ  **Builds**: readonly [Build](_types_.md#build)[]

___

### ClientConfiguration

Ƭ  **ClientConfiguration**: { apiEndpoint: string ; password: string ; proxy?: [ProxyConfiguration](_types_.md#proxyconfiguration) ; username: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`apiEndpoint` | string |
`password` | string |
`proxy?` | [ProxyConfiguration](_types_.md#proxyconfiguration) |
`username` | string |

___

### Info

Ƭ  **Info**: { external_url: string ; version: string ; worker_version: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`external\_url` | string |
`version` | string |
`worker\_version` | string |

___

### Pipeline

Ƭ  **Pipeline**: { archived: boolean ; id: number ; last_updated: number ; name: string ; paused: boolean ; public: boolean ; team_name: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`archived` | boolean |
`id` | number |
`last\_updated` | number |
`name` | string |
`paused` | boolean |
`public` | boolean |
`team\_name` | string |

___

### PipelineConfig

Ƭ  **PipelineConfig**: { jobs: readonly [Job](_types_.config.md#job)[] ; resources: readonly [Resource](_types_.config.md#resource)[]  }

#### Type declaration:

Name | Type |
------ | ------ |
`jobs` | readonly [Job](_types_.config.md#job)[] |
`resources` | readonly [Resource](_types_.config.md#resource)[] |

___

### PipelineConfigFailures

Ƭ  **PipelineConfigFailures**: { errors?: readonly string[] ; warnings?: readonly { message: string ; type: string  }[]  }

#### Type declaration:

Name | Type |
------ | ------ |
`errors?` | readonly string[] |
`warnings?` | readonly { message: string ; type: string  }[] |

___

### ProxyConfiguration

Ƭ  **ProxyConfiguration**: AxiosProxyConfig

___

### Team

Ƭ  **Team**: { auth: [TeamAuthConfiguration](_types_.md#teamauthconfiguration) ; id: number ; name: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`auth` | [TeamAuthConfiguration](_types_.md#teamauthconfiguration) |
`id` | number |
`name` | string |

___

### TeamAuthConfiguration

Ƭ  **TeamAuthConfiguration**: { [config:string]: { groups?: readonly string[] ; users?: readonly string[]  };  }

___

### Token

Ƭ  **Token**: { access_token: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`access\_token` | string |
