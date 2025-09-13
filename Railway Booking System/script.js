// Main JavaScript functionality for IRCTC Railway Booking System

// Function to swap from and to stations
function swapStations() {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    
    const fromValue = fromInput.value;
    const toValue = toInput.value;
    
    fromInput.value = toValue;
    toInput.value = fromValue;
}

// Function to set minimum date to today
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
    dateInput.value = `${year}-${month}-${day}`;
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    
    if (!from || !to || !date) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (from === to) {
        alert('Source and destination cannot be the same');
        return;
    }
    
    // Redirect to train list page with parameters
    const params = new URLSearchParams({
        from: from,
        to: to,
        date: date
    });
    
    window.location.href = `train_list/index.html?${params.toString()}`;
}

// Function to populate train list based on URL parameters
function populateTrainList() {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from') || 'Mumbai';
    const to = urlParams.get('to') || 'Delhi';
    const date = urlParams.get('date') || new Date().toISOString().split('T')[0];
    
    // Update search details
    const searchDetails = document.getElementById('search-details');
    if (searchDetails) {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        searchDetails.innerHTML = `
            <div class="search-info">
                <span class="route">${from} → ${to}</span>
                <span class="date">${formattedDate}</span>
            </div>
            <p class="result-count">Found 12 trains for your journey</p>
        `;
    }
    
    // Update page title
    document.title = `Trains from ${from} to ${to} - IRCTC`;
    
    console.log(`Searching trains from ${from} to ${to} on ${date}`);
}

// Function to handle train selection
function selectTrain(trainId) {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from') || 'Mumbai';
    const to = urlParams.get('to') || 'Delhi';
    const date = urlParams.get('date') || new Date().toISOString().split('T')[0];
    
    // Get train details
    const trainDetails = getTrainDetails(trainId);
    if (!trainDetails) {
        showErrorMessage('Train details not found');
        return;
    }
    
    // Store train selection in sessionStorage for booking page
    const bookingData = {
        trainId: trainId,
        trainName: trainDetails.name,
        from: from,
        to: to,
        date: date,
        departure: trainDetails.departure,
        arrival: trainDetails.arrival,
        duration: trainDetails.duration,
        seats: trainDetails.seats
    };
    
    sessionStorage.setItem('selectedTrain', JSON.stringify(bookingData));
    
    // Redirect to booking page
    window.location.href = `../booking_page/index.html`;
}

// Function to add passenger form
function addPassenger() {
    const passengersContainer = document.getElementById('passengers-container');
    const passengerCount = passengersContainer.children.length + 1;
    
    const passengerForm = document.createElement('div');
    passengerForm.className = 'passenger-form';
    passengerForm.innerHTML = `
        <h4>Passenger ${passengerCount}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>First Name:</label>
                <input type="text" name="firstName${passengerCount}" required>
            </div>
            <div class="form-group">
                <label>Last Name:</label>
                <input type="text" name="lastName${passengerCount}" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Age:</label>
                <input type="number" name="age${passengerCount}" min="1" max="120" required>
            </div>
            <div class="form-group">
                <label>Mobile Number:</label>
                <input type="tel" name="mobile${passengerCount}" pattern="[0-9]{10}" required>
            </div>
        </div>
        <div class="form-group">
            <label>Type of Berth:</label>
            <select name="berth${passengerCount}" class="berth-select">
                <option value="side-lower">Side Lower</option>
                <option value="side-upper">Side Upper</option>
                <option value="lower">Lower</option>
                <option value="middle">Middle</option>
                <option value="upper">Upper</option>
                <option value="side-middle">Side Middle</option>
            </select>
        </div>
        <button type="button" class="remove-btn" onclick="removePassenger(this)">Remove Passenger</button>
    `;
    
    passengersContainer.appendChild(passengerForm);
}

