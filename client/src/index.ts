import "./initPages";
import "./initComponents";
import "./root";
import {state} from "./state";
import { Router } from "@vaadin/router";
(function main(){
//   state.init();
 //  state.setReady(false)
   Router.go("/")
})();

window.addEventListener("beforeunload",()=>{
      ("funciona??");
      if(state.data.roomId){
         state.data.hasPlayed = false
         state.data.online = false
         state.updateStatusOnRoom()
         state.resetPlay()
         state.updateConnection()
      }
})