import {setSeconds} from "./setSeconds"
customElements.define('countdown-el', class countdown extends HTMLElement {
    shadow: ShadowRoot;
    seconds: string;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open"});
    }
    connectedCallback(){
        this.seconds = this.getAttribute("seconds") || "3";
        const style = document.createElement("style");
        style.innerHTML = `
        .circulo{
            display:flex;
            justify-content:center;
            align-items:center;
            border:10px solid black;  
            border-radius:50%;
            width:243px;
            height:243px;
            animation: circulo ${(parseInt(this.seconds,10) + 2) + "s"} ease 1;
            animation-delay: 0s;
        }
        @keyframes circulo{
            0%{
                transform: scale(0.5)
            }
            80%{
                transform: scale(1.0)
            }
            100%{
                transform: scale(0.2)
              }
            }
            .cuenta-regresiva{
                font-family:'Roboto';
                font-weight:700;
                font-size:100px;
            }
            `
            this.shadow.appendChild(style);
            this.render();
        }

        render(){
            const div = document.createElement("div");
            div.setAttribute("seconds",this.seconds);
            div.innerHTML = `
            <div class="circulo">
            <h1 class="cuenta-regresiva"></h1>       
            </div>
        `
            setSeconds(div);
            this.shadow.appendChild(div);
    }
  });

