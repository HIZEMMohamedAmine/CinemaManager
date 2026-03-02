(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addFilmBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        window.location.href = 'ajoutFilmForm.html';
      });
    }
  });
})();
