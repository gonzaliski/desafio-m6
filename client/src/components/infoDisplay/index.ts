import { state } from "../../state";

customElements.define('info-display', class InfoDisplay extends HTMLElement {
    roomId:String;
    localPlayerName:String;
    oponentName:String;

    shadow = this.attachShadow({ mode: "open"});
    constructor() {
      super();
    }
    
    connectedCallback(){
        const cs = state.getState()
        this.roomId = cs.roomId
        this.localPlayerName = cs.name
        this.oponentName = state.data.oponent.name || "Esperando jugador 2"
      this.render();
    }
 
      render(){

        this.shadow.innerHTML = `
        <div class="header__container">
        <div>
          <p>${this.localPlayerName}</p>
          <p>${this.oponentName}</p>
        </div>
        <div>
          <h4>Sala</h4>
          <p>${this.roomId}</p>
        </div>
      </div>
        `
        const style = document.createElement("style")
        style.innerHTML = `
        .header__container{
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin:10px;
            font-size:24px;
            font-family:'Odibee Sans';
        }
        `
        this.shadow.appendChild(style)
        }
  });