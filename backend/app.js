const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const cookieParser = require("cookie-parser")


//! Access Port 

const PORT = process.env.PORT || "6000"
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env file");
}

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => console.error("MongoDB connection failed:", err.message));

const login = require("./routes/login")
const agent = require('./routes/agent')
const uploads = require("./routes/uploads")
const verifyJsonToken = require("./middleware/verifyToken")
const { upload } = require("./middleware/multer")
const agentlist = require("./routes/agentList")

const app = express(); 
app.use(cookieParser());
app.use(express.json(),cors(),express.urlencoded({extended: false}))
// app.use(
//   cors({
//     origin: "https://localhost:3000",
//     credentials: true
//   })
// );

app.use("/login",login)
app.use("/agent", verifyJsonToken, agent)
app.use("/uploads", verifyJsonToken, upload.single("file"),uploads)
app.use("/agentlist",verifyJsonToken,agentlist)

app.listen(PORT , () => {
    console.log("server is now ready to work on the port" + PORT)
})