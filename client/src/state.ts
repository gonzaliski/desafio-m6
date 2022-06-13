import {rtdb} from "./rtdb"
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
    rtdbData:{},
    rtdbLongId:"",
    oponentId:"",
    online:false,
    ready:false,
    hasWon: false,
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
    const rtdbRef = rtdb.ref(`rooms/${this.data.rtdbLongId}`);
    // const rtdbRef = rtdb.ref(`rooms/${this.data.roomId}`);    
    rtdbRef.on("value", (snapshot) => {
      const currentState = this.getState();
      const value = snapshot.val();
      currentState.rtdbData = value.currentGame;
      console.log(currentState.rtdbData);
      this.setState(currentState);
    });
  },
  signIn(callback) {
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
          callback();
  
        });
    } else {
      console.error("No hay nombre en el state");
    }
  },
  connectToRoom(){
    const cs = this.getState();
    const userId = cs.userId;
    fetch(API_BASE_URL + "/currentGame",{
      method: "post",
      headers: {
        "Accept": "application/json",
        "content-type": "application/json",
      },
      body:JSON.stringify({
          userId,
          choice:"",
          name:cs.name,
          online:true,
          ready:false,
          roomId:cs.roomId
        })
    }).then(res=>{
      return res.json();
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
    console.log("userId:",userId);
    console.log(roomId);
    
    fetch(API_BASE_URL + "/rooms/" + roomId + "/?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbLongId = data.rtdbRoomId;
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
    const oponentData = this.rtdbData.filter((p)=>{p.name != this.data.userId})
  },
  isOponentReady(){
    return this.getOponent().ready
  },
  setComSelection() {
    const comSelection = this.getRandomSelection();

    const currentState = this.getState();
    currentState.comPlay = comSelection;
    this.setState(currentState);
  },
  getRandomSelection() {
    const possiblePlays = ["piedra", "papel", "tijera"].filter((p)=>{return p != state.getPlayerSelection()});
    const randomSelection =
      possiblePlays[Math.floor(Math.random() * possiblePlays.length)];
    return randomSelection;
  },
  getComSelection() {
    return this.getState().comPlay;
  },
  getPlayerSelection() {
    const lastState = this.getState();


    return lastState.playerPlay;
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
  }

  },
  savePlayerPlay(play: Play) {

    const currentState = this.getState();
    
    currentState.playerPlay = play;

    this.setComSelection();
    this.setState(currentState);
  },
  parameters: {},
  saveParams(params) {
    this.parameters = params;
  },
  getParams() {
    return this.parameters;
  },
  whoWins() {    
    const playerMove = this.getPlayerSelection();
    const comMove = this.getComSelection();
    const ganeConTijera = playerMove == "tijera" && comMove == "papel";
    const ganeConPapel = playerMove == "papel" && comMove == "piedra";
    const ganeConPiedra = playerMove == "piedra" && comMove == "tijera";
    const gane = [ganeConPapel, ganeConPiedra, ganeConTijera].includes(true);
    this.getState().hasWon = gane;
    this.saveHistory(gane);
    return gane;
  },
  isDraw(){
    const playerMove = this.getPlayerSelection();
    const comMove = this.getComSelection();
    return playerMove == comMove
  },
  lastResult() {
    return this.getState().hasWon;
  },
  saveHistory(result) {
    const currentHistory = this.getState().history;
    if (result) {
 
      currentHistory.player += 1;
      console.log("player victoria:",currentHistory.player );
      
    } else {
      
      currentHistory.com += 1;
      console.log("com victoria:",currentHistory.com );
      
      
    }
    localStorage.setItem("data", JSON.stringify(currentHistory))
  },
};

export { state };
