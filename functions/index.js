const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    // functions.logger.info("Hello logs!", { structuredData: true });
    return response.status(200).json({
        data: "helloWorld"
    })
});

exports.getListOfUser = functions.https.onRequest((request, response) => {
    // functions.logger.info("getListOfUser logs!", { request });
    let temp = [
        {
            title: "A",
            post: "Engineer"
        },
        {
            title: "B",
            post: "Doctor"
        },
    ]
    return response.status(200).json({
        data: temp
    })
});

exports.createUser = functions.https.onCall(async (request, response) => {
    // functions.logger.info("createUser logs!", { request });
    const { email, password } = request;
    functions.logger.info("createUser logs!", { email, password });
    try {
        const { uid, } = await admin.auth().createUser({
            password,
            email
        })
        await admin.firestore().collection("Users").doc(uid).set({
            user_id: uid,
            email: email,
        })
        // try {
        //     console.log("Going to check trigger");
        //     let path = `/Users/${uid}`;
        //     console.log("Path-0------>", path);
        //     functions.firestore.document(path).onCreate((snap, context) => {
        //         console.log("Snap-->", snap.data());
        //     })
        // } catch (error) {
        //     console.log("Snap-error->", error);

        // }
        return {
            uid,
            message: "Sucess"
        }


    } catch (error) {
        console.log("Error createUser----->", error);
    }

})

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('This will be run every 1 minutes!');
    return null;
});