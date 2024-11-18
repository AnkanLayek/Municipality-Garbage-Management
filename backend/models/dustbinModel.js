// dustbinModel.js

const mongoose = require('mongoose');

const dustbinModel = mongoose.Schema({
    dustbinId: String,
    dustbinNo: String,
    areaId: {
        type: String,
        ref: "area"
    },
    coords: {
        lat: Number,
        lng: Number
    }
})

module.exports = mongoose.model('dustbin', dustbinModel);