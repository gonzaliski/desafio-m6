import {Router} from '@vaadin/router';

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  {path: '/', component:'welcome-page'},
  {path: '/setName', component: 'set-name-page'},
  {path: '/connectRoom', component: 'connect-room-page'},
  {path: '/room-info', component: 'room-info-page'},
  {path: '/instructions', component: 'instructions-page'},
  {path: '/waiting', component: 'waiting-page'},
  {path: '/game', component: 'game-page'},
  {path: '/showHands', component: 'show-hands-page'}
]);