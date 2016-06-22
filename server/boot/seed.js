module.exports = (app, done) => {
    console.log("DSSSSSSSSSSSSSS")
    var ApiConfig = app.models.ApiConfig;
    ApiConfig.find((err, configs) => {
        if(err) return done(err)
        if (configs.length == 0) {
            ApiConfig.create([
                {
                    name: 'route1',
                    plugins: ['discovery', 'proxy'],
                    entry: '/public/cars',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'cars',
                        withPath: '/api/cars'
                    }
                },
                {
                    name: 'route2',
                    plugins: ['discovery', 'proxy'],
                    entry: '/public/makers',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'cars',
                        withPath: '/api/makers'
                    }
                },
                {
                    name: 'route3',
                    plugins: ['discovery', 'proxy'],
                    entry: '/public/enginetypes',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'cars',
                        withPath: '/api/enginetypes'
                    }
                },
                {
                    name: 'route4',
                    plugins: ['authentication', 'discovery', 'proxy'],
                    entry: '/profiles/cars',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'cars',
                        withPath: '/api/cars',
                        grant: ['read']
                    }
                },
                {
                    name: 'route5',
                    plugins: ['discovery', 'proxy'],
                    entry: '/auth',
                    methods: ["POST"],
                    config: {
                        mapTo: 'profile',
                        withPath: '/auth'
                    }
                },
                {
                    name: 'route6',
                    plugins: ['authentication', 'discovery', 'proxy'],
                    entry: '/profiles',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'profile',
                        withPath: '/profiles',
                        grant: ['read']
                    }
                },
                {
                    name: 'route7',
                    plugins: ['discovery', 'proxy'],
                    entry: '/tracks',
                    methods: ['GET'],
                    config: {
                        mapTo: 'tracker',
                        withPath: '/tracks'
                    }
                },
                {
                    name: 'route8',
                    plugins: ['authentication', 'discovery', 'proxy'],
                    entry: '/users',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'profile',
                        withPath: '/users',
                        grant: ['read']
                    }
                },
                {
                    name: 'route9',
                    plugins: ['authentication', 'discovery', 'proxy'],
                    entry: '/image',
                    methods: ['GET', "POST"],
                    config: {
                        mapTo: 'image',
                        withPath: '/api'
                    }
                },
                {
                    name: 'route10',
                    plugins: ['discovery', 'proxy'],
                    entry: '/',
                    methods: ['GET'],
                    config: {
                        mapTo: 'web',
                        withPath: '/',
                    }
                },

            ], (err, configs) => {
                console.log("DEFAULT DATA SET", configs)
                done(err)
            })
        }else{
            done()
        }
    })

};
