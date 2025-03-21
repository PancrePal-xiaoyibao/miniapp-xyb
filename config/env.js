const env = process.env.NODE_ENV || 'development'

const config = {
    development: {
        debug: true,
        timeout: 180000,
        retryTimes: 3
    },
    production: {
        debug: false,
        timeout: 120000,
        retryTimes: 2
    }
}

module.exports = config[env]