import {Router} from "@vaadin/router"
import { state } from "../../state";

customElements.define('show-hands-page', class ShowHandsPage extends HTMLElement {
   imageURL = require("url:../../assets/star.png");

    
   connectedCallback(){
    const oponentHasPlayed = state.getOponent().hasPlayed
    if(oponentHasPlayed){
      console.log("aAA");
      state.whoWins()
      // state.resetPlay()
    }
     this.render()
    }
    addListeners(){
    console.log("en juego.",state.data.play);
      console.log("yo jugue",state.data.play.myPlay, "y mi oponente:", state.data.play.oponentPlay);
      console.log(state.listeners);
      
      const buttonEl =  this.querySelector(".play-again__button")
      console.log(buttonEl);
   buttonEl.addEventListener("click", () => {
      state.resetPlay()
      Router.go("/instructions");
    });
  }
  render(){

    this.innerHTML = `
      <div class="hands__container">
      <elemento-el elemento="${state.data.play.myPlay}" class="option-oponent"></elemento-el>
      <elemento-el elemento="${state.data.play.oponentPlay}" class="option-player"></elemento-el>
      </div>
          `;
      this.className = "container";
      const style = document.createElement("style");
      style.innerHTML = `
          :root{
            --won-color: #888949E5;
            --loose-color: #894949;
          }
          .container{
            height:100vh;
            position:relative;
            font-family:'Odibee Sans'
          }
          .hands__container{
            height:100vh;
            width:100%;
            display:flex;
            flex-direction:column;
            align-items: center;
            justify-items:center;
            position:absolute;
            overflow: hidden;
          }
          .option-player{
            pointer-events:none;
            transform: scale(1.5);
            position: absolute;
            bottom:0px;
            animation: move-up 2s ease 1;
          }
          .option-oponent{
            pointer-events:none;
            transform: scale(1.5) rotate(180deg);
            position: absolute;
            top:0px;
            animation: move-down 2s ease 1;
          }
          @keyframes move-down{
            0%{
              transform:translateY(-70px) scale(1.5) rotate(180deg);
            }
     
            100%{
              transform:translateY(0px) scale(1.5) rotate(180deg);
            }
          }
          @keyframes move-up{
            0%{
              transform:translateY(70px) scale(1.5);
            }
     
            100%{
              transform:translateY(0px) scale(1.5);
            }
          }
        `;
          
  const resultEl = document.createElement("div");
  resultEl.innerHTML = `
  <div class="result__container">
  <div class="star__container">
  <img src=${this.imageURL} class="star-img">
  <p class="result-text">${state.data.hasWon && !state.data.hasDrawn ? "Ganaste" : (state.data.hasDrawn ? "Empate" : "Perdiste")}</p>
    </div>
    <div class="score__container">
    <p class="score-title">Score</p>
    <div class="score-result__container">
    <p>${state.data.name}: ${state.data.wins}</p>
    <p>${state.getOponent().name}:${state.data.oponentWins} </p>
    </div>
    </div>
    <play-button class="play-again__button">Volver a jugar</play-button> 
    </div>
    <div class="background-container"></div>
    <style>
    .star-img{
      height:259px;
      width:254px;
      filter: ${
        state.data.hasWon
          ? ""
          : "invert(7%) sepia(13%) saturate(3689%) hue-rotate(601deg) brightness(95%) contrast(188%)"
      };
    }
    .star__container{
      margin-top:20px;
      position:relative;
      
    }
    .result__container{
      position:absolute;
      z-index:9;
      display:flex;
      width:100%;
      height:100vh;
      flex-direction:column;
      align-items:center;
      gap:20px;
      }
      .result-text{
        position:absolute;
        font-size:55px;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .score__container{
        display:grid;
        justify-items:center;
        width:260px;
        height:218px;
        border:10px solid #000000;
        background-color: white;
        align-items:center;
        font-size:45px;
        box-sizing:content-box;
      }
      .score-result__container{
      text-align:right;
      }
      p{
        margin:0;
      }
      .background-container{
        height:100vh;
        width:100%;
        background-color:var(${
          state.data.hasWon ? "--won-color" : "--loose-color"
        });
        opacity:0.5;
      }
      </style>
      `;
  setTimeout(() => {
    this.appendChild(resultEl);
    this.addListeners();
  }, 3000);

  this.appendChild(style);
  }
})
