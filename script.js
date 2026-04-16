let items = JSON.parse(localStorage.getItem('shoppingData')) || [];
let itemToDelete = null;

const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

const sync = () => {
    localStorage.setItem('shoppingData', JSON.stringify(items));
    render();
    updateStats();
};

function updateStats() {
    const totalCount = items.length;
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('countItems').innerText = totalCount;
    document.getElementById('totalCost').innerText = `€ ${totalPrice.toFixed(2)}`;
}

function render() {
    const container = document.getElementById('shoppingContainer');
    const filter = document.getElementById('filterCat').value;
    container.innerHTML = '';

    items.forEach(item => {
        if (filter !== 'all' && item.category !== filter) return;

        const priceTot = item.price * item.qty;
        const card = document.createElement('div');
        card.className = `card mb-3 item-card category-${item.category.replace(/\s+/g, '-')} shadow-sm ${item.completed ? 'completed' : ''}`;
        
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <h5 class="mb-0 fw-bold">${item.name} <small class="text-muted" style="font-size: 0.6em;">${item.category}</small></h5>
                    <p class="mb-1 text-muted small">${item.desc || ''}</p>
                    <div>
                        <span class="badge bg-light text-dark border">x${item.qty}</span>
                        <span class="text-primary fw-bold ms-2">€ ${priceTot.toFixed(2)}</span>
                    </div>
                </div>
                <div class="d-flex gap-2 ms-3">
                    <button class="btn btn-sm ${item.completed ? 'btn-success' : 'btn-outline-success'}" onclick="toggle(${item.id})">✅</button>
                    <button class="btn btn-sm btn-outline-warning" onclick="openEdit(${item.id})">✏️</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="askDelete(${item.id})">🗑️</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Eventi Form e Filtri
document.getElementById('addForm').onsubmit = (e) => {
    e.preventDefault();
    items.push({
        id: Date.now(),
        name: document.getElementById('addName').value,
        desc: document.getElementById('addDesc').value,
        price: parseFloat(document.getElementById('addPrice').value) || 0,
        qty: parseInt(document.getElementById('addQty').value) || 1,
        category: document.getElementById('addCategory').value,
        completed: false
    });
    sync();
    e.target.reset();
};

window.openEdit = (id) => {
    const item = items.find(i => i.id === id);
    document.getElementById('editId').value = item.id;
    document.getElementById('editName').value = item.name;
    document.getElementById('editDesc').value = item.desc;
    document.getElementById('editPrice').value = item.price;
    document.getElementById('editQty').value = item.qty;
    document.getElementById('editCategory').value = item.category;
    editModal.show();
};

document.getElementById('editForm').onsubmit = (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    items = items.map(item => item.id === id ? {
        ...item,
        name: document.getElementById('editName').value,
        desc: document.getElementById('editDesc').value,
        price: parseFloat(document.getElementById('editPrice').value),
        qty: parseInt(document.getElementById('editQty').value),
        category: document.getElementById('editCategory').value
    } : item);
    editModal.hide();
    sync();
};

window.askDelete = (id) => { itemToDelete = id; deleteModal.show(); };
document.getElementById('confirmDeleteBtn').onclick = () => {
    items = items.filter(i => i.id !== itemToDelete);
    deleteModal.hide();
    sync();
};

window.toggle = (id) => {
    items = items.map(i => i.id === id ? { ...i, completed: !i.completed } : i);
    sync();
};

document.getElementById('filterCat').onchange = render;
document.getElementById('clearAll').onclick = () => { if(confirm("Vuoi svuotare tutto?")) { items = []; sync(); } };

sync();