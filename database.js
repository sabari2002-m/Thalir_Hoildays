const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create destinations table
  db.run(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      popular_attractions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create packages table
  db.run(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_id INTEGER,
      title TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      inclusions TEXT,
      highlights TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (destination_id) REFERENCES destinations(id)
    )
  `);

  // Create bookings table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      travel_date TEXT NOT NULL,
      num_adults INTEGER NOT NULL,
      num_children INTEGER DEFAULT 0,
      special_requests TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (package_id) REFERENCES packages(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tables:', err.message);
    } else {
      console.log('Database tables initialized');
      seedData();
    }
  });
}

function seedData() {
  // Check if destinations already exist
  db.get('SELECT COUNT(*) as count FROM destinations', (err, row) => {
    if (err) {
      console.error('Error checking destinations:', err.message);
      return;
    }
    
    if (row.count === 0) {
      console.log('Seeding initial data...');
      
      // Insert destinations
      const destinations = [
        ['Valparai', 'Tamil Nadu', 'A scenic hill station known for tea estates and wildlife', '/images/valparai.jpg', 'Tea estates, Athirappilly Falls, Aliyar Dam'],
        ['Ooty', 'Tamil Nadu', 'The Queen of Hill Stations with beautiful botanical gardens', '/images/ooty.jpg', 'Botanical Gardens, Ooty Lake, Nilgiri Mountain Railway'],
        ['Yercaud', 'Tamil Nadu', 'A peaceful hill station with coffee plantations', '/images/yercaud.jpg', 'Yercaud Lake, Kiliyur Falls, Shevaroy Temple'],
        ['Kanyakumari', 'Tamil Nadu', 'The southernmost tip of India with stunning sunsets', '/images/kanyakumari.jpg', 'Vivekananda Rock, Thiruvalluvar Statue, Sunrise & Sunset'],
        ['Rameshwaram', 'Tamil Nadu', 'Sacred pilgrimage site with beautiful beaches', '/images/rameshwaram.jpg', 'Ramanathaswamy Temple, Pamban Bridge, Dhanushkodi'],
        ['Varkala', 'Kerala', 'Beach town with dramatic cliffs and natural springs', '/images/varkala.jpg', 'Varkala Beach, Cliff views, Janardhana Temple'],
        ['Wayanad', 'Kerala', 'Lush green paradise with wildlife and waterfalls', '/images/wayanad.jpg', 'Chembra Peak, Edakkal Caves, Soochipara Falls'],
        ['Munnar', 'Kerala', 'Famous for tea gardens and misty mountains', '/images/munnar.jpg', 'Tea plantations, Eravikulam National Park, Mattupetty Dam'],
        ['Chikkamagaluru', 'Karnataka', 'Coffee land with serene hills and temples', '/images/chikkamagaluru.jpg', 'Mullayanagiri Peak, Coffee estates, Baba Budangiri'],
        ['Coorg', 'Karnataka', 'Scotland of India with coffee plantations', '/images/coorg.jpg', 'Abbey Falls, Raja\'s Seat, Coffee plantations'],
        ['Mysore', 'Karnataka', 'Royal city with magnificent palaces and gardens', '/images/mysore.jpg', 'Mysore Palace, Chamundi Hills, Brindavan Gardens']
      ];

      const insertDest = db.prepare('INSERT INTO destinations (name, state, description, image_url, popular_attractions) VALUES (?, ?, ?, ?, ?)');
      destinations.forEach(dest => {
        insertDest.run(dest);
      });
      insertDest.finalize();

      // Insert sample packages
      const packages = [
        [1, 'Valparai Tea Estate Tour', '2 Days / 1 Night', 4999, 'Explore lush tea gardens and wildlife', 'Accommodation, Breakfast, Transport', 'Tea estate visit, Wildlife spotting, Scenic drives'],
        [1, 'Valparai Nature Retreat', '3 Days / 2 Nights', 7999, 'Extended nature experience in Valparai', 'Accommodation, All meals, Transport, Guide', 'Tea plantation tour, Athirappilly Falls, Nature walks'],
        [2, 'Ooty Hill Station Getaway', '2 Days / 1 Night', 5499, 'Classic Ooty experience with gardens and lake', 'Accommodation, Breakfast, Sightseeing', 'Botanical Garden, Ooty Lake, Doddabetta Peak'],
        [2, 'Ooty Heritage Tour', '3 Days / 2 Nights', 8999, 'Experience Ooty\'s colonial charm', 'Accommodation, All meals, Toy train ride, Transport', 'Nilgiri Railway, Tea factory, Rose garden'],
        [3, 'Yercaud Coffee Trails', '2 Days / 1 Night', 4499, 'Peaceful retreat in coffee country', 'Accommodation, Breakfast, Transport', 'Coffee plantation, Yercaud Lake, Viewpoints'],
        [4, 'Kanyakumari Sunrise Special', '2 Days / 1 Night', 3999, 'Witness spectacular sunrise at land\'s end', 'Accommodation, Breakfast, Ferry ticket', 'Vivekananda Rock, Thiruvalluvar Statue, Beach'],
        [5, 'Rameshwaram Pilgrimage', '2 Days / 1 Night', 4299, 'Spiritual journey to sacred Rameshwaram', 'Accommodation, Breakfast, Temple visit', 'Ramanathaswamy Temple, Dhanushkodi, Pamban Bridge'],
        [6, 'Varkala Beach Relaxation', '3 Days / 2 Nights', 6999, 'Unwind on pristine cliffs and beaches', 'Accommodation, Breakfast, Ayurvedic massage', 'Beach activities, Cliff walks, Local markets'],
        [7, 'Wayanad Wildlife Adventure', '3 Days / 2 Nights', 9499, 'Explore forests, caves and waterfalls', 'Accommodation, All meals, Safari, Guide', 'Wildlife safari, Edakkal Caves, Chembra Peak trek'],
        [8, 'Munnar Tea Gardens', '2 Days / 1 Night', 5999, 'Immerse in tea country beauty', 'Accommodation, Breakfast, Tea factory tour', 'Tea plantations, Eravikulam Park, Mattupetty'],
        [8, 'Munnar Honeymoon Package', '3 Days / 2 Nights', 10999, 'Romantic getaway in misty hills', 'Luxury stay, All meals, Candlelight dinner, Transfers', 'Tea gardens, Scenic spots, Private tours'],
        [9, 'Chikkamagaluru Coffee Experience', '2 Days / 1 Night', 5299, 'Discover coffee culture and hills', 'Accommodation, Breakfast, Coffee tour', 'Coffee plantation, Mullayanagiri, Hirekolale Lake'],
        [10, 'Coorg Nature Escape', '3 Days / 2 Nights', 8499, 'Experience Scotland of India', 'Accommodation, All meals, Transport, Activities', 'Abbey Falls, Coffee estates, Raja\'s Seat'],
        [11, 'Mysore Royal Heritage', '2 Days / 1 Night', 4799, 'Explore royal palaces and gardens', 'Accommodation, Breakfast, Palace entry', 'Mysore Palace, Chamundi Hills, Brindavan Gardens']
      ];

      const insertPkg = db.prepare('INSERT INTO packages (destination_id, title, duration, price, description, inclusions, highlights) VALUES (?, ?, ?, ?, ?, ?, ?)');
      packages.forEach(pkg => {
        insertPkg.run(pkg);
      });
      insertPkg.finalize(() => {
        console.log('Initial data seeded successfully');
      });
    }
  });
}

module.exports = db;
