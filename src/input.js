export function bindControls(elements, handlers) {
  elements.nightBtn.addEventListener('click', handlers.onNight);
  elements.resetBtn.addEventListener('click', handlers.onReset);
  elements.helpBtn.addEventListener('click', handlers.onHelp);
}
