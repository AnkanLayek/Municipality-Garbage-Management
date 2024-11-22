// dustbinModel.js

const mongoose = require('mongoose');

const dustbinModel = mongoose.Schema({
    dustbinId: {
        type: String,
        required: true
    },
    dustbinNo: {
        type: Number,
        required: true
    },
    areaId: {
        type: String,
        ref: "area"
    },
    coords: {
        lat: Number,
        lng: Number
    },
    isVisited: {
        type: Boolean,
        default: false,
    },
    visitedTime: {
        type: Date,
        default: null,
    },
})

module.exports = mongoose.model('dustbin', dustbinModel);