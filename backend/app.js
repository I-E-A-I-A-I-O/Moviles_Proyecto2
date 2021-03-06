require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

let whitelist = ['http://localhost']

let pushWooshRoutes = require('./routers/pushWooshRoutes');

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}));
app.use(express.json());

app.use('/notifications', pushWooshRoutes);

app.listen(port, () => {
    console.log(`Server running in port ${port}`);
})