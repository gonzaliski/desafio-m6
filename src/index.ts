import "./components/play-button"
import "./components/elemento"
import "./components/play-options"
import "./components/countdown"
import { initRouter } from "./root"
import {state} from "./state"
(function main(){
    state.init();
    initRouter(document.querySelector(".root"))
})();