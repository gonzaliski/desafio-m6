import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('instructions-page', class InstructionsPage extends HTMLElement {
  roomId: Number;
  localPlayerName:String;
  oponentName:String;
  connectedCallback(){
    const cs = state.getState()
    this.roomId = cs.roomId
    this.localPlayerName = cs.name
    this.oponentName = state.data.oponent.name
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
    <info-display></info-display>
        <h2 class="title">Presioná jugar
        y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
        </h2>
        <blue-button class="button-play">Jugar!</blue-button>
        <play-options class="options"></play-options>
    `;
    this.className = "title__container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title__container{
        display: grid;
        grid-template-rows: 200px 1fr 1fr 300px;
        align-items: center;
        width: 85vw;
        margin: 0 auto;
        height: 100vh;
        position: relative;
      }
      @media(max-width:420px){
        .title__container{
          grid-template-rows: 150px 300px;
        }
      }
      @media(max-height:600px){
        .title__container{
          height:-webkit-fill-available;
        }
      }
      .title{
        padding:10px;
        text-align:center;
        font-family:'Roboto';
        font-size: 40px;  
        color:#009048;
      }
      @media(max-width:420px){
        .title{
          font-size: 30px;  
        }
      }
      .options{
        pointer-events:none;
        margin-top:auto;
        margin-right: auto;
        margin-left: auto;
      }
    .button-play{
      margin:auto;
    }
    @media(max-width:420px){
      .button-play{
        transform:scale(0.8);
      }
    }
    `


    this.appendChild(style);
    this.addListeners()
  }

})