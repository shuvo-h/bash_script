// external imports 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";

// build express app 
const app = express();
const port = process.env.PORT || 5000;

// app middlewares 
dotenv.config();
const corsOptions = {
    origin: [process.env.FRONTEND_BASE_URL, process.env.FRONTEND_DEV_URL],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser(`${process.env.COOKIE_SIGN_SECRET}`));

// internal imports 
import { errorHandler, notFoundHandler } from "./src/middleware/common/errorHandler.mjs";
import { authRouter } from "./src/router/authenticateRouter.mjs";
import { videoRouter } from "./src/router/videoRouter.mjs";
// import { callToStartChildAutomation } from "./src/videoConverter/processInitializer/childProcessCreator.mjs";
import { callToStartChildAutomation } from "./src/videoConverter/processInitializer/childProcessCreator.mjs";

// database connection 
mongoose.connect(process.env.MONGO_CONNECTION_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Article2Video'
}).then(()=>console.log("DB connection successfull."))
.catch(err => console.log(err))

// routing setup 
// Authentication registration login router 
app.use("/auth",authRouter)

// video route
app.use("/video",videoRouter)


// public test route 
app.get("/", (req,res)=>{
    res.send("Article 2 video server running...")
    
})


// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler)

app.listen(port,()=>{
    console.log("Article 2 Video running at ",port);
})





    // *************************************             *************************************
        
            // video convert automation(continue the process forever)
            const ConvertAutomation = await callToStartChildAutomation();
        
        
    // *************************************             *************************************