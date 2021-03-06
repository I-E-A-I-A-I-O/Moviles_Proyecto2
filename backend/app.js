require('dotenv');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

let pushWooshRoutes = require('./routers/pushWooshRoutes');

app.use(cors({
    credentials: true,
    origin: 'http://localhost'
  }));
app.use(express.json());

app.use('/notifications', pushWooshRoutes);

app.listen(port, () => {
    console.log(`Server running in port ${port}`);
})