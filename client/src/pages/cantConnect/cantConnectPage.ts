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
    },80000)
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
    <blue-button class="button-play" id="go-back__button">Volver al menú</blue-button>
    <play-options class="options"></play-options>
    `
    this.className = "title__container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title__container{
          display:grid;
          grid-template-rows: 350px 1fr 1fr 200px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
          font-family:'Odibee Sans';
      }
      @media(max-width:420px){
        .title__container{
          grid-template-rows: 250px 50px 200px;
            }
          }
      .text__container{
        max-width:317px;
      }
      .text{
        font-family:Roboto;
        font-size:35px;
        text-align:center;
      }
      @media(max-width:420px){
        .text{
          font-size:25px;
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
      @media(max-width:420px){
        .button-play{
          transform: scale(0.8);
      }
    }

    `
    this.appendChild(style)
    this.addListeners();
  }
  


})