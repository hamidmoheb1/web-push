const PUSH_SEEN = 29;
const PUSH_DISMISSED = 27;
const PUSH_RECEIVED = 25;

function fnBrowserDetect() {

    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "1_ch";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "_fi";
    } else if (userAgent.match(/safari/i)) {
        browserName = "_sa";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "_op";
    } else if (userAgent.match(/edg/i)) {
        browserName = "_ed";
    } else {
        browserName = "_no";
    }

    return browserName;
}

const CreateHash = async () => {
    const fpPromise = import('http://openfpcdn.io/fingerprintjs/v3')
        .then(FingerprintJS => FingerprintJS.load())

    let res = "";
    await fpPromise
        .then(fp => fp.get())
        .then(result => {
            const visitorId = result.visitorId
            res = visitorId;
        })
    return res + fnBrowserDetect();
}

const registerDevice = (config) => {
    var url = "http://sandbox.pod.ir/srv/notif-sandbox/push/device/subscribe";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(config));
}


const sendStatus = (config) => {
    console.log("status sent:" + config.status);
    var url = "http://sandbox.pod.ir/srv/notif-sandbox/push/device/status";

    let data = {
        status: config.status,
        messageId: config.messageId,
        registrationToken: config.registrationToken
    }

    fetch(url, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

}

const configFireBase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCd77oDdFact3bgoyixxfQTa8wWiJxMrVY",
        authDomain: "podnotification-88758.firebaseapp.com",
        databaseURL: "https://podnotification-88758-default-rtdb.firebaseio.com",
        projectId: "podnotification-88758",
        storageBucket: "podnotification-88758.appspot.com",
        messagingSenderId: "309762851928",
        appId: "1:309762851928:web:3bfb65cb74e353b553362d",
        measurementId: "G-D325BCEYEB"
    };
    firebase.initializeApp(firebaseConfig);
    return firebase.messaging();
}

const listen = async (token) => {
    // queryParamInUrl();
    let messaging = configFireBase();
    messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        // Update the UI to include the received message.
        sendStatus({
            status: PUSH_RECEIVED,
            messageId: payload.data.messageId,
            registrationToken: token,
            data: [],
        });
        const notification = new Notification(payload.data.title + "  front", {
            body: payload.data.body,
            icon: payload.data.icon,
            image: payload.data.image,
            dir: payload.data.dir,
            requireInteraction: payload.data.requireInteraction == "true" ? true : false
        });
        notification.addEventListener('click', () => {

            sendStatus({
                status: PUSH_SEEN,
                messageId: payload.data.messageId,
                registrationToken: token,
                data: [],

            });
            if (payload.data.link)
                window.open(payload.data.link);
        });
        notification.addEventListener('close', (e) => {
            sendStatus({
                status: PUSH_DISMISSED,
                messageId: payload.data.messageId,
                registrationToken: token,
                data: [],

            });
        });


    });

}

const subscribe = async () => {

    console.log("subscribe function ")
    let messaging = configFireBase();

    let token = ""
    return await messaging
        .getToken({
            vapidKey: "BKKqFoBjWi-Bg7pQF7y4W0kFQ-BB62o6Oo_ANzB8Lk8S1q_LH9U5V7DDSR4pRVeV84PQKllSw-WrP4f1G-F8tVE"
        })
        .then((currentToken) => {
            sendTokenToServer(currentToken);
            if (currentToken) {
                console.log("currentToken", currentToken);
                return currentToken;
            } else {
                console.log(
                    "No registration token available. Request permission to generate one."
                );
            }
        })
        .catch((err) => {
            console.log(err);
        });

}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        console.log("Sending token to server...");
    } else {
        console.log(
            "Token already sent to server so won't send it again " +
            "unless it changes"
        );
    }
}

function isTokenSentToServer() {
    return window.localStorage.getItem("sentToServer") === "1";
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}

async function requestPermission() {
    let state = false;
    await Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            state = true
        } else {
            console.log("Unable to get permission to notify.");
            state = false;
        }
    });
    return state;
}

async function deleteToken(currentToken) {
    // Delete registration token.
    let messaging = configFireBase();
    let t = await messaging
        .getToken()
        .then((currentToken) => {
            messaging
                .deleteToken(currentToken)
                .then(() => {
                    console.log("Token deleted.");
                    return;
                })
                .catch((err) => {
                    console.log("Unable to delete token. ", err);
                });
        })
        .catch((err) => {
            console.log(
                "Error retrieving registration token. ",
                err
            );
        });
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


// require("./firebase-messaging-compat")
// require("./notif-sdk.js")
let token;

const init = async function() {
    let permission = requestPermission();

    let hash = await CreateHash();
    let subscribeBefore = localStorage.getItem('subscribe');

    if (permission) {
        token = await subscribe();
        // deleteToken(token);
        if (token && hash && subscribeBefore == null) {

            let config = {
                isSubscriptionRequest: 'true',
                registrationToken: token,
                appId: '463a2f03-f078-43b1-9853-e9431e69f7e3',
                platform: 'WEB',
                deviceId: hash,
                ssoId: 78153,
                data: [],
            };
            registerDevice(config);
            localStorage.setItem('subscribe', 'yes');
            getToken(token);
        }
        listen(token);
    }
};

init();
