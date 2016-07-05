module.exports = (app, done) => {
   /* var ApiConfig = app.models.ApiConfig;
    ApiConfig.find((err, configs) => {
        if (err) return done(err)
        if (configs.length == 0) {
            ApiConfig.create([
                {
                    name: 'route1',
                    entry: '/public/cars',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'cars',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/api/cars'
                        }
                    }
                },
                {
                    name: 'route2',
                    entry: '/public/makers',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'cars',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/api/makers'
                        }
                    }
                },
                {
                    name: 'route3',
                    entry: '/public/enginetypes',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'cars',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/api/enginetypes'
                        }
                    }
                },
                {
                    name: 'route4',
                    entry: '/profiles/cars',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'cars',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/api/cars',
                        },
                        authentication: {
                            grant: 'read'
                        }
                    }
                },
                {
                    name: 'route5',
                    entry: '/auth',
                    methods: ["POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'profile',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/auth'
                        }
                    }
                },
                {
                    name: 'route6',                   
                    entry: '/profiles',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'profile',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/profiles'
                        },
                        authentication: {
                            grant: 'read'
                        }
                    }
                },
                {
                    name: 'route7',                   
                    entry: '/tracks',
                    methods: ['GET'],
                    plugins: {
                        discovery: {
                            mapTo: 'tracker',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/tracks'
                        }
                    }
                },
                {
                    name: 'route8',                  
                    entry: '/users',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'profile',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/users'
                        },
                        authentication: {
                            grant: 'read'
                        }
                    }
                },
                {
                    name: 'route9',                  
                    entry: '/image',
                    methods: ['GET', "POST"],
                    plugins: {
                        discovery: {
                            mapTo: 'image',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/api'
                        }
                    }
                },
                {
                    name: 'route10',                
                    entry: '/',
                    methods: ['GET'],
                    plugins: {
                        discovery: {
                            mapTo: 'web',
                        },
                        proxy: {
                            target: '${target}',
                            withPath: '/',
                        }
                    }
                },

            ], (err, configs) => {
                console.log("DEFAULT DATA SET", configs)
                done(err)
            })
        } else {
            done()
        }
    })
*/








 done()
};
