import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('cant-connect-page', class CantConnect extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners(){
    const buttonEl = this.querySelector("#go-back__button")
    buttonEl?.addEventListener("click",()=>{
        Router.go("/")
    })
    setTimeout(()=>{
        Router.go("/")
    },5000)
  }

  render(){
    this.innerHTML=`
    <h1 class="title">Piedra
    Papel ó
    Tijera</h1>
    <div class="text__container">
    <h2 class="text">
    Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.
    </h2>
    </div>
    <blue-button id="go-back__button">Volver al menú</blue-button>
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
          font-family:'Odibee Sans';
      }
      .text__container{
        max-width:317px;
      }
      .text{
        font-family:Roboto;
        font-size:35px;
        text-align:center;
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
      .form{
          display:flex;
          flex-direction:column;
          gap:20px;
          align-items:center;
      }

      .form-title{
          font-size:45px;
      }

    `
    this.appendChild(style)
    this.addListeners();
  }
  


})