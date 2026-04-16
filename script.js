let items = JSON.parse(localStorage.getItem('shoppingData')) || [];
let itemToDelete = null;

const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

document.getElementById('dateDisplay').innerText = new Date().toLocaleDateString('it-IT', { day:'numeric', month:'short', year:'numeric'});

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
    const filterCategory = document.getElementById('filterCat').value;
    const filterText = document.getElementById('searchText').value.toLowerCase();
    
    container.innerHTML = '';

    const sortedItems = [...items].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed - b.completed;
        return b.id - a.id;
    });

    sortedItems.forEach(item => {
        const matchesCategory = (filterCategory === 'all' || item.category === filterCategory);
        const matchesText = item.name.toLowerCase().includes(filterText) || 
                            (item.desc && item.desc.toLowerCase().includes(filterText));

        if (matchesCategory && matchesText) {
            const priceTot = (item.price * item.qty).toFixed(2);
            const card = document.createElement('div');
            card.className = `item-card p-3 d-flex align-items-center justify-content-between category-${item.category.replace(/\s+/g, '-')} ${item.completed ? 'completed' : ''}`;
            
            card.innerHTML = `
                <div class="d-flex align-items-center flex-grow-1">
                    <div class="me-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggle(${item.id})" style="width: 24px; height: 24px; cursor: pointer;">
                        </div>
                    </div>
                    <div>
                        <span class="category-pill mb-1 d-inline-block">${item.category}</span>
                        <h5 class="mb-0 fw-bold">${item.name}</h5>
                        <p class="mb-0 text-muted small">${item.desc || ''}</p>
                    </div>
                </div>
                <div class="text-end d-flex align-items-center">
                    <div class="me-3">
                        <div class="fw-800 text-dark">€ ${priceTot}</div>
                        <div class="text-muted small">${item.qty} pz</div>
                    </div>
                    <div class="btn-group shadow-sm rounded-3 overflow-hidden">
                        <button class="btn btn-light btn-sm px-3 border-end" onclick="openEdit(${item.id})">✏️</button>
                        <button class="btn btn-light btn-sm px-3 text-danger" onclick="askDelete(${item.id})">🗑️</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    });

    if (items.length === 0) {
        container.innerHTML = `<div class="text-center p-5 text-muted">La lista è vuota.</div>`;
    }
}

document.getElementById('addForm').onsubmit = (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        name: document.getElementById('addName').value.trim(),
        desc: document.getElementById('addDesc').value.trim(),
        price: parseFloat(document.getElementById('addPrice').value) || 0,
        qty: parseInt(document.getElementById('addQty').value) || 1,
        category: document.getElementById('addCategory').value,
        completed: false
    };
    items.unshift(newItem); 
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
        name: document.getElementById('editName').value.trim(),
        desc: document.getElementById('editDesc').value.trim(),
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
document.getElementById('searchText').oninput = render;
document.getElementById('clearAll').onclick = () => {
    if(confirm("Vuoi cancellare tutto?")) { items = []; sync(); }
};

sync();