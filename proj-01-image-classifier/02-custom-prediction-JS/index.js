let net;
const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();

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
    // read the image from the webcam and associate it with a specific class index
    const addExample = classId => {
        // Get the intermediate activation of MobileNet 'conv_preds' and pass that to knn classifier
        const activation = net.infer(webcamElement, 'conv_preds');

        // pass the intermediate activation to the classifer
        classifier.addExample(activation, classId);
    };

    document.getElementById('class-a').addEventListener('click', () => addExample(0));
    document.getElementById('class-b').addEventListener('click', () => addExample(1));
    document.getElementById('class-c').addEventListener('click', () => addExample(2));
    document.getElementById('class-d').addEventListener('click', () => addExample(3));

    while(true){
        if (classifier.getNumClasses () > 0) {
            // Get the activation from mobileNet from webcam
            const activation = net.infer(webcamElement, 'conv_preds');

            // Get the most likely classes and confidence from the knn classifer
            const result = await classifier.predictClass(activation);

            const classes = ['A', 'B', 'C', 'D']
            document.getElementById('prediction').innerText = `
                prediction: ${classes[result.classIndex]}\n
                probability: ${result.confidences[result.classIndex]}
            `;

        }
        // add wait for next frame to load
        await tf.nextFrame();
    }
}

app();