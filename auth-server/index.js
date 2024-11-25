const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const imageRoute = require('./routes/image');
const userRoute = require('./routes/user');
const foodRoute = require('./routes/food');
const orderRoute = require('./routes/order');

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());
dotenv.config();
const cors = require('cors');
const port = process.env.PORT || 8000;
app.use(cors());
app.get('/', (req, res) => {
    res.send("Hello world");
});


// connect db 

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("disconnected");
});
mongoose.connection.on("connected", () => {
    console.log("connected to database");
});
app.use('/api/vl/all', imageRoute);
app.use('/api/vl/user', userRoute);
app.use('/api/vl/food', foodRoute);
app.use('/api/vl/order', orderRoute);

app.use(express.json({ limit: "2mb" }));

app.listen(port, () => {
    connect();
    console.log(`Listening from ${port}`);
});