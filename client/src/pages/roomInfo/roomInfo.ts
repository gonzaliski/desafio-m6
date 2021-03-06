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
         if(cs.oponent.online &&
        (!cs.oponent.ready &&
        !cs.oponent.hasPlayed) && (cs.online &&
          (!cs.ready &&
          !cs.hasPlayed))){
          
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
    <play-options class="options"></play-options>
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
      @media(max-width:420px){
        .title__container{
          grid-template-rows: 200px 1fr;
        }
      }
      @media(max-height:600px){
        .title_container{
          height:-webkit-fill-available;
        }
      }
 
      .options{
        pointer-events:none;
        margin-top:auto;
        margin-right: auto;
        margin-left: auto;
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
    `
    this.appendChild(style)
    this.addListeners();
  }
  


})