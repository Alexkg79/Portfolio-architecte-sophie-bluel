document.addEventListener("DOMContentLoaded", function () {
  const btnUpdateGallery = document.getElementById("updateGallery");
  const btnAjouterPhoto = document.getElementById("btnAjouterPhoto");
  const btnValiderAjout = document.getElementById("btnValiderAjout");

  const modal = document.getElementById("modalUpdate");
  const modalAjout = document.getElementById("modalAjout");

  const closeModalBtnModifier = document.querySelector(".closeModifier");
  const closeModalBtnAjout = document.querySelector(".closeAjout");
  const returnModal = document.querySelector(".return");

  //ouvre la modal
  btnUpdateGallery.addEventListener("click", function () {
    modal.style.display = "block";
    const galleryModal = document.getElementById("galleryModal");
    // Efface le contenu avant d'ajouter de nouvelles images
    galleryModal.innerHTML = "";
    // Charge les photos de la galerie dans le modal
    updateGalleryInModal(galleryModal);

    btnAjouterPhoto.addEventListener("click", function () {
        //ouvre la modal d'ajout de photo
      modalAjout.style.display = "block";
      modal.style.display = "none";
      btnValiderAjout.addEventListener("click", function () {
      });
    });
  });

  // ferme les modal
  closeModalBtnModifier.addEventListener("click", function () {
    modal.style.display = "none";
  });
  closeModalBtnAjout.addEventListener("click", function () {
    modalAjout.style.display = "none";
  });

  // Ferme les modal clique en dehors
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
    if (event.target === modalAjout) {
      modalAjout.style.display = "none";
    }
  });

//Btn retour
returnModal.addEventListener("click", function () {
    // Cacher la modal actuelle
    modalAjout.style.display = "none";
    // Afficher la modal précédente
    modal.style.display = "block";
  });


// Fonction pour charger les photos de la galerie dans le modal
  function updateGalleryInModal(galleryContainer) {
    const apiUrl = "http://localhost:5678/api/works";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          console.log(item);
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
          //Récuperation id pour chaque element
          iconElement.dataset.id = item.id;
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

  // Recuperation du cookie pour authToken pour suppression
  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
  
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
  
    return "";
  }
  
  // Fonction pour supprimer dans la gallery

  galleryModal.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      // Récupérer l'identifiant unique de l'image 
      const imageId = event.target.dataset.id;
      // AuthTopken pour suppresion par rapport au droit.
      const authToken = getCookie("authToken");
      // Effectue une demande DELETE à l'API
      fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'image");
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          const figureElement = document.querySelector(`[data-id="${imageId}"]`);
          if (figureElement) {
            figureElement.remove();
          }
        })
        .catch(error => console.error("Erreur lors de la suppression de l'image:", error));
    }
  });

});
