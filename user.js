const url = "http://localhost:3000/user/";
const ul = document.querySelector(".list-group");

const getUser = async () => {
  const respuesta = await fetch(url);
  const data = await respuesta.json();
  data.forEach((element) => {
    const { id, nombre, url } = element;
    ul.innerHTML += `
        <li class="list-group-items">
        <span class="lead">${nombre}</span>
        <img src=${url} width="50px">
        <button id=${id} class="btn btn-dark btn-sm float-end">Borrar</button>
        </li>`;
  });
};
document.addEventListener("DOMContentLoaded", getUser);
///peticion Delete - Eliminacion de datos
ul.addEventListener("click", async (e) => {
  const btnEliminar = e.target.classList.contains("btn-dark");
  if (btnEliminar === true) {
    const id = e.target.id;
    await fetch(endpoint + id, {
      method: "DELETE",
    });
  }
});
