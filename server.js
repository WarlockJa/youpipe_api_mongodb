require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const app = express();
const PORT = process.env.PORT || 5000;

//testing
// app.use(cors());


// Connect to monogDB
connectDB();

// Middleware
// checks sent credentials before CORS and sets cookies status to allowed if origin is in the whitelist
app.use(credentials);
// Cross-Origin Resource Sharing
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routers
app.get("/", (req, res) => { res.send("API is running") });
app.use('/userUnauthorized', require('./routes/userUnauthorized'));
app.use('/videoUnauthorized', require('./routes/videoUnauthorized'));
app.use('/commentUnauthorized', require('./routes/commentUnauthorized'));
app.use('/auth', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));
app.use('/refresh', require('./routes/refresh'));
// // passing all routes that can be accessed without JWT
app.use(verifyJWT);
app.use('/register', require('./routes/register'));
app.use('/userAuthorized', require('./routes/userAuthorized'));
app.use('/videoAuthorized', require('./routes/videoAuthorized'));
app.use('/commentAuthorized', require('./routes/commentAuthorized'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})