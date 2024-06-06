const bcrypt = require("bcrypt");
const { db, auth } = require("../Config/firebaseConfig");
const { collection, getDocs, addDoc, query, where } = require("@firebase/firestore/lite");
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
                        email: userData.email
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                response = h.response({
                    error: false,
                    message: "Success",
                    loginResult: {
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

async function tesHandler(request,h){
    const { email, password } = request.payload;
    let response = h.response({
        email: email,
        data: firestore 
    })
    return response
}

module.exports = {
    RegisterHandler,
    LoginHandler,
    tesHandler
};
