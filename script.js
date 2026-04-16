let items = JSON.parse(localStorage.getItem('shoppingData')) || [];
const modalElement = new bootstrap.Modal(document.getElementById('editModal'));

// Salvataggio e Render
const sync = () => {
    localStorage.setItem('shoppingData', JSON.stringify(items));
    render();
};

function render() {
    const container = document.getElementById('shoppingContainer');
    const filter = document.getElementById('filterCat').value;
    container.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        if (filter !== 'all' && item.category !== filter) return;

        const priceTot = item.price * item.qty;
        if (!item.completed) total += priceTot;

        const card = document.createElement('div');
        card.className = `card mb-3 item-card category-${item.category.replace(' ', '-')} shadow-sm ${item.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <h5 class="mb-0 fw-bold text-dark">${item.name}</h5>
                    <p class="mb-1 text-muted small">${item.desc || 'Nessuna nota'}</p>
                    <div class="d-flex gap-2 align-items-center mt-2">
                        <span class="badge rounded-pill bg-light text-dark border">x${item.qty}</span>
                        <span class="fw-bold text-primary">€ ${priceTot.toFixed(2)}</span>
                    </div>
                </div>
                <div class="d-flex gap-1">
                    <button class="btn btn-action btn-sm ${item.completed ? 'btn-success' : 'btn-outline-success'}" onclick="toggle(${item.id})">✔️</button>
                    <button class="btn btn-action btn-sm btn-outline-warning" onclick="openEdit(${item.id})">✏️</button>
                    <button class="btn btn-action btn-sm btn-outline-danger" onclick="remove(${item.id})">🗑️</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById('totalDisplay').innerText = `€ ${total.toFixed(2)}`;
}

// AZIONI AGGIUNTA
document.getElementById('addForm').onsubmit = (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        name: document.getElementById('addName').value,
        desc: document.getElementById('addDesc').value,
        price: parseFloat(document.getElementById('addPrice').value) || 0,
        qty: parseInt(document.getElementById('addQty').value) || 1,
        category: document.getElementById('addCategory').value,
        completed: false
    };
    items.push(newItem);
    sync();
    e.target.reset();
};

// AZIONI MODIFICA (POP-UP)
window.openEdit = (id) => {
    const item = items.find(i => i.id === id);
    document.getElementById('editId').value = item.id;
    document.getElementById('editName').value = item.name;
    document.getElementById('editDesc').value = item.desc;
    document.getElementById('editPrice').value = item.price;
    document.getElementById('editQty').value = item.qty;
    document.getElementById('editCategory').value = item.category;
    modalElement.show();
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
    modalElement.hide();
    sync();
};

// UTILS
window.remove = (id) => { if(confirm("Rimuovere?")) { items = items.filter(i => i.id !== id); sync(); } };
window.toggle = (id) => { items = items.map(i => i.id === id ? { ...i, completed: !i.completed } : i); sync(); };
document.getElementById('filterCat').onchange = render;
document.getElementById('clearAll').onclick = () => { if(confirm("Svuotare?")) { items = []; sync(); } };

render();