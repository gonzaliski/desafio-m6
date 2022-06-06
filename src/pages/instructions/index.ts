import "../../root"
export function initPage(params){
    const div = document.createElement("div");
    div.innerHTML = `
        <h2 class="title">Presioná jugar
        y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
        </h2>
        <play-button class="button-play">Jugar!</play-button>
        <play-options class="options"></play-options>
    `;
    div.className = "title_container"
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
    `
    const buttonEl = div.querySelector(".button-play");
    buttonEl.addEventListener('click',()=>{
        params.goTo("/game")
    });

    div.appendChild(style);
    return div
}