import "../../root"
import {state} from "../../state"
export function initPage(params){
    state.saveParams(params); 

    const div = document.createElement("div");
    div.innerHTML = `
        <countdown-el seconds="3" class="countdown-game"></countdown-el>
        <play-options class="options"></play-options>
    `;
    div.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title_container{
          display:grid;
          grid-template-rows: 500px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
      }
      .options{
        position:absolute;
        bottom:0px;
      }
    `
    const playerOption = div.querySelector(".options")
    playerOption.addEventListener("click",()=>{
      params.goTo("/showHands")
    })
    
    div.appendChild(style);
    return div
}
