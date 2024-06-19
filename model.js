// import * as tf from '@tensorflow/tfjs'; 

const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const axios = require('axios');


let model;

// const place_name_to_id = {
//     'Kota Tua': 1,
//     'Mall Thamrin City': 2,
// };

// const id_to_place_name = {
//     1: 'Kota Tua',
//     2: 'Mall Thamrin City',
// };

// const place_id_to_city = {
//     1: 'Jakarta',
//     2: 'Jakarta'
// };

const window_size = 2;

async function predictNextLocation(currentSequence, place_id_to_city, id_to_place_name, place_name_to_id) {
    const overallSequenceIds = currentSequence.map(place => place_name_to_id[place]);
    const currentSequenceIds = currentSequence.slice(-window_size).map(place => place_name_to_id[place]);
    const currentCity = place_id_to_city[currentSequenceIds[0]];
    const inputSequence = currentSequenceIds.slice(-window_size);

    console.log('Making prediction for input sequence:', inputSequence);

    try {
        const response = await axios.post('http://34.135.211.146/v1/models/tour_locations_model:predict', {
            instances: [inputSequence]
        });

        let predictions = response.data.predictions[0];

        console.log('Predictions:', predictions);

        // Zero out probabilities for locations in the input sequence
        overallSequenceIds.forEach(id => {
            predictions[id] = 0;
        });

        // Zero out probabilities for locations not in the current city
        Object.keys(place_id_to_city).forEach(id => {
            if (place_id_to_city[id] !== currentCity) {
                predictions[id] = 0;
            }
        });

        // Get the ID of the location with the highest remaining probability
        const predictedId = predictions.indexOf(Math.max(...predictions));
        const predictedPlace = id_to_place_name[predictedId];
        console.log('Predicted place:', predictedPlace);
        return predictedPlace;

    } catch (error) {
        console.error('Error making prediction:', error);
        throw error;
    }
}

async function generateTourSequence(initialLocation,initialLocation2, place_id_to_city, id_to_place_name, place_name_to_id) {
    // This function assumes initialLocation and category are already filtered
    const tourSequence = [initialLocation, initialLocation2];

    while (tourSequence.length < 5) {
        const nextLocation = await predictNextLocation(tourSequence, place_id_to_city, id_to_place_name, place_name_to_id, );
        tourSequence.push(nextLocation);
    }

    return tourSequence;
}

async function main() {
    await loadModel();
    const initialLocation = 'Kota Tua'; // isi pake random tour berdasarkan kota dan category yang dipilih user

    const tourSequence = await generateTourSequence(initialLocation);
    console.log(`The generated tour sequence is: ${tourSequence}`);
}

module.exports={
    generateTourSequence,
}