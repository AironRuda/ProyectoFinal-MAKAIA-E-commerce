const API_URL = "http://localhost:3000/products"; //url de productos
const cardField = document.querySelector("#cardField"); // instanciar el lugar donde iran las cartas
const dropdownContent = document.querySelector(".dropdown-content");

const handleError = (error) => {
  console.log(error);
};

/**
 * extrae la informacion
 * si no recibe parametro, trae toda la info del db
 * si recibe parametro, hace una busqueda general en todos los campos relacionados al parametro
 * @param {*str} browser
 * @returns retorna una lista con objetos
 */
const getInfo = async (browser) => {
  browser
    ? (response = await fetch(API_URL + `?q=${browser}`))
    : (response = await fetch(API_URL));
  try {
    let data = await response.json();
    data = data.sort(() => {
      return Math.random() - 0.5; // genera que la info salga en desorden
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};
/**
 * crea una carta general a partir de un objeto
 * @param {*array} data
 */
const createBasicCard = (data) => {
  cardField.innerHTML += `
  <div class="col">
    <div class="card" id="${data.id}" style="width: 18rem">
        <img src="${data.img}" class="card-img-top" alt="..." />
        <div class="card-body">
            <p class="card-text">${data.type}</p>
            <h5 class="card-title">${data.name}</h5>
        </div>
        <div class="money_bag">
              <h3>$ ${data.price}</h3>
              <button class="btn btn-success text-uppercase btn-sm details cart-btn" onClick="itemSelected(${data.id} ,'cart')">
                ADD
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-cart3"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                  />
                </svg>
              </button>
              <button class="btn btn-success text-uppercase btn-sm details favs-btn" onClick="itemSelected(${data.id} ,'fav')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                  />
                </svg>
              </button>
            </div>
    </div>
    </div>
  `;
};
/**
 * Genera una busqueda en la db, crea cartas a partir del resultado de la buqeuda
 * y agrega las cartas en el campo de las cartas
 * @param {*str} products
 */
const showProducts = async (products) => {
  cardField.innerHTML = "";
  const data = await getInfo(products);
  data.forEach((element) => {
    createBasicCard(element);
  });
  addInfoToCart();
};

document.addEventListener("DOMContentLoaded", showProducts()); // genera todas las cartas cuando el dom es cargado

const browser = document.querySelector("#browser");
/**
 * identifica el estimulo "submit", genera la buqeuda de info y presenta las cartas
 */
browser.addEventListener("submit", (e) => {
  e.preventDefault();
  showProducts(e.target.search.value);
});
/**
 * recibe un id como parametro, extrae el objeto con el id del db y lo agrega al loca storage
 * @param {*str} idSelected
 * @param {*str} favOrCart
 */
const itemSelected = async (idSelected, favOrCart) => {
  const data = await getInfo();
  const product = data.find((item) => item.id == idSelected); // extrae el producto con el id

  let favOrCartStorage = localStorage.getItem(favOrCart); // trae del local storage o el carrito o el favPage
  let infoStorage;

  favOrCartStorage
    ? (infoStorage = JSON.parse(favOrCartStorage))
    : (infoStorage = []);

  let bandFinded = infoStorage.some((item) => item.id == idSelected);

  bandFinded ? console.log("Ya está en " + "fav") : infoStorage.push(product);

  let answerJSON = JSON.stringify(infoStorage);
  localStorage.setItem(favOrCart, answerJSON);
  addInfoToCart();
};
/**
 * recibe un objeto del que se extraen los datos y muestran en cartas de favoritos
 * @param {*object} data
 */
const createFavCard = (data) => {
  cardField.innerHTML += `
    <div class="card" id="${data.id}" style="width: 18rem">
      <button type="button" class="btn-close" aria-label="Close" onClick="deleteItem(${data.id},'fav')"></button>
      <img src="${data.img}" class="card-img-top" alt="..." />
      <div class="card-body">
          <p class="card-text">${data.type}</p>
          <h5 class="card-title">${data.name}</h5>
      </div>
      <div class="money_bag">
            <h3>$ ${data.price}</h3>
            <button class="btn btn-success text-uppercase btn-sm details cart-btn" onClick="itemSelected(${data.id} ,'cart')">
              ADD
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-cart3"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                />
              </svg>
            </button>
      
          </div>
    </div>
  `;
};
/**
 * ingresa al localstorage de fav y los muestra en pantalla
 */
const showFavs = () => {
  cardField.innerHTML = `<h1>Favoritos</h1>`;
  let favStorage = localStorage.getItem("fav");
  let infoStorage;
  favStorage ? (infoStorage = JSON.parse(favStorage)) : (infoStorage = []);
  infoStorage.forEach((element) => {
    createFavCard(element);
  });
};
/**
 * recibe un id para eliminar, busca dentro de favoritos y elimina el objeto con ese id
 * @param {*num} idToDelete
 */

const createCartCard = (data) => {
  dropdownContent.innerHTML += `
    <div class="card" id="${data.id}" style="width: 18rem">
    <button type="button" class="btn-close" aria-label="Close" onClick="deleteItem(${data.id}, 'cart')"></button>
      <img src="${data.img}" class="card-img-top" alt="..." />
      <div class="card-body">
          <p class="card-text">${data.type}</p>
          <p class="card-title">${data.name}</p>
      </div>
      <div class="money_bag">
            <h3>$ ${data.price}</h3>
      </div>
      
    </div>
  `;
};

const addInfoToCart = () => {
  dropdownContent.innerHTML = `
  <h1>Carrito</h1>
  `;
  let cartStorage = localStorage.getItem("cart");
  let infoStorage;
  cartStorage ? (infoStorage = JSON.parse(cartStorage)) : (infoStorage = []);
  infoStorage.forEach((element) => {
    createCartCard(element);
  });
  dropdownContent.innerHTML += `
    <button type="button" class="btn btn-primary btn-sm">Small button</button>
    <button type="button" class="btn btn-secondary btn-sm">Small button</button>
  `;
};

const deleteItem = (idToDelete, favOrCart) => {
  let storage = localStorage.getItem(favOrCart);
  let infoStorage = JSON.parse(storage);
  infoStorage = infoStorage.filter((item) => item.id != idToDelete);
  let answerJSON = JSON.stringify(infoStorage);
  localStorage.setItem(favOrCart, answerJSON);
  showFavs();
  addInfoToCart();
};
/*

const deleteItem = (idToDelete) => {
  let favStorage = localStorage.getItem("fav");
  let infoStorage = JSON.parse(favStorage);
  infoStorage = infoStorage.filter((item) => item.id != idToDelete);
  let answerJSON = JSON.stringify(infoStorage);
  localStorage.setItem("fav", answerJSON);
  showFavs();
};

const showFavs = () => {
  cardField.innerHTML = `<h1>Favoritos</h1>`;
  let favStorage = localStorage.getItem("fav");
  let infoStorage;
  favStorage ? (infoStorage = JSON.parse(favStorage)) : (infoStorage = []);
  infoStorage.forEach((element) => {
    createFavCard(element);
  });
};

*/
