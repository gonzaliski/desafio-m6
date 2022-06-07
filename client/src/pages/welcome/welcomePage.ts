import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('welcome-page', class welcomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners(){
    const buttonEl = this.querySelector("#new-room");
    buttonEl.addEventListener('click',()=>{
      state.askNewRoom(() => {
        state.accessToRoom();
      });
      Router.go("/setName")
    });
  }

  render(){
    this.innerHTML=`
    <h1 class="title">Piedra
    Papel ó
    Tijera</h1>
    <play-button class="button-play" id="new-room">Crear sala</play-button>
    <play-button class="button-play" id="join-room">Ingresar a una sala</play-button>
    <play-options class="options"></play-options>
    `
    this.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title_container{
          display:grid;
          grid-template-rows: 350px 150px 200px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
      }
      .title{
        text-align:center;
        font-family:'Roboto';
        font-weight: 700;
        font-size: 80px;  
        color:#009048;
      }
      .options{
        pointer-events:none;
        position:absolute;
        bottom:0px;

      }
    `
    this.appendChild(style)
    this.addListeners();
  }
  


})