// Function to remove passenger form
function removePassenger(button) {
    const passengerForm = button.closest('.passenger-form');
    passengerForm.remove();
    
    // Renumber remaining passengers
    const passengers = document.querySelectorAll('.passenger-form');
    passengers.forEach((passenger, index) => {
        const h4 = passenger.querySelector('h4');
        h4.textContent = `Passenger ${index + 1}`;
    });
}

// Function to handle booking submission
function handleBookingSubmission(event) {
    event.preventDefault();
    
    const passengers = document.querySelectorAll('.passenger-form');
    if (passengers.length === 0) {
        showErrorMessage('Please add at least one passenger');
        return;
    }
    
    // Validate all passenger forms
    let isValid = true;
    passengers.forEach((passenger, index) => {
        const inputs = passenger.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc3545';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
    });
    
    if (!isValid) {
        showErrorMessage('Please fill in all required fields for all passengers');
        return;
    }
    
    // Get booking data
    const bookingData = JSON.parse(sessionStorage.getItem('selectedTrain'));
    if (!bookingData) {
        showErrorMessage('Booking data not found. Please try again.');
        return;
    }
    
    // Generate PNR
    const pnr = generatePNR();
    
    // Collect passenger data
    const passengerData = [];
    passengers.forEach((passenger, index) => {
        const passengerInfo = {
            firstName: passenger.querySelector(`input[name="firstName${index + 1}"]`).value,
            lastName: passenger.querySelector(`input[name="lastName${index + 1}"]`).value,
            age: passenger.querySelector(`input[name="age${index + 1}"]`).value,
            mobile: passenger.querySelector(`input[name="mobile${index + 1}"]`).value,
            berth: passenger.querySelector(`select[name="berth${index + 1}"]`).value
        };
        passengerData.push(passengerInfo);
    });
    
    // Create complete booking
    const completeBooking = {
        pnr: pnr,
        trainDetails: bookingData,
        passengers: passengerData,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed',
        totalAmount: calculateTotalAmount(passengerData.length, bookingData.trainId)
    };
    
    // Store booking in sessionStorage
    const existingBookings = JSON.parse(sessionStorage.getItem('userBookings') || '[]');
    existingBookings.push(completeBooking);
    sessionStorage.setItem('userBookings', JSON.stringify(existingBookings));
    
    // Clear selected train
    sessionStorage.removeItem('selectedTrain');
    
    // Store booking data for payment
    sessionStorage.setItem('pendingBooking', JSON.stringify(completeBooking));
    
    // Redirect to payment gateway
    window.location.href = '../payment_gateway.html';
}

// Function to generate PNR
function generatePNR() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 10; i++) {
        pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
}

// Function to calculate total amount
function calculateTotalAmount(passengerCount, trainId) {
    const baseFares = {
        '12301': 2850, // Rajdhani Express
        '12302': 2200, // Delhi-Mumbai Superfast
        '12303': 1800, // Delhi-Mumbai Express
        '12045': 850,  // Shatabdi Express
        '12046': 750,  // Chandigarh-Delhi Fast Train
        '12047': 800,  // Chandigarh-Delhi Superfast
        '12245': 1950, // Duronto Express
        '12246': 1800, // Mumbai-Kolkata Duronto
        '12247': 1600, // Mumbai-Kolkata Express
        '12615': 450,  // Garib Rath
        '12616': 500,  // Bangalore-Chennai Fast Train
        '12617': 550   // Bangalore-Chennai Superfast
    };
    
    const baseFare = baseFares[trainId] || 1000;
    return baseFare * passengerCount;
}

