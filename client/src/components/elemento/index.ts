import { state } from "../../state";

customElements.define('elemento-el', class Elemento extends HTMLElement {
    elemento:string;

    shadow = this.attachShadow({ mode: "open"});
    constructor() {
      super();
    }
    
    connectedCallback(){
      this.elemento = this.getAttribute("elemento") || "tijera";
      this.render();
    }

    addListeners(){
        const elemento = this.shadow.querySelector(".elemento-container");
        elemento.addEventListener("click",()=>{

          if(this.elemento == "piedra" || this.elemento == "papel" || this.elemento == "tijera"){
            const params = state.getParams();
            
            state.savePlayerPlay(this.elemento);
            params.goTo("/instructions")
          }
        })
      }
      
      render(){
        var imageURL = ""
        if(this.elemento == "tijera"){
           imageURL = require("url:../../assets/tijera.png");
        }
        if(this.elemento == "piedra"){
           imageURL = require("url:../../assets/piedra.png");
        }
        if(this.elemento == "papel"){
           imageURL = require("url:../../assets/papel.png");
        }
        
        this.shadow.innerHTML = `
         <div class="elemento-container">
           <img src=${imageURL}></img>
         </div>
        `
        this.addListeners();
    }
  });