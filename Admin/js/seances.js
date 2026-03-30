// Elements du DOM
const tableBody = document.getElementById('seances-tbody');
const searchInput = document.getElementById('filter-search');
const btnAddSeance = document.getElementById('btn-add-seance');

// Modale
const modal = document.getElementById('seance-modal');
const form = document.getElementById('seance-form');
const btnCancel = document.getElementById('btn-cancel');

function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    if (form) form.reset();
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (form) form.reset();
}

function filterTable() {
    if (!tableBody || !searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = query === '' || text.includes(query) ? '' : 'none';
    });
}

if (btnAddSeance) {
    btnAddSeance.addEventListener('click', openModal);
}

if (btnCancel) {
    btnCancel.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', filterTable);
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
    });
}