// Function to populate booking page with train details
function populateBookingDetails() {
    // Get booking data from sessionStorage
    const bookingData = JSON.parse(sessionStorage.getItem('selectedTrain'));
    
    if (!bookingData) {
        showErrorMessage('No train selected. Please go back and select a train.');
        setTimeout(() => {
            window.location.href = '../train_list/index.html';
        }, 3000);
        return;
    }
    
    // Update selection details
    document.getElementById('from-selection').textContent = bookingData.from;
    document.getElementById('to-selection').textContent = bookingData.to;
    document.getElementById('date-selection').textContent = bookingData.date;
    
    // Update train details
    document.getElementById('train-name').textContent = bookingData.trainName;
    document.getElementById('train-id').textContent = bookingData.trainId;
    document.getElementById('train-from').textContent = bookingData.from;
    document.getElementById('train-to').textContent = bookingData.to;
    document.getElementById('departure-time').textContent = bookingData.departure;
    document.getElementById('arrival-time').textContent = bookingData.arrival;
    document.getElementById('duration').textContent = bookingData.duration;
    document.getElementById('seats-available').textContent = bookingData.seats;
    
    // Update page title with train name
    document.title = `Booking - ${bookingData.trainName}`;
}

// Function to get train details by ID
function getTrainDetails(trainId) {
    const trains = {
        '12301': {
            id: '12301',
            name: 'Rajdhani Express',
            from: 'Delhi',
            to: 'Mumbai',
            departure: '06:00 AM',
            arrival: '04:00 PM',
            duration: '10h 00m',
            seats: '50'
        },
        '12302': {
            id: '12302',
            name: 'Delhi-Mumbai Superfast',
            from: 'Delhi',
            to: 'Mumbai',
            departure: '08:00 AM',
            arrival: '06:30 PM',
            duration: '10h 30m',
            seats: '40'
        },
        '12303': {
            id: '12303',
            name: 'Delhi-Mumbai Express',
            from: 'Delhi',
            to: 'Mumbai',
            departure: '10:00 AM',
            arrival: '08:15 PM',
            duration: '10h 15m',
            seats: '30'
        },
        '12045': {
            id: '12045',
            name: 'Shatabdi Express',
            from: 'Chandigarh',
            to: 'Delhi',
            departure: '08:00 AM',
            arrival: '10:30 AM',
            duration: '2h 30m',
            seats: '30'
        },
        '12046': {
            id: '12046',
            name: 'Chandigarh-Delhi Fast Train',
            from: 'Chandigarh',
            to: 'Delhi',
            departure: '10:00 AM',
            arrival: '12:45 PM',
            duration: '2h 45m',
            seats: '20'
        },
        '12047': {
            id: '12047',
            name: 'Chandigarh-Delhi Superfast',
            from: 'Chandigarh',
            to: 'Delhi',
            departure: '02:00 PM',
            arrival: '04:15 PM',
            duration: '2h 15m',
            seats: '25'
        },
        '12245': {
            id: '12245',
            name: 'Duronto Express',
            from: 'Mumbai',
            to: 'Kolkata',
            departure: '05:30 PM',
            arrival: '09:00 AM',
            duration: '15h 30m',
            seats: '20'
        },
        '12246': {
            id: '12246',
            name: 'Mumbai-Kolkata Duronto',
            from: 'Mumbai',
            to: 'Kolkata',
            departure: '06:30 PM',
            arrival: '10:00 AM',
            duration: '15h 30m',
            seats: '15'
        },
        '12247': {
            id: '12247',
            name: 'Mumbai-Kolkata Express',
            from: 'Mumbai',
            to: 'Kolkata',
            departure: '07:30 PM',
            arrival: '11:45 AM',
            duration: '16h 15m',
            seats: '10'
        },
        '12615': {
            id: '12615',
            name: 'Garib Rath',
            from: 'Bangalore',
            to: 'Chennai',
            departure: '09:00 AM',
            arrival: '01:00 PM',
            duration: '4h 00m',
            seats: '100'
        },
        '12616': {
            id: '12616',
            name: 'Bangalore-Chennai Fast Train',
            from: 'Bangalore',
            to: 'Chennai',
            departure: '11:00 AM',
            arrival: '03:30 PM',
            duration: '4h 30m',
            seats: '80'
        },
        '12617': {
            id: '12617',
            name: 'Bangalore-Chennai Superfast',
            from: 'Bangalore',
            to: 'Chennai',
            departure: '01:00 PM',
            arrival: '05:15 PM',
            duration: '4h 15m',
            seats: '60'
        }
    };
    
    return trains[trainId] || null;
}

