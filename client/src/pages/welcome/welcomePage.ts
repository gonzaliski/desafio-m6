import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('welcome-page', class WelcomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners(){
    const newRoomEl = this.querySelector("#new-room");
    newRoomEl.addEventListener('click',()=>{
      state.askNewRoom();
      Router.go("/setName")
    });
    const joinRoomEl = this.querySelector("#join-room");
    joinRoomEl.addEventListener('click',()=>{
      Router.go("/connectRoom")
    });
  }

  render(){
    this.innerHTML=`
    <h1 class="title">Piedra
    Papel ó
    Tijera</h1>
    <div class="buttons__container">
    <blue-button class="button-play" id="new-room">Crear sala</blue-button>
    <blue-button class="button-play" id="join-room">Ingresar a una sala</blue-button>
    </div>
    <play-options class="options"></play-options>
    `
    this.className = "title__container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title__container{
          display:grid;
          grid-template-rows: 300px 2fr 200px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
        }
        @media(max-width:420px){
          .title__container{
          grid-template-rows: 250px 2fr 200px;

        }
      }
      @media(max-height:600px){
        .title__container{
          height: -webkit-fill-available;
        }
      }
 
      .title{
        text-align:center;
        font-family:'Roboto';
        font-weight: 700;
        font-size: 80px;  
        color:#009048;
      }
      @media(max-width:420px){
        .title{
          font-size: 60px;  
      }
    }
    .buttons__container{
      display:flex;
      flex-direction:column;
      margin-bottom:10px;
      gap:20px;
    }
    @media(max-width:420px){
      .button-play{
        transform: scale(0.8);
    }
  }
      .options{
        pointer-events:none;
        margin-top:auto;
      }
      `
      //grid-template-rows: auto 1fr 200px;
      // position:absolute;
      // bottom:0px;
    this.appendChild(style)
    this.addListeners();
  }
  


})