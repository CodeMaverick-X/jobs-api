require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authRouter = require('./routes/auth')
const connectDB = require('./db/connect')
const jobsRouter = require('./routes/jobs')
const authentication = require('./middleware/authentication')

// security packages
const helmet = require('helmet')
const  cors = require('cors')
const xss = require('xss-clean')
const ratelimiter = require('express-rate-limit')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages

app.set('trust proxy', 1)
app.use(ratelimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each ip to 100 request per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/jobs', authentication, jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
