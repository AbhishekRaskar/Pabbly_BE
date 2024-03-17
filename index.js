const express = require("express")
require("dotenv").config()
const cors = require("cors")
const { Connection } = require("./Config/db")
const { userRouter } = require("./Routes/userRoute")
const { taskRouter } = require("./Routes/taskRoute")
const app = express()


app.use(cors())
app.use(express.json())
app.use("/users", userRouter)
app.use("/tasks", taskRouter)


app.listen(process.env.PORT, async () => {
    try {
        await Connection
        console.log(`Server is running at PORT ${process.env.PORT}`);
        console.log("Connected to Database");
    } catch (error) {
        console.log("Something Went Wrong.");
        console.log(error.message);
    }
})