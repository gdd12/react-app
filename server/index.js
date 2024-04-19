const express = require('express');
const passport = require('./auth/passport');
const userRoutes = require('./controllers/user');
const session = require('express-session');
const db = require('./database/db');
const cors = require('cors');

const app = express();
app.use(cors());

const secretKey = 'superSecretKeyLOL123!'

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
