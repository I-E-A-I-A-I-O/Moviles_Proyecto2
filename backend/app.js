require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

let whitelist = ['http://localhost']

let pushWooshRoutes = require('./routers/pushWooshRoutes');
let userAuthenticationRoutes = require('./routers/userAuth');
let userDataRoutes = require('./routers/userData');
let taskRoutes = require('./routers/taskRoutes');
let userData = require('./routers/userData')

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders: ['authToken', 'Content-Type', 'Accept', 'pushToken']
}));
app.use(express.json());

app.use('/notifications', pushWooshRoutes);
app.use('/users', userAuthenticationRoutes);
app.use('/users', userDataRoutes);
app.use('/users', userData);
app.use('/tasks', taskRoutes);


app.listen(port, () => {
    console.log(`Server running in port ${port}`);
})