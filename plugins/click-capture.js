import clickCapture from "~/directives/click-capture";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-capture', clickCapture);
});
