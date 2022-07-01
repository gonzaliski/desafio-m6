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

window.addEventListener("unload",()=>{
   console.log("funciona??");
   
   state.data.hasPlayed = false
   state.updateStatusOnRoom()
   state.resetPlay()
})