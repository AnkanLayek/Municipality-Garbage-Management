const express = require('express');
const http = require('http')
const { Server } = require('socket.io');
const cors = require('cors');
const methods = require('methods');
const path = require('path');

const adminRouter = require('./routes/admin.routes');
const areaRouter = require('./routes/area.routes');
const pathRouter = require('./routes/path.routes');
const dustbinRouter = require('./routes/dustbin.routes');
const driverRouter = require('./routes/driver.routes');
const assignRouter = require('./routes/assign.routes');
const vehicleRouter = require('./routes/vehicle.routes');
const cookieParser = require('cookie-parser');
const db = require('./configs/mongooseConnection');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    }
});

io.on("connection", (socket) => {
    const isAdmin = socket.handshake.query.isAdmin === 'true'
    console.log("♪(^∇^*)  A new user connected with ID ", socket.id, ". Is Admin ? ", isAdmin);
    socket.join("AdminTrackingRoom")
    socket.on('send location', (data) => {
        console.log(data.areaId.areaId , data.location.latitude, data.location.longitude)
        socket.to("AdminTrackingRoom").emit("receive location", {id: socket.id, areaId: data.areaId.areaId, ...data});
    })
    socket.on('stop location', (data) => {
        socket.to("AdminTrackingRoom").emit("driver disconnected", {id: socket.id, areaId: data.areaId.areaId})
    })
    socket.on('disconnect', () => {
        console.log("＞︿＜  An user disconnected of ID ", socket.id, ". Is Admin ? ", isAdmin);
        // if(!isAdmin){
        //     socket.to("AdminTrackingRoom").emit("driver disconnected", {id: socket.id, areaId: data.areaId.areaId})
        // }
    })
})

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        methods: ["GET", "POST", "DELETE"],
        credentials: true
    })
)

app.set("view engine", "ejs");

app.use("/admin", adminRouter);
app.use("/area", areaRouter);
app.use("/path", pathRouter);
app.use("/dustbin", dustbinRouter);
app.use("/driver", driverRouter);
app.use("/assign", assignRouter);
app.use("/vehicle", vehicleRouter);

app.get("/", (req, res) => {
    res.send("server is running .... ");
});

server.listen(3000, () => {    // handle the port****
    console.log("Server is running on port 3000")
});