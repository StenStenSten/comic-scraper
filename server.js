const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs'); // Use EJS for templating

app.get('/', (req, res) => {
    let imageUrl = null;
    
    try {
        const data = fs.readFileSync('comics.json', 'utf8');
        const images = JSON.parse(data);
        imageUrl = images.length > 0 ? images[0] : null;
    } catch (error) {
        console.error('Error reading comics.json:', error);
    }

    res.render('index', { imageUrl });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
