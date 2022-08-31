"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.AppDataSource = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Nuser_1 = require("./models/Nuser");
const Cuser_1 = require("./models/Cuser");
const Notification_1 = require("./models/Notification");
const Issue_1 = require("./models/Issue");
const Counter_1 = require("./models/Counter");
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const counterUserRoutes_1 = __importDefault(require("./routes/counterUserRoutes"));
const normalUserRoutes_1 = __importDefault(require("./routes/normalUserRoutes"));
const verifyToken_1 = require("./libs/verifyToken");
const socket_io_1 = require("socket.io");
const cusercontroller_1 = require("./controllers/cusercontroller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "queuesystem",
    entities: [Counter_1.Counter, Cuser_1.Cuser, Issue_1.Issue, Notification_1.Notification, Nuser_1.Nuser],
    synchronize: true,
    logging: false,
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', loginRoute_1.default);
app.use('/cuser', verifyToken_1.ValidateToken, counterUserRoutes_1.default);
app.use('/nuser', verifyToken_1.ValidateToken, normalUserRoutes_1.default);
exports.AppDataSource.initialize()
    .then(() => {
    console.log('db connected');
})
    .catch((error) => console.log(error));
exports.io = new socket_io_1.Server(server, { cors: { origin: "http://localhost:3000" } });
let onlineUsers = [];
const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) && onlineUsers.push({ username, socketId });
};
const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
};
exports.io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
    });
    console.log('online users', onlineUsers);
    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };
    socket.on("sendNotification", ({ receiverName, type, id }) => {
        const receiver = getUser(receiverName);
        console.log(getUser(receiverName));
        exports.io.to(receiver.socketId).emit("getNotification", {
            id,
            type
        });
    });
    setInterval(function () {
        (0, cusercontroller_1.getcurrentnext2)().then((Counter) => {
            exports.io.emit('getqueuenum1', Counter);
        });
        (0, cusercontroller_1.getcurrentnext3)().then((Counter) => {
            exports.io.emit('getqueuenum2', Counter);
        });
        (0, cusercontroller_1.getcurrentnext4)().then((Counter) => {
            exports.io.emit('getqueuenum3', Counter);
        });
    }, 1000);
    socket.on('disconnect', () => {
        removeUser(socket.id);
    });
});
server.listen(8000, () => {
    console.log('app running on server 8000');
});
//# sourceMappingURL=index.js.map