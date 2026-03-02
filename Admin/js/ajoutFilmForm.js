(() => {
  const form = document.getElementById('filmForm');
  const status = document.getElementById('status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    if (!data.title || !data.genre || !data.duration || !data.rating) {
      status.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
      status.style.color = '#ffb3b3';
      return;
    }

    const films = JSON.parse(localStorage.getItem('cinemaFilms') || '[]');
    films.push({ id: Date.now(), showtimes: [], ...data });
    localStorage.setItem('cinemaFilms', JSON.stringify(films));

    form.reset();
    status.textContent = 'Film ajouté avec succès !';
    status.style.color = '#a0a0a0';
  });
})();
