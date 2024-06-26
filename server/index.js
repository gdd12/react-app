const express = require('express');
const passport = require('./auth/passport');
const session = require('express-session');
const db = require('./database/db');
const cors = require('cors');
const Sequelize = require('sequelize');
const config = require('config');
const { 
  secretKey, 
  apiVersion, 
  application: {
    port
  },
  database: {
    user,
    password,
    host,
    dbport,
    database,
    dialect
  }
} = config;

// Import controllers
const userRoutes = require('./controllers/user');
const authRoutes = require('./controllers/auth')
const loansRoutes = require('./controllers/loans')
const paymentsRoutes = require('./controllers/payments')

const app = express();
app.use(cors());

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(`${apiVersion}/user`, userRoutes)
app.use(`${apiVersion}/auth`, authRoutes)
app.use(`${apiVersion}/loans`, loansRoutes)
app.use(`${apiVersion}/payments`, paymentsRoutes)

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.log('Unable to connect to the database:', err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});