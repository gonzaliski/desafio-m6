import {rtdb} from "./rtdb"
import {map} from "lodash"
type Play = "piedra" | "papel" | "tijera";
type Player = {
  name:String,
  choice:String,
  hasPlayed:Boolean,
  online:Boolean,
  ready:Boolean,
  wins:Number
}
const API_BASE_URL = "http://localhost:3000"
const state = {
  data: {
    name:"",
    userId:"",
    roomId:"",
    rtdbData:[],
    rtdbLongId:"",
    oponentId:"",
    choice:"",
    online:false,
    ready:false,
    hasWon: false,
    hasDrawn:false,
    hasPlayed:false,
    wins:0,
    play:{
      myPlay:"",
      oponentPlay:""
    },
    oponent:{} as Player,
    oponentWins:0
  },
  listeners:[],
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
 },
  // init() {
	// 	const localData = JSON.parse(localStorage.getItem("data") || "");
  //   console.log(localData);
	// 	if (localStorage.getItem("data")) {
	// 		return (this.setState(localData));
	// 	}
	// },
  listenDatabase() {
    // Connection with RTDB
    console.log("listening data base");
    
    const rtdbRef = rtdb.ref(`rooms/${this.data.rtdbLongId}`);
    // const rtdbRef = rtdb.ref(`rooms/${this.data.roomId}`);    
    rtdbRef.on("value", (snapshot) => {
      const cs = this.getState();
      const value = snapshot.val();
      cs.rtdbData = map(value.currentGame.gameData)
      console.log(cs.rtdbData);
      this.saveOponentData(value.currentGame.gameData)
        this.setState(cs);
    });
  },
  saveOponentData(data){
    const mappedData = map(data) as any;
    const oponentDataMap = mappedData.filter((p)=>{return p.name != this.data.name })
    const oponentData = oponentDataMap[0] as Player;
    // console.log(oponentData);
    if(oponentData != undefined){
      this.data.oponent = oponentData
    }
  },
  signIn(callback?) {
    const cs = this.getState();
    if (cs.name) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: cs.name }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          console.log(cs.userId);
          this.setState(cs);
          if(callback){
            callback();
          }
  
        });
    } else {
      console.error("No hay nombre en el state");
    }
  },
  checkPlayerOnRoom(cb?){
    const cs = this.getState();
    const roomId = cs.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "/check")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("aaaaaaa",data);
        this.processData(data,cb)
      //  this.listenRoom();
    
      });
      
  },
  processData(data,cb?){
     const players = map(data) as any
      console.log("data to check", players);
      const names = players.map((p)=>{return p.name})      
      console.log(names);
      let isPlayerOnRoom = names.includes(this.data.name)
      console.log("player name is in room:", isPlayerOnRoom, "there's 2 players?:", players.length < 2);
      if(!isPlayerOnRoom && players.length < 2){
        console.log("player is new in room");
         this.setPlayerDataOnRoom()
      }else if(isPlayerOnRoom){
        console.log("player were here before");
        
        const playerData = players.filter((p)=>{return p.name == this.data.name})
        this.updateLocalDataFromRoom(playerData[0])
      }else{
        console.log("callback");
        
          cb();
      }
  },
  updateLocalDataFromRoom(data){
    
    const cs = this.getState()
    console.log("updating wins");
    console.log(data);
    cs.wins = data.wins
    cs.ready = false
    cs.hasPlayed = false
    cs.choice = ""
    // this.setPlayerDataOnRoom()
    this.setState(cs)
  },
  setPlayerDataOnRoom(){
    const cs = this.getState();
    const userId = cs.userId;
    fetch(API_BASE_URL + "/roomData",{
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify({
          userId,
          choice:cs.choice,
          name:cs.name,
          online:cs.online,
          ready:cs.ready,
          roomId:cs.roomId,
          wins:cs.wins,
          hasPlayed:cs.hasPlayed
        })
    }).then((res)=>{
      return res.json()
    })
      .then((res)=>{res})
  },
  updateScoreOnRoom(){
    const cs = this.getState();
    console.log(cs.wins);
    
    fetch(API_BASE_URL + "/rooms/wins",{
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify({
          userId:cs.userId,
          roomId:cs.roomId,
          wins:cs.wins,
        })
    }).then((res)=>{
      return res.json()
    })
      .then((res)=>{
        this.setState(cs)
        console.log(res);
      })
  },
  setName(name:String){
    const cs = this.getState();
    console.log(name);
    cs.name = name;
    this.setState(cs);
  },
  setReady(ready:Boolean){
    this.data.ready = ready;
    this.setPlayerDataOnRoom()
  },
  askNewRoom(callback?) {
    const cs = this.getState();    
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "content-type": "application/json",
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("line 33 ",data.id);
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
  },
  setRoomId(roomId:string){
    const cs = this.getState();
    cs.roomId = roomId
    this.setState(cs);
  },
  accessToRoom(callback?){
    console.log("accessToRoom");
    const cs = this.getState();
    const roomId = cs.roomId;
    const userId = cs.userId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "/?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbLongId = data.rtdbRoomId;
        cs.online = true
        console.log(cs.rtdbLongId);
        this.setState(cs);
        this.listenDatabase()
      //  this.listenRoom();
        if (callback) {
          callback();
        }
      });
  },

  getState() {
    return this.data;
  },
  isOponentReady(){
    const oponentData = this.data.oponent
    return oponentData.ready
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
      for (const cb of this.listeners) {
        cb();
      }
      console.log("el state cambio",newState);
      
  },
  setPlayerPlayOnRoom(){
    const cs = this.getState();
    fetch(API_BASE_URL + "/playersChoices",{
      method: "post",
      headers: {
        "Accept": "application/json",
        "content-type": "application/json",
      },
      body:JSON.stringify({
          choice:cs.choice,
          name:cs.name,
          roomId:cs.roomId,
        })  
    }).then((res)=>{
      return res.json()
    })
      .then(()=>{
      })
  },
  savePlayerPlay(play: Play) {
    this.data.ready = false;
    this.data.choice = play;
    this.data.play.myPlay = play;
    this.setPlayerDataOnRoom()
  },
  resetPlay(){
    this.data.play.myPlay =""
    this.data.play.choice=""
    this.data.hasWon=false
    this.data.hasDrawn=false
    this.data.ready=false
    this.setPlayerDataOnRoom()
  },
  whoWins() {    
    const playerMove = this.data.choice;
    console.log(playerMove);
    const oponentMove = this.data.oponent.choice;
    console.log(oponentMove);
    const ganeConTijera = playerMove == "tijera" && oponentMove == "papel";
    const ganeConPapel = playerMove == "papel" && oponentMove == "piedra";
    const ganeConPiedra = playerMove == "piedra" && oponentMove == "tijera";
    const gane = [ganeConPapel, ganeConPiedra, ganeConTijera].includes(true);
    console.log("gane?",gane);
    
    this.saveHistory(gane);
  },
  isDraw(){
    const playerMove = this.data.choice;
    const oponentMove = this.data.oponent.choice;
    return playerMove == oponentMove
  },
  lastResult() {
    return this.getState().hasWon;
  },
  saveHistory(won) {
    this.data.hasWon = won;
    this.data.hasDrawn = this.isDraw()
  if (!this.isDraw() && won) {
      this.data.wins += 1;
      console.log("current wins",this.data.wins);
    }else if(!won){
      this.data.oponentWins = this.data.oponent.wins + 1
    }
    console.log("empate?", this.isDraw());
    console.log("oponentWins", this.data.oponentWins);
    state.data.hasPlayed = false
    this.updateScoreOnRoom()
   
  },
};

export { state };
