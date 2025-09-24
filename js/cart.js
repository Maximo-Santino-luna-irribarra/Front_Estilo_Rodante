import { API_BASE } from "../constantes/rutas.js";

const box = document.querySelector(".box")
const listaProductos = []
let productosPrecios = 0
let productosContador = 0


const getProductos = () =>{
    return localStorage.getItem('carrito')
}

const setProductos = () =>{
    let lista = JSON.parse(getProductos())
    lista.forEach(element => {
    const cantidad = element.cantidad || 1
    productosPrecios += element.precio * cantidad
    productosContador += cantidad
    crearProducto(element, cantidad)
})};

const crearProducto = (element, cantidad = 1) =>{
    let product = document.createElement('div')
    product.className = 'col'
    product.innerHTML = `
            <div class="card product-box text-center p-3 shadow rounded-4">
            <div class="product-image-wrapper mx-auto mb-3">
                <img src="${API_BASE}/${element.urlIMG || 'images/primer-plano-de-pato-de-goma.jpg'}" class="product-image" alt="${element.nombre}">
            </div>
            <h5 class="fw-bold text-dark mb-1">Modelo: ${element.nombre}</h5>
            <p class="text-primary fw-semibold fs-5 mb-3">Precio: $${element.precio}</p>
            <p class="mb-3">Marca: ${element.marca}</p>
            <div class="d-flex justify-content-end gap-2 mt-auto">
                <div class="contador d-flex align-items-center gap-2">
                <button class="btn btn-outline-danger rounded-circle btn-restar fw-bold px-3">-</button>
                <span class="cantidad fs-5 fw-semibold">${cantidad}</span>
                <button class="btn btn-outline-success rounded-circle btn-sumar fw-bold px-3">+</button>
            </div>
            </div>
            </div>
            
            `
            box.appendChild(product)
            const btnSumar = product.querySelector('.btn-sumar')
            const btnRestar = product.querySelector('.btn-restar')
            const spanCantidad = product.querySelector('.cantidad')
            
            btnSumar.addEventListener('click', () => {
                if(cantidad < element.stock){
                    cantidad++
                    spanCantidad.textContent = cantidad
                    productosContador++
                    productosPrecios += element.precio
                    actualizarResumen()
                    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || []
                    const index = carritoActual.findIndex(item => item.nombre === element.nombre && item.marca === element.marca)
                    if (index !== -1) {
                        carritoActual[index].cantidad = cantidad
                        localStorage.setItem('carrito', JSON.stringify(carritoActual))
                    }
                }
                else{
                    alert('No hay suficiente stock para sumar más unidades de este producto.')
                }
            })

            btnRestar.addEventListener('click', () => {
            if (cantidad > 1) {
                cantidad--
                spanCantidad.textContent = cantidad
                productosContador--
                productosPrecios -= element.precio
            } else {
                product.remove()
                productosContador--
                productosPrecios -= element.precio

                const carritoActual = JSON.parse(localStorage.getItem('carrito')) || []
                const index = carritoActual.findIndex(item => item.nombre === element.nombre && item.marca === element.marca)

                if (cantidad > 1) {
                    carritoActual[index].cantidad = cantidad
                } else {
                    carritoActual.splice(index, 1)
                }
                localStorage.setItem('carrito', JSON.stringify(carritoActual))
            }

            actualizarResumen()
            verificarVacio()
        })
        }


const ticketBox = document.querySelector(".ticket")

const crearResumen = () =>{
    ticket = document.createElement('div')
    ticket.className = "aside-ticket shadow"
    ticket.innerHTML = `
          <h5>Resumen</h5>
          <p>Productos: $${productosPrecios}</p>
          <p>Impuestos: $${productosContador * 500}</p>
          <hr class="border-light"/>
          <p class="fw-bold">Total: $${productosPrecios + productosContador * 500}</p>
        `
        if(verificarVacio()){
            ticket.innerHTML += `<button class="btn btn-light w-100 mt-2" onClick="confirmarCompra()">Generar Ticket</button>`
        }else{
            ticket.innerHTML += `<button class="btn btn-light w-100 mt-2" disabled>Generar Ticket</button>`
        }
    ticketBox.appendChild(ticket)
    }

const actualizarResumen = () => {
    ticketBox.innerHTML = ''

    var ticket = document.createElement('div')
    ticket.className = "aside-ticket shadow"
    ticket.innerHTML = `
        <h5>Resumen</h5>
        <p>Productos: $${productosPrecios}</p>
        <p>Impuestos: $${productosContador * 500}</p>
        <hr class="border-light"/>
        <p class="fw-bold">Total: $${productosPrecios + productosContador * 500}</p>
        <button onClick="confirmarCompra()" class="btn btn-light w-100 mt-2 text-dark" ${productosContador > 0 ? '' : 'disabled'}>Finalizar compra</button>
    `
    ticketBox.appendChild(ticket)
}


const verificarVacio = () => {
    if (box.children.length === 0) {
        box.innerHTML = `
        <div class="alert text-center fw-semibold shadow-sm mx-auto mt-5" style="max-width: 500px; background-color: var(--second-color); color: var(--main-color); border-radius: 10px;" style="background-color: var(--second-color); color: var(--main-color); border-radius: 10px;">
            No hay productos en el carrito
        </div>
        `
        return false
    }
    return true
}

setProductos()
verificarVacio()
actualizarResumen() 


const modal = document.getElementById('modalConfirmacion');
const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');
const btnCancelarCompra = document.getElementById('btnCancelarCompra');

const confirmarCompra = () => {
  modal.style.display = 'flex';
}

btnConfirmarCompra.onclick = () => {
  modal.style.display = 'none';
  window.location.href = "./ticket.html";
}

btnCancelarCompra.onclick = () => {
  modal.style.display = 'none';
}
window.confirmarCompra = confirmarCompra;
