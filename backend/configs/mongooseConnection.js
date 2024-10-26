const mongoose = require('mongoose');

mongoose
.connect("mongodb://127.0.0.1:27017/MGCProject")
.then(()=>{
    console.log("Connected to Database");
})
.catch((err) => {
    console.log(err.message)
});

module.exports = mongoose.connection;