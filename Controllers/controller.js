const bcrypt = require("bcrypt");
const { db, auth } = require("../Config/firebaseConfig");
const { collection, getDocs, addDoc, query, where ,doc, getDoc, setDoc, deleteDoc} = require("@firebase/firestore/lite");
const jwt = require("jsonwebtoken");

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

async function addFavorit(request , h){
    const { userId, destinationId } = request.payload;
    let response;
    try {
        const destinationRef = doc(db,'destination',destinationId);
        const destinationDoc = await getDoc(destinationRef);
        console.log(destinationDoc.data());

        const favoritColRef = collection(db,'Users',userId, 'Favorites');
        await setDoc(doc(favoritColRef, destinationId), destinationDoc.data());

        response = h.response({
            error: false,
            message: "Adding to favorite"
        });
    } catch (error) {
        response = h.response({
            error: true,
            message: error.message
        });
    }
    return response;
}

async function getFavorit(request,h){
    const  userId = request.params.userId;
    let response;
    try {
        const favoritColRef = collection(db,'Users',userId, 'Favorites');
        const favorite = await getDocs(favoritColRef);
        const data= [];
        favorite.forEach((doc)=>{
            data.push({ id: doc.id, ...doc.data() });
        })

        response = h.response({
            error: false,
            data: data
        });
    } catch (error) {
        response = h.response({
            error: true,
            message: error.message
        });
    }
    return response;
}

async function deleteFavorit(request,h){
    const { userId, destinationId } = request.payload;
    let response;
    try{
        console.log('1');
        const favoritColRef = collection(db, 'Users', userId, 'Favorites');
        console.log('a');
        await deleteDoc(doc(favoritColRef, destinationId));
        console.log('2');
        response = h.response({
            error: true,
            message: "Delete favorite"
        });
    } catch (error){
        response = h.response({
            error: true,
            message: error.message
        });
    }

    return response;
}

async function createItinenary(request, h) {
    const { name, destination, startDate, endDate } = request.payload;

    // form validation
    if (!name || !destination || !startDate || !endDate) {
        return h.response({
            error: true,
            message: "All fields are required: name, destination, startDate, endDate"
        });
    }

    // check token from header
    const token = request.headers.authorization;

    if (!token) {
        return h.response({
            error: true,
            message: "Token not found"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return h.response({
                error: true,
                message: "Token not valid"
            });
        }

        const itenary = collection(db, 'Itinenary');

        const docRef = await addDoc(itenary, {
            name: name,
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            userId: decoded.userId
        });

        console.log('Document written with ID:', docRef.id);

    } catch (error) {
        console.error('Error adding itenary:', error);
        return h.response({
            error: true,
            message: "Token not valid"
        });
    }

    return h.response({
        error: false,
        message: "Itinenary created"
    });
}

async function getItinenary(request, h) {
    const token = request.headers.authorization;

    if (!token) {
        return h.response({
            error: true,
            message: "Token not found"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return h.response({
                error: true,
                message: "Token not valid"
            });
        }

        const itenary = collection(db, 'Itinenary');
        const q = query(itenary, where("userId", "==", decoded.userId));
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
            message: "Token not valid"
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

module.exports = {
    RegisterHandler,
    LoginHandler,
    getDestinationHandler,
    addFavorit,
    getFavorit,
    deleteFavorit,
    createItinenary,
    getItinenary,
    getDestinationByCategory,
    getAllCategory
};