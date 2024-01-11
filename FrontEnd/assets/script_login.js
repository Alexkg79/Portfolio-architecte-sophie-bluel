document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Créez un objet avec les données du formulaire
    const loginData = {
      email: email,
      password: password,
    };
    // Envoyez les données à l'API
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          // génére une erreur si la réponse n'est pas correcte
          throw new Error("Erreur dans l'identifiant ou le mot de passe");
        }
        return response.json();
      })
      .then((data) => {
        // Stockage du token dans le cookie
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        document.cookie = `authToken=${
          data.token
        }; expires=${expirationDate.toUTCString()}; Secure; SameSite=Strict; path=/;`;
        // Traitement de la réponse de l'API ici
        // Si l'authentification est ok, redirection sur page du dashboard
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error("Error login");
        // Message d'erreur
        const errorLoginMessage = document.getElementById("errorLoginMessage");
        errorLoginMessage.innerHTML = error.message;
      });
  });
});

//Si le token existe dans le cookie on redirige la page Login vers la page Dashboard
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

const authToken = getCookie("authToken");

if (authToken) {
  // Redirige vers la page de dashboard 
  window.location.href = "dashboard.html";
}
