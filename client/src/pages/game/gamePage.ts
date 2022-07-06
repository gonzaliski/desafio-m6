import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('game-page', class GamePage extends HTMLElement {
  connectedCallback(){
    this.render()
  }
  addListeners(){
    const playerOption = this.querySelector(".options")
    playerOption.addEventListener("click",()=>{
      state.subscribe(()=>{
        const oponentPlayed = state.data.oponent.hasPlayed
        const emptyOponentChoice = state.data.oponent.choice == ""
          if(oponentPlayed && !emptyOponentChoice && state.data.choice &&
            (location.pathname == "/game")){
            Router.go("/showHands")
          }
      })
      state.data.ready = false
      state.updateReadyOnRoom()
    })
  }
  render(){
    this.innerHTML = `
        <countdown-el seconds="3" class="countdown-game"></countdown-el>
        <play-options class="options"></play-options>
    `;
    this.className = "title__container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title__container{
          display:grid;
          grid-template-rows: 500px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
      }
      @media(max-height:600px){
        .title__container{
          height:-webkit-fill-available;
        }
      }
      .options{
        cursor:pointer;
        margin-top:auto;
      }
    `
    
    
    this.appendChild(style);
    this.addListeners();
  }

})
    


