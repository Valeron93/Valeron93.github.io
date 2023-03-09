import {Renderer} from "./renderer.js";
const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");
const renderer = Renderer.create(gl);
const state = {
  x: 0,
  y: 0,
  zoom: 1
};
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.setViewportSize(canvas.width, canvas.height);
  draw();
}
renderer.setZoom(1);
function zoomBy(delta) {
  const sens = 5e-4;
  state.zoom += delta * sens * state.zoom;
  if (state.zoom < 22e-6) {
    state.zoom = 22e-6;
  }
  if (state.zoom > 1) {
    state.zoom = 1;
  }
  renderer.setZoom(state.zoom);
  draw();
}
function draw() {
  renderer.clear();
  renderer.drawRect();
}
window.addEventListener("wheel", (event) => {
  const {deltaY} = event;
  zoomBy(-deltaY);
});
window.addEventListener("mousemove", (event) => {
  if (event.buttons == 0) {
    return;
  }
  const {movementX, movementY} = event;
  const {zoom} = state;
  state.x += zoom * movementX * 5e-3;
  state.y -= zoom * movementY * 5e-3;
  renderer.setTranslation(state.x, state.y);
  draw();
});
window.addEventListener("resize", resize);
resize();
draw();
