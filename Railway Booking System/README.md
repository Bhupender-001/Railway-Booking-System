# IRCTC Railway Ticket Booking System

A complete web-based railway ticket booking system inspired by the official IRCTC website. This project includes all the essential features for booking train tickets online.

## Features

### 🏠 Home Page
- Beautiful train background with booking form
- Search for trains by source, destination, and date
- Class and quota selection options
- Special concession options (disability, flexible dates, etc.)
- Responsive design with modern UI

### 🔐 Login Page
- User authentication form
- Demo account: `demo_user` / `password123`
- Railway-themed background
- Form validation

### 📝 Registration Page
- New user registration form
- Email and mobile number validation
- Terms and conditions acceptance
- Station-themed background

### 🚂 Train List Page
- Comprehensive list of available trains
- Train details including timings, duration, and seat availability
- Search filtering based on source and destination
- Interactive train selection

### 🎫 Booking Page
- Passenger details form
- Multiple passenger support
- Berth type selection
- Real-time form validation
- Booking confirmation

## Project Structure

```
git irctc/
├── index.html                 # Home page
├── styles.css                 # Main stylesheet
├── script.js                  # JavaScript functionality
├── README.md                  # Project documentation
├── Login_Page/
│   └── index.html            # Login page
├── Registeration page/
│   └── index.html            # Registration page
├── train_list/
│   └── index.html            # Train list page
└── booking_page/
    └── index.html            # Booking page
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for best experience)

### Installation

1. **Clone or download** this repository to your local machine
2. **Open the project** in your preferred code editor
3. **Start a local server** (recommended):
   - Using Python: `python -m http.server 8000`
   - Using Node.js: `npx http-server`
   - Using Live Server extension in VS Code
4. **Open your browser** and navigate to `http://localhost:8000`

### Alternative: Direct File Opening
You can also open `index.html` directly in your browser, but some features may not work due to CORS restrictions.

## Usage

### 1. Home Page
- Enter your source and destination stations
- Select your travel date
- Choose your preferred class and quota
- Click "Search" to view available trains

### 2. Login
- Use the demo account: `demo_user` / `password123`
- Or register a new account

### 3. Registration
- Fill in your email, mobile number, and password
- Accept the terms and conditions
- Click "Register"

### 4. Train Selection
- Browse through available trains
- View train details, timings, and seat availability
- Click "Select" on your preferred train

### 5. Booking
- Fill in passenger details
- Select berth preferences
- Add multiple passengers if needed
- Complete the booking

## Features in Detail

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly buttons and inputs

### Form Validation
- Real-time input validation
- Email and mobile number format checking
- Required field validation
- Age and berth validation

### Interactive Elements
- Station swapping functionality
- Dynamic passenger form addition/removal
- Smooth scrolling and transitions
- Loading states and success messages

### Visual Design
- Railway-themed backgrounds
- Professional color scheme
- Modern UI components
- Consistent branding throughout

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Styling, animations, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and form handling
- **Font Awesome** - Icons and visual elements
- **Unsplash** - High-quality background images

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Adding New Trains
Edit the train data in `train_list/index.html` or modify the JavaScript functions in `script.js`.

### Styling Changes
Modify `styles.css` to customize colors, fonts, and layouts.

### Functionality Extensions
Add new features by extending the JavaScript functions in `script.js`.

## Demo Account

For testing purposes, use these credentials:
- **Username:** demo_user
- **Password:** password123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect the original IRCTC branding and trademarks.

## Acknowledgments

- Inspired by the official IRCTC website
- Background images from Unsplash
- Icons from Font Awesome
- Design patterns from modern web applications

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Note:** This is a demonstration project and is not affiliated with the official IRCTC website. All train data and functionality are simulated for educational purposes.

