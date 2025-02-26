const video = document.getElementById("video");
const captureButton = document.getElementById("capture");
const countdownElement = document.getElementById("countdown");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const previewContainer = document.getElementById("preview-container");
const frameContainer = document.getElementById("frame-container");
const colorButtons = document.querySelectorAll(".color-option");
const patternButtons = document.querySelectorAll(".pattern-option");
const toggleDateCheckbox = document.getElementById("toggle-date");
const downloadImageButton = document.getElementById("download-image");
const downloadGifButton = document.getElementById("download-gif");

let stream;
let usingBackCamera = false;
let selectedFrame = "portrait";
let selectedColor = "#ffffff";
let selectedPattern = "";
let capturedFrames = [];

const gifMaker = new GIF({
    workers: 2,
    quality: 10,
    width: 400,
    height: 300
});

const shutterSound = new Audio("shutter.mp3");
const countdownSound = new Audio("countdown.mp3");

// Start camera
async function startCamera() {
    const constraints = {
        video: {
            facingMode: usingBackCamera ? "environment" : "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch (err) {
        console.error("Camera access error:", err);
        alert("Please allow camera access.");
    }
}

// Toggle between front and back cameras
function switchCamera() {
    usingBackCamera = !usingBackCamera;
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    startCamera();
}

// Start countdown before taking a picture
async function startCountdown() {
    countdownElement.style.display = "block";

    for (let i = 3; i > 0; i--) {
        countdownSound.play();
        countdownElement.innerText = i;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    countdownElement.style.display = "none";
    takePicture();
}

// Capture the image
function takePicture() {
    shutterSound.play();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");

    if (toggleDateCheckbox.checked) {
        addDateToImage(img);
    }

    capturedFrames.push(img);
    applyFrame(img);
    addFrameToGIF(canvas);

    if (capturedFrames.length === 4) {
        offerDownloadGIF();
    }
}

// Add date and time to the image
function addDateToImage(img) {
    const dateText = new Date().toLocaleString();
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);

    tempCtx.fillStyle = "white";
    tempCtx.font = "20px Arial";
    tempCtx.fillText(dateText, 10, tempCanvas.height - 10);

    img.src = tempCanvas.toDataURL("image/png");
}

// Add frame styling and color
function applyFrame(img) {
    frameContainer.style.background = selectedPattern || selectedColor;
    switch (selectedFrame) {
        case "portrait":
            frameContainer.style.width = "300px";
            frameContainer.style.height = "400px";
            break;
        case "photostrip4":
            frameContainer.style.width = "200px";
            frameContainer.style.height = "600px";
            break;
        case "photostrip3":
            frameContainer.style.width = "200px";
            frameContainer.style.height = "450px";
            break;
        case "vintage":
            frameContainer.style.filter = "grayscale(100%) contrast(1.2) brightness(0.9)";
            frameContainer.style.width = "250px";
            frameContainer.style.height = "600px";
            break;
    }

    previewContainer.innerHTML = "";
    previewContainer.appendChild(img);
}

// Set selected frame
function setFrame(type) {
    selectedFrame = type;
}

// Change frame color
colorButtons.forEach(button => {
    button.addEventListener("click", function () {
        selectedColor = this.dataset.color;
        frameContainer.style.background = selectedColor;
    });
});

// Change frame pattern
patternButtons.forEach(button => {
    button.addEventListener("click", function () {
        selectedPattern = url(${this.dataset.pattern});
        frameContainer.style.background = selectedPattern;
    });
});

// Add frame to GIF
function addFrameToGIF(canvas) {
    gifMaker.addFrame(canvas, {
        delay: 500,
        copy: true
    });
}

// Offer GIF download
function offerDownloadGIF() {
    gifMaker.on("finished", function (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "captured-frames.gif";
        link.click();
    });

    gifMaker.render();
}

// Download single image
downloadImageButton.addEventListener("click", () => {
    if (capturedFrames.length > 0) {
        const link = document.createElement("a");
        link.href = capturedFrames[capturedFrames.length - 1].src;
        link.download = "photo.png";
        link.click();
    }
});

// Initialize camera on load
window.onload = () => {
    startCamera();
};
