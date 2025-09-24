import {VENTAS} from "./constantes/rutas.js";
const escribirTicket = async () => {
  const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
  const nombreCliente = localStorage.getItem('nombreCliente') || 'Cliente Anónimo';
  const ticketContainer = document.querySelector('.ticket');

  if (carritoActual.length === 0) {
    alert("El carrito está vacío. No se puede generar un ticket.");
    return;
  }

  const productos = carritoActual.map(item => {
    const cantidad = item.cantidad && item.cantidad > 0 ? item.cantidad : 1;

    const ticket = document.createElement('div');
    ticket.className = "ticket-item shadow-sm";
    ticket.innerHTML = `
      <h5>${item.nombre} - ${item.marca}</h5>
      <p>Precio: <span class="price">$${item.precio}</span></p>
      <p>Cantidad: ${cantidad}</p>
      <hr class="border-light"/>
    `;
    ticketContainer.appendChild(ticket);

    return {
      producto_id: item.id,
      tipo_producto: item.categoria,
      cantidad,
      precio_unitario: item.precio,
      subtotal: cantidad * item.precio
    };
  });

  try {
    await registrarVenta(nombreCliente, productos);
  } catch (error) {
    console.error("Error al enviar la venta:", error.message);
    alert("No se pudo registrar la venta");
  }

  const fecha = document.createElement('p');
  fecha.innerHTML = `<strong>Fecha:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  ticketContainer.appendChild(fecha);

  localStorage.removeItem('carrito');
  localStorage.removeItem('nombreCliente');

};

document.querySelector('.terminarCompra').addEventListener('click', () => {
  window.location.href = "./survey.html";
});

async function registrarVenta(nombre_cliente, productos) {
  try {
    const response = await fetch(VENTAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente,
        productos
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar la venta');
    }

    const ventaCreada = await response.json();
    return ventaCreada;

  } catch (error) {
    console.error('Error en registrarVenta:', error);
    alert('No se pudo registrar la venta');
  }
}

escribirTicket();
