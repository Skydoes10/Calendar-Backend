const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

// database connection
dbConnection();

// CORS
app.use( cors() );

// public folder
app.use( express.static('public') );

// body parser
app.use( express.json() );

// routes
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen( process.env.PORT, () => {
    console.log(`Server is running on port ${ process.env.PORT }`);
});