# Thalir Holidays - Travel Booking Website

A dynamic website for booking travel packages to South Indian destinations including Tamil Nadu, Kerala, and Karnataka.

## Features

- Browse travel packages for 11+ destinations
- Interactive booking form with validation
- SQLite database for storing customer inquiries
- Responsive design for mobile and desktop
- Admin dashboard to view bookings

## Destinations

- **Tamil Nadu**: Valparai, Ooty, Yercaud, Kanyakumari, Rameshwaram
- **Kerala**: Varkala, Wayanad, Munnar
- **Karnataka**: Chikkamagaluru, Coorg, Mysore

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Design**: Responsive CSS with mobile-first approach

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
thalir-holidays/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   ├── index.html
│   ├── packages.html
│   ├── booking.html
│   └── admin.html
├── server.js
├── database.js
├── package.json
└── .env
```

## API Endpoints

- `GET /api/destinations` - Get all destinations
- `GET /api/packages` - Get all packages
- `POST /api/bookings` - Submit a booking inquiry
- `GET /api/bookings` - Get all bookings (admin)

## Database Schema

The SQLite database includes tables for:
- Destinations
- Packages
- Bookings/Inquiries

## Future Enhancements

- Payment gateway integration
- Email notifications
- User authentication
- Reviews and ratings
- Photo galleries
- Multi-language support
