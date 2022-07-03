import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('room-info-page', class RoomInfo extends HTMLElement {
  roomId: Number;
  localPlayerName:String;
  connectedCallback() {
    const cs = state.getState()
    this.roomId = cs.roomId
    this.localPlayerName = cs.name
    
    this.render();
  }
  addListeners(){
    // state.subscribe(()=>{
    //   if(state.data.oponent && state.data.oponent.online){
    //     Router.go("/instructions")
    //   }
    // })
    state.subscribe(()=>{
      const cs = state.getState()
      console.log(state.data.oponent.online);
      console.log(state.data.oponent.ready);
      console.log(state.data.oponent.hasPlayed);
         if(cs.oponent.online &&
        (!cs.oponent.ready &&
        !cs.oponent.hasPlayed) && (cs.online &&
          (!cs.ready &&
          !cs.hasPlayed))){
          console.log("cambiando a instructions");
          
          Router.go("/instructions")
        }
   
    })
    state.data.online = true;
    state.updateConnection()
    
      const buttonEl = this.querySelector("#next")
      buttonEl.addEventListener("click",()=>{
        Router.go("/instructions")
      })
  }

  render(){
    this.innerHTML=`
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
    <div class="info__container">

    <p> Compartí el código</p>
    <h4 class="room-id__title">${this.roomId}</h4>
    <p> con tu contrincante</p>
    </div>
    <blue-button class="button-play" id="next">Siguiente</blue-button>
    <div class="options__container">
    <play-options class="options"></play-options>
    </div>
    `
    this.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title_container{
          display:grid;
          grid-template-rows: 150px 300px;
          align-items:center;
          width:65vw;
          margin:0 auto;
          height:100vh;
          position:relative;
          font-family:'Odibee Sans';
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
      }
      .players-stats__box{

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
    this.appendChild(style)
    this.addListeners();
  }
  


})