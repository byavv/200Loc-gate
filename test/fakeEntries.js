module.exports = (app, done) => {
    var ApiConfig = app.models.ApiConfig;
    ApiConfig.find((err, configs) => {
        if (err) return done(err)
        if (configs.length == 0) {
            ApiConfig.create([
                {
                    name: 'route1',
                    entry: '/public/cars',
                    methods: ['GET', "POST"],
                    plugins: [
                        {
                            name: "discovery",
                            settings: {
                                mapTo: 'cars',
                            }

                        },
                        {
                            name: " proxy",
                            target: '${target}',
                            withPath: '/api/cars'
                        }
                    ]
                }
            ], (err, configs) => {
                console.log("DEFAULT DATA SET", configs)
                done(err)
            })
        } else {
            done()
        }
    })
    done()
};
