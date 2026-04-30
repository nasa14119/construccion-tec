const audio = new Audio();
audio.src = "./theme.mp3";
audio.autoplay = true;
audio.loop = true;
function start() {
  const div = document.querySelector("#audio-control");
  div.addEventListener("click", () => {
    if (audio.paused) {
      div.dataset.play = true;
      audio.play();
    } else {
      div.dataset.play = false;
      audio.pause();
    }
  });
  audio.addEventListener("loadedmetadata", () => {
    audio.play().catch(() => {
      window.addEventListener(
        "click",
        () => {
          audio.play();
        },
        { once: true },
      );
    });
  });
}
start();
