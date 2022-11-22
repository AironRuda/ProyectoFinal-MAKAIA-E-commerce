const API_URL = "http://localhost:3000/products";
const cardField = document.querySelector("#cardField");

const handleError = (error) => {
  console.log(error);
};

const getInfo = async (browser) => {
  browser == undefined
    ? (response = await fetch(API_URL))
    : (response = await fetch(API_URL + `?q=${browser}`));
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    handleError(err);
  }
};

const createBasicCard = (data) => {
  cardField.innerHTML += `
    <div class="card" id="${data.id}" style="width: 18rem">
        <img src="${data.img}" class="card-img-top" alt="..." />
        <div class="card-body">
            <p class="card-text">${data.type}</p>
            <h5 class="card-title">${data.name}</h5>
        </div>
        <div class="money_bag">
              <h3>$ ${data.price}</h3>
              <button class="btn btn-success text-uppercase btn-sm details">
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
              <button class="btn btn-success text-uppercase btn-sm details">
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

const showProducts = async (products) => {
  cardField.innerHTML = "";
  const data = await getInfo(products);
  data.forEach((element) => {
    createBasicCard(element);
  });
};
showProducts();

const browser = document.querySelector("#browser");
browser.addEventListener("submit", (e) => {
  e.preventDefault();
  showProducts(e.target.search.value);
});

/*
let API_URL = "http://localhost:3000/";
const cardField = document.querySelector("#carField");

const handleError = (error) => {
  console.log("ha llegado un error");
  console.log(error);
};

const getInfo = async (browser) => {
  browser != undefined
    ? (API_URL += "products?q=" + browser)
    : (API_URL += "products");
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    handleError(error);
  }
};
const createCard = (info) => {
  const data = getInfo(info);
  cardField.innerHTML += `
      <div class="card" id="${data.id}" style="width: 18rem">
            <img src="${data.img}" class="card-img-top" alt="..." />
            <div class="card-body">
              <p class="card-text">${data.type}</p>
              <h5 class="card-title">${data.name}</h5>
            </div>
            <div class="money_bag">
              <h3>$ ${data.price}</h3>
              <button class="btn btn-success text-uppercase btn-sm details">
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
              <button class="btn btn-success text-uppercase btn-sm details">
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
          </div>`;
};
createCard();
*/
