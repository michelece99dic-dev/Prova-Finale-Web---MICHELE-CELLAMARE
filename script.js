// Stato dell'applicazione
let items = JSON.parse(localStorage.getItem('shoppingData')) || [];
let itemToDelete = null;

// Inizializzazione Modali
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// Funzione Centrale di Sincronizzazione
const sync = () => {
    localStorage.setItem('shoppingData', JSON.stringify(items));
    render();
    updateStats();
};

// Calcolo Statistiche dinamiche
function updateStats() {
    const countItems = items.length;
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('countItems').innerText = countItems;
    document.getElementById('totalCost').innerText = `€ ${totalPrice.toFixed(2)}`;
}

// Rendering della lista con Filtri (Categoria + Descrizione)
function render() {
    const container = document.getElementById('shoppingContainer');
    const filterCategory = document.getElementById('filterCat').value;
    const filterText = document.getElementById('searchText').value.toLowerCase();
    
    container.innerHTML = '';

    items.forEach(item => {
        // Logica filtri combinati
        const matchesCategory = (filterCategory === 'all' || item.category === filterCategory);
        const matchesText = item.name.toLowerCase().includes(filterText) || 
                            (item.desc && item.desc.toLowerCase().includes(filterText));

        if (matchesCategory && matchesText) {
            const priceTot = item.price * item.qty;
            const card = document.createElement('div');
            card.className = `card mb-3 item-card category-${item.category.replace(/\s+/g, '-')} shadow-sm ${item.completed ? 'completed' : ''}`;
            
            card.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h5 class="mb-0 fw-bold">${item.name}</h5>
                            <span class="badge bg-light text-dark border small">${item.category}</span>
                        </div>
                        <p class="mb-1 text-muted small">${item.desc || '<i>Nessuna nota</i>'}</p>
                        <div class="mt-2">
                            <span class="text-dark small fw-bold">x${item.qty}</span>
                            <span class="text-primary fw-bold ms-3">€ ${priceTot.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="d-flex gap-2 ms-3">
                        <button class="btn btn-sm ${item.completed ? 'btn-success' : 'btn-outline-success'}" onclick="toggle(${item.id})" title="Segna come preso">✅</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="openEdit(${item.id})" title="Modifica">✏️</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="askDelete(${item.id})" title="Elimina">🗑️</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    });

    if (container.innerHTML === '') {
        container.innerHTML = '<div class="text-center p-5 text-muted">Nessun prodotto trovato.</div>';
    }
}

// --- GESTIONE EVENTI ---

// Aggiunta Prodotto
document.getElementById('addForm').onsubmit = (e) => {
    e.preventDefault();
    items.push({
        id: Date.now(),
        name: document.getElementById('addName').value.trim(),
        desc: document.getElementById('addDesc').value.trim(),
        price: parseFloat(document.getElementById('addPrice').value) || 0,
        qty: parseInt(document.getElementById('addQty').value) || 1,
        category: document.getElementById('addCategory').value,
        completed: false
    });
    sync();
    e.target.reset();
};

// Modifica Prodotto (Apertura Modale)
window.openEdit = (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    document.getElementById('editId').value = item.id;
    document.getElementById('editName').value = item.name;
    document.getElementById('editDesc').value = item.desc;
    document.getElementById('editPrice').value = item.price;
    document.getElementById('editQty').value = item.qty;
    document.getElementById('editCategory').value = item.category;
    editModal.show();
};

// Salvataggio Modifiche
document.getElementById('editForm').onsubmit = (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    items = items.map(item => item.id === id ? {
        ...item,
        name: document.getElementById('editName').value.trim(),
        desc: document.getElementById('editDesc').value.trim(),
        price: parseFloat(document.getElementById('editPrice').value),
        qty: parseInt(document.getElementById('editQty').value),
        category: document.getElementById('editCategory').value
    } : item);
    editModal.hide();
    sync();
};

// Eliminazione
window.askDelete = (id) => {
    itemToDelete = id;
    deleteModal.show();
};

document.getElementById('confirmDeleteBtn').onclick = () => {
    items = items.filter(i => i.id !== itemToDelete);
    deleteModal.hide();
    sync();
};

// Toggle Completato
window.toggle = (id) => {
    items = items.map(i => i.id === id ? { ...i, completed: !i.completed } : i);
    sync();
};

// Filtri in tempo reale
document.getElementById('filterCat').onchange = render;
document.getElementById('searchText').oninput = render;

// Svuota tutto
document.getElementById('clearAll').onclick = () => {
    if (confirm("Vuoi davvero cancellare TUTTI i prodotti?")) {
        items = [];
        sync();
    }
};

// Avvio iniziale
sync();