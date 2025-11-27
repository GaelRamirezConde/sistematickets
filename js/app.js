class Message {
    constructor(nombre, email, texto, prioridad) {
        this.nombre = nombre;
        this.email = email;
        this.texto = texto;
        this.prioridad = prioridad;
        this.fecha = new Date().toLocaleString();
        this.leido = false;
    }

    toHTML(index) {
        let clasePrioridad = "";

        // SWITCH utilizado (validación requerida por la práctica)
        switch(this.prioridad){
            case "alta": clasePrioridad = "prioridad-alta"; break;
            case "normal": clasePrioridad = "prioridad-normal"; break;
            case "baja": clasePrioridad = "prioridad-baja"; break;
        }

        return `
        <div class="card p-3 mb-2 ticket-card ${clasePrioridad} ${this.leido ? 'leido' : ''}">
            <strong>${this.nombre}</strong> — ${this.email} <br>
            <small>${this.fecha}</small>
            <p>${this.texto}</p>
            
            <button onclick="toggleRead(${index})" class="btn btn-outline-info btn-sm">Leído</button>
            <button onclick="deleteTicket(${index})" class="btn btn-outline-danger btn-sm">Eliminar</button>
        </div>`;
    }
}

let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
renderTickets();

// FORMULARIO
document.getElementById("ticketForm").addEventListener("submit", e => {
    e.preventDefault();

    const nombre = name.value.trim();
    const email = email.value.trim();
    const texto = message.value.trim();
    const prioridad = priority.value;

    // VALIDACIONES
    if(nombre.length < 3) return showError("Nombre mínimo 3 caracteres.");
    if(!email.includes("@")) return showError("Email no válido.");
    if(texto.length < 10) return showError("Mensaje mínimo 10 caracteres.");

    const nuevo = new Message(nombre, email, texto, prioridad);
    tickets.unshift(nuevo);

    saveData();
    renderTickets();
    e.target.reset();
});

// RENDERIZAR TICKETS
function renderTickets(filtro = "todos"){
    ticketList.innerHTML = "";

    tickets.forEach((t, i) => {
        if(filtro !== "todos" && t.prioridad !== filtro) return;
        ticketList.innerHTML += t.toHTML(i);
    });

    updateUrgentCounter();
}

// CONTADOR DE ALTA PRIORIDAD
function updateUrgentCounter(){
    const urgentes = tickets.filter(t => t.prioridad === "alta").length;
    countUrgent.textContent = urgentes;
}

// FUNCIONALIDADES
function deleteTicket(i){
    tickets.splice(i,1);
    saveData();
    renderTickets();
}

function toggleRead(i){
    tickets[i].leido = !tickets[i].leido;
    saveData();
    renderTickets();
}

function filterTickets(pr){
    renderTickets(pr);
}

// UTIL
function showError(msg){
    errorMsg.textContent = msg;
    setTimeout(()=> errorMsg.textContent="", 3000);
}

function saveData(){
    localStorage.setItem("tickets", JSON.stringify(tickets));
}
