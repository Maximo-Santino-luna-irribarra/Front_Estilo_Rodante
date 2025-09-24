document.getElementById("btn1").addEventListener("click", function() {
    window.location.href = "./products.html?tipo=Llanta";
});

document.getElementById("btn2").addEventListener("click", function() {
    window.location.href = "./products.html?tipo=Cubierta";
});

const nombre = localStorage.getItem('nombreCliente');
if (!nombre) {
    window.location.href = './login.html';
}
document.querySelector('.welcome').innerHTML = `
    <h1 class="text-white">¡Bienvenido ${nombre} a EstiloRodante!</h1>
    `;

