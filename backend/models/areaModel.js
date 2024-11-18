const mongoose = require('mongoose');

const areaModel = mongoose.Schema({
    areaName: String,
    areaId: String,
    dustbins: [
        {
            type: String,
            ref: "dustbin"
        }
    ]
})

module.exports = mongoose.model('area', areaModel);