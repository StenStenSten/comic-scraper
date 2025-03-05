const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const COMIC_URL = 'https://questionablecontent.net/view.php?comic=5502';
const BASE_URL = 'https://questionablecontent.net/';

async function scrapeComic() {
    try {
        const { data } = await axios.get(COMIC_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(data);
        const images = [];

        // Select the comic image
        const imgElement = $('#strip');
        let imgUrl = imgElement.attr('src');

        if (imgUrl) {
            // Ensure absolute URL
            if (!imgUrl.startsWith('http')) {
                imgUrl = new URL(imgUrl, BASE_URL).href;
            }

            images.push(imgUrl);

            console.log('Comic image found:', imgUrl);
            fs.writeFileSync('comics.json', JSON.stringify(images, null, 2));
            console.log('Saved to comics.json');
        } else {
            console.log('No comic image found.');
        }
    } catch (error) {
        console.error('Error scraping the comic:', error.message);
    }
}

scrapeComic();
