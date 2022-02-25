var express = require('express');
var router = express.Router();

const fs = require('fs');

const NASAAPIController = require('../controllers/NASAAPI');

const formatDate = date => {
    return new Date(date).toISOString().split('T')[0]
}

router.get('/', (req, res, next) => {
    res.send('Get ready to see NASA images.');
});

router.post('/getImagesBasedOnDate', async (req, res, next) => {
    const INPUT_DATE = formatDate(req.body.date)
    let hasImagesAlreadyBeenDownloaded = false

    const folderName = `${__dirname}/../public/images/${INPUT_DATE}`

    try {
        // Check if images have already been downloaded
        if (!fs.existsSync(folderName)) fs.mkdirSync(folderName)
        // Update boolean to indicate that the images have not been downloaded yet
        else hasImagesAlreadyBeenDownloaded = true
    } catch (err) {
        console.error(err)
    }

    let jsonObj = {
        photos: []
    }         
    // Check if images exist before downloading
    if (!hasImagesAlreadyBeenDownloaded) {
        // Call NASA API and return images
        await NASAAPIController.makeAPICall(INPUT_DATE)
        .then(value => {
            jsonObj.photos = value
        })

        console.log('Downloading Photos...')
        // Save photos to a json file
        fs.writeFile(`${folderName}/${INPUT_DATE} photos.json`, JSON.stringify(jsonObj), (err, result) => {
            if (err) console.log(`Error when trying to save ${INPUT_DATE} photos.`)

            res.json(jsonObj)
        })
    } else {
        console.log('Retrieving Photos...')
        // Read file contents
        fs.readFile(`${folderName}/${INPUT_DATE} photos.json`, (err, fileContent) => {
            if (err) console.log(`Error when trying to read ${INPUT_DATE} photos.`)
            
            res.json(JSON.parse(fileContent));
        })
    }
});

module.exports = router;