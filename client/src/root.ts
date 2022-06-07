import {Router} from '@vaadin/router';

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  {path: '/', component: 'welcome-page'},
  {path: '/setName', component: 'set-name-page'},
  {path: '/room-info', component: 'room-info-page'},
  {path: '/instructions', component: 'initInstructions'},
  {path: '/game', component: 'initGame'},
  {path: '/showHands', component: 'initShowHands'}
]);