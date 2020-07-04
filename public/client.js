
const publicVapidKey = "BD2F54DB8SenEQlKzeyJ0pQYKSXiT_8wT1LGMbFs4w4ZqPnys8bpN8KoSk2Tt6Nj7TRfQPpfQxssmh0h68CIjdc"

// check for service woker
// if ('serviceWorker' in navigator) {

//     handingData()
//     // Lấy giá trị 
//     var xd = document.getElementById('xd');
//     console.log(xd.value)

//     //Xét điều kiện xem có thay đổi hay không để gửi thông báo
//     if (xd.value == 1) {
//         // hàm dùng để gửi thông báo
//         var date = new Date();
//         send().catch(err => console.log(err))

//     } else {
//         console.log('Không thông báo')
//     }
// }


let handingData = async () => {

    if ('serviceWorker' in navigator) {

        var socket = io.connect();
        let url = 'http://localhost:3000/data'
        let arrData = await fetch(url)
        .then(data => data.json())
        .then( data => data)
        .catch(err => console.log(err))
    
        // if(arrData.length > 0){
        //     var xd = document.getElementById('xd');
        //     xd.value = "1"
        // }
        // console.log(arrData)
    

        // Lấy giá trị 
        var xd = document.getElementById('xd');
        console.log(xd.value)
    
        //Xét điều kiện xem có thay đổi hay không để gửi thông báo
        if (xd.value == 1) {
            // hàm dùng để gửi thông báo
            var date = new Date();
            send().catch(err => console.log(err))
    
        } else {
            console.log('Không thông báo')
        }
    }
    
}



async function send() {



    const register = await navigator.serviceWorker.register('/public/worker.js'); // đường dẫn tới file worker.js
    

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        text: 'TESTING'
    });

    // Thay đổi phần link này thì sẽ thay đổi luôn phần gửi
    
    var data = { test: 'Test notification',subscription:subscription}
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',

        }
    })

}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}