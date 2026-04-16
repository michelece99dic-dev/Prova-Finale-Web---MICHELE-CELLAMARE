// 1. Stato dell'applicazione
let shoppingItems = [];

// 2. Selettori degli elementi DOM
const shoppingForm = document.getElementById('shoppingForm');
const itemNameInput = document.getElementById('itemName');
const itemQtyInput = document.getElementById('itemQty');
const itemCategoryInput = document.getElementById('itemCategory');
const shoppingListUI = document.getElementById('shoppingList');

// Selettori per Riepilogo e Filtri
const totalItemsUI = document.getElementById('totalItems');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

// 3. Funzione per aggiungere un prodotto
shoppingForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impedisce il ricaricamento della pagina

    const newItem = {
        id: Date.now(),
        name: itemNameInput.value.trim(),
        qty: parseInt(itemQtyInput.value),
        category: itemCategoryInput.value,
        completed: false
    };

    shoppingItems.push(newItem);
    renderApp();
    shoppingForm.reset(); // Pulisce i campi
});

// 4. Funzione per renderizzare la UI (La logica centrale)
function renderApp() {
    // Filtriamo i prodotti in base a ricerca e categoria
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = filterCategory.value;

    const filteredList = shoppingItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    // Svuotiamo la lista attuale
    shoppingListUI.innerHTML = '';

    // Creiamo gli elementi della lista
    filteredList.forEach(item => {
        const li = document.createElement('li');
        li.className = `item-card ${item.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span><strong>${item.name}</strong> (${item.qty}) - <em>${item.category}</em></span>
            <div class="actions">
                <button onclick="toggleComplete(${item.id})">✔️</button>
                <button onclick="deleteItem(${item.id})">🗑️</button>
            </div>
        `;
        shoppingListUI.appendChild(li);
    });

    updateSummary();
}

// 5. Funzioni di utilità (Elimina, Segna come fatto, Riepilogo)
function deleteItem(id) {
    shoppingItems = shoppingItems.filter(item => item.id !== id);
    renderApp();
}

function toggleComplete(id) {
    shoppingItems = shoppingItems.map(item => {
        if (item.id === id) return { ...item, completed: !item.completed };
        return item;
    });
    renderApp();
}

function updateSummary() {
    totalItemsUI.innerText = shoppingItems.length;
}

// 6. Eventi per Ricerca e Filtri
searchInput.addEventListener('input', renderApp);
filterCategory.addEventListener('change', renderApp);

// Bonus: Pulsante svuota tutto
document.getElementById('clearAll').addEventListener('click', () => {
    if(confirm("Sei sicuro di voler svuotare tutta la lista?")) {
        shoppingItems = [];
        renderApp();
    }
});