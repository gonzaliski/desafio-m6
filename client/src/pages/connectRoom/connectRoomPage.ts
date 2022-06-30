import {Router} from "@vaadin/router"
import { state } from "../../state";
customElements.define('connect-room-page', class ConnectRoom extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners(){
    const formEl = this.querySelector(".form");
    formEl.addEventListener('submit',(e)=>{
      e.preventDefault();
      const target = e.target as any;
      state.setRoomId(target["room-id__input"].value)
      Router.go("/setName")
    });
  }

  render(){
    this.innerHTML=`
    <h1 class="title">Piedra
    Papel ó
    Tijera</h1>
    <form class="form" id="form">
    <input required class="name__input" name="room-id__input" type="text"></input>
    <blue-button class="button-play" id="send-button">Ingresar a la sala</blue-button>
    </form>
    <play-options class="options"></play-options>
    `
    this.className = "title_container"
    const style = document.createElement("style");
    style.innerHTML=`
      .title_container{
          display:grid;
          grid-template-rows: 350px 150px 200px;
          align-items: center;
          justify-items:center;
          height:100vh;
          position:relative;
          font-family:'Odibee Sans';
      }
      .title{
        text-align:center;
        font-family:'Roboto';
        font-weight: 700;
        font-size: 80px;  
        color:#009048;
      }
      .options{
        pointer-events:none;
        position:absolute;
        bottom:0px;
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
      }

    `
    this.appendChild(style)
    this.addListeners();
  }
  


})