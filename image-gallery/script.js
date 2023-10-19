document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const imageWrapper = document.getElementById('imageWrapper');

    // Initialize Swiper for the gallery
    const gallerySwiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    // Event listener for image upload form
    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(() => loadImages());
    });

    // Function to load images from the server
    function loadImages() {
        fetch('/images')
            .then(response => response.json())
            .then(images => {
                // Clear existing images
                imageWrapper.innerHTML = '';

                // Add new images to the gallery
                images.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = `uploads/${image.filename}`;
                    imgElement.alt = 'Gallery Image';
                    imageWrapper.appendChild(imgElement);
                });

                // Update Swiper to reflect changes
                gallerySwiper.update();
            });
    }

    // Load initial images on page load
    loadImages();
});
