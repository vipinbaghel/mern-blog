const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

//middlewares
app.use(cookieParser());

app.use(cors({credentials: true, origin: 'https://playful-biscuit-c078b1.netlify.app'}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'))



const CONNECTION_URL = process.env.MONGODB_URI;
mongoose.connect(CONNECTION_URL, {
    dbName: 'mongo_blog'
}).then(()=> {
    console.log(`connected to db`);
}).catch((err) => console.error('mongo connection failed', err));



app.use('', userRouter);
app.use('', postRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
});
