import { PRODUCTOS, API_BASE } from "../constantes/rutas.js";

let carrito = cargarCarrito();

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get("idProducto");

  if (!idProducto) {
    document.getElementById("detalle-container").innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger fs-5">No se especificó un producto válido.</p>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`${PRODUCTOS}/${idProducto}`);
    if (!res.ok) throw new Error("Error al obtener el producto");
    const producto = await res.json();

    renderDetalle(producto);
  } catch (error) {
    console.error(error);
    document.getElementById("detalle-container").innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger fs-5">Error al cargar el producto.</p>
      </div>
    `;
  }
});

function cargarCarrito() { return JSON.parse(localStorage.getItem("carrito")) || []; }

function renderDetalle(producto) {
  const { nombre, marca, categoria, modelo, medida, activo, urlIMG, precio, stock } = producto;

  const html = `
    <div class="col-md-6 text-center">
      <img src="${API_BASE}${urlIMG || '/images/primer-plano-de-pato-de-goma.jpg'}"
          alt="${nombre}"
          class="img-fluid rounded shadow"
          style="max-height: 400px; object-fit: cover;" />
    </div>

    <div class="col-md-6 d-flex flex-column justify-content-center">
      <h2 class="fw-bold mb-3">${nombre}</h2>
      <p class="mb-1"><strong>Marca:</strong> ${marca}</p>
      <p class="mb-1"><strong>Categoría:</strong> ${categoria}</p>
      <p class="mb-1"><strong>Modelo:</strong> ${modelo}</p>
      <p class="mb-1"><strong>Medida:</strong> ${medida || "N/A"}</p>
      <p class="mb-1"><strong>Stock:</strong> ${stock} unidades</p>
      <p class="fs-4 text-primary fw-bold mt-3">$${precio}</p>
      <p class="mb-3"><span class="badge ${activo ? "bg-success" : "bg-danger"}">
        ${activo ? "Disponible" : "No disponible"}
      </span></p>
      <button id="btnAgregarDetalle" class="btn btn-success btn-lg w-100">Agregar al carrito 🛒</button>
    </div>
  `;

  document.getElementById("detalle-container").innerHTML = html;

  // Asignamos el click al botón
  const btn = document.getElementById("btnAgregarDetalle");
  if (btn) {
    btn.addEventListener("click", () => {
      agregarAlCarrito(producto); // usa la misma función de tu lista principal
    });
  }
}

function mostrarAlerta(msg) {
  const alerta = document.getElementById("alerta-carrito");
  const contenido = document.getElementById("alerta-contenido");
  contenido.textContent = `Producto ${msg}`;
  alerta.style.display = "block";
  setTimeout(() => alerta.style.display = "none", 3000);
}

// Función de agregar al carrito compartida
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
    mostrarAlerta(`${producto.nombre} - Cantidad actual: ${existente.cantidad}`);
  } else {
    const productoConCantidad = { ...producto, cantidad: 1 };
    carrito.push(productoConCantidad);
    mostrarAlerta(`${producto.nombre} añadido al carrito`);
  }

  guardarCarrito();
}

function guardarCarrito() { localStorage.setItem("carrito", JSON.stringify(carrito)); }
