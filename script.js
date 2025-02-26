document.addEventListener('DOMContentLoaded', () => {
    const frameButtons = document.querySelectorAll('.frame-option button');
    const colorCircles = document.querySelectorAll('.color-circle');
    const patternFrames = document.querySelectorAll('.pattern-frame');
    const captureButton = document.getElementById('capture-button');
    const downloadImageButton = document.getElementById('download-image');
    const downloadGifButton = document.getElementById('download-gif');
    const dateTimeCheckbox = document.getElementById('add-datetime');
    const countdownDisplay = document.getElementById('countdown');
    const shutterSound = new Audio('shutter.mp3'); // Add your shutter sound file
    const countdownSound = new Audio('countdown.mp3'); // Add your countdown sound file
    let selectedFrame = '';
    let selectedColor = '';
    let selectedPattern = '';
    
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
                    console.log('Capturing image with frame:', selectedFrame, 'Color:', selectedColor, 'Pattern:', selectedPattern);
                    // Capture logic here
                }
            }, 1000);
        });
    }

    // Download image
    if (downloadImageButton) {
        downloadImageButton.addEventListener('click', () => {
            console.log('Downloading image');
            // Image download logic here
        });
    }

    // Download GIF
    if (downloadGifButton) {
        downloadGifButton.addEventListener('click', () => {
            console.log('Downloading GIF');
            // GIF download logic here
        });
    }

    // DateTime toggle
    if (dateTimeCheckbox) {
        dateTimeCheckbox.addEventListener('change', () => {
            console.log('Date and Time toggle:', dateTimeCheckbox.checked);
        });
    }
});