// Function to handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'demo_user' && password === 'password123') {
        alert('Login successful!');
        window.location.href = '../index.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Function to handle registration form submission
function handleRegistration(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    if (!email || !mobile || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!termsAccepted) {
        alert('Please accept the terms and conditions');
        return;
    }
    
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    alert('Registration successful! You can now login with your credentials.');
    window.location.href = '../Login_Page/index.html';
}

// Initialize page based on current location
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    // Set minimum date for date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        setMinDate();
    }
    
    // Add event listeners based on current page
    if (currentPage.includes('index.html') || currentPage === '/') {
        // Home page
        const form = document.querySelector('.ticket-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    } else if (currentPage.includes('train_list')) {
        // Train list page
        populateTrainList();
    } else if (currentPage.includes('booking_page')) {
        // Booking page
        populateBookingDetails();
    } else if (currentPage.includes('Login_Page')) {
        // Login page
        const form = document.querySelector('.login-form');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }
    } else if (currentPage.includes('Registeration')) {
        // Registration page
        const form = document.querySelector('.register-form');
        if (form) {
            form.addEventListener('submit', handleRegistration);
        }
    }
});

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Utility function to validate mobile number
function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

// Utility function to validate email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Function to proceed to booking (show passenger form)
function proceedToBooking() {
    const bookingCard = document.querySelector('.booking-card');
    bookingCard.style.display = 'block';
    bookingCard.scrollIntoView({ behavior: 'smooth' });
}

// Function to handle train selection from train list
function selectTrainFromList(trainId) {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from') || 'Mumbai';
    const to = urlParams.get('to') || 'Delhi';
    const date = urlParams.get('date') || '2024-10-25';
    
    // Redirect to booking page with train details
    const params = new URLSearchParams({
        from: from,
        to: to,
        date: date,
        trainId: trainId
    });
    
    window.location.href = `../booking_page/index.html?${params.toString()}`;
}

// Function to populate train list based on search parameters
function populateTrainListFromSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const date = urlParams.get('date');
    
    if (from && to && date) {
        // Filter trains based on search criteria
        console.log(`Filtering trains from ${from} to ${to} on ${date}`);
        
        // You can add logic here to filter the train table based on search criteria
        // For now, we'll show all trains
    }
}

// Function to format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Function to calculate duration between two times
function calculateDuration(departure, arrival) {
    const depTime = new Date(`2000-01-01 ${departure}`);
    const arrTime = new Date(`2000-01-01 ${arrival}`);
    
    if (arrTime < depTime) {
        arrTime.setDate(arrTime.getDate() + 1);
    }
    
    const diffMs = arrTime - depTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
}

// Function to validate passenger age
function validatePassengerAge(age) {
    return age >= 1 && age <= 120;
}

// Function to validate mobile number format
function validateMobileFormat(mobile) {
    return /^\d{10}$/.test(mobile);
}

// Function to show loading state
function showLoading(element) {
    element.disabled = true;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
}

// Function to hide loading state
function hideLoading(element, originalText) {
    element.disabled = false;
    element.innerHTML = originalText;
}

// Function to show success message
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 5px;
        border: 1px solid #c3e6cb;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Function to show error message
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 15px 20px;
        border-radius: 5px;
        border: 1px solid #f5c6cb;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Registration Step Management
function nextStep(stepNumber) {
    // Hide current step
    const currentStep = document.querySelector('.step-content.active');
    if (currentStep) {
        currentStep.classList.remove('active');
    }
    
    // Show next step
    const nextStepElement = document.getElementById(`step-${stepNumber}`);
    if (nextStepElement) {
        nextStepElement.classList.add('active');
    }
    
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');
}

