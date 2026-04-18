// Booking Page JavaScript

// Booking Page JavaScript

class BookingPage {
  constructor() {
    this.movie = null;
    this.showtime = null;
    this.ticketCount = 1;
    this.ticketPrice = 12; // default
    this.hall = { name: "Standard Hall" }; // default
    this.init();
  }

  init() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      alert("You must be logged in to book a ticket.");
      window.location.href = '../login/login.html';
      return;
    }

    this.checkLoginState(userSession);
    this.loadBookingData();
    this.setupEventListeners();
    this.updateSummary();
  }

  checkLoginState(userSessionData) {
    try {
        const user = JSON.parse(userSessionData);
        if(user && user.username) {
            // Pre-fill name and lock it if possible
            const nameField = document.getElementById('fullName');
            if(nameField) {
                nameField.value = user.username;
            }
        }
    } catch(e) {}
  }

  loadBookingData() {
    const movieData = localStorage.getItem('selectedMovie');
    const showtimeData = localStorage.getItem('selectedShowtime');

    if (!movieData || !showtimeData) {
      window.location.href = '../index/index.html';
      return;
    }

    this.movie = JSON.parse(movieData);
    this.showtime = JSON.parse(showtimeData);

    if (this.showtime.price) {
        this.ticketPrice = parseFloat(this.showtime.price);
    }
    
    if (this.showtime.room) {
        this.hall.name = this.showtime.room;
    }

    // Update page content
    const titleEl = document.getElementById('movieTitle');
    if(titleEl) titleEl.textContent = this.movie.title;
    
    const summaryTitleEl = document.getElementById('summaryMovieTitle');
    if(summaryTitleEl) summaryTitleEl.textContent = this.movie.title;

    const dateObj = new Date(this.showtime.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const dateTimeStr = `${formattedDate} at ${this.showtime.time}`;
    
    const summaryDateEl = document.getElementById('summaryDateTime');
    if(summaryDateEl) summaryDateEl.textContent = dateTimeStr;

    const hallEl = document.getElementById('hallName');
    if(hallEl) hallEl.textContent = this.hall.name;
  }

  updateSummary() {
    const total = this.ticketCount * this.ticketPrice;

    // Update prices
    const seatPriceEl = document.getElementById('seatPrice');
    if(seatPriceEl) seatPriceEl.textContent = `$${this.ticketPrice.toFixed(2)}`;
    
    const numSeatsEl = document.getElementById('numSeats');
    if(numSeatsEl) numSeatsEl.textContent = this.ticketCount;
    
    const totalEl = document.getElementById('totalPrice');
    if(totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  setupEventListeners() {
    const input = document.getElementById('ticketCountInput');
    if (input) {
        input.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 10) val = 10;
            e.target.value = val;
            this.ticketCount = val;
            this.updateSummary();
        });
    }

    const submitBtn = document.getElementById('submitBookingBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.submitBooking();
        });
    }
  }

  async submitBooking() {
    const form = document.getElementById('bookingForm');
    if(form && !form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    const totalAmount = this.ticketCount * this.ticketPrice;

    const payload = {
        seance_id: this.showtime.id,
        customer_name: fullName,
        customer_email: email,
        tickets_count: this.ticketCount,
        total_amount: totalAmount
    };

    console.log('Booking payload:', payload);

    try {
        const response = await fetch('../../backend/movies/api-book.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log('API Response status:', response.status);
        const result = await response.json();
        
        console.log('API Response:', result);

        if (result.success) {
            // Create booking object for confirmation page
            const booking = {
              bookingId: result.booking_code,
              movie: this.movie,
              showtime: this.showtime,
              seats: [`${this.ticketCount} General Admission Ticket(s)`],
              customer: {
                fullName,
                email,
                phone
              },
              paymentMethod: 'Cash',
              bookingDate: new Date().toISOString(),
              totalPrice: totalAmount.toFixed(2)
            };

            // Store booking data
            localStorage.setItem('booking', JSON.stringify(booking));

            // Redirect to confirmation
            window.location.href = '../confirmation/confirmation.html';
        } else {
            const errorMsg = result.message || 'Unknown error - check browser console for details';
            alert('Failed to book: ' + errorMsg);
            console.error('Booking error details:', result);
        }
    } catch (e) {
        console.error('Error submitting booking', e);
        alert('Server error while submitting your booking. Check browser console (F12) for more details.');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookingPage();
});
