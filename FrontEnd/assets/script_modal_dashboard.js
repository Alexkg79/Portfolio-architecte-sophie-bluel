document.addEventListener("DOMContentLoaded", function () {
  const btnUpdateGallery = document.getElementById("updateGallery");
  const btnAjouterPhoto = document.getElementById("btnAjouterPhoto");
  const btnValiderAjout = document.getElementById("btnValiderAjout");
  
  const modal = document.getElementById("modalUpdate");
  const modalAjout = document.getElementById("modalAjout");
  
  const closeModalBtnModifier = document.querySelector(".closeModifier");
  const closeModalBtnAjout = document.querySelector(".closeAjout");
  const returnModal = document.querySelector(".return");

  // Recuperation du cookie pour authToken
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
  
  //ouvre la modal
  btnUpdateGallery.addEventListener("click", function () {
    modal.style.display = "block";
    const galleryModal = document.getElementById("galleryModal");
    // Efface le contenu avant d'ajouter de nouvelles images
    galleryModal.innerHTML = "";
    // Charge les photos de la galerie dans le modal
    updateGalleryInModal(galleryModal);
    //ouvre la modal d'ajout de photo
    btnAjouterPhoto.addEventListener("click", function () {
      modalAjout.style.display = "block";
      modal.style.display = "none";

      btnValiderAjout.addEventListener("click", function () {
          // Récupére les valeurs des champs du formulaire
          const title = document.getElementById("titleAjout").value;
          // le *1 pour convertir la string en number
          const categoryId  = document.getElementById('categorieAjout').value*1;
          const fileInput = document.getElementById('fileUploadInput');
          const imageFile = fileInput.files[0];
          
          if (imageFile && title  && categoryId) {
              const formData = new FormData();
              formData.append("title", title);
              formData.append("image", imageFile);
              formData.append("category", categoryId);

              const authToken = getCookie("authToken");
              console.log("Auth Token:", authToken);
              if (authToken) {
                  fetch("http://localhost:5678/api/works", {
                      method: "POST",
                      headers: {
                          Authorization: `Bearer ${authToken}`
                      },
                      body: formData
                  })
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`Erreur lors de l'ajout : ${response.status} ${response.statusText}`);
                      }
                      return response.json();
                  })
                  .then(data => {
                      console.log("Réponse de l'API après l'ajout :", data);
                  })
                  .catch(error => {
                      console.error("Erreur lors de l'ajout :", error);
                  });
              } else {
                  console.error("Token d'authentification manquant");
              }
            } else {
              console.error("Données du formulaire manquantes ou invalides.");
            }
          });
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
          const iconElement = document.createElement("i");
          iconElement.classList = "fas fa-trash-alt delete";
          iconElement.alt = "delete";
          //Récuperation id pour chaque element
          iconElement.dataset.id = item.id;

          //événement de suppression directement à l'icône
          iconElement.addEventListener("click", function(event) {
            event.preventDefault();
            deleteImage(event.target.dataset.id); // Fonction pour gérer la suppression
          });

          //<img> dans <figure>
          figureElement.appendChild(imageElement);
          //<i> dans <img>
          figureElement.appendChild(iconElement);

          galleryContainer.appendChild(figureElement);
        });
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des photos:", error)
      );
  }
  // Fonction pour supprimer dans la gallery
  function deleteImage(imageId) {
    const authToken = getCookie("authToken");
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
      // Retirer l'élément du DOM après la suppression réussie
      débugger;

      const figureElement = document.querySelector(`[data-id="${imageId}"]`).closest("figure");
      if (figureElement) {
        figureElement.remove();
      }
    })
    .catch(error => {
      console.error("Erreur lors de la suppression de l'image:", error);
    });
  }

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
    // Cache la modal actuelle
    modalAjout.style.display = "none";
    // Affiche la modal précédente
    modal.style.display = "block";
  });

  //Au click sur button affiche input type file
  document.getElementById('fileUploadButton').addEventListener('click', function() {
    document.getElementById('fileUploadInput').click();
  });

  // Afficher une preview de l'image avant envoie
  document.getElementById('fileUploadInput').addEventListener('change', function() {
      const fileInput = this;
      const imageFile = fileInput.files[0];
      if (imageFile) {
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const imgPreview = document.createElement("img");
          const conteneurPreview = document.getElementById('imagePreview');

              imgPreview.src = e.target.result;
              conteneurPreview.style.display = 'block';
              conteneurPreview.appendChild(imgPreview)
              // Masque le bouton de téléchargement une fois que l'image est affichée
            const uploadButton = document.getElementById('fileUploadButton');
            uploadButton.style.display = 'none';
          };

          reader.readAsDataURL(imageFile);
      }
  });

});
});
