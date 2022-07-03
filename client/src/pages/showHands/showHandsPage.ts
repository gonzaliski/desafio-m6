import {Router} from "@vaadin/router"
import { state } from "../../state";

customElements.define('show-hands-page', class ShowHandsPage extends HTMLElement {
  oponentHand:String;
  playerHand:String;

    
   connectedCallback(){
    this.oponentHand = state.data.oponent.choice
    this.playerHand = state.data.choice
    
     this.render()
    }
    addListeners(){
      console.log("en juego.",state.data.play);
      console.log("yo jugue",this.playerHand, "y mi oponente:", this.oponentHand);
      console.log(state.listeners);
        const oponentHasPlayed = state.data.oponent.hasPlayed
        setTimeout(()=>{
          if(oponentHasPlayed) {
            state.whoWins()
            Router.go("/result");
          }
        },3000)
    
  }
  render(){  
    this.innerHTML = `
    <div class="hands__container">
    <elemento-el elemento="${this.oponentHand}" class="option-oponent"></elemento-el>
    <elemento-el elemento="${this.playerHand}" class="option-player"></elemento-el>
    </div>`;
    const style = document.createElement("style");
      style.innerHTML = `
          :root{
            --won-color: #888949E5;
            --loose-color: #894949;
          }
          .hands__container{
            background-color:transparent;
            height:100vh;
            width:100%;
            display:flex;
            flex-direction:column;
            align-items: center;
            justify-items:center;
            position:absolute;
            overflow: hidden;
          }
          .option-player{
            pointer-events:none;
            transform: scale(1.5);
            position: absolute;
            bottom:0px;
            animation: move-up 2s ease 1;
          }
          .option-oponent{
            pointer-events:none;
            transform: scale(1.5) rotate(180deg);
            position: absolute;
            top:0px;
            animation: move-down 2s ease 1;
          }
          @keyframes move-down{
            0%{
              transform:translateY(-70px) scale(1.5) rotate(180deg);
            }
     
            100%{
              transform:translateY(0px) scale(1.5) rotate(180deg);
            }
          }
          @keyframes move-up{
            0%{
              transform:translateY(70px) scale(1.5);
            }
     
            100%{
              transform:translateY(0px) scale(1.5);
            }
          }  `;
  this.appendChild(style)
  this.addListeners()
  }
})
 