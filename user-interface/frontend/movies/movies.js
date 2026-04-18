// Movies Page JavaScript

class MoviesPage {
  constructor() {
    this.allMovies = [];
    this.nowShowing = [];
    this.comingSoon = [];
    this.filteredMovies = [];
    this.filters = {
      genre: '',
      status: ''
    };
    this.init();
  }

  async init() {
    await this.fetchMovies();
    this.loadMovies();
    this.setupEventListeners();
    this.handleSearch();
    this.renderMovies();
  }

  async fetchMovies() {
      try {
          const response = await fetch('../../backend/movies/get-movies.php');
          const result = await response.json();
          if (result.success) {
              this.nowShowing = result.data.nowShowing;
              this.comingSoon = result.data.comingSoon;
          }
      } catch (error) {
          console.error("Error fetching movies:", error);
      }
  }

  loadMovies() {
    this.allMovies = [...this.nowShowing, ...this.comingSoon];
    this.filteredMovies = this.allMovies;
  }

  setupEventListeners() {
    const genreFilter = document.getElementById('genreFilter');
    if(genreFilter) genreFilter.addEventListener('change', (e) => {
      this.filters.genre = e.target.value;
      this.applyFilters();
    });

    const statusFilter = document.getElementById('statusFilter');
    if(statusFilter) statusFilter.addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.applyFilters();
    });

    const resetFilters = document.getElementById('resetFilters');
    if(resetFilters) resetFilters.addEventListener('click', () => {
      this.resetFilters();
    });

    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if(clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => {
      this.resetFilters();
    });
  }

  applyFilters() {
    this.filteredMovies = this.allMovies.filter(movie => {
      // Genre filter
      if (this.filters.genre && !movie.genre.includes(this.filters.genre)) {
        return false;
      }

      // Status filter
      if (this.filters.status) {
        const isNowShowing = this.nowShowing.some(m => m.id === movie.id);
        if (this.filters.status === 'now' && !isNowShowing) return false;
        if (this.filters.status === 'coming' && isNowShowing) return false;
      }

      return true;
    });

    this.renderMovies();
  }

  resetFilters() {
    this.filters = {
      genre: '',
      status: ''
    };

    const genreFilter = document.getElementById('genreFilter');
    if(genreFilter) genreFilter.value = '';
    
    const statusFilter = document.getElementById('statusFilter');
    if(statusFilter) statusFilter.value = '';

    this.filteredMovies = this.allMovies;
    this.renderMovies();
  }

  renderMovies() {
    const grid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');
    
    if (!grid || !noResults || !resultCount) return;

    if (this.filteredMovies.length === 0) {
      grid.style.display = 'none';
      noResults.style.display = 'block';
      resultCount.textContent = 'No movies found matching your criteria';
      return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    resultCount.textContent = `Showing ${this.filteredMovies.length} movie(s)`;

    grid.innerHTML = '';

    this.filteredMovies.forEach(movie => {
      const isComingSoon = this.comingSoon.some(m => m.id === movie.id);
      const card = this.createMovieCard(movie, isComingSoon);
      grid.appendChild(card);
    });
  }

  createMovieCard(movie, isComingSoon = false) {
    const card = document.createElement('div');
    card.className = 'movie-card fade-in';

    const buttonHTML = isComingSoon
      ? `<button class="btn btn-secondary btn-small" style="cursor: default;">Coming Soon</button>`
      : `<button class="btn btn-primary btn-small" onclick="window.location.href='../movie-details/movie-details.html?id=${movie.id}'">Book Now</button>`;

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="movie-genre">${movie.genre}</span>
          <span class="movie-duration">${movie.duration}</span>
        </div>
        <div class="movie-card-footer" style="margin-top: 15px;">
          ${buttonHTML}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (!isComingSoon) {
        window.location.href = `../movie-details/movie-details.html?id=${movie.id}`;
      }
    });

    return card;
  }

  handleSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
      this.filteredMovies = this.allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MoviesPage();
});
