const express = require('express');
const { saveAssign, deleteAssign, getAllAssigns } = require('../controllers/assign.controlers');
const route = express();

route.post("/save/:areaId", saveAssign);
route.delete("/delete/:areaId", deleteAssign);
route.get("/getAllAssigns/:areaId?", getAllAssigns)

module.exports = route;