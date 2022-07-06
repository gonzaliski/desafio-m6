import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('waiting-page', class WaitingPage extends HTMLElement {
  roomId: Number;
  localPlayerName:String;
  oponentName:String;
  connectedCallback(){
  
    this.render()
  }
  addListeners(){
    if(state.data.oponent.ready){
      
      Router.go("/game")
    }
    state.subscribe(()=>{      
      if(state.data.oponent.ready && state.data.ready){
        Router.go("/game")
      }
     })
  }

  render(){
    this.innerHTML = `
   <info-display></info-display>

    <div class="info__container">
    <p> Esperando a que</p>
    <p> AAAA presione</p>
    <p> ¡Jugar!...</p>
    </div>
    <play-options class="options"></play-options>
    `;
    this.className = "title__container"
    const style = document.createElement("style");
    style.innerHTML=`
    .title__container{
        display:grid;
        grid-template-rows: 200px 1fr 300px;
          align-items:center;
          width:85vw;
        margin:0 auto;
        height:100vh;
        position:relative;
        font-family:'Odibee Sans';
    }

    @media(max-height:600px){
      .title__container{
        height:-webkit-fill-available;
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
    .info__container{
        display:flex;
        flex-direction:column;
        align-items:center;
        font-size:35px;
    }
    .room-id__title{
        margin:0;
        font-size:45px;
    }
    .options__container{
      display:flex;
      justify-content:center;
    }
    `


    this.appendChild(style);
    this.addListeners()
  }

})