import { rtdb } from "./rtdb";
import { map } from "lodash";
const API_BASE_URL = "https://piedra-papel-tijera-online-xam1.onrender.com";
// const API_BASE_URL = "http://localhost:3000"
type Play = "piedra" | "papel" | "tijera";
type Player = {
  name: String;
  choice: String;
  hasPlayed: Boolean;
  online: Boolean;
  ready: Boolean;
  wins: Number;
};
const state = {
  data: {
    name: "",
    userId: "",
    roomId: "",
    rtdbData: [],
    rtdbLongId: "",
    choice: "",
    online: false,
    ready: false,
    hasWon: false,
    hasDrawn: false,
    hasPlayed: false,
    wins: 0,
    oponent: {} as Player,
  },
  listeners: [],
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },

  listenDatabase() {
    // Connection with RTDB

    const rtdbRef = rtdb.ref(`rooms/${this.data.rtdbLongId}`);
    // const rtdbRef = rtdb.ref(`rooms/${this.data.roomId}`);
    rtdbRef.on("value", (snapshot) => {
      const cs = this.getState();
      const value = snapshot.val();
      cs.rtdbData = map(value.currentGame.gameData);
      this.saveOponentData(cs.rtdbData, cs);
      this.setState(cs);
    });
  },
  saveOponentData(data, cs) {
    const oponentDataFilter = data.filter((p) => {
      return p.name != this.data.name;
    });
    const oponentData = oponentDataFilter[0] as Player;
    if (oponentData != undefined) {
      cs.oponent = oponentData;
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
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay nombre en el state");
    }
  },
  checkPlayerOnRoom(accept, reject) {
    const cs = this.getState();
    const roomId = cs.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "/check")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return this.processData(data, accept, reject);
      });
  },
  processData(data, acc, rej) {
    let isPlayerOnRoom = data.names.includes(this.data.name);
    if (!isPlayerOnRoom && data.playersOnline < 2) {
      this.setPlayerDataOnRoom();
      acc();
    } else if (isPlayerOnRoom) {
      this.updateLocalDataFromRoom();
      acc();
    } else {
      rej();
    }
  },
  updateLocalDataFromRoom() {
    const cs = this.getState();
    const listData = map(cs.rtdbData) as any;
    const playerData = listData.filter((p) => {
      return p.name == this.data.name;
    })[0];

    cs.wins = playerData.wins;
    cs.ready = false;
    cs.hasPlayed = false;
    cs.choice = "";
    this.setState(cs);
  },
  setPlayerDataOnRoom() {
    const cs = this.getState();
    const userId = cs.userId;
    fetch(API_BASE_URL + "/roomData", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId,
        choice: cs.choice,
        name: cs.name,
        online: cs.online,
        ready: cs.ready,
        roomId: cs.roomId,
        wins: cs.wins,
        hasPlayed: cs.hasPlayed,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res;
      });
  },
  updateScoreOnRoom() {
    const cs = this.getState();

    fetch(API_BASE_URL + "/rooms/wins", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        roomId: cs.roomId,
        wins: cs.wins,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState(cs);
        console.log(res, "score updated");
      });
  },
  updateReadyOnRoom() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/rooms/ready", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        roomId: cs.roomId,
        ready: cs.ready,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState(cs);
        console.log(res, "ready actualizado");
      });
  },
  updateChoiceOnRoom() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/rooms/choice", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        roomId: cs.roomId,
        choice: cs.choice,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState(cs);
        console.log(res, "choice actualizado");
      });
  },
  updateConnection() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/rooms/online", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        roomId: cs.roomId,
        online: cs.online,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState(cs);
        console.log(res, "online status updated");
      });
  },
  updateStatusOnRoom() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/rooms/hasPlayed", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.userId,
        roomId: cs.roomId,
        hasPlayed: cs.hasPlayed,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState(cs);
        console.log(res, "status actualizado");
      });
  },
  setName(name: String) {
    const cs = this.getState();
    cs.name = name;
    this.setState(cs);
  },
  setReady(ready: Boolean) {
    this.data.ready = ready;
    this.updateReadyOnRoom();
  },
  askNewRoom(callback?) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.roomId = data.id;
        this.setState(cs);
        if (callback) {
          callback();
        }
      });
  },
  setRoomId(roomId: string) {
    const cs = this.getState();
    cs.roomId = roomId;
    this.setState(cs);
  },
  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;
    const userId = cs.userId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "/?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbLongId = data.rtdbRoomId;
        this.setState(cs);
        this.listenDatabase();
        //  this.listenRoom();
        if (callback) {
          callback();
        }
      });
  },

  getState() {
    return this.data;
  },
  isOponentReady() {
    const oponentData = this.data.oponent;
    return oponentData.ready;
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },

  savePlayerPlay(play: Play) {
    this.data.ready = false;
    this.data.choice = play;
    this.updateChoiceOnRoom();
    this.updateReadyOnRoom();
    this.updateStatusOnRoom();
  },
  resetPlay() {
    this.data.choice = "";
    this.data.hasWon = false;
    this.data.hasDrawn = false;
    this.data.ready = false;
    this.updateChoiceOnRoom();
    this.updateReadyOnRoom();
  },
  whoWins() {
    const playerMove = this.data.choice;
    const oponentMove = this.data.oponent.choice;
    const ganeConTijera = playerMove == "tijera" && oponentMove == "papel";
    const ganeConPapel = playerMove == "papel" && oponentMove == "piedra";
    const ganeConPiedra = playerMove == "piedra" && oponentMove == "tijera";
    const gane = [ganeConPapel, ganeConPiedra, ganeConTijera].includes(true);

    this.saveHistory(gane);
  },
  isDraw() {
    const playerMove = this.data.choice;
    const oponentMove = this.data.oponent.choice;
    return playerMove == oponentMove;
  },
  lastResult() {
    return this.getState().hasWon;
  },
  saveHistory(won) {
    this.data.hasWon = won;
    this.data.hasDrawn = this.isDraw();
    if (!this.isDraw() && won) {
      this.data.wins += 1;
    }
    // state.data.hasPlayed = false
    this.updateScoreOnRoom();
  },
};

export { state };
