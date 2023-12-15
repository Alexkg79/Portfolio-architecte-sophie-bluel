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

      //Appel API pour affichage catégories
      fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(categories => {
          const categorySelect = document.getElementById('categorieAjout');
          categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.id;
              option.textContent = category.name; 
              categorySelect.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Erreur lors de la récupération des catégories:', error);
      });

      btnValiderAjout.addEventListener("click", function () {
          // Récupére les valeurs des champs du formulaire
          const title = document.getElementById("titleAjout").value;
          // le *1 pour convertir la string en number
          const categoryId  = document.getElementById('categorieAjout').value*1;
          const fileInput = document.getElementById('imageAjout');
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
  galleryModal.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      modal.style.display = "block";
            
      // Récupére l'identifiant unique de l'image 
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
          // Vérifie si la réponse n'est pas vide
          if (response.status !== 204) {
            return response.json();
          }
          // Si la réponse est vide, retourne une promesse résolue avec un objet vide
          return Promise.resolve({});
        })
        .then(data => {
          console.log("Réponse de l'API:", data);
          console.log(data);
          // Appelle la fonction de suppression avec l'élément à supprimer
          const figureElement = event.target.closest("figure");
          if (figureElement) {
            figureElement.remove();
          }
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'image:", error);
        })
    }
  });

});
});
