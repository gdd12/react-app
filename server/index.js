const express = require('express');
const passport = require('./auth/passport');
const session = require('express-session');
const db = require('./database/db');
const cors = require('cors');
const config = require('config');
const { secretKey } = config

// Import controllers
const userRoutes = require('./controllers/user');
const authRoutes = require('./controllers/auth')
const loansRoutes = require('./controllers/loans')

const app = express();
app.use(cors());

const apiVersioning = '/api/v1'

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(`${apiVersioning}/user`, userRoutes)
app.use(`${apiVersioning}/auth`, authRoutes)
app.use(`${apiVersioning}/loans`, loansRoutes)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { secretKey };