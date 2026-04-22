const imgIn = document.querySelector("#pizza-in");
const imgOut = document.querySelector("#pizza-out");
const imgs = {
  img1: "assets/pizzas_imgs/pizza_1.png",
  img2: "assets/pizzas_imgs/pizza_2.png",
  img3: "assets/pizzas_imgs/pizza_3.png",
};
const items = [
  {
    img: imgs.img1,
    name: "Monica",
    desc: "Pizza intensa y elegante, con pepperoni jugoso, el aroma profundo de la trufa negra y una capa de queso fundido que envuelve cada bocado en sabor irresistible.",
  },
  {
    img: imgs.img2,
    name: "Lucia",
    desc: "Pizza intensa y elegante, con pepperoni jugoso, el aroma profundo de la trufa negra y una capa de queso fundido que envuelve cada bocado en sabor irresistible.",
  },
  {
    img: imgs.img3,
    name: "Juana",
    desc: "Pizza intensa y elegante, con pepperoni jugoso, el aroma profundo de la trufa negra y una capa de queso fundido que envuelve cada bocado en sabor irresistible.",
  },
];
const newPizzaItem = () =>
  document.querySelector("#template-pizza-item").content.cloneNode(true);
const handleMouseOver = () => {
  const queue = [imgs.img1, null];
  imgIn.addEventListener("animationend", () => {
    imgIn.classList.remove("rotate-pizza-in");
  });
  imgOut.addEventListener("animationend", () => {
    imgOut.classList.remove("rotate-pizza-out");
  });
  imgIn.src = queue[0];
  return (img) => {
    if (img === queue[0]) return;
    queue.unshift(img);
    queue.pop();
    imgIn.src = queue[1];
    imgOut.src = queue[0];
    imgIn.classList.add("rotate-pizza-in");
    imgOut.classList.add("rotate-pizza-out");
  };
};
const setUpItems = () => {
  const container = document.querySelector("#pizza-items");
  const handleHover = handleMouseOver();
  container.innerHTML = "";
  for (const item of items) {
    const template = newPizzaItem();
    const li = template.querySelector("#pizza-item");
    li.addEventListener("mouseenter", () => handleHover(item.img));
    const [title, desc] = li.querySelectorAll("span");
    title.innerHTML = item.name;
    desc.innerHTML = item.desc;
    container.appendChild(li);
  }
};
setUpItems();
