require("dotenv").config();
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
const webpush = require("web-push");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const publicVapidKey = process.env.PUBLICKEY;
const privateVapidKey = process.env.PRIVATEKEY;

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);
var users = [];
var connections = [];

let demoData = [{
        id: "1",
        name: "asdasd"
    },
    {
        id: "2",
        name: "asdasd"
    },
    {
        id: "3",
        name: "asdasd"
    },
    {
        id: "4",
        name: "abc"
    },
    {
        id: "5",
        name: "xyz"
    },
    {
        id: "6",
        name: "ccc"
    }
];

server.listen(process.env.PORT || 3000);

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/data", (req, res) => {
    res.json(demoData);
});

app.get("/data/:id", (req, res) => {
    let id = req.params.id;
    res.send(id);
});

// Subscribe Route
app.post("/subscribe", (req, res) => {
    const data = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({
        title: "Tiêu đề",
        body: "Thông báo: có nội dung cần xem",
        image: "",
        icon: "https://via.placeholder.com/100x100",
        tag: "1"
    });

    // Pass object into sendNotification
    webpush
        .sendNotification(data.subscription, payload)
        .catch(err => console.error(err));
});

io.sockets.on("connection", function (socket) {
    connections.push(socket);
    console.log(`Connected: ${connections.length}`);

    // Disconnect
    socket.on("disconnect", function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnect: ${connections.length}`);
    });

    socket.on("send message", data => {
        console.log(data);
        io.sockets.emit("new message", {
            msg: data
        });
    });
});