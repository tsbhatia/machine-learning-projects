let net;

async function app() {
    console.log('Loading mobilenet...');
    // load the model
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    // Use this model to predict our image.
    const imgEl = document.getElementById('img');
    const result = await net.classify(imgEl);
    console.log(result);

}

app();