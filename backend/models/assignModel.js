const mongoose = require('mongoose');

const assignModel = mongoose.Schema({
    areaId: {
        type: String,
        ref: "area"
    },
    driverUsername: {
        type: String,
        res: "driver"
    },
    vehicalReg: {
        type: String,
    }
})

module.exports = mongoose.model('assign', assignModel);