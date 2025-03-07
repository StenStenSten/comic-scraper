const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://questionablecontent.net/';
const START_COMIC = 5500; // Change as needed
const NUM_COMICS = 10; // Number of comics to scrape

async function scrapeComics(start, count) {
    let comics = [];

    for (let i = 0; i < count; i++) {
        const comicNumber = start + i;
        const comicUrl = `${BASE_URL}view.php?comic=${comicNumber}`;

        try {
            const { data } = await axios.get(comicUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            const $ = cheerio.load(data);

            // Find the comic image
            const imgElement = $('#strip');
            let imgUrl = imgElement.attr('src');

            if (imgUrl) {
                // Ensure absolute URL
                if (!imgUrl.startsWith('http')) {
                    imgUrl = new URL(imgUrl, BASE_URL).href;
                }

                comics.push({
                    comicNumber,
                    images: [imgUrl]
                });

                console.log(`Comic #${comicNumber} found: ${imgUrl}`);
            } else {
                console.log(`No comic found for #${comicNumber}`);
            }
        } catch (error) {
            console.error(`Error scraping comic #${comicNumber}:`, error.message);
        }
    }

    // Save to comics.json
    fs.writeFileSync('comics.json', JSON.stringify(comics, null, 2));
    console.log('Saved to comics.json');
}

// Run the scraper
scrapeComics(START_COMIC, NUM_COMICS);
