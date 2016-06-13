[![CircleCI](https://circleci.com/gh/byavv/200Loc-gate.svg?style=svg)](https://circleci.com/gh/byavv/200Loc-gate)
# Simple api gateway as part of this [solution](https://github.com/byavv/funny-market)

Finds service url in etcd using [etcd-registry](https://www.npmjs.com/package/etcd-registry) lib and uses 
[node-http-proxy](https://github.com/nodejitsu/node-http-proxy) for request routing. 
To configure your gateway server modify **gateway.config.yml** 

### Configuration sample: 

```yml
 # Access to route '/sampleapi' will be granted only for users in role1 OR role2:
 access:
    - url: /sampleapi
      grant:      
         - role1
         - role2
            
 # Define paths, client requests will be forwarded to.
 proxy:
    - rule: '.*/api'
      mapTo: '{etcd_key}/api'
      withPath: '/api'
      
 # Define rate limiting for any url.
 # Uses https://github.com/jhurliman/node-rate-limiter limiter, so
 # interval and limit options are equal to the node-rate-limiter's (see link below)

 rate: 
 # max 5 requests per minute    
    - paths: ['/login']
      methods: ['post']
      interval: 60000
      limit: 5
```
