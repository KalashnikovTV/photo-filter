window.addEventListener('DOMContentLoaded', () => {
    const imageCurrent = document.querySelector('.image-current');
    const filterInputs = document.querySelectorAll('.filters input');
    
    // Add active class to the current button
    function activeBtns() {
        const btns = document.querySelectorAll(".btn-container .btn");
    
        btns.forEach(btn => btn.addEventListener('click', function() {
            const current = document.getElementsByClassName("btn-active");
            current[0].className = current[0].className.replace(" btn-active", "");
            this.className += " btn-active";
        }));
    }
    activeBtns();
    
    // Filters: blur, invert, sepia, saturate, hue
    function handleFilters() {
        const btnReset = document.querySelector('.btn-reset');
    
        function handleUpdate() {
            const suffix = this.dataset.sizing || '';
            imageCurrent.style.setProperty(`--${this.name}`, this.value + suffix);
        
            const outputs = this.nextElementSibling;
            outputs.innerHTML = this.value;
        }
        filterInputs.forEach(input => input.addEventListener('input', handleUpdate));
        
        function handleReset() {
            filterInputs.forEach(input => {
                input.name === 'saturate' ? input.value = 100 : input.value = 0;
                imageCurrent.style.setProperty(`--${input.name}`, input.value + (input.dataset.sizing || ''));
        
                const outputs = input.nextElementSibling;
                outputs.innerHTML = input.value;
            });
        }
        btnReset.addEventListener('click', handleReset);
    }
    handleFilters();
    
    // getPicture, nextPicture and prevPicture
    function getPicture() {
        const btnNextPicture = document.querySelector('.btn-next');
        const btnPrevPicture = document.querySelector('.btn-prev');
        const basePath = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
    
        function getPicturePath() {
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 12) {
                return basePath + 'morning/';
            } else if (hour >= 12 && hour < 18) {
                return basePath + 'day/';
            } else if (hour >= 18 && hour < 24) {
                return basePath + 'evening/';
            } else {
                return basePath + 'night/';
            }
        }
    
        const imagesList = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
        let slideIndex = 0;
        let isUsed = false;
    
        function nextPicture() {
            if (!isUsed) {
                const imageSrc = getPicturePath() + imagesList[slideIndex];
                imageCurrent.src = imageSrc;
                isUsed = true;
            } else {
                if (slideIndex == imagesList.length - 1) {
                    slideIndex = 0;
                } else {
                    slideIndex++;
                }
                const imageSrc = getPicturePath() + imagesList[slideIndex];
                imageCurrent.src = imageSrc;
            }

            btnNextPicture.disabled = true;
            setTimeout(function() {
                btnNextPicture.disabled = false;
            }, 100);
        }
        btnNextPicture.addEventListener('click', nextPicture);

        function prevPicture() {
            if (slideIndex == 0) {
                slideIndex = imagesList.length - 1;
            } else {
                slideIndex--;
            }
            const imageSrc = getPicturePath() + imagesList[slideIndex];
            imageCurrent.src = imageSrc;
            
            btnPrevPicture.disabled = true;
            setTimeout(function() {
                btnPrevPicture.disabled = false;
            }, 100);
        }
        btnPrevPicture.addEventListener('click', prevPicture);
    }
    getPicture();
    
    // Load picture
    function loadPicture() {
        const fileInput = document.querySelector('input[type="file"]');
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                imageCurrent.src = reader.result;
            }
            reader.readAsDataURL(file);
            fileInput.value = null;
        });
    }
    loadPicture();
    
    // Draw and save picture with Canvas API
    function drawPicture() {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext("2d");
    
        function createCanvas(img) {
            let filters = '';
    
            canvas.width = img.width;
            canvas.height = img.height;
    
            filterInputs.forEach(input => {
                if (input.name === 'blur') {
                    const sizeScalling = input.value * (img.height / imageCurrent.height);
                    filters += `${input.name}(${sizeScalling}${input.dataset.sizing})`;
                } else {
                    filters += `${input.name}(${input.value}${input.dataset.sizing})`;
                }
            });
    
            // console.log(`Filters: ${filters}`);
            ctx.filter = filters.trim();
            ctx.drawImage(img, 0, 0);
        }
    
        function savePicture() {
            const btnSavePicture = document.querySelector('.btn-save');
    
            btnSavePicture.addEventListener('click', () => {
                const img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = imageCurrent.src; 
                img.onload = () => {
                    createCanvas(img);
                    let link = document.createElement('a');
                    link.download = 'picture.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    link.delete;
                };
            });
        }
        savePicture();
    }
    drawPicture();
    
    // Fullscreen mode
    function fullscreen() {
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
    }
    fullscreen();
});
