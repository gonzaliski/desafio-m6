import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('instructions-page', class InstructionsPage extends HTMLElement {
  roomId: Number;
  localPlayerName:String;
  connectedCallback(){
    const cs = state.getState()
    this.roomId = cs.roomId
    this.localPlayerName = cs.name
    this.render()
  }
  addListeners(){
    const buttonEl = this.querySelector(".button-play");
    buttonEl.addEventListener('click',()=>{
        state.setReady(true)
        Router.go("/waiting")
    });
  }
  render(){
    this.innerHTML = `
    <div class="header__container">
      <div class="players-stats__box">
        <p class="player">${this.localPlayerName}</p>
        <p class="player two">Jugador 2</p>
      </div>
      <div>
        <h4>Sala</h4>
        <p>${this.roomId}</p>
      </div>
    </div>
        <h2 class="title">Presioná jugar
        y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
        </h2>
        <play-button class="button-play">Jugar!</play-button>
        <div class="options__container">
        <play-options class="options"></play-options>
        </div>
    `;
    this.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title_container{
        display: grid;
        grid-template-rows: 150px 300px;
        align-items: center;
        width: 65vw;
        margin: 0 auto;
        height: 100vh;
        position: relative;
      }
      .title{
        padding:10px;
        text-align:center;
        font-family:'Roboto';
        font-size: 40px;  
        color:#009048;
      }
      .options{
        pointer-events:none;
        position:absolute;
        bottom:0px;
      }
      .header__container{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin:10px;
        font-size:24px;
        font-family:'Odibee Sans';
    }
    .options__container{
      display:flex;
      justify-content:center;
    }
    .button-play{
      margin:auto;
    }
    ..header__container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px;
      font-size: 24px;
      font-family:'Odibee Sans';
  }
    .players-stats__box{

    }
    `


    this.appendChild(style);
    this.addListeners()
  }

})