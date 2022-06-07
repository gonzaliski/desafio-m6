import "../elemento"
customElements.define('play-options', class PlayOptions extends HTMLElement {
    shadow = this.attachShadow({ mode: "open"});
    constructor() {
      super();
      this.render();
    }

    render(){
        const style = document.createElement("style");
        style.innerHTML = `
         .options_container{
             display:flex;
             gap:48px;
             
         }
         @media(min-widht:960px){
          .options_container{
            gap:68px;
            transform:scale(1.5);
            }
         }
        `
        this.shadow.innerHTML = `
         <div class="options_container">
         <elemento-el elemento="piedra"></elemento-el>
         <elemento-el elemento="papel"></elemento-el>
         <elemento-el elemento="tijera"></elemento-el>
         </div>
        `
        this.shadow.appendChild(style);
        
    }
  });