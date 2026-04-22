const imgParallax = document.querySelector("#parallax-hero");
const maxHeight = 5;
window.addEventListener("scroll", (e) => {
  let h = document.documentElement,
    b = document.body,
    st = "scrollTop",
    sh = "scrollHeight";

  let percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 10;
  const value = Math.min(maxHeight * percent, maxHeight);
  imgParallax.style.translate = `0 -${value}%`;
});
