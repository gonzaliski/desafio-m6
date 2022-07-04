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
      console.log("oponent was already waiting");
      
      Router.go("/game")
    }
    state.subscribe(()=>{      
      if(state.data.oponent.ready && state.data.ready){
        console.log("oponent is ready");
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
    <div class="options__container">
    <play-options class="options"></play-options>
    </div>
    `;
    this.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
    .title_container{
        display:grid;
        grid-template-rows: 200px 1fr 300px;
          align-items:center;
          width:85vw;
        margin:0 auto;
        height:100vh;
        position:relative;
        font-family:'Odibee Sans';
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