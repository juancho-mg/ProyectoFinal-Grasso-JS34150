//Catalogo de aspersores
//Segun el aspersor elegido se dimensionará el sistema

//Catalogo de Aspersores
let catalogoAspersores = []
//Constructor de aspersores
class Aspersor {
  constructor(id, categoria, nombre, precio, radio, caudalM3Hora, diametroBoquilla, img) {
    this.id = id;
    this.categoria = categoria;
    this.nombre = nombre;
    this.precio = precio;
    this.radio = radio;
    this.caudalM3Hora = caudalM3Hora;
    this.diametroBoquilla = diametroBoquilla;
    this.img = img;
  }
}

const cargarAspersores = async () => {
  const response = await fetch('./JSON/aspersores.json')
  const data = await response.json()
  for(let aspersor of data){
      let aspersorNuevo = new Aspersor(
        aspersor.id,
        aspersor.categoria,
        aspersor.nombre,
        aspersor.precio,
        aspersor.radio,
        aspersor.caudalM3Hora,
        aspersor.diametroBoquilla,
        aspersor.img,
      )
      catalogoAspersores.push(aspersorNuevo)
  }
  console.log(catalogoAspersores)
  localStorage.setItem('aspersores', JSON.stringify(catalogoAspersores))
}

if (localStorage.getItem('aspersores')) { for(let aspersor of JSON.parse(localStorage.getItem('aspersores'))){
  let getAspersor = new Aspersor(
    aspersor.id,
    aspersor.categoria,
    aspersor.nombre,
    aspersor.precio,
    aspersor.radio,
    aspersor.caudalM3Hora,
    aspersor.diametroBoquilla,
    aspersor.img,
    )
    catalogoAspersores.push(getAspersor)
  }
  console.log(catalogoAspersores)

}else{
cargarAspersores()
}

//Catalogo de Controllers
let catalogoControllers = []

class Controller {
  constructor(id, categoria, nombre, precio, maxEstaciones) {
    this.id = id;
    this.categoria = categoria;
    this.nombre = nombre;
    this.precio = precio;
    this.maxEstaciones = maxEstaciones;
  }
}

const cargarControllers = async () => {
  const response = await fetch('./JSON/controllers.json')
  const data = await response.json()
  for(let controller of data){
      let controllerNuevo = new Controller(
        controller.id,
        controller.categoria,
        controller.nombre,
        controller.precio,
        controller.maxEstaciones,
        )
      catalogoControllers.push(controllerNuevo)
  }
  console.log(catalogoControllers)
  localStorage.setItem('controllers', JSON.stringify(catalogoControllers))
}

if (localStorage.getItem('controllers')) { for(let controller of JSON.parse(localStorage.getItem('controllers'))){
  let getController = new Controller(
    controller.id,
    controller.categoria,
    controller.nombre,
    controller.precio,
    controller.maxEstaciones,
    )
  catalogoControllers.push(getController)
}
console.log(catalogoControllers)
}else{
cargarControllers()
}

//Catalogo de Valvulas
let catalogoValvulas = []
//Constructor de Valvulas
class Valvula {
  constructor(id, categoria, nombre, material, precio, caudalM3Hora) {
    this.id = id;
    this.categoria = categoria;
    this.nombre = nombre;
    this.material = material;
    this.precio = precio;
    this.caudalM3Hora = caudalM3Hora;
  }
}

const cargarValvulas = async () => {
  const response = await fetch('./JSON/valvulas.json')
  const data = await response.json()
  for(let valvula of data){
      let ValvulaNueva = new Valvula(
        valvula.id,
        valvula.categoria,
        valvula.nombre,
        valvula.material,
        valvula.precio,
        valvula.caudalM3Hora,
        )
      catalogoValvulas.push(ValvulaNueva)
  }
  console.log(catalogoValvulas)
  localStorage.setItem('valvulas', JSON.stringify(catalogoValvulas))
}

if (localStorage.getItem('valvulas')) { for(let valvula of JSON.parse(localStorage.getItem('valvulas'))){
  let getValvula = new Valvula(
    valvula.id,
    valvula.categoria,
    valvula.nombre,
    valvula.material,
    valvula.precio,
    valvula.caudalM3Hora,
    )
  catalogoValvulas.push(getValvula)
}
console.log(catalogoValvulas)
}else{
cargarValvulas()
}