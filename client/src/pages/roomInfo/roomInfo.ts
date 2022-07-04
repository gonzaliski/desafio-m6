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
  }

  render(){
    this.innerHTML=`
    <info-display></info-display>
    <div class="info__container">

    <p> Compartí el código</p>
    <h4 class="room-id__title">${this.roomId}</h4>
    <p> con tu contrincante</p>
    </div>
    <div class="options__container">
    <play-options class="options"></play-options>
    </div>
    `
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
        position:absolute;
        bottom:0px;
        
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