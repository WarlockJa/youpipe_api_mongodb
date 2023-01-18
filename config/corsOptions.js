// Cross Origin Resource Sharing
const allowedOrigins = require('./allowedOrigins');
// corsOptions from the documentation
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1) { // || !origin) { // for localhost testing
            callback(null, origin)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;