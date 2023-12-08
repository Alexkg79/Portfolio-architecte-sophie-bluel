document.addEventListener("DOMContentLoaded", function () {
  // Fonction pour obtenir la valeur du cookie en fonction de son nom
  function getCookie(cookieName) {
    const name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }

    return null; // Retourne null si le cookie n'est pas trouvé
  }

  // Vérifie si l'utilisateur est connecté
  const authToken = getCookie("authToken");
  if (!authToken) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    window.location.href = "login.html";
  }


  // Bouton de déconnexion
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", function () {
    // Efface le cookie contenant le token
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirige vers la page de connexion
    window.location.href = "index.html";
  });
});
