let net;
const webcamElement = document.getElementById('webcam');

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigaorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia ||
            navigatorAny.mozGetUserMedia ||
            navigaorAny.mozGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener('loadeddata',  () => resolve(), false);
                },
                error => reject());
        } else {
            reject();
        }
    });
}

async function app() {
    console.log('Loading mobilenet...');
    // load the model
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    await setupWebcam();
    while(true){
        const result = await net.classify(webcamElement);
        document.getElementById('prediction').innerText = `
            prediction: ${result[0].className}\n
            probability: ${result[0].probability}
        `;
        // add wait for next frame to load
        await tf.nextFrame();
    }
}

app();