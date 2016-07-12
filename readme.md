[![CircleCI][circle-image]][circle-url]
[![Coverage Status][coverage-image]][coverage-url]

[![Dependency Status][david-image]][david-url]

# 200LOC-GATE

200Loc-gate is a scalable, plugin based, open source API Middleware manager (API Gateway). 
Being deployed in front of your API servers uses defined plugins to process incoming calls.

Made to be small, simple and open. Use custom or build-in plugins to implement your logic for route processing and 
the client to manage them.

> Based on Loopback framework, that makes it simple to use with various datasources.
> See [loopback docs](https://docs.strongloop.com/display/public/LB/Database+connectors) for more info.

### NOTE! Solution is under development and is not ready. 
- [ ] implement monitoring system
- [ ] add more standard plugins
- [ ] add [docker](https://www.docker.com/) support
- [ ] users and authentication
- [ ] documentation

### NOTE! Requires MongoDb installed for sample plugins

## Quick start
```bash
# clone the repo
$ git clone https://github.com/byavv/200Loc-gate.git

# change into the repo directory
$ cd 200Loc-gate

# install 
$ npm install

# build
$ npm run build     

# run
$ npm start              
```
## Api management process: 
![screen](https://cloud.githubusercontent.com/assets/15154388/16776036/1d4f82c4-486c-11e6-878a-006a121b9205.png)
    

## Development
### Build
Development build (by default):
```bash
$ gulp build
```
### Serve/watch
Start *Gateway server* on 3001 and *Api explorer* on 5601 in development mode:
```bash
$ gulp
```
### Testing
```bash
$ gulp test 
```
[circle-image]: https://circleci.com/gh/byavv/200Loc-gate.svg?style=shield
[circle-url]: https://circleci.com/gh/byavv/200Loc-gate
[coverage-url]: https://coveralls.io/github/byavv/200loc-gate?branch=master
[coverage-image]: https://coveralls.io/repos/github/byavv/200Loc-gate/badge.svg?branch=master
[david-image]: https://david-dm.org/byavv/200loc-gate.svg
[david-url]: https://david-dm.org/byavv/200loc-gate
