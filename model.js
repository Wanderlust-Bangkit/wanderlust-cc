const tf = require('@tensorflow/tfjs-node');
const path = require('path');


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

async function loadModel() {
    model = await tf.loadLayersModel('https://storage.googleapis.com/modelwanderlust/model.json');
    console.log('Model loaded successfully');
}

function predictNextLocation(currentSequence,place_id_to_city, id_to_place_name, place_name_to_id) {
    const currentSequenceIds = currentSequence.map(place => place_name_to_id[place]);
    const currentCity = place_id_to_city[currentSequenceIds[0]];
    const inputSequence = currentSequenceIds.slice(-window_size);

    const inputTensor = tf.tensor2d([inputSequence], [1, window_size]);

    return model.predict(inputTensor).data().then(predictions => {
        inputSequence.forEach(id => {
            predictions[id] = 0;
        });

        // Set probabilities of locations not in the current city to 0
        Object.keys(place_id_to_city).forEach(id => {
            if (place_id_to_city[id] !== currentCity) {
                predictions[id] = 0;
            }
        });

        // Get the ID of the location with the highest remaining probability
        const predictedId = predictions.indexOf(Math.max(...predictions));
        const predictedPlace = id_to_place_name[predictedId];
        return predictedPlace;
    });
}

async function generateTourSequence(initialLocation,place_id_to_city, id_to_place_name, place_name_to_id) {
    // This function assumes initialLocation and category are already filtered
    const tourSequence = [initialLocation];
    
    while (tourSequence.length < 5) {
        const nextLocation = await predictNextLocation(tourSequence.slice(-window_size),place_id_to_city, id_to_place_name, place_name_to_id);
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
    loadModel
}