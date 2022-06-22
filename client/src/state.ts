import {rtdb} from "./rtdb"
import {map} from "lodash"
type Play = "piedra" | "papel" | "tijera";
const API_BASE_URL = "http://localhost:3000"
const state = {
  data: {
    name:"",
    userId:"",
    playerPlay: "",
    comPlay: "",
    history: {
      player: 0,
      com: 0,
    },
    roomId:"",
    rtdbData:[],
    rtdbLongId:"",
    oponentId:"",
    online:false,
    ready:false,
    hasWon: false,
    wins:"",
    play:{
      myPlay:"",
      oponentPlay:""
    }

  },
  listeners:[],
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
 },
  init() {
		// const localData = JSON.parse(localStorage.getItem("data"));
    // console.log(localData);
		// if (localStorage.getItem("data")) {
		// 	return (this.data.history = localData);
		// }
		// console.log(localData);
	},
  listenDatabase() {
    // Connection with RTDB
    console.log("listening data base");
    
    const rtdbRef = rtdb.ref(`rooms/${this.data.rtdbLongId}`);
    // const rtdbRef = rtdb.ref(`rooms/${this.data.roomId}`);    
    rtdbRef.on("value", (snapshot) => {
      const cs = this.getState();
      const value = snapshot.val();
      console.log(value.currentGame);
      cs.rtdbData = map(value.currentGame.gameData)
      const oponentDataMap = map(value.currentGame.playersChoices).filter((p)=>{return p != this.data.name })
      const oponentData = oponentDataMap[0] as any;
      cs.play.oponentPlay = oponentData.choice
      this.setState(cs);
    });
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
  setPlayerDataOnRoom(){
    const cs = this.getState();
    const userId = cs.userId;
    fetch(API_BASE_URL + "/roomData",{
      method: "post",
      headers: {
        "Accept": "application/json",
        "content-type": "application/json",
      },
      body:JSON.stringify({
          userId,
          choice:cs.choice,
          name:cs.name,
          online:cs.online,
          ready:cs.ready,
          roomId:cs.roomId,
          wins:cs.wins
        })
    }).then((res)=>{
      return res.json()
    })
      .then(()=>{
        this.listenDatabase()
      })
  },
  setName(name:String){
    const cs = this.getState();
    console.log(name);
    cs.name = name;
    this.setState(cs);
  },
  setReady(ready:Boolean){
    const cs = this.getState()
    cs.ready = ready;
    this.setState(cs)
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
      //  this.listenRoom();
        if (callback) {
          callback();
        }
      });
  },

  getState() {
    return this.data;
  },
  getOponent(){
    const oponentData = this.data.rtdbData.filter((p)=>{
      return [p.name] && (p.name != this.data.name)
    })
    console.log(oponentData);
    
    return oponentData
  },
  isOponentReady(){
    console.log(this.getOponent()[0].ready);
    
    return this.getOponent()[0].ready
  },
  getOponentSelection():String {
    console.log("oponente choice",this.getOponent());
    
    return this.getOponent()[0].choice;
  },
  getPlayerSelection() {
    const lastState = this.getState();
    return lastState.choice;
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
  }

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
          choice:cs.play.myPlay,
          name:cs.name,
          roomId:cs.roomId,
        })
    }).then((res)=>{
      return res.json()
    })
      .then(()=>{
        this.listenDatabase()
      })


  },
  savePlayerPlay(play: Play) {
    const currentState = this.getState();
    currentState.ready = false;
    currentState.play.myPlay = play;
    this.setState(currentState);
    this.setPlayerPlayOnRoom()
    this.setPlayerDataOnRoom()
  },
  resetPlay(){
    const currentState = this.getState();
    currentState.play.myPlay =""
    currentState.play.oponentPlay =""
    this.setState(currentState)
  },
  whoWins() {    
    const playerMove = this.play.myPlay;
    const oponentMove = this.play.oponenPlay;
    const ganeConTijera = playerMove == "tijera" && oponentMove == "papel";
    const ganeConPapel = playerMove == "papel" && oponentMove == "piedra";
    const ganeConPiedra = playerMove == "piedra" && oponentMove == "tijera";
    const gane = [ganeConPapel, ganeConPiedra, ganeConTijera].includes(true);
    this.getState().hasWon = gane;
    this.saveHistory(gane);
  },
  isDraw(){
    const playerMove = this.play.myPlay;
    const oponentMove = this.play.oponenPlay;
    return playerMove == oponentMove
  },
  lastResult() {
    return this.getState().hasWon;
  },
  saveHistory(result) {
    const cs = this.getState();
    if(this.isDraw()){
      cs.wins+=1
    }
    else if (!this.isDraw() && result) {
      cs.wins += 1;
    }

    this.setPlayerDataOnRoom()
    this.setState(cs)
    // localStorage.setItem("data", JSON.stringify(currentHistory))
  },
};

export { state };
