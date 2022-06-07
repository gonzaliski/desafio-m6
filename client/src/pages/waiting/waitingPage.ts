import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('waiting-page', class WaitingPage extends HTMLElement {
  connectedCallback(){
    this.render()
  }
  addListeners(){
    // const buttonEl = this.querySelector(".button-play");
    // buttonEl.addEventListener('click',()=>{
    //     Router.go("/game")
    // });
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
    <div class="info__container">

    <p> Esperando a que</p>
    <p> AAAA presione</p>
    <p> ¡Jugar!...</p>
    </div>
    <button class="test-button">test</button>
    <div class="options__container">
    <play-options class="options"></play-options>
    </div>
    `;
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


    this.appendChild(style);
    this.addListeners()
  }

})