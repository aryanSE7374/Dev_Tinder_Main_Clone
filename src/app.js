const env = require("dotenv")
env.config();
const express = require("express");
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json());
app.use(cookieParser())

const authRouter = require("./routes/auth")
const authProfile = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/",authRouter);
app.use("/" , authProfile);
app.use("/",requestRouter);
app.use("/" , userRouter)

//connection of MongoDB
connectDB().then(()=>{
    console.log("Data base successfully established")
    app.listen(process.env.PORT , console.log("Server is listening "))
}).catch((err)=>{
    console.log(err)
})
