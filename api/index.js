import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=> {
    console.log('Connected to MongoDB');
}).catch((err)=> {
    console.error('Error connecting to MongoDB', err);
});

const app = express();

app.get('/test', (req, res) => {
    res.send('API is working');
});

app.listen(3000, ()=> {
    console.log('Server running on port 3000');
});