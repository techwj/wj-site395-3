export default {
  mounted(el, binding) {
    el._clickHandler_ = function(e) {
      let target = e.target;
      while (target && target !== el) {
        if (target.tagName === 'A') {
          return;
        }
        target = target.parentNode;
      }
      binding.value(e);
    }
    el.addEventListener('click', el._clickHandler_);
  },
  beforeUnmount(el) {
    el.removeEventListener('click', el._clickHandler_);
    delete el._clickHandler_;
  }
}