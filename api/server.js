require('dotenv').config()
const express = require("express")
const db = require("mongoose")
const dotenv = require("dotenv")
const app = express()

db.connect(process.env.DB, {
	useNewUrlParser: true,
})
.then(() => {
	console.log("Connected to MongoDB !");
});



const hostelRouter = require("./routes/hostelsRoutes")
const restaurantRouter = require("./routes/restaurantsRoutes")

app.use("/hostels", hostelRouter)
app.use("/restaurants", restaurantRouter)

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}..`)
});
