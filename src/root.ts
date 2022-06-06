import {initPage as initTitle} from "./pages/welcome"
import {initPage as initInstructions} from "./pages/instructions"
import {initPage as initGame} from "./pages/game"
import {initPage as initShowHands} from "./pages/showHands"

const routes = [
  {
    path:/\/welcome/,
    component: initTitle
  },
  {
    path:/\/instructions/,
    component: initInstructions
  },
  {
    path:/\/game/,
    component: initGame
  },
  {
    path:/\/showHands/,
    component: initShowHands
  }
]

const BASE_PATH = "/desafio-m5";

function isGithubPages() {
  return location.host.includes("github.io");
}

export function initRouter(container: Element) {
  function goTo(path) {
    const completePath = isGithubPages() ? BASE_PATH + path : path;
    history.pushState({}, "", completePath);
    handleRoute(completePath);
  }
  function handleRoute(route) {

    const newRoute = isGithubPages() ? route.replace(BASE_PATH, "") : route;
    //recibe una ruta, la compara con las rutas del array routes y
    //pregunta si alguna coincide con el patron y ejecuta la funcion asociada con esa ruta
    for (const r of routes) {
      if (r.path.test(newRoute)) {
        const el = r.component({ goTo: goTo }); // le pasa la funcion goTo para que pueda hacer el cambio en la url
        if (container.firstChild) {
          //si tiene algo lo vacio
          container.firstChild.remove();
        }
        container.appendChild(el);
      }
    }
    // newRoute entonces ya no tiene el BASE_PATH
    // y podemos seguir procesando la ruta como siempre
    
    // resto del router...
  }
  if (location.pathname == "/desafio-m5/") {
		goTo("/welcome");
	} else {
		handleRoute(location.pathname);
	}
}