/** @type {DAY[]} */
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** @type {(str: string) => HTMLLIElement} */
const templateSpecials = (isFirst) => {
  return document.querySelector("#menu-item").content.cloneNode(true);
};
/**
 * @param {string} day
 * @returns {Promise<MenuItem>}
 */
const defaultSrc =
  "https://images.unsplash.com/photo-1562447457-579fc34967fb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const dayMenu = document.querySelector("#day-menu");
const imgShowCase = document.querySelector("#show-case-img");
imgShowCase.src = defaultSrc;
const setSrc = (li, src) => {
  li.addEventListener("mouseover", () => {
    imgShowCase.classList.add("animate-img");
    imgShowCase.src = src;
  });
  li.addEventListener("click", () => {
    imgShowCase.classList.add("animate-img");
    imgShowCase.src = src;
  });
};
imgShowCase.addEventListener("animationend", () => {
  imgShowCase.classList.remove("animate-img");
});
const cache = new Map();
const parent = document.querySelector("#container-content");
const getMenu = async (day) => {
  // await new Promise((res) => setTimeout(res, 1000));
  if (cache.has(day)) return cache.get(day);
  const res = await fetch(`api/menu/${day.toLocaleLowerCase()}`);
  const data = res.json();
  cache.set(day, data);
  return data;
};
async function setMenu(day) {
  parent.dataset.loading = true;
  const container = document
    .querySelector("#specials-container")
    .cloneNode(true);
  container.innerHTML = "";
  const menuItem = await getMenu(day);
  dayMenu.querySelector("h3").innerHTML = day;
  for (const [key, items] of Object.entries(menuItem)) {
    const element = templateSpecials();
    const ul = element.querySelector("ul");
    element.querySelector("h4").innerHTML = key;
    items.forEach(({ name, imgSrc }) => {
      const li = element.querySelector("li").cloneNode(true);
      setSrc(li, imgSrc);
      li.innerHTML = name;
      ul.appendChild(li);
    });
    container.appendChild(element);
  }
  let og = document.querySelector("#specials-container");
  og.parentNode.replaceChild(container, og);
  parent.dataset.loading = false;
}
const day = DAYS[new Date().getDay()];
const ul = document.querySelector("#days");
ul.querySelectorAll("li").forEach((node) => {
  node.addEventListener("click", () => {
    setMenu(node.id);
  });
});
setMenu(day);
