import "../../pages/game/gamePage";
import {state} from "../../state"
import { Router } from "@vaadin/router";
export function setSeconds(container) {
  let getSeconds = container.getAttribute("seconds");
  let countdown = parseInt(getSeconds, 10);
  const secondEl = container.querySelector(".cuenta-regresiva");
  secondEl.textContent = countdown;
  const intervalId = setInterval(() => {
    if (countdown == 0) {
        if(location.pathname == "/game"){ 
          alert("Se acabó el tiempo porque vos o tu rival no jugó")
          clearInterval(intervalId);
          Router.go("/instructions")
        }
      clearInterval(intervalId);
    }
    secondEl.textContent = countdown;
    countdown--;
  }, 1000);
}
