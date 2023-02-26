//Cargar catalogo de aspersores por DOM, pudiendo filtrarlos por radio de accion
let catalogo = document.getElementById("MostrarTodo")
let tituloMostrarTodo = document.getElementById("tituloMostrarTodo")
tituloMostrarTodo.style.display = "none";
let botonShowAll = document.getElementById("verTodo")
let botonShow750 = document.getElementById("ver750")
let botonShow1500 = document.getElementById("ver1500")
let botonShow1500Plus = document.getElementById("ver1500plus")


function showArray(arr){
  tituloMostrarTodo.style.display = "initial";
  for(let aspersor of arr){
    //Creo un div padre de la card
    let nuevoAspersor = document.createElement("div")
    nuevoAspersor.className = "col-md-6 col-lg-4"
    nuevoAspersor.innerHTML = `
    <div class="card card-asp" style="width: 18rem;">
      <img src="./assets/aspersores/${aspersor.img}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${aspersor.nombre}</h5>
        <p><strong>Radio:</strong> ${aspersor.radio} m </p>
        <p><strong>Caudal:</strong> ${aspersor.caudalM3Hora} m3 / hora </p>
        <p><strong>Precio:</strong> U$S ${aspersor.precio} / unidad </p>
  
        <a href="#seccionDeCalculos" class="btn btn-asp" onclick="selectById(${aspersor.id})">Dimensionar con este modelo</a>
      </div>
    </div>
  `
  catalogo.appendChild(nuevoAspersor)
  }
}

//VER CATALOGO COMPLETO DE ASPERSORES
function showAll(){
  catalogo.innerHTML = ``
  showArray(catalogoAspersores)
}
botonShowAll.addEventListener('click', showAll)

//VER ASPERSORES PARA JARDINES HASTA 750 M2
let hasta750 = []

function filtrarArray750(){
  catalogo.innerHTML = ``
  hasta750 = catalogoAspersores.filter((small)=> small.radio < 10)
  showArray(hasta750)
}
botonShow750.addEventListener('click', filtrarArray750)

//VER ASPERSORES PARA JARDINES HASTA 1500 M2
let hasta1500 = []

function filtrarArray1500(){
  catalogo.innerHTML = ``
  hasta1500 = catalogoAspersores.filter((medium)=> medium.radio >= 10 && medium.radio < 20)
  showArray(hasta1500)
}
botonShow1500.addEventListener('click', filtrarArray1500)

//VER ASPERSORES PARA JARDINES DE MAS DE 1500 M2
let masde1500 = []
function filtrarArray1500Plus(){
  catalogo.innerHTML = ``
  masde1500 = catalogoAspersores.filter((large)=> large.radio >= 20)
  showArray(masde1500)
}
botonShow1500Plus.addEventListener('click', filtrarArray1500Plus)