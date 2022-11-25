const API_URL = "http://localhost:3000"; //url de productos
const cardField = document.querySelector("#cardField"); // instanciar el lugar donde iran las cartas
const dropdownContent = document.querySelector(".dropdown-content");

const API_PATHS = {
  products: "/products",
  purchaseOrders: "/purchaseOrders",
};

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
const infoGET = async (path, browser) => {
  browser
    ? (response = await fetch(API_URL + path + `?q=${browser}`))
    : (response = await fetch(API_URL + path));
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
  <div class="card">
    <img src="${data.img}" class="card-img" alt="${data.name}" />
    <p class="productType">${data.type}</p>
    <p class="productName"><strong>${data.name}</strong></p>
    <h3 class="productPrice">$ ${data.price}</h3>
    <div class="btn-filed">
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
  `;
};
/**
 * Genera una busqueda en la db, crea cartas a partir del resultado de la buqeuda
 * y agrega las cartas en el campo de las cartas
 * @param {*str} products
 */
const showProducts = async (products) => {
  cardField.innerHTML = "";
  const data = await infoGET(API_PATHS.products, products);
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
 * extra la informacion del localStorage
 * @param {*str} favOrCart "fav" or "cart"
 * @returns array con objetos disponibles en el localStorage
 */
const extractInfoFromLocalStorage = (favOrCart) => {
  let favOrCartStorage = localStorage.getItem(favOrCart); // trae del local storage o el carrito o el favPage
  let infoStorage;
  favOrCartStorage
    ? (infoStorage = JSON.parse(favOrCartStorage))
    : (infoStorage = []);
  return infoStorage;
};
/**
 * recibe un id como parametro, extrae el objeto con el id del db y lo agrega al localStorage
 * @param {*str} idSelected id del producto que se agregará a una de las listas disponibles
 * @param {*str} favOrCart "fav" or "cart"
 */
const itemSelected = async (idSelected, favOrCart) => {
  const data = await infoGET(API_PATHS.products);
  const product = data.find((item) => item.id == idSelected); // extrae el producto con el id
  let infoStorage = extractInfoFromLocalStorage(favOrCart);
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
    <div class="card">
      <button class="btn-close" onClick="deleteItem(${data.id},'fav')"></button>
      <img src="${data.img}" class="card-img" alt="${data.name}" />
      <p class="productType">${data.type}</p>
      <p class="productName"><strong>${data.name}</strong></p>
      <h3 class="productPrice">$ ${data.price}</h3>
      <div class="btn-filed">
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
  cardField.innerHTML = `<h1 class="section-title">Favoritos</h1><br>`;
  let infoStorage = extractInfoFromLocalStorage("fav");
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
    <div class="cardCart">
      <button class="btn-close btn-close-cart" onClick="deleteItem(${data.id}, 'cart')"></button>
      <img src="${data.img}" class="card-img-cart" alt="${data.name}" />
      <div class="card-cart-info">
        <p class="productType">${data.type}</p>
        <p class="productName"><strong>${data.name}</strong></p>
      </div>
      
      <h3 class="productPrice-cart">$ ${data.price}</h3>
    </div>
  `;
};
/**
 * Agregar informacion carrito
 */
const addInfoToCart = () => {
  dropdownContent.innerHTML = `
  <h1>Carrito</h1>
  `;
  let infoStorage = extractInfoFromLocalStorage("cart");
  const cartIndex = document.querySelector("#cartIndex");
  cartIndex.innerHTML = infoStorage.length;
  infoStorage.forEach((element) => {
    createCartCard(element);
  });
  dropdownContent.innerHTML += `
    <button class="btn btn-success text-uppercase btn-cart-view" onclick="confirmCartView()">Confirmar compra</button>
    
  `;
};
/**
 * Se debe proporcionar un entero que indica el id del objeto a eliminar, y de donde se desea eliminar
 * @param {*int} idToDelete
 * @param {*string} favOrCart "fav" or "cart"
 */
const deleteItem = (idToDelete, favOrCart, cartConfirmRefresh) => {
  let infoStorage = extractInfoFromLocalStorage(favOrCart);
  infoStorage = infoStorage.filter((item) => item.id != idToDelete);
  let answerJSON = JSON.stringify(infoStorage);
  localStorage.setItem(favOrCart, answerJSON);

  if (favOrCart == "fav") {
    showFavs();
  } else {
    addInfoToCart();
    if (cartConfirmRefresh) confirmCartView();
  }
  // ;
};
/**
 * crea cartas que esten en el carrito de compras
 * @param {*object} data
 */
const createCartCardToConfirm = (data) => {
  cardField.innerHTML += `
    <div class="cardCartConfirm">
      <img src="${data.img}" class="card-img-confirm" alt="${data.name}" />
      <div>
        <p class="productType">${data.type}</p>
        <p class="productName"><strong>${data.name}</strong></p>
      </div>
      <h3 class="productPrice">$ ${data.price}</h3>

      <div class="quantity-btn-field">
        <button onclick="modifyQuantityProduct(${data.id},'plus')">+</button>
        <P>${data.quantity}</P>
        <button onclick="modifyQuantityProduct(${data.id},'minus')">-</button>
      </div>
      <div>
        <p>
        total
        ${data.quantity * data.price}
        </p>
      </div>
      <button class="btn-close" aria-label="Close" onClick="deleteItem(${
        data.id
      }, 'cart', true)"></button>
    </div>
  `;
};

/**
 * Extrae los productos del carrito de compras, los muestra y genera una suma del total de la compra
 */
