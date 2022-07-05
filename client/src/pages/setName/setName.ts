import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('set-name-page', class SetName extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners(){
    const formEl = this.querySelector("#form");
    const buttonEl = this.querySelector("#send-button")
    buttonEl?.addEventListener("click",(e)=>{
      e.preventDefault();
      formEl?.dispatchEvent(new Event("submit"))
    })
    
    formEl.addEventListener("submit",(e)=>{
      e.preventDefault();
      const target = e.target as any;
      state.setName(target["name"].value)
      state.signIn(()=>{
        state.accessToRoom(()=>{
          
            state.checkPlayerOnRoom(()=>{
              Router.go("/room-info")
            },
            ()=>{
               Router.go("/cant-connect")
            })

          // state.setPlayerDataOnRoom();
        });
      });
    });
  }

  render(){
    this.innerHTML=`
    <h1 class="title">Piedra
    Papel ó
    Tijera</h1>
    <div>
    <form class="form" id="form">
    <h2 class="form-title">Tu nombre</h2>
    <input required class="name__input" name="name" maxlength="12" type="text"></input>
    <blue-button  type="submit" class="button-play" id="send-button" >Empezar</blue-button>
    </form>
    </div>
    <play-options class="options"></play-options>
    `
    this.className = "title__container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title__container{
          display:grid;
          grid-template-rows: 300px 1fr 200px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
          font-family:'Odibee Sans';
      }
      @media(max-width:420px){
        .title__container{
          grid-template-rows: 250px 200px;
            }
          }
      .title{
        text-align:center;
        font-family:'Roboto';
        font-weight: 700;
        font-size: 80px;  
        color:#009048;
      }
      @media(max-width:420px){
        .title{
          font-size: 60px;  
      }
        .button-play{
          transform: scale(0.8);
      }
    }
    .form{
      display:flex;
      flex-direction:column;
      gap:20px;
      align-items:center;
    }
    .name__input{
      width:322px;
      height:50px;
      border:solid 4px #182460;
      border-radius:4px;
    }
    .form-title{
      font-size:45px;
      margin:0;
    }
    .button-play{
      margin-top:5px;
    }
    .options{
      pointer-events:none;
      margin-top:auto;
    }

    `
    this.appendChild(style)
    this.addListeners();
  }
  


})
