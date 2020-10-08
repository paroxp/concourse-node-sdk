**[Concourse SDK - v0.0.1](../README.md)**

> [Globals](../README.md) / ["types"](_types_.md) / Config

# Namespace: Config

## Index

### Type aliases

* [Job](_types_.config.md#job)
* [Resource](_types_.config.md#resource)

## Type aliases

### Job

Ƭ  **Job**: { name: string ; plan: readonly Step[]  }

#### Type declaration:

Name | Type |
------ | ------ |
`name` | string |
`plan` | readonly Step[] |

___

### Resource

Ƭ  **Resource**: { icon?: undefined \| string ; name: string ; source: { branch?: undefined \| string ; interval?: undefined \| string ; uri?: undefined \| string  } ; type: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`icon?` | undefined \| string |
`name` | string |
`source` | { branch?: undefined \| string ; interval?: undefined \| string ; uri?: undefined \| string  } |
`type` | string |
