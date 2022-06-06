customElements.define('play-button', class PlayButton extends HTMLElement {
    shadow = this.attachShadow({ mode: "open"});
    constructor() {
      super();
      this.render();
    }
    render(){
        const style = document.createElement("style");
        const content = this.textContent;
        style.innerHTML = `
            .blue-button{
                background: #006CFC;
                border: 10px solid #001997;
                border-radius: 10px;
                width:322px;
                height:87px;
                font-size:45px;
                font-family:'Odibee Sans';
                color:white;
            }
        `
        this.shadow.innerHTML = `
         <button class="blue-button">${content}</button>
        `
        this.shadow.appendChild(style);
    }
  });