const confirmCartView = () => {
  cardField.innerHTML = `<h1 class="section-title">Orden de compra</h1><br>`;
  let infoStorage = extractInfoFromLocalStorage("cart");
  let total = 0;
  infoStorage.forEach((element) => {
    total += element.quantity * element.price;
    createCartCardToConfirm(element);
  });
  cardField.innerHTML += `
    <div class="total-cart text-uppercase">
      <p>
      <strong>total de compra: $ ${total}</strong>
      </p>
    </div>
    <button class="btn btn-success" onClick="confirmCartOrder()">Confirmar compra</button>
  `;
};
/**
 * modifica en una unidad (mas o menos, dependiendo sel segundo parametro) la cantidad del producto con id proporcionada
 * @param {*int} idToModiifyQuantity id de producto a modificar
 * @param {*str} plusOrMinus "plus" or "minus"
 */
const modifyQuantityProduct = (idToModiifyQuantity, plusOrMinus) => {
  let infoStorage = extractInfoFromLocalStorage("cart");
  infoStorage.forEach((element) => {
    if (element.id == idToModiifyQuantity) {
      plusOrMinus == "plus" ? (element.quantity += 1) : (element.quantity -= 1);
      if (element.quantity < 0) {
        element.quantity = 0;
      }
    }
  });
  let answerJSON = JSON.stringify(infoStorage);
  localStorage.setItem("cart", answerJSON);
  confirmCartView();
};
/**
 * Muestra formulario para completar orden de compra y con el boton se extraen la info del contacto
 */
const showFormCompleteOrderCart = () => {
  cardField.innerHTML += `
  <form class="form-group">
    <input type="text" id="username" class="form-control mt-2" placeholder="Nombre" required>
    <input type="text" id="addres" class="form-control mt-2" placeholder="direccion" required>
    <input type="email" id="email" class="form-control mt-2" placeholder="e-mail" required>
  </form>
  <button class="btn btn-success" onClick="getInfoToConfirm()">Completar compra</button> 
  `;
};
/**
 * Comprueba que las cantidades sean mayores que cero
 */
const confirmCartOrder = () => {
  const infoStorage = extractInfoFromLocalStorage("cart");
  const someQuantityInvalid = infoStorage.some((item) => item.quantity == 0);
  if (infoStorage.length == 0) {
    alert("carrito vacio");
  } else {
    if (someQuantityInvalid == true) {
      alert("algun producto tiene cantidad de 0");
    } else {
      cardField.innerHTML = `<h1 class="section-title">Confirmar orden de compra</h1><br>`;
      showFormCompleteOrderCart();
    }
  }
};
/**
 * crea un objeto con la informacion del contacto y con la compra realizada
 */
const getInfoToConfirm = () => {
  const username = document.getElementById("username");
  const addres = document.getElementById("addres");
  const email = document.getElementById("email");
  const infoStorage = extractInfoFromLocalStorage("cart");
  let orderComplete = {
    username: username.value,
    addres: addres.value,
    email: email.value,
    purchase: infoStorage,
  };
  let answerJSON = JSON.stringify([]);
  localStorage.setItem("cart", answerJSON);
  httpPOST(API_PATHS.purchaseOrders, orderComplete);
  showProducts();
};

const httpPOST = async (path, newData) => {
  try {
    let response = await fetch(API_URL + path, {
      body: JSON.stringify(newData),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    handleError;
  }
};

const showToAddProducts = () => {
  cardField.innerHTML += `
  <form class="form-group">
    <input type="text" id="productName" class="form-control mt-2" placeholder="Nombre del producto" required>
    <input type="text" id="productType" class="form-control mt-2" placeholder="Tipo del producto" required>
    <input type="url" id="productImg" class="form-control mt-2" placeholder="Imagen del producto" required>
    <input type="number" id="productPrice" class="form-control mt-2" placeholder="Precio del producto" required>
  </form>
  <button class="btn btn-success" onClick="addProduct()">Completar compra</button> 
  `;
};

const addProduct = () => {
  const productName = document.getElementById("productName");
  const productType = document.getElementById("productType");
  const productImg = document.getElementById("productImg");
  const productPrice = document.getElementById("productPrice");
  let newProduct = {
    type: productType.value,
    name: productName.value,
    img: productImg.value,
    price: productPrice.value,
    quantity: 0,
  };
  httpPOST(API_PATHS.products, newProduct);
};

const showPurchase = (data) => {
  cardField.innerHTML += `
  <div class="purchaseCard">
    <h2>Orden de compra: ${data.id}</h2>
    <div class="cardCartConfirm">
      <p>Usuario: ${data.username}</p>
      <p>Direccion: ${data.addres}</p>
      <p>Correo: ${data.email}</p>
    </div>
  `;
  const items = data.purchase;
  let total = 0;
  items.forEach((product) => {
    total += product.price * product.quantity;
    cardField.innerHTML += `
      <div class="cardCartConfirm">
        <img src="${product.img}" class="card-img-confirm" alt="${
      product.name
    }" />
        <div>
          <p class="productType">${product.type}</p>
          <p class="productName"><strong>${product.name}</strong></p>
        </div>
        <h3 class="productPrice">$ ${product.price}</h3>
        <P>${product.quantity}</P>

        <div>
          <p>
          total
          ${product.quantity * product.price}
          </p>
        </div>
      </div>
    `;
  });
  cardField.innerHTML += `
  <div class="total-cart text-uppercase">
    <p>
    <strong>total de compra: $ ${total}</strong>
    </p>
  </div>
  `;
};

const adminView = async () => {
  cardField.innerHTML = `<h1 class="section-title">Agregar un nuevo producto</h1><br>`;
  showToAddProducts();
  cardField.innerHTML += `<h1 class="section-title">Ordenes de compra</h1><br>`;
  const purchaseStored = await infoGET(API_PATHS.purchaseOrders);
  purchaseStored.forEach((element) => {
    showPurchase(element);
  });
};

/*

*/
