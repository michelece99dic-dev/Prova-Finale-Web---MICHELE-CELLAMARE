// Stato dell'applicazione - Carica da LocalStorage o crea array vuoto
let shoppingItems = JSON.parse(localStorage.getItem('myShoppingList')) || [];

// Selettori Form
const shoppingForm = document.getElementById('shoppingForm');
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemQtyInput = document.getElementById('itemQty');
const itemCategoryInput = document.getElementById('itemCategory');

// Selettori UI
const shoppingListUI = document.getElementById('shoppingList');
const totalItemsUI = document.getElementById('totalItems');
const completedItemsUI = document.getElementById('completedItems');
const totalCostUI = document.getElementById('totalCost');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

// Funzione per salvare nel LocalStorage
function saveToStorage() {
    localStorage.setItem('myShoppingList', JSON.stringify(shoppingItems));
}

// Aggiunta prodotto
shoppingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newItem = {
        id: Date.now(),
        name: itemNameInput.value.trim(),
        price: parseFloat(itemPriceInput.value) || 0,
        qty: parseInt(itemQtyInput.value),
        category: itemCategoryInput.value,
        completed: false
    };

    shoppingItems.push(newItem);
    saveToStorage();
    renderApp();
    shoppingForm.reset();
    itemNameInput.focus();
});

// Renderizzazione Dashboard
function renderApp() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = filterCategory.value;

    const filteredList = shoppingItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    shoppingListUI.innerHTML = '';

    filteredList.forEach(item => {
        const rowTotal = (item.price * item.qty).toFixed(2);
        const categoryClass = item.category.replace(/\s+/g, '-'); // Gestione "Tempo libero"
        
        const div = document.createElement('div');
        div.className = `list-group-item d-flex justify-content-between align-items-center item-card category-${categoryClass} ${item.completed ? 'completed bg-light' : ''}`;
        
        div.innerHTML = `
            <div class="ms-2">
                <h6 class="mb-0">${item.name}</h6>
                <small class="text-muted">
                    <span class="badge bg-light text-dark border">${item.category}</span> 
                    ${item.qty} pz. x ${item.price.toFixed(2)}€ = <strong>${rowTotal}€</strong>
                </small>
            </div>
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-success" onclick="toggleComplete(${item.id})">
                    ${item.completed ? '↩️' : '✅'}
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${item.id})">
                    🗑️
                </button>
            </div>
        `;
        shoppingListUI.appendChild(div);
    });

    updateSummary();
}

// Funzioni Azione
function deleteItem(id) {
    shoppingItems = shoppingItems.filter(item => item.id !== id);
    saveToStorage();
    renderApp();
}

function toggleComplete(id) {
    shoppingItems = shoppingItems.map(item => {
        if (item.id === id) return { ...item, completed: !item.completed };
        return item;
    });
    saveToStorage();
    renderApp();
}

function updateSummary() {
    const total = shoppingItems.length;
    const completed = shoppingItems.filter(i => i.completed).length;
    const cost = shoppingItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    totalItemsUI.innerText = total;
    completedItemsUI.innerText = completed;
    totalCostUI.innerText = `€ ${cost.toFixed(2)}`;
}

// Eventi Filtri
searchInput.addEventListener('input', renderApp);
filterCategory.addEventListener('change', renderApp);

// Svuota tutto
document.getElementById('clearAll').addEventListener('click', () => {
    if(confirm("Vuoi cancellare definitivamente tutta la lista?")) {
        shoppingItems = [];
        saveToStorage();
        renderApp();
    }
});

// Avvio iniziale
renderApp();