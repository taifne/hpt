const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const compression = require('compression')
const { default: helmet } = require('helmet')
const { errorHandler } = require('@src/base/helpers/Wrapper')
const ExampleController = require('@controllers/ExampleController')
const userRouter = require("@routers/user/UsersRouter")
const authRouter=require('@routers/auth/AuthRoute')


const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/users",userRouter);
app.use("/auth",authRouter);
app.get(
    "/",
    ExampleController.get
)
app.use(errorHandler)
module.exports = app