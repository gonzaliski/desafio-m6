import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('instructions-page', class InstructionsPage extends HTMLElement {
  connectedCallback(){
    this.render()
  }
  addListeners(){
    const buttonEl = this.querySelector(".button-play");
    buttonEl.addEventListener('click',()=>{
        Router.go("/waiting")
    });
  }
  render(){
    this.innerHTML = `
    <div class="header__container">
      <div class="players-stats__box">
        <p class="player">Jugador 1</p>
        <p class="player two">Jugador 2</p>
      </div>
      <div>
        <h4>Sala</h4>
        <p>AAAAA</p>
      </div>
    </div>
        <h2 class="title">Presioná jugar
        y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
        </h2>
        <play-button class="button-play">Jugar!</play-button>
        <play-options class="options"></play-options>
    `;
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
        padding:10px;
        text-align:center;
        font-family:'Roboto';
        font-size: 40px;  
        color:#009048;
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
    `


    this.appendChild(style);
    this.addListeners()
  }

})