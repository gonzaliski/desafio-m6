import { rtdb,firestore } from "./db";
import { customAlphabet, nanoid } from 'nanoid'
import { map} from 'lodash'
import 'dotenv/config'
import * as cors from "cors";
import * as express from "express"
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static("../dist"))
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
        const roomId = nanoidShort();
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
        const listData = map(snapData) as any;
        const getNames = listData.map((p)=>{return p.name})
        const numberOfPlayers = listData.length
        let roomValues = {
          names: getNames,
          playersOnline: numberOfPlayers
        }
        res.json(roomValues)
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
app.patch("/rooms/ready", (req,res)=>{
  const {ready, roomId,userId} = req.body
  roomCollection.doc(roomId).get()
  .then(snap=>{
    const rtdbId = snap.data();
    const playerRef = rtdb.ref(`/rooms/${rtdbId.rtdbRoomId}/currentGame/gameData/${userId}`)
    playerRef.update({
      ready:ready
    },()=>{res.json("ok")})
})
})

app.patch("/rooms/choice", (req,res)=>{
  const {choice, roomId,userId} = req.body
  roomCollection.doc(roomId).get()
  .then(snap=>{
    const rtdbId = snap.data();
    const playerRef = rtdb.ref(`/rooms/${rtdbId.rtdbRoomId}/currentGame/gameData/${userId}`)
    playerRef.update({
      choice:choice
    },()=>{res.json("ok")})
})
})
app.patch("/rooms/online", (req,res)=>{
  const {online, roomId,userId} = req.body
  roomCollection.doc(roomId).get()
  .then(snap=>{
    const rtdbId = snap.data();
    const playerRef = rtdb.ref(`/rooms/${rtdbId.rtdbRoomId}/currentGame/gameData/${userId}`)
    playerRef.update({
      online:online
    },()=>{res.json("ok")})
})
})
app.patch("/rooms/hasPlayed", (req,res)=>{
  const {hasPlayed, roomId,userId} = req.body
  roomCollection.doc(roomId).get()
  .then(snap=>{
    const rtdbId = snap.data();
    const playerRef = rtdb.ref(`/rooms/${rtdbId.rtdbRoomId}/currentGame/gameData/${userId}`)
    playerRef.update({
      hasPlayed:hasPlayed
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
  res.sendFile(__dirname + "../dist/index.html");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
