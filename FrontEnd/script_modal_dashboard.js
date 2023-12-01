document.addEventListener("DOMContentLoaded", function () {
  const btnModifier = document.getElementById("updateGallery");
  const modal = document.getElementById("modalUpdate");
  const closeModalBtn = document.querySelector(".close");

  //ouvre le modal
  btnModifier.addEventListener("click", function () {
    modal.style.display = "block";
    const galleryModal = document.getElementById("galleryModal");
    // Efface le contenu avant d'ajouter de nouvelles images
    galleryModal.innerHTML = "";
    // Charge les photos de la galerie dans le modal
    updateGalleryInModal(galleryModal);

    const btnAjouterPhoto = document.getElementById("btnAjouterPhoto");
    btnAjouterPhoto.addEventListener("click", function () {});
  });

  // ferme le modal
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Ferme le modal clique en dehors
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Fonction pour charger les photos de la galerie dans le modal
  function updateGalleryInModal(galleryContainer) {
    const apiUrl = "http://localhost:5678/api/works";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          //<figure>
          const figureElement = document.createElement("figure");
          //<img>
          const imageElement = document.createElement("img");
          imageElement.src = item.imageUrl;
          imageElement.alt = item.title;
          //<img> dans <figure>
          figureElement.appendChild(imageElement);

          galleryContainer.appendChild(figureElement);
        });
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des photos:", error)
      );
  }
});
