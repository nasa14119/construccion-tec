const CATS = [
  {
    img: "https://images.unsplash.com/photo-1570117268106-8e369647c733?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Emeregildo",
    desc: "Playful and curious, always chasing shadows.",
    year: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1762685793510-a1d59d197b2d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Jaime",
    desc: "Quick and graceful with bright, alert eyes.",
    year: 5,
  },
  {
    img: "https://images.unsplash.com/photo-1570824105192-a7bb72b73141?q=80&w=1442&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Pancracio",
    desc: "Independent but affectionate when it chooses.",
    year: 1,
  },
  {
    img: "https://images.unsplash.com/photo-1490650034439-fd184c3c86a5?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Schrödinger",
    desc: "Mischievous and clever, full of personality.",
    year: 7,
  },
  {
    img: "https://images.unsplash.com/photo-1570824103090-72cf4906868c?q=80&w=1426&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Cilantro",
    desc: "Soft and sleepy, loves sunny windowsills.",
    year: 3,
  },
];

/** @type{() => HTMLDivElement} */
const template = () =>
  document.querySelector("#cat-template").content.cloneNode(true);
function appendCats() {
  const container = document.querySelector("#cat-gallery");
  CATS.forEach(({ img, name, desc, year }) => {
    const element = template();
    element.querySelector("img").src = img;
    element.querySelector(".cat-title").innerHTML = name;
    element.querySelector(".cat-desc").innerHTML = desc;
    element.querySelector(".cat-age").innerHTML = `${year} years old`;
    container.appendChild(element);
  });
}
window.addEventListener("DOMContentLoaded", appendCats);
