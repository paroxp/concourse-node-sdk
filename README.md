# Concourse NodeJS SDK

Interact with Concourse API from a node application.

## Disclaimer

I do not work for Concourse.

This library doesn't provide the full coverage of Concourse API. I've only built as much as necessary for my current
needs.

Hopefully I'll get some time in the future to cover more endpoints.

The full list of
[endpoints available can be found here](https://github.com/concourse/concourse/blob/master/atc/routes.go).

Feel free to raise any PRs adding extra coverage.

## What's the need?

The real need behind this project, is ability to use Concourse as an engine for running CI/CD for PaaS tenants, without
exposing them to Concourse interface.

Think: GitHub Actions, DigitalOcean App Deployments, Heroku Deployments.

## Documentation

Find the `docs/` directory which is generated from source code.

## Testing

Majority of the tests are written as integration tests, and there is very little unit tests as it stands.

You can test locally, by running the [Concourse in docker-compose setup](https://github.com/concourse/concourse-docker),
or setting `CONCOURSE_API`, `CONCOURSE_PASSWORD`, `CONCOURSE_USERNAME` environment variables.

To run all the tests `integration` and `unit`, run:

```sh
npm run test
```
