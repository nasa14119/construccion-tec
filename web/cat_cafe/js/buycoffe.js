/** @type {HTMLButtonElement} */
const btn = document.querySelector("#buy-coffee");
const container = document.querySelector("#hero-container");
const img = document.querySelector("#hero-image");
img.addEventListener("click", () => {
  document
    .querySelector("#coffee")
    .scrollIntoView({ behavior: "smooth", block: "nearest" });
});
/** @param {MouseEvent} e */
function handleMoseOver(e) {
  const rect = container.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  btn.style.left = `${x + btn.offsetWidth / 4}px`;
  btn.style.top = `${y - btn.offsetHeight / 2 - 10}px`;
}
function reset() {
  btn.style.left = "unset";
  btn.style.top = "unset";
  window.innerWidth >= 768
    ? (btn.style.display = "flex")
    : (btn.style.display = "none");
  container.removeEventListener("mousemove", handleMoseOver);
  container.removeEventListener(
    "mouseenter",
    () => (btn.style.display = "flex"),
  );
  container.removeEventListener(
    "mouseleve",
    () => (btn.style.display = "none"),
  );
}
function init() {
  if (window.innerWidth <= 768) {
    reset();
    return;
  }
  container.addEventListener("mousemove", handleMoseOver);
  container.addEventListener("mouseenter", () => {
    btn.style.display = "flex";
  });
  container.addEventListener("mouseleave", () => {
    btn.style.display = "none";
  });
}
window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", init);
