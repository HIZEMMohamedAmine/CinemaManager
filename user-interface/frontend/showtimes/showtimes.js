// Showtimes Page JavaScript

class ShowtimesPage {
  constructor() {
    this.selectedDate = null;
    this.showtimesData = {}; // mapped by date
    this.movies = [];
    this.init();
  }

  async init() {
    await this.fetchShowtimes();
    this.setupDates();
    this.displayShowtimes();
  }

  async fetchShowtimes() {
      try {
          const response = await fetch('../../backend/movies/get-showtimes.php');
          const result = await response.json();
          if (result.success) {
              this.showtimesData = result.data;
          }
      } catch (error) {
          console.error("Error fetching showtimes", error);
      }
  }

  setupDates() {
    const dateButtonsContainer = document.getElementById('dateButtons');
    if(!dateButtonsContainer) return;
    
    // Get unique dates from database or use generic ones if none.
    let availableDates = Object.keys(this.showtimesData).sort();
    
    if (availableDates.length === 0) {
        // Fallback or empty state
        const tmr = new Date();
        availableDates = [tmr.toISOString().split('T')[0]]; 
    }

    availableDates.slice(0, 14).forEach((date, index) => {
      const dateObj = new Date(date);
      const button = document.createElement('button');
      button.className = `date-button ${index === 0 ? 'active' : ''}`;
      button.textContent = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      button.addEventListener('click', () => {
        this.selectDate(date, button);
      });
      dateButtonsContainer.appendChild(button);
    });

    this.selectedDate = availableDates[0];
  }

  selectDate(date, button) {
    // Remove active class from all buttons
    document.querySelectorAll('.date-button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to selected button
    button.classList.add('active');
    this.selectedDate = date;
    this.displayShowtimes();
  }

  displayShowtimes() {
    const container = document.getElementById('showTimesContainer');
    const noShowtimes = document.getElementById('noShowtimes');
    
    if(!container || !noShowtimes) return;
    
    container.innerHTML = '';

    const moviesMap = this.showtimesData[this.selectedDate];
    this.movies = moviesMap ? Object.values(moviesMap) : [];

    if (this.movies.length === 0) {
      container.style.display = 'none';
      noShowtimes.style.display = 'block';
      return;
    }

    container.style.display = 'block';
    noShowtimes.style.display = 'none';

    this.movies.forEach(movie => {
      const movieShowtime = this.createMovieShowtime(movie);
      container.appendChild(movieShowtime);
    });
  }

  createMovieShowtime(movie) {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-showtimes fade-in';

    // Create movie header with poster
    const headerDiv = document.createElement('div');
    headerDiv.className = 'movie-header';
    headerDiv.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster-small">
      <div class="movie-header-info">
        <h3>${movie.title}</h3>
        <div class="movie-header-meta">
          <span class="meta-badge">🎭 ${movie.genre}</span>
          <span class="meta-badge">⏱️ ${movie.duration}</span>
          ${movie.rating ? `<span class="meta-badge">⭐ ${movie.rating}/10</span>` : ''}
        </div>
      </div>
    `;

    // Create showtimes grid
    const timesDiv = document.createElement('div');
    timesDiv.className = 'showtimes-grid';

    movie.showtimes.forEach(seance => {
      const timeCard = document.createElement('div');
      const availableSeats = seance.availableSeats;
      const isBooked = availableSeats < 10 && availableSeats > 0;
      const isFull = availableSeats === 0;

      timeCard.className = `showtime-card ${isFull ? 'booked' : (isBooked ? 'almost-full' : '')}`;
      let statusText = 'Available';
      if (isFull) statusText = 'Sold Out';
      else if (isBooked) statusText = 'Almost Full';

      timeCard.innerHTML = `
        <div class="showtime-time">${seance.time}</div>
        <div class="showtime-capacity">${availableSeats} seats</div>
        <div class="showtime-available">${statusText}</div>
      `;

      if (!isFull) {
        timeCard.addEventListener('click', () => {
          this.selectShowtime(movie.id, seance);
        });
      }

      timesDiv.appendChild(timeCard);
    });

    movieDiv.appendChild(headerDiv);
    movieDiv.appendChild(timesDiv);

    return movieDiv;
  }

  selectShowtime(movieId, seance) {
    // Find the movie
    const movie = this.movies.find(m => m.id === movieId);

    // Store selected data
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    localStorage.setItem('selectedShowtime', JSON.stringify({
      date: this.selectedDate,
      time: seance.time,
      id: seance.id,
      price: seance.price
    }));

    // Redirect to booking page
    window.location.href = '../booking/booking.html';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShowtimesPage();
});
