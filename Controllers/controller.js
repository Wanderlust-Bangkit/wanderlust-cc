const bcrypt = require("bcryptjs");
const { db, auth } = require("../Config/firebaseConfig");
const { collection, getDocs, addDoc, query, where ,doc, getDoc, setDoc, deleteDoc} = require("@firebase/firestore/lite");
const jwt = require("jsonwebtoken");
const {generateTourSequence, loadModel} = require("../model")

require('dotenv').config();

async function RegisterHandler(request, h) {
    const { name, email, password } = request.payload;

    try {
        const users = collection(db, 'Users');
        
        const q = query(users, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return h.response({
                error: true,
                message: "Email Already In Use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const docRef = await addDoc(users, {
            name: name,
            email: email,
            password: hashedPassword
        });

        console.log('Document written with ID:', docRef.id);

        return h.response({
            error: false,
            message: "User created"
        });
        
    } catch (error) {
        console.error('Error adding user:', error);
        
        return h.response({
            error: true,
            message: error.message
        });
    }
}

async function LoginHandler(request, h) {
    const { email, password } = request.payload;
    let response;

    try {
        const users = collection(db, 'Users');
        
        const q = query(users, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const uid = querySnapshot.docs[0].id;
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (!passwordMatch) {
                response = h.response({
                    error: true,
                    message: "Check Your Password"
                });
            } else {
                const token = jwt.sign(
                    {
                        name: userData.name,
                        email: userData.email,
                        userId: uid
                    },
                    process.env.JWT_SECRET
                );

                response = h.response({
                    error: false,
                    message: "Success",
                    loginResult: {
                        userId: uid,
                        name: userData.name,
                        email: userData.email,
                        token: token
                    }
                });
            }
        } else {
            response = h.response({
                error: true,
                message: "Wrong Email"
            });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        response = h.response({
            error: true,
            message: error.message
        });
    }

    return response;
}

async function getDestinationHandler(request,h){
    let response;
    try {
        const destination = collection(db, 'destination');
        const querySnapshot = await getDocs(destination);
        const data= [];
        querySnapshot.forEach((doc)=>{
            data.push({ id: doc.id, ...doc.data() });
        })
        response = h.response({
            error: false,
            data :  data
        })
    } catch(error){
        console.error('Error get destination:', error);
        response = h.response({
            error: true,
            message: error.message
        });
    }
    return response
}

async function addFavorit(request, h) {
  const { destinationId, userId } = request.payload;

  let response;
  try {
          
    const destinationRef = doc(db, 'destination', destinationId);
    const destinationDoc = await getDoc(destinationRef);

    const favoritColRef = collection(db, 'Users', userId, 'Favorites');
    await setDoc(doc(favoritColRef, destinationId), destinationDoc.data());

    response = h.response({
      error: false,
      message: 'Adding to favorite',
    });
  } catch (error) {
    response = h.response({
      error: true,
      message: error.message,
    });
  }
  return response;
}

async function getFavorit(request, h) {
  const userId = request.params.userId;
  let response;
  try {
    const favoritColRef = collection(db, 'Users', userId, 'Favorites');
    const favorite = await getDocs(favoritColRef);
    const data = [];
    favorite.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    response = h.response({
      error: false,
      data: data,
    });
  } catch (error) {
    response = h.response({
      error: true,
      message: error.message,
    });
  }
  return response;
}

async function deleteFavorit(request, h) {
  const { destinationId, userId } = request.payload;

  let response;
  try {
    const favoritColRef = collection(db, 'Users', userId, 'Favorites');
    await deleteDoc(doc(favoritColRef, destinationId));
    response = h.response({
      error: true,
      message: 'Delete favorite',
    });
  } catch (error) {
    response = h.response({
      error: true,
      message: error.message,
    });
  }

  return response;
}

async function createItinerary(request, h) {
    const { name, destination, startDate, endDate, category, userId} = request.payload;
    // form validation
    if (!name || !destination || !startDate || !endDate || !category ) {
        return h.response({
            error: true,
            message: "All fields are required: name, destination, startDate, endDate, category"
        });
    }
    try {
        
        const itinerary = collection(db, 'Itinerary');

        const docRef = await addDoc(itinerary, {
            name: name,
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            userId: userId,
        });

        console.log('Document written with ID:', docRef.id);
    } catch (error) {
        console.error('Error adding itinerary:', error);
        return h.response({
            error: true,
            message: error.message
        });
    }

    return h.response({
        error: false,
        message: "Itinerary created"
    });
}

async function getItinerary(request, h) {
    const userId = request.params.userId;

    try {
        const itenary = collection(db, 'Itinerary');
        const q = query(itenary, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        return h.response({
            error: false,
            data: data
        });
    } catch (error) {
        console.error('Error getting itenary:', error);
        return h.response({
            error: true,
            message: error.message
        });
    }
}

async function getDestinationByCategory(request, h) {
    const { category } = request.params;
    let response;
    
    try {
        const destination = collection(db, 'destination');
        const q = query(destination, where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        response = h.response({
            error: false,
            data: data
        });
    } catch (error) {
        console.error('Error get destination:', error);
        response = h.response({
            error: true,
            message: error.message
        });
    }

    return response;
}

async function getAllCategory(request, h) {
    let response;
    
    try {
        const destination = collection(db, 'destination');
        const q = query(destination);
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        const category = [];
        data.forEach((doc) => {
            if (!category.includes(doc.category)) {
                category.push(doc.category);
            }
        });

        response = h.response({
            error: false,
            data: category
        });
    } catch (error) {
        console.error('Error get destination:', error);
        response = h.response({
            error: true,
            message: error.message
        });
    }

    return response;
}

async function search(request,h){
    const {keyword} = request.params;
    let response;

    try{
        if (keyword === ""){
            response = getDestinationHandler();
        } else{
            const destination = collection(db, 'destination');
            const querySnapshot = await getDocs(destination);
            let data= [];
            querySnapshot.forEach((doc)=>{
                let a = {};
                a = {...doc.data()}; 
                if(a.placeName.toLowerCase().includes(keyword)){
                    data.push({ id: doc.id, ...doc.data() });
                }
            });
            response = h.response({
                error: false,
                data :  data
            })
        }

    } catch (error) {
        response = h.response({
            error: true,
            message: error.message
        });
    }

    return response;
}

async function destinationML(request, h) {
    const { category = "Taman Hiburan", city = "Semarang" } = request.payload || {};
    let response;

    try {
        const destinationCollection = collection(db, 'destination');

        let q = query(destinationCollection, where('category', '==', category), where('city', '==', city));
        let querySnapshot2 = await getDocs(q);

        let destinations = [];
        querySnapshot2.forEach((doc) => {
            destinations.push({ id: doc.id, ...doc.data() });
        });

        if (destinations.length < 2) {
            q = query(destinationCollection, where('city', '==', city));
            querySnapshot2 = await getDocs(q);
            destinations = [];
            querySnapshot2.forEach((doc) => {
                destinations.push({ id: doc.id, ...doc.data() });
            });
        }

        if (destinations.length < 2) {
            q = query(destinationCollection, where('category', '==', category));
            querySnapshot2 = await getDocs(q);
            destinations = [];
            querySnapshot2.forEach((doc) => {
                destinations.push({ id: doc.id, ...doc.data() });
            });
        }

        const initialLocation = destinations[0].placeName;
        const initialLocation2 = destinations[1].placeName;
        const destination = collection(db, 'destination');
        const querySnapshot = await getDocs(destination);
        const id_to_place_name = {};
        const place_name_to_id = {};
        const place_id_to_city = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            id_to_place_name[data.placeId] = data.placeName;
            place_name_to_id[data.placeName] = data.placeId;
            place_id_to_city[data.placeId] = data.city;
        });

        const tourSequence = await generateTourSequence(initialLocation, initialLocation2, place_id_to_city, id_to_place_name, place_name_to_id);

        if (tourSequence.length > 0) {
            let results = [];
            console.log('tess', tourSequence);
            for (const name of tourSequence) {
                console.log(name);
                const destinationCollection = collection(db, 'destination');
                const q1 = query(destinationCollection, where('placeName', '==', name));
                const querySnapshot1 = await getDocs(q1);
                querySnapshot1.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() });
                });
            }
            response = h.response({
                error: false,
                data: results
            });
        } else {
            response = h.response({
                error: false,
                data: [],
            });
        }
    } catch (error) {
        console.error('Error get destination:', error);
        response = h.response({
            error: true,
            message: error.message
        });
    }
    return response;
}

module.exports = {
    RegisterHandler,
    LoginHandler,
    getDestinationHandler,
    addFavorit,
    getFavorit,
    deleteFavorit,
    createItinerary,
    getItinerary,
    getDestinationByCategory,
    getAllCategory,
    destinationML,
    search
};