"use strict";
exports.__esModule = true;
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
var lodash_1 = require("lodash");
require("dotenv/config");
var cors = require("cors");
var express = require("express");
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
var nanoidShort = (0, nanoid_1.customAlphabet)('1234567890abcdefghi', 6);
var userCollection = db_1.firestore.collection("users");
var roomCollection = db_1.firestore.collection("rooms");
app.post("/rooms", function (req, res) {
    var roomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
    roomRef.set({
        currentGame: ""
    }).then(function () {
        var roomLongId = roomRef.key;
        var roomId = nanoidShort(6);
        roomCollection.doc(roomId.toString()).set({
            rtdbRoomId: roomLongId
        }).then(function () {
            res.json({
                id: roomId.toString(),
                rtdbLongId: roomLongId.toString()
            });
        });
    });
});
app.get("/rooms/:roomId/check", function (req, res) {
    var roomId = req.params.roomId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var gameRoomRef = db_1.rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/currentGame/gameData");
        gameRoomRef.once("value").then(function (snap) {
            var snapData = snap.val();
            var listData = (0, lodash_1.map)(snapData);
            var getNames = listData.map(function (p) { return p.name; });
            var numberOfPlayers = listData.length;
            var roomValues = {
                names: getNames,
                playersOnline: numberOfPlayers
            };
            res.json(roomValues);
        }, function () { res.json("ok"); });
    });
});
app.patch("/rooms/wins", function (req, res) {
    var _a = req.body, wins = _a.wins, roomId = _a.roomId, userId = _a.userId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var playerRef = db_1.rtdb.ref("/rooms/".concat(rtdbId.rtdbRoomId, "/currentGame/gameData/").concat(userId));
        playerRef.update({
            wins: wins
        }, function () { res.json("ok"); });
    });
});
app.patch("/rooms/ready", function (req, res) {
    var _a = req.body, ready = _a.ready, roomId = _a.roomId, userId = _a.userId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var playerRef = db_1.rtdb.ref("/rooms/".concat(rtdbId.rtdbRoomId, "/currentGame/gameData/").concat(userId));
        playerRef.update({
            ready: ready
        }, function () { res.json("ok"); });
    });
});
app.patch("/rooms/choice", function (req, res) {
    var _a = req.body, choice = _a.choice, roomId = _a.roomId, userId = _a.userId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var playerRef = db_1.rtdb.ref("/rooms/".concat(rtdbId.rtdbRoomId, "/currentGame/gameData/").concat(userId));
        playerRef.update({
            choice: choice
        }, function () { res.json("ok"); });
    });
});
app.patch("/rooms/online", function (req, res) {
    var _a = req.body, online = _a.online, roomId = _a.roomId, userId = _a.userId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var playerRef = db_1.rtdb.ref("/rooms/".concat(rtdbId.rtdbRoomId, "/currentGame/gameData/").concat(userId));
        playerRef.update({
            online: online
        }, function () { res.json("ok"); });
    });
});
app.patch("/rooms/hasPlayed", function (req, res) {
    var _a = req.body, hasPlayed = _a.hasPlayed, roomId = _a.roomId, userId = _a.userId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var playerRef = db_1.rtdb.ref("/rooms/".concat(rtdbId.rtdbRoomId, "/currentGame/gameData/").concat(userId));
        playerRef.update({
            hasPlayed: hasPlayed
        }, function () { res.json("ok"); });
    });
});
app.post("/roomData", function (req, res) {
    var userId = req.body.userId;
    var roomId = req.body.roomId;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        var gameRoomRef = db_1.rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/currentGame/gameData");
        gameRoomRef.child(userId).set({
            choice: req.body.choice,
            name: req.body.name,
            online: req.body.online,
            ready: req.body.ready,
            wins: req.body.wins,
            hasPlayed: req.body.hasPlayed
        }, function () { res.json("ok"); });
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    console.log("roomId type:", roomId.type);
    userCollection.doc(userId).get().then(function (doc) {
        if (doc.exists) {
            roomCollection.doc(roomId).get()
                .then(function (snap) {
                var data = snap.data();
                console.log(data.rtdbRoomId);
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                messages: "You don't exist"
            });
        }
    });
});
app.post("/auth", function (req, res) {
    var name = req.body.name;
    userCollection
        .where("name", "==", name)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            userCollection.add({
                name: name
            }).then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.user(express.static('dist'));
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
