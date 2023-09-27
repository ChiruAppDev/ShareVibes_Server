const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router');
const requestLogger = require('./utilities/requestLogger');
const errorLogger = require('./utilities/errorLogger');
const port = 4200;

const corsOptions = {
  origin: '*', // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.use(errorLogger);
app.use('/', router);

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
