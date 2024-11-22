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
    vehicleReg: {
        type: String,
        res: "vehicle"
    }
})

module.exports = mongoose.model('assign', assignModel);