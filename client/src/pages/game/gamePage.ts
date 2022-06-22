import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('game-page', class GamePage extends HTMLElement {
  connectedCallback(){
    this.render()
  }
  addListeners(){
    const playerOption = this.querySelector(".options")
    // const titleEl = this.querySelector(".title_container")
    // const waiting = document.createElement("div")
    // waiting.innerHTML = `
    // <h1>Esperando a que el oponente juegue</h1>
    //   `
    // titleEl.appendChild(waiting)

    playerOption.addEventListener("click",()=>{
      state.subscribe(()=>{
        console.log(state.data.play);
        const oponentPlay = state.data.play.oponentPlay
        console.log("oponente jugó", oponentPlay);
        
        if(oponentPlay != ""){
          Router.go("/showHands")
        }
      })     
    })
  }
  render(){
    this.innerHTML = `
        <countdown-el seconds="3" class="countdown-game"></countdown-el>
        <play-options class="options"></play-options>
    `;
    this.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title_container{
          display:grid;
          grid-template-rows: 500px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
      }
      .options{
        position:absolute;
        bottom:0px;
      }
    `
    
    
    this.appendChild(style);
    this.addListeners();
  }

})
    


