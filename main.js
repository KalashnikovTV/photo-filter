
// Add active class to the current button
const header = document.querySelector(".btn-container");
const btns = header.querySelectorAll(".btn");

btns.forEach(btn => btn.addEventListener('click', function() {
    const current = document.getElementsByClassName("btn-active");
    current[0].className = current[0].className.replace(" btn-active", "");
    this.className += " btn-active";
}));

// Filters: blur, invert, sepia, saturate, hue
const inputs = document.querySelectorAll('.filters input');
const btnReset = document.querySelector('.btn-reset');

function handleUpdate() {
    const suffix = this.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);

    const outputs = this.nextElementSibling;
    outputs.innerHTML = this.value;
}
inputs.forEach(input => input.addEventListener('input', handleUpdate));

function handleReset() {
    inputs.forEach(input => {
        input.name === 'saturate' ? input.value = 100 : input.value = 0;
        document.documentElement.style.setProperty(`--${input.name}`, input.value + (input.dataset.sizing || ''));

        const outputs = input.nextElementSibling;
        outputs.innerHTML = input.value;
    });
}
btnReset.addEventListener('click', handleReset);

// Next picture
const hour = new Date().getHours();
const imageCurrent = document.querySelector('.image-current');
const btnNextPicture = document.querySelector('.btn-next');
let basePath = 'assets/images/';

function nextPicture() {
    if (hour >= 6 && hour < 12) {
        basePath = 'assets/images/morning/';
    } else if (hour >= 12 && hour < 18) {
        basePath = 'assets/images/day/';
    } else if (hour >= 18 && hour < 24) {
        basePath = 'assets/images/evening/';
    } else {
        basePath = 'assets/images/night/';
    }
}
console.log(hour);  // проверить и потом удалить

const imagesList = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;

function getImage() {
    nextPicture();
    const index = i % imagesList.length;
    const imageSrc = basePath + imagesList[index];
    imageCurrent.src = imageSrc;
    i++;
    // Delay
    /* btnNextImage.disabled = true;
    setTimeout(function () {
        btnNextImage.disabled = false
    }, 250); */
}
btnNextPicture.addEventListener('click', getImage);

// Load picture
const fileInput = document.querySelector('input[type="file"]');
/* const imageContainer = document.querySelector('.image-current'); */

fileInput.addEventListener('change', function(e) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        /* const img = new Image(); */
        /* img.src = reader.result; */
        /* imageContainer.innerHTML = ""; */
        imageCurrent.src = reader.result
    }
    reader.readAsDataURL(file);
    // clear input for reload picture(the same)
    fileInput.value = null;
});

// Fullscreen mode
document.querySelector('.fullscreen').addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            btnOffFullScreen();
        }
    }
}

const btnOffFullScreen = () => {
    document.addEventListener("keypress", (e) => {
        if (e.key === "Escape") {
            toggleFullScreen();
        }
    }, false);
};