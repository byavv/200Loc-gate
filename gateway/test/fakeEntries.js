const debug = require('debug')('test')
module.exports = function seedTestData(app, done) {
    let ApiConfig = app.models.ApiConfig;
    ApiConfig.create([
        {
            name: 'route1',
            entry: '/test',
            methods: ['GET', "POST"],
            plugins: [
                {
                    name: "errPlugin",
                    settings: {
                        throwError: true,
                        errorCode: 404
                    }
                }
            ]
        },
        {
            name: 'route2',
            entry: '/test2',
            methods: ['GET', "POST"],
            plugins: [
                {
                    name: "errPlugin",
                    settings: {
                        throwError: false,
                    }
                },
                {
                    name: "errPlugin",
                    settings: {
                        throwError: true,
                        errorCode: 500
                    }
                }
            ]
        },
        {
            name: 'route3',
            entry: '/test3',
            methods: ['GET', "POST"],
            plugins: [
                {
                    name: "errPlugin",
                    settings: {
                        throwError: false,
                    }
                }                
            ]
        },
         {
            name: 'route4',
            entry: '/test4',
            methods: ['GET', "POST"],
            plugins: [
                {
                    name: "setDynamicPlugin",
                    settings: {
                        
                    }
                },
                {
                    name: "simplePlugin",
                    settings: {
                        dynamic: "${dynamic}",
                    }
                }                
            ]
        },
        {
            name: 'route5',
            entry: '/test5',
            methods: ['GET', "POST"],
            plugins: [                
                {
                    name: "simplePlugin",
                    settings: {
                        env: "env{SOME_HOST}",
                    }
                }                
            ]
        }
    ], (err, configs) => {        
        done(err)
    })
};
