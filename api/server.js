const express = require("express")
const app = express()
const PORT = 3000


const hostelRouter = require("./routes/hostels")

app.use("/hostels", hostelRouter)

app.listen(PORT, () => {
    console.log("Server listening..")
})