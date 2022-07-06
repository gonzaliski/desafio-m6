import "../elemento"
customElements.define('play-options', class PlayOptions extends HTMLElement {
    shadow = this.attachShadow({ mode: "open"});
    constructor() {
      super();
      this.render();
    }
    addListeners(){
     const tijera =  this.shadow.querySelector("elemento-el[elemento='tijera']")
     const piedra =  this.shadow.querySelector("elemento-el[elemento='piedra']")
     const papel =  this.shadow.querySelector("elemento-el[elemento='papel']")
     const elementStyle = this.shadow.querySelector("style")
     tijera.addEventListener("click",()=>{
      elementStyle.innerHTML=`
      elemento-el[elemento="piedra"],
      elemento-el[elemento="papel"]
      {
        display:none;
      }
      `
     })
     piedra.addEventListener("click",()=>{
      elementStyle.innerHTML=`
      elemento-el[elemento="tijera"],
      elemento-el[elemento="papel"]
      {
        display:none;
      }
      `
     })
     papel.addEventListener("click",()=>{
      elementStyle.innerHTML=`
      elemento-el[elemento="piedra"],
      elemento-el[elemento="tijera"]
      {
        display:none;
      }
      `
     })
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
        this.addListeners()
    }
  });