let events = [];
let arr = [];

const eventName = document.querySelector("#eventName");
const eventDate = document.querySelector("#eventDate");
const btnAdd = document.querySelector("#btnAdd");
const eventsContainer = document.querySelector("#eventsContainer");

const json = load();
try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}
events = arr ? [...arr] : []; // op. ternario

renderEvents();

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    addEvent();
});

btnAdd.addEventListener("click", e => {
    e.preventDefault();
    addEvent();
});

function addEvent() {
    if (eventName.value == "") {
        showError(eventName);
        return;
    }
    eventName.style.borderStyle = "";
    eventName.style.borderColor = "";

    if (eventDate.value == "") {
        showError(eventDate);
        return;
    }
    eventDate.style.borderStyle = "";
    eventDate.style.borderColor = "";

    if (dateDiff(eventDate.value) < 0) {
        showError(eventDate);
        return;
    }
    eventDate.style.borderStyle = "";
    eventDate.style.borderColor = "";

    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3),
        name: eventName.value,
        date: eventDate.value,
    };

    //agregar un elemento al inicio del arreglo:
    events.unshift(newEvent);

    save(JSON.stringify(events));

    eventName.value = "";
    eventDate.value = "";
    renderEvents();
}

function showError(event) {
    event.style.borderStyle = "solid";
    event.style.borderColor = "red";
}

// Días que faltan de la actual al destino:
function dateDiff(d) {
    const target = new Date(d);
    const today = new Date();
    const difference = target.getTime() - today.getTime();

    const days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
}

// Itera todos los elementos del objeto events:
function renderEvents() {
    const eventsHTML = events.map(evt => {
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(evt.date)}</span>
                    <span class="days_text">días</span>
                </div>

                <div class="event-name">${evt.name}</div>
                <div class="event-date">${evt.date}</div>
                <div class="actions">
                    <button class="btnDelete" data-id="${evt.id}">Eliminar</button>
                </div>
            </div>
        `;
    });
    eventsContainer.innerHTML = eventsHTML.join(""); // une todo con un string vacío
    document.querySelectorAll(".btnDelete").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = btn.getAttribute("data-id");
            events = events.filter(evt => evt.id != id);

            save(JSON.stringify(events));

            renderEvents();
        });
    });
}

function save(data) {
    localStorage.setItem("items", data);
}

function load() {
    return localStorage.getItem("items");
}