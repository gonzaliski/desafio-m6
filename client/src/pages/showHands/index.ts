import "../../root";
import { state } from "../../state";
export function initPage(params) {
  const div = document.createElement("div");
  const playerMove = state.getPlayerSelection();
  const comMove = state.getComSelection();
  const imageURL = require("url:../../assets/star.png");
  div.innerHTML = `
  <div class="hands__container">
  <elemento-el elemento="${comMove}" class="option-com"></elemento-el>
  <elemento-el elemento="${playerMove}" class="option-player"></elemento-el>
  </div>
      `;
  div.className = "container";
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
      .option-com{
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

  state.whoWins();

  const resultEl = document.createElement("div");
  resultEl.innerHTML = `
  <div class="result__container">
  <div class="star__container">
  <img src=${imageURL} class="star-img">
  <p class="result-text">${state.data.hasWon ? "Ganaste" : "Perdiste"}</p>
    </div>
    <div class="score__container">
    <p class="score-title">Score</p>
    <div class="score-result__container">
    <p>Vos: ${state.data.history.player}</p>
    <p>Maquina:${state.data.history.com} </p>
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
    div.appendChild(resultEl);
  }, 3000);

  resultEl
    .querySelector(".play-again__button")
    .addEventListener("click", () => {
      params.goTo("/game");
    });

  div.appendChild(style);
  return div;
}
