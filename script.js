document.addEventListener('DOMContentLoaded', () => {
    const frameButtons = document.querySelectorAll('.frame-option button');
    const colorCircles = document.querySelectorAll('.color-circle');
    const patternFrames = document.querySelectorAll('.pattern-frame');
    const captureButton = document.getElementById('capture-button');
    const downloadImageButton = document.getElementById('download-image');
    const downloadGifButton = document.getElementById('download-gif');
    const dateTimeCheckbox = document.getElementById('add-datetime');
    const countdownDisplay = document.getElementById('countdown');
    const previewContainer = document.getElementById('preview-container');
    const video = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    const shutterSound = new Audio('shutter.mp3'); // Add your shutter sound file
    const countdownSound = new Audio('countdown.mp3'); // Add your countdown sound file
    let selectedFrame = '';
    let selectedColor = '';
    let selectedPattern = '';

    // Access the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
    
    // Frame selection
    frameButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedFrame = button.dataset.frame;
            console.log('Selected frame:', selectedFrame);
        });
    });

    // Color selection
    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            selectedColor = circle.style.backgroundColor;
            console.log('Selected color:', selectedColor);
        });
    });

    // Pattern selection
    patternFrames.forEach(pattern => {
        pattern.addEventListener('click', () => {
            selectedPattern = pattern.src;
            console.log('Selected pattern:', selectedPattern);
        });
    });

    // Capture image with countdown
    if (captureButton) {
        captureButton.addEventListener('click', () => {
            let countdown = 3; // Set countdown time
            countdownDisplay.innerText = countdown;
            countdownDisplay.style.display = 'block';
            
            const countdownInterval = setInterval(() => {
                countdownSound.play(); // Play countdown sound
                countdown--;
                countdownDisplay.innerText = countdown;
                
                if (countdown === 0) {
                    clearInterval(countdownInterval);
                    countdownDisplay.style.display = 'none';
                    shutterSound.play(); // Play shutter sound
                    captureImage();
                }
            }, 1000);
        });
    }

    function captureImage() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.classList.add('captured-image');
        previewContainer.prepend(img);
    }

    // Download image
    if (downloadImageButton) {
        downloadImageButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'captured-image.png';
            link.click();
        });
    }

    // Download GIF (Placeholder logic for now)
    if (downloadGifButton) {
        downloadGifButton.addEventListener('click', () => {
            alert('GIF download functionality to be implemented.');
        });
    }

    // DateTime toggle
    if (dateTimeCheckbox) {
        dateTimeCheckbox.addEventListener('change', () => {
            console.log('Date and Time toggle:', dateTimeCheckbox.checked);
        });
    }
});
