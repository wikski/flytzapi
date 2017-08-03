const Hapi              = require('hapi')
const server            = new Hapi.Server()
const Good              = require('good')
const moment            = require('moment')

server.connection({
    host: 'localhost',
    port: 6969,
    routes: {
        cors: true
    }
})

server.route({
    method: 'GET',
    path: '/',
    handler: (req, res) => {

        res('Wow splendid days!')
    }
})

server.route({
    method: 'GET',
    path: '/timeline',
    handler: (req, res) => {

        const aMonthFromNow     = moment().utc().add(1, 'month')
        const timeline          = []
        let firstWeekend

        switch(Number(aMonthFromNow.format('d'))){

            case 0 :
                // sunday

                firstWeekend = aMonthFromNow.add(4, 'days')

                break

            case 1 :
                // monday

                firstWeekend = aMonthFromNow.add(3, 'days')

                break

            case 2 :
                // tuesday

                firstWeekend = aMonthFromNow.add(2, 'days')

                break

            case 3 :
                // wednesday

                firstWeekend = aMonthFromNow.add(1, 'days')

                break

            case 4 :
                // thursday

                firstWeekend = aMonthFromNow

                break

            case 5 :
                // friday

                firstWeekend = aMonthFromNow.subtract(1, 'days')

                break

            case 6 :
                // saturday

                firstWeekend = aMonthFromNow.subtract(2, 'days')

                break

            default :

                return null
        }

        for(let i = 0; i <= 6; i++){

            const
                friday = firstWeekend.clone(),
                sunday = firstWeekend.clone().add(2, 'days')

            timeline.push({
                active: i === 0 ? true : false,
                friday: friday.add(i, 'weeks').format('Do'),
                sunday: sunday.add(i, 'weeks').format('Do MMM'),
            })
        }

        return res(timeline)
    }
})

server.register({
    register: Good,
    options: {
        reporters: {
            console: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [
                        {
                            response: '*',
                            log: '*'
                        }
                    ]
                },
                {
                    module: 'good-console'
                },
                'stdout'
            ]
        }
    }

}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(err => {

        if(err){

            throw err
        }

        console.log('...and we\'re up & runnin at: ', server.info.uri)
    })
})