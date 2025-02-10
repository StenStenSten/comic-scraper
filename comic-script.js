const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


const COMIC_URL = 'example link here';

async function scrapeComic() {
    try {
       
        const { data } = await axios.get(COMIC_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(data);
        const images = [];

        
        $('img.comic-image').each((index, element) => {
            const imgUrl = $(element).attr('src');
            if (imgUrl) {
                images.push(imgUrl);
            }
        });

        if (images.length > 0) {
            console.log('Comic images found:', images);
            fs.writeFileSync('comics.json', JSON.stringify(images, null, 2));
            console.log('Saved to comics.json');
        } else {
            console.log('No comic images found.');
        }

    } catch (error) {
        console.error('Error scraping the comic:', error.message);
    }
}

scrapeComic();
