let isMove = false;
const btn = document.querySelector("#center-btn");
const center = [37.4221, -122.0841];
var map = L.map("map", {
  center,
  zoom: 10,
  zoomControl: false,
});
function hangleChange() {
  const newConrds = Object.values(map.getCenter()).map((v) => v.toFixed(3));
  const centerDefault = center.map((v) => v.toFixed(3));
  isMove =
    (centerDefault[0] !== newConrds[0] && centerDefault[1] !== newConrds[1]) ||
    map.getZoom() !== 10;
  isMove ? btn.classList.add("active") : btn.classList.remove("active");
}
btn.addEventListener("click", () => {
  map.flyTo(center, 10, { duration: 0.15 });
});
map.on("moveend", hangleChange);
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
}).addTo(map);
const myIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cb062e" style="transform:rotate(20deg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    ),
  iconSize: [32, 32],
});
L.marker(center, { icon: myIcon }).addTo(map);
