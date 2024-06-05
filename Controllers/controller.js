const bcrypt = require("bcrypt");
const { firestore , auth} = require("firebase-admin");

async function RegisterHandler(request, h) {
    const { name, email, password } = request.payload;
    let response;
    console.log
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(firestore);
        const newUser = await firestore.collection("Users").where('email',"==",email).get();
        console.log("sebelum add collection");
        console.log
        await firestore.collection('Users').add({
            name: name,
            email: email,
            password: hashedPassword  
        });
        response = h.response({
            error: false,
            message: "User Created"
        });
            
    } catch (error) {
        console.error('Error registering user:', error);
        response = h.response({
            error: true,
            message: "Email Already In Use",
        });
    }

    return response;
}

async function LoginHandler(request, h) {
    const { email, password } = request.payload;
    let response;

    try {
        const userSnapshot = await firestore.collection('Users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (!passwordMatch) {
                response = h.response({
                    error: true,
                    message: "Check Your Password"
                });
            } else {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                const token = await user.getIdToken();
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
    console.log(firestore);
    console.log("----------");
    console.log(auth);
    let response = h.response({
        data: firestore,
        data2: auth
    })
    return response
}

module.exports = {
    RegisterHandler,
    LoginHandler,
    tesHandler
};

