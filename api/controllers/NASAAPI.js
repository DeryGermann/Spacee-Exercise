const API_KEY = 'zT1Owt7Qrhg7oRMFwegeCS6TTbk8yQlF3DHlqqJ9';
const API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${API_KEY}`
const TEST_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-06-03&api_key=${API_KEY}`

/*
    Test Date 1: 5/3/2015
    Test Date 2: 6/3/2015
*/

const axios = require('axios').default;

const formatAPIResponse = async data => {
    return data.map((d, idx) => {
        let tempObj = {
            earth_date: d.earth_date,
            img_src: d.img_src,
            full_name: d.camera.full_name
        }

        return tempObj
    })
}

const makeAPICall = async (date) => {
    let apiResponse = []

    // Make NASA API call
    await axios.get(`${API_URL}&earth_date=${date}`, {})
    .then(response => {
        apiResponse = response.data.photos
    })
    .catch(e => {
        console.log(e);
    });

    // Format API response
    return await formatAPIResponse(apiResponse)
}

module.exports = { makeAPICall }