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
          //<icon pour suppression>
          const iconElement = document.createElement("img");
          iconElement.src = "./icons/poubelle.png";
          iconElement.alt = "delete";
          iconElement.classList = "delete";
          console.log(iconElement);
          //<img> dans <figure>
          figureElement.appendChild(imageElement);
          //<i> dans <figure>
          figureElement.appendChild(iconElement);

          galleryContainer.appendChild(figureElement);
        });
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des photos:", error)
      );
  }

  // Sélectionne toutes les icônes de poubelle dans la galerie
  const allIcons = document.querySelectorAll("img");

  // Ajout d'un écouteur d'événement à chaque icône de poubelle
  allIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      // Récupérer l'élément figure parent correspondant à l'icône
      const figureElement = icon.closest("figure");

      // Appele la fonction de suppression
      deleteGalleryItem(figureElement);
    });
  });

  // Fonction pour supprimer un élément de la galerie
  function deleteGalleryItem(figureElement) {
    // Supprimezl'élément du DOM
    figureElement.remove();

    // TODO: Ajout de la logique pour supprimer l'élément correspondant dans la base de données/API
  }
});
