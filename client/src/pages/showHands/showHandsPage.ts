import {Router} from "@vaadin/router"
import { state } from "../../state";

customElements.define('show-hands-page', class ShowHandsPage extends HTMLElement {
   imageURL = require("url:../../assets/star.png");
  oponentHand:String;
  playerHand:String;
    
   connectedCallback(){
    this.oponentHand = state.data.play.oponentPlay
    this.playerHand = state.data.play.myPlay
     this.render()
    }
    addListeners(){
      console.log("en juego.",state.data.play);
      console.log("yo jugue",state.data.play.myPlay, "y mi oponente:", state.data.play.oponentPlay);
      console.log(state.listeners);
      const oponentHasPlayed = state.getOponent().hasPlayed
      if(oponentHasPlayed) {
        state.whoWins()
      }
      Router.go("/result");
    
  }
  render(){  
  this.addListeners()
  }
})
 