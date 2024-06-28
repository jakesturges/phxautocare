const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://jake-admin:1234@cluster0.l6cvsvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Serve static files from current directory
app.use(express.static(__dirname));

//create a data schema
const bookingsSchema = {
    fullName: String,
    email: String,
    number: String,
    car: String,
    package: String,
    date: String,
    timeSlot: String,
    comments: String
};

const Booking = mongoose.model("Booking", bookingsSchema);

//app.get

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/unavailable-times', async function (req, res) {
    const selectedDate = req.query.date;
    try {
        const bookings = await Booking.find({ date: selectedDate }, 'timeSlot');
        const unavailableTimes = bookings.map(booking => booking.timeSlot);
        res.json(unavailableTimes);
    } catch (err) {
        res.status(500).send(err);
    }
});



//app.post
app.post("/", async function (req, res) {
    let newBooking = new Booking({
        fullName: req.body.fullName,
        email: req.body.email,
        number: req.body.number,
        car: req.body.car,
        package: req.body.package,
        date: req.body.date,
        timeSlot: req.body.timeSlot,
        comments: req.body.comments
    });
    try {
        await newBooking.save();
        res.redirect("/?status=success");
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(3000, function () {
    console.log("server is running on 3000");
});