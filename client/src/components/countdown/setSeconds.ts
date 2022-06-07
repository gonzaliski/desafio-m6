import "../../pages/game";
import {state} from "../../state"
export function setSeconds(container) {
  let getSeconds = container.getAttribute("seconds");
  let countdown = parseInt(getSeconds, 10);
  const secondEl = container.querySelector(".cuenta-regresiva");
  secondEl.textContent = countdown;
  const intervalId = setInterval(() => {
    if (countdown == 0) {
        if(location.pathname == "/desafio-m5/game"){ 
            state.getParams().goTo("/instructions");
            clearInterval(intervalId);
        }
      clearInterval(intervalId);
    }
    secondEl.textContent = countdown;
    countdown--;
  }, 1000);
}
