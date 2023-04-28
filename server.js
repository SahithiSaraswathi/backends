const express = require("express");
const mongoose = require("mongoose");
var path=require('path')
const app = express();
require("dotenv").config();
const cors = require('cors');
const multer = require('multer')
var morgan=require('morgan')
var rfs=require('rotating-file-stream')
var Users = require('./models/userModel');
var Doctor = require('./models/doctorModel');
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(cors());
const swaggerUi = require('swagger-ui-express')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isDoctor: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    seenNotifications: {
        type: Array,
        default: [],
    },
    unseenNotifications: {
        type: Array,
        default: [],
    },
    status : {
        type: String,
        default: "approved",
    }
}, {
    timestamps: true
})

const upload = multer({ storage: storage });
app.use(express.json());

const Registers = mongoose.model('users',userSchema);
Registers.createIndex({email:1},(err) => {
  if(err) {
    console.error(err)
  }
  else{
    console.log('Index created on email field');
  }
});
app.get('/read',async(req,res) => {
  try{
    const results = await Registers.find({}).sort({email:1}).exec();
  }
  catch(err){
    res.status(500).send(err);
  }
});

app.get('/',(req,res)=>{
  res.send('Welcome to mongo db')
})

app.post('/image',upload.single('file'),function(req,res){
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
})


var access=rfs.createStream('access.log',{
    interval: '1h' ,
    path:path.join(__dirname,'log')
})
app.use(morgan('tiny',{stream:access}))
const dbConfig = require("./config/dbConfig");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");


app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);


const port = process.env.PORT || 5000;
console.log(process.env.MONGO_URL);
app.listen(port, () => console.log(`Listening in the port ${port}`));