function prevStep(stepNumber) {
    // Hide current step
    const currentStep = document.querySelector('.step-content.active');
    if (currentStep) {
        currentStep.classList.remove('active');
    }
    
    // Show previous step
    const prevStepElement = document.getElementById(`step-${stepNumber}`);
    if (prevStepElement) {
        prevStepElement.classList.add('active');
    }
    
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');
}

function cancelRegistration() {
    if (confirm('Are you sure you want to cancel registration?')) {
        window.location.href = '../index.html';
    }
}

// Captcha Management
function refreshCaptcha() {
    const captchaText = document.getElementById('captcha-text');
    const loginCaptcha = document.getElementById('login-captcha');
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    if (captchaText) {
        captchaText.textContent = result;
    }
    if (loginCaptcha) {
        loginCaptcha.textContent = result;
    }
}

// Login Modal Management
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showForgotPassword() {
    alert('Password recovery feature will be implemented soon!');
}

function goToRegistration() {
    window.location.href = '../Registeration page/index.html';
}

function goToAgentLogin() {
    alert('Agent login feature will be implemented soon!');
}

// Admin Panel Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
}

function toggleUserMenu() {
    const popup = document.getElementById('userProfilePopup');
    if (popup) {
        popup.classList.toggle('active');
    }
}

function showChangePassword() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeChangePassword() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleChangePassword(event) {
    event.preventDefault();
    
    const oldPassword = document.querySelector('input[name="oldPassword"]').value;
    const newPassword = document.querySelector('input[name="newPassword"]').value;
    
    if (!oldPassword || !newPassword) {
        showErrorMessage('Please fill in all fields');
        return;
    }
    
    if (newPassword.length < 6) {
        showErrorMessage('New password must be at least 6 characters long');
        return;
    }
    
    showSuccessMessage('Password changed successfully!');
    closeChangePassword();
}

function handleScheduleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const scheduleData = {};
    
    for (let [key, value] of formData.entries()) {
        scheduleData[key] = value;
    }
    
    if (!scheduleData.trainNo || !scheduleData.trainName || !scheduleData.from || !scheduleData.to) {
        showErrorMessage('Please fill in all required fields');
        return;
    }
    
    showSuccessMessage('Train schedule added successfully!');
    event.target.reset();
}

function deleteTrain(trainId) {
    if (confirm(`Are you sure you want to delete train ${trainId}?`)) {
        showSuccessMessage(`Train ${trainId} deleted successfully!`);
        // In a real application, you would make an API call here
    }
}

function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        window.location.href = '../index.html';
    }
}

function addAccount() {
    alert('Add account feature will be implemented soon!');
}

// User Dashboard Functions
function goToBooking() {
    window.location.href = '../train_list/index.html';
}

function showBookingHistory() {
    alert('Booking history feature will be implemented soon!');
}

function showProfile() {
    alert('Profile management feature will be implemented soon!');
}

function showSupport() {
    alert('Customer support feature will be implemented soon!');
}

function viewTicket(ticketId) {
    alert(`View ticket ${ticketId} - Feature will be implemented soon!`);
}

function cancelTicket(ticketId) {
    if (confirm(`Are you sure you want to cancel ticket ${ticketId}?`)) {
        showSuccessMessage(`Ticket ${ticketId} cancelled successfully!`);
    }
}

function editProfile() {
    alert('Edit profile feature will be implemented soon!');
}

function editAddress() {
    alert('Edit address feature will be implemented soon!');
}

