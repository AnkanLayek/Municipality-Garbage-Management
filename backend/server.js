const express = require('express');
const http = require('http')
const { Server } = require('socket.io');
const cors = require('cors');

const adminRouter = require('./routes/admin.routes');
const areaRouter = require('./routes/area.routes');
const dustbinRouter = require('./routes/dustbin.routes');
const driverRouter = require('./routes/driver.routes');
const assignRouter = require('./routes/assign.routes');
const cookieParser = require('cookie-parser');
const db = require('./configs/mongooseConnection');
const methods = require('methods');

const app = express();
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
    console.log("♪(^∇^*)  A new user connected with ID ", socket.id);
    socket.on('disconnect', () => {
        console.log("＞︿＜  An user disconnected of ID ", socket.id);
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
app.use("/dustbin", dustbinRouter);
app.use("/driver", driverRouter);
app.use("/assign", assignRouter);

app.get("/", (req, res) => {
    res.send("server is running .... ");
});

server.listen(3000, () => {    // handle the port****
    console.log("Server is running on port 3000")
});