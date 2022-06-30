import { rtdb,firestore } from "./db";
import { customAlphabet, nanoid } from 'nanoid'
//import 'dotenv/config'
import * as cors from "cors";
//import {v4  as uuidv4} from "uuid"
var express = require("express");
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static("dist"))
app.use(express.json());
app.use(cors());

const nanoidShort = customAlphabet('1234567890abcdefghi', 6)

const userCollection = firestore.collection("users")
const roomCollection = firestore.collection("rooms")


app.post("/rooms",(req,res)=>{  
  const roomRef = rtdb.ref("rooms/"+nanoid());
  roomRef.set({
        currentGame:""
      }).then(()=>{
        const roomLongId = roomRef.key;
        const roomId = nanoidShort(6);
        roomCollection.doc(roomId.toString()).set({
          rtdbRoomId:roomLongId
        }).then(()=>{
          res.json({
            id:roomId.toString(),
            rtdbLongId: roomLongId.toString()
          })
        })
      })
  })

  app.get("/rooms/:roomId/check",(req,res)=>{
    const {roomId} = req.params
    roomCollection.doc(roomId).get()
    .then(snap=>{
      const rtdbId = snap.data();
       const gameRoomRef = rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/currentGame/gameData");
       gameRoomRef.once("value").then((snap)=>{
        const snapData = snap.val();
        res.json(snapData)
      },()=>{res.json("ok")})
    })
    
  })

  app.patch("/rooms/wins", (req,res)=>{
    const {wins, roomId,userId} = req.body
    roomCollection.doc(roomId).get()
    .then(snap=>{
      const rtdbId = snap.data();
      const playerRef = rtdb.ref(`/rooms/${rtdbId.rtdbRoomId}/currentGame/gameData/${userId}`)
      playerRef.update({
        wins:wins
      },()=>{res.json("ok")})
  })
})

  app.post("/roomData", (req,res)=>{
   const {userId} = req.body
   const {roomId} = req.body
    roomCollection.doc(roomId).get()
    .then(snap=>{
      const rtdbId = snap.data();
       const gameRoomRef = rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/currentGame/gameData");
       gameRoomRef.child(userId).set(
        {
          choice:req.body.choice,
          name:req.body.name,
          online:req.body.online,
          ready:req.body.ready,
          wins:req.body.wins,
          hasPlayed:req.body.hasPlayed
        },()=>{res.json("ok")})

    })
  })
  app.post("/playersChoices", (req,res)=>{
    const {name,roomId} = req.body
    roomCollection.doc(roomId).get()
    .then(snap=>{
      const rtdbId = snap.data();
       const gameRoomRef = rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/currentGame/playersChoices");
       gameRoomRef.child(name).set(
        {
            name,
            choice:req.body.choice
        },()=>{res.json("ok")})
    })
    
  })

app.get("/rooms/:roomId",(req,res)=>{
  const {userId} = req.query;
  const {roomId} = req.params;
  console.log("roomId type:",roomId.type);
  
  userCollection.doc(userId).get().then(doc=>{
    if(doc.exists){
     roomCollection.doc(roomId).get()
     .then(snap=>{
       const data = snap.data();
       console.log(data.rtdbRoomId);
      res.json(data)
     })
    }else{
      res.status(401).json({
        messages:"You don't exist"
      })
    }
  })
})



app.post("/signup", (req,res)=>{
const {email,name} = req.body;
userCollection
.where("email","==",email)
.get()
.then((searchResponse)=>{
  if(searchResponse.empty){
    userCollection.add({
      email,
      name
    }).then((newUserRef=>{
      res.json({
        id:newUserRef.id,
        new:true
      })
    }))
  }else{
    res.status(404).json({
      message:"User already exists"
    })
  }
}) 
})

app.post("/auth",(req,res)=>{
  const {name} = req.body;

  userCollection
.where("name","==",name)
.get()
.then((searchResponse)=>{
  if(searchResponse.empty){
    userCollection.add({
      name
    }).then(newUserRef=>{
      res.json({
        id:newUserRef.id,
        new:true
        })
      })
  }else{
    res.json({
      id:searchResponse.docs[0].id
    })
  }
  })
}) 

app.get("*", function(req,res){
  res.sendFile(__dirname + "/dist/index.html");
})

//app.user(express.static('dist'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