function changePassword() {
    alert('Change password feature will be implemented soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
}

// Enhanced Registration Handler
function handleRegistration(event) {
    event.preventDefault();
    
    // Validate all steps
    const step1Form = document.getElementById('basic-details-form');
    const step2Form = document.getElementById('personal-details-form');
    const step3Form = document.getElementById('address-form');
    
    let isValid = true;
    let errorMessage = '';
    
    // Validate Step 1
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        isValid = false;
        errorMessage = 'Please fill in all basic details';
    } else if (password !== confirmPassword) {
        isValid = false;
        errorMessage = 'Passwords do not match';
    } else if (password.length < 6) {
        isValid = false;
        errorMessage = 'Password must be at least 6 characters long';
    }
    
    // Validate Step 2
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    
    if (!firstName || !lastName || !email || !mobile) {
        isValid = false;
        errorMessage = 'Please fill in all personal details';
    } else if (!validateEmail(email)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (!validateMobile(mobile)) {
        isValid = false;
        errorMessage = 'Please enter a valid 10-digit mobile number';
    }
    
    // Validate Step 3
    const flatNo = document.getElementById('flatNo').value;
    const pinCode = document.getElementById('pinCode').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const captcha = document.getElementById('captcha').value;
    const terms = document.getElementById('terms').checked;
    
    if (!flatNo || !pinCode || !city || !state) {
        isValid = false;
        errorMessage = 'Please fill in all address details';
    } else if (!captcha) {
        isValid = false;
        errorMessage = 'Please enter the captcha';
    } else if (!terms) {
        isValid = false;
        errorMessage = 'Please accept the terms and conditions';
    }
    
    if (!isValid) {
        showErrorMessage(errorMessage);
        return;
    }
    
    // Show success message
    showSuccessMessage('Registration successful! You can now login with your credentials.');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = '../Login_Page/index.html';
    }, 2000);
}

// Enhanced Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captcha = document.getElementById('login-captcha-input').value;
    
    if (!username || !password || !captcha) {
        showErrorMessage('Please fill in all fields');
        return;
    }
    
    // Simple captcha validation (in real app, this would be server-side)
    const expectedCaptcha = document.getElementById('login-captcha').textContent;
    if (captcha.toLowerCase() !== expectedCaptcha.toLowerCase()) {
        showErrorMessage('Invalid captcha. Please try again.');
        refreshCaptcha();
        return;
    }
    
    // Demo login validation
    if (username === 'demo_user' && password === 'password123') {
        showSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
            window.location.href = '../user_dashboard/index.html';
        }, 2000);
    } else if (username === 'admin' && password === 'admin123') {
        showSuccessMessage('Admin login successful! Redirecting to admin panel...');
        setTimeout(() => {
            window.location.href = '../admin/index.html';
        }, 2000);
    } else {
        showErrorMessage('Invalid username or password. Please try again.');
        refreshCaptcha();
    }
}

// Update current date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('en-GB', options);
    
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateTimeString;
    }
}

// Initialize page based on current location
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    // Update date and time every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Set minimum date for date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        setMinDate();
    }
    
    // Initialize captcha
    refreshCaptcha();
    
    // Add event listeners based on current page
    if (currentPage.includes('index.html') || currentPage === '/') {
        // Home page
        const form = document.querySelector('.ticket-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    } else if (currentPage.includes('train_list')) {
        // Train list page
        populateTrainList();
    } else if (currentPage.includes('booking_page')) {
        // Booking page
        populateBookingDetails();
    } else if (currentPage.includes('Login_Page')) {
        // Login page
        const form = document.querySelector('.login-form-element');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }
    } else if (currentPage.includes('Registeration')) {
        // Registration page
        const form = document.querySelector('#address-form');
        if (form) {
            form.addEventListener('submit', handleRegistration);
        }
    } else if (currentPage.includes('admin')) {
        // Admin page
        // Initialize admin panel
        showSection('dashboard');
    } else if (currentPage.includes('user_dashboard')) {
        // User dashboard
        // Initialize user dashboard
    }
    
    // Close popups when clicking outside
    document.addEventListener('click', function(event) {
        const userPopup = document.getElementById('userProfilePopup');
        if (userPopup && !event.target.closest('.user-profile') && !event.target.closest('.user-profile-popup')) {
            userPopup.classList.remove('active');
        }
    });
});
