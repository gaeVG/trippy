const express = require("express")
const app = express()
const PORT = 3000


const hostelRouter = require("./routes/hostelsRoutes")
const restaurantRouter = require("./routes/restaurantsRoutes")

app.use("/hostels", hostelRouter)
app.use("/restaurants", restaurantRouter)

app.listen(PORT, () => {
    console.log("Server listening..")
})