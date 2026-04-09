const items = document.querySelectorAll("#nav-item");
items.forEach((item) => {
  item.addEventListener("click", () => {
    const elemento = document.querySelector(item.dataset.href);
    elemento.scrollIntoView({ block: "start", behavior: "smooth" });
  });
});
const sections = ["home", "coffee", "adopt"];
/** @param {IntersectionObserverEntry[]} element*/
function handleIntersection(element) {
  if (!element || !element[0]) return;
  const { target: current } =
    element.find((item) => item.isIntersecting) ?? element[0];
  const { id } = current;
  items.forEach((item) => {
    item.dataset.href === "#" + id
      ? item.classList.add("active")
      : item.classList.remove("active");
  });
}
function initObserver() {
  const isDekstop = window.innerWidth >= 768;
  const intersection = new IntersectionObserver(handleIntersection, {
    threshold: isDekstop ? 0.8 : 0.5,
    scrollMargin: "5px 0px 0px 0px",
  });
  for (const key of sections) {
    intersection.observe(document.getElementById(key));
  }
}
window.addEventListener("DOMContentLoaded", initObserver);
window.addEventListener("resize", initObserver);
