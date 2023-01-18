const allowedOrigins = [
    process.env.ALLOWED_ORIGIN_FRONT_END,
    process.env.ALLOWED_ORIGIN_DEV
];

module.exports = allowedOrigins;