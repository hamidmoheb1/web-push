importScripts(
    "https://www.gstatic.com/firebasejs/9.6.3/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.6.3/firebase-messaging-compat.js"
);

let token;

//
// const storageGet = async () => {
// 	// include your worker
// 	var myWorker = new Worker('firebase-messaging-sw.js'),
// 		data,
// 		changeData = function() {
// 			// save data to local storage
// 			localStorage.setItem('data', (new Date).getTime().toString());
// 			// get data from local storage
// 			data = localStorage.getItem('data');
// 			sendToWorker();
// 		},
// 		sendToWorker = function() {
// 			// send data to your worker
// 			myWorker.postMessage({
// 				data: data
// 			});
// 		};
// 	setInterval(changeData, 1000)
// }


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
//
// const CreateHash = async () => {
// 	const fpPromise = import('http://openfpcdn.io/fingerprintjs/v3')
// 		.then(FingerprintJS => FingerprintJS.load())
//
// 	let res = "";
// 	await fpPromise
// 		.then(fp => fp.get())
// 		.then(result => {
// 			const visitorId = result.visitorId
// 			res = visitorId;
// 		})
// 	return res + fnBrowserDetect();
// }

// const registerDevice = (config) => {
//     var url = "http://sandbox.pod.ir/srv/notif-sandbox/push/device/subscribe";
//
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url);
//
//     xhr.setRequestHeader("Accept", "application/json");
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             console.log(xhr.status);
//             console.log(xhr.responseText);
//         }
//     };
//     xhr.send(JSON.stringify(config));
// }

async function subscribe () {

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
//
firebase.initializeApp({
    apiKey: "AIzaSyCqNkPWfTu2Apvhc5C4z0l3IGWpd5aP4IA",
    authDomain: "prodnotification-eba19.firebaseapp.com",
    databaseURL: "https://prodnotification-eba19-default-rtdb.firebaseio.com",
    projectId: "prodnotification-eba19",
    storageBucket: "prodnotification-eba19.appspot.com",
    messagingSenderId: "923291418261",
    appId: "1:923291418261:web:4fe138fc0ded175199659c",
    measurementId: "G-L8MSQXRRDE"
});

const configFireBase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCqNkPWfTu2Apvhc5C4z0l3IGWpd5aP4IA",
        authDomain: "prodnotification-eba19.firebaseapp.com",
        databaseURL: "https://prodnotification-eba19-default-rtdb.firebaseio.com",
        projectId: "prodnotification-eba19",
        storageBucket: "prodnotification-eba19.appspot.com",
        messagingSenderId: "923291418261",
        appId: "1:923291418261:web:4fe138fc0ded175199659c",
        measurementId: "G-L8MSQXRRDE"
    };

    firebase.initializeApp(firebaseConfig);
    return firebase.messaging();
}

const PUSH_SEEN = 29;
const PUSH_DISMISSED = 27;
const PUSH_RECEIVED = 25;

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    init();
    self.registration.showNotification(payload.data.title, {
        body: payload.data.body,
        icon: payload.data.icon,
        image: payload.data.image,
        dir: payload.data.dir,
        requireInteraction: payload.data.requireInteraction == "true" ? true : false,
        actions: [{
            action: 'close',
            title: 'بستن'
        }],
    });
    fetch('http://sandbox.pod.ir/srv/notif-sandbox/push/device/status', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: PUSH_RECEIVED,
            messageId: payload.data.messageId,
            registrationToken: token,
            data: [],
        }),
    })

    self.addEventListener('notificationclick', async function (event) {
        const clickedNotification = event.notification
        clickedNotification.close()

        const promiseChain = clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((windowClients) => {
            if (event.action === "close") {
                fetch('http://sandbox.pod.ir/srv/notif-sandbox/push/device/status', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: PUSH_DISMISSED,
                        messageId: payload.data.messageId,
                        registrationToken: token,
                        data: [],
                    }),
                })
            } else {
                fetch('http://sandbox.pod.ir/srv/notif-sandbox/push/device/status', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: PUSH_SEEN,
                        messageId: payload.data.messageId,
                        registrationToken: token,
                        data: [],
                    }),
                })
            }

            if (payload.data.link) {
                return clients.openWindow(new URL(payload.data.link).href)

            } else {
                return clients.openWindow(new URL(self.location.origin).href)
            }
        })
        event.waitUntil(promiseChain)
    });

    // self.addEventListener('notificationclose', function (event) {
    // 	fetch('http://sandbox.pod.ir/srv/notif-sandbox/push/device/status', {
    // 		method: 'POST',
    // 		headers: {
    // 			Accept: 'application/json',
    // 			'Content-Type': 'application/json',
    // 		},
    // 		body: JSON.stringify({
    // 			status: PUSH_DISMISSED,
    // 			messageId: payload.data.messageId,
    // 			registrationToken: payload.data.token,
    // 			data: [],
    // 		}),
    // 	})
    // });

});