# POD Notification / Web Push
## _Web Push Notification Package_

## Installation

Install via npm :
```sh
npm i @pod-notification/web-push
```
Then , import this file and send config:
```
<script src="node_modules/@pod-notification/web-push/index.js" type="text/javascript"></script>
<script type="text/javascript">
    init( config = {
        appId: 'your app id',
        ssoId: ssoId,
        apiToken: string,
        data: [],
        isSubscriptionRequest: boolean,
        isProduction: boolean,
        onGetData: (data) => {
            console.log("get notification message data :", data)
        }
    })
</script>
```
**Important** Please move firebase-messaging-sw.js to your root of project
