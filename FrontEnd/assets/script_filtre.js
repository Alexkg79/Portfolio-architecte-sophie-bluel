const tous = document.getElementById("tous");

//BTN "TOUS" POUR TOUT AFFICHER QUAND CLICK
tous.addEventListener("click", () => {
  const galleryContainer = document.getElementById("gallery");
  const apiUrl = "http://localhost:5678/api/works";

  // Chargement des infos depuis l'API
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
        //<figcaption>
        const captionElement = document.createElement("figcaption");
        captionElement.textContent = item.title; // Utilisez la propriété title
        //<img> dans <figure>
        figureElement.appendChild(imageElement);
        // <figcaption> dans <figure>
        figureElement.appendChild(captionElement);
        // <figure> dans la div gallery
        galleryContainer.appendChild(figureElement);
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des données:", error)
    );
});

//BTN FILTRE + AFFICHAGE PAR DEFAUT
document.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const galleryContainer = document.getElementById("gallery");
  const filtreButtons = document.getElementById("container_btn_filtre");
  const apiUrl = "http://localhost:5678/api/works";

  let currentCategory = null;

  // Chargement des infos depuis l'API
  function updateGallery(category) {
    galleryContainer.innerHTML = "";
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (category === null || item.category.name === category) {
            //filtrer les éléments en fonction de leur catégorie.
            //<figure>
            const figureElement = document.createElement("figure");
            //<img>
            const imageElement = document.createElement("img");
            imageElement.src = item.imageUrl;
            imageElement.alt = item.title;
            //<figcaption>
            const captionElement = document.createElement("figcaption");
            captionElement.textContent = item.title;
            //<img> dans <figure>
            figureElement.appendChild(imageElement);
            // <figcaption> dans <figure>
            figureElement.appendChild(captionElement);
            // <figure> dans la div gallery
            galleryContainer.appendChild(figureElement);
          }
        });
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des données:", error)
      );
  }

  // Ajout d'un evenement aux boutons de filtre
  container_btn_filtre.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.tagName === "BUTTON") {
      // Récupération de la catégorie en utilisant le texte du bouton
      const category = event.target.innerText;
      // Mise à jour de la classe active pour le background-color
      filtreButtons
        .querySelectorAll("button")
        .forEach((button) => button.classList.remove("active"));
      event.target.classList.add("active");

      // Mise à jour de la galerie click BTN
      currentCategory = category;
      updateGallery(currentCategory);
    }
  });
  // Initialisez la galerie avec la catégorie par défaut
  updateGallery(currentCategory);
});
