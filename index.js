const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors()); 

// MySQL Connection
const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
});

// Add School API
app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
    }

    try {
        const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
        await db.execute(query, [name, address, latitude, longitude]);
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding school', details: err.message });
    }
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371; 

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

app.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM schools');
        const schoolsWithDistance = rows.map((school) => ({
            ...school,
            distance: calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                school.latitude,
                school.longitude
            ),
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json(schoolsWithDistance);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching schools', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
