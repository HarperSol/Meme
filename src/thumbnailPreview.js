export function setupThumbnailPreviews(imageFilenames) {
    const buttons = document.querySelectorAll('.item');
  
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const imageName = imageFilenames[index];
        const img = button.querySelector('img');
        img.src = `/images/${imageName}`; // Assuming your images are in the public/images directory
      });
    });
  }