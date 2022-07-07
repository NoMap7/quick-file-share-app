require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: ['http://localhost:3000']
}
app.use(cors(corsOptions));

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.json());

const connectDB = require('./config/db');
connectDB();

//routers
app.use('/api/files', require('./routes/fileUploadRouter'));
app.use('/files/download', require('./routes/fileDownloadRouter'));
app.use('/files', require('./routes/downloadPageRouter'));
app.use('/', require('./routes/homePageRouter'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})