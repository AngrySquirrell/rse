// Script principal - Version écologique et accessible

document.addEventListener("DOMContentLoaded", function () {
  console.log("Site Hycreo chargé et prêt !");

  // Vérification des préférences de réduction de mouvement
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Animation du logo (avec support clavier)
  const logo = document.getElementById("logo-pourri");
  if (logo) {
    // Rendre le logo focusable et lui donner un rôle bouton
    logo.setAttribute("tabindex", "0");
    logo.setAttribute("role", "button");
    logo.setAttribute("aria-label", "Afficher un message écologique");

    const showEcoMessage = function () {
      this.classList.add("pulse");
      if (!prefersReducedMotion) {
        setTimeout(() => {
          this.classList.remove("pulse");
        }, 1000);
      }

      // Affiche un message écologique aléatoire
      const messages = [
        "Saviez-vous qu'un site web écologique consomme moins d'énergie?",
        "Réduisez votre empreinte carbone numérique!",
        "Les arbres vous remercient pour ce site Hycreo!",
        "Green code = Clean code",
      ];

      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      // Création ou mise à jour d'une notification accessible
      let tooltip = document.getElementById("eco-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "eco-tooltip";
        tooltip.id = "eco-tooltip";
        tooltip.setAttribute("role", "status");
        tooltip.setAttribute("aria-live", "polite");
        document.body.appendChild(tooltip);
      }

      tooltip.textContent = randomMsg;
      tooltip.classList.add("visible");

      // Suppression après délai
      setTimeout(() => {
        tooltip.classList.remove("visible");
        // Attendre la fin de l'animation avant de supprimer
        setTimeout(() => {
          // Ne pas supprimer, juste cacher pour éviter de recréer constamment
          tooltip.style.display = "none";
        }, 500);
      }, 5000);
    };

    // Support des clics
    logo.addEventListener("click", showEcoMessage);

    // Support du clavier
    logo.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showEcoMessage.call(this);
      }
    });
  }

  // Animation des indicateurs écologiques - uniquement si les animations ne sont pas réduites
  const indicators = document.querySelectorAll(".indicator");

  if (indicators.length > 0 && !prefersReducedMotion) {
    indicators.forEach((indicator, index) => {
      setTimeout(() => {
        indicator.classList.add("fade-in");
      }, 300 * index);
    });
  } else if (indicators.length > 0) {
    // Si préférence pour réduire les animations, les afficher immédiatement
    indicators.forEach((indicator) => {
      indicator.style.opacity = "1";
    });
  }

  // Animation du titre avec respect de prefers-reduced-motion
  const title = document.querySelector("h1");
  if (title && !prefersReducedMotion) {
    title.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.3s ease";
    });

    title.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  // Ajoutons un peu de style CSS dynamique pour nos tooltips et animations
  const style = document.createElement("style");
  style.textContent = `
    .pulse {
      animation: pulse-animation 1s ease;
    }
    
    @keyframes pulse-animation {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    .eco-tooltip {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #2e7d32;
      color: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      opacity: 0;
      transform: translateY(100px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      max-width: 300px;
    }
    
    .eco-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
      display: block;
    }
    
    .fade-in {
      animation: fade-in 0.8s ease forwards;
    }
    
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Amélioration du comportement des liens externes
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach((link) => {
    // S'assurer que tous les liens externes ont rel="noopener noreferrer" pour la sécurité
    if (
      !link.getAttribute("rel") ||
      !link.getAttribute("rel").includes("noopener")
    ) {
      const rel = link.getAttribute("rel") || "";
      link.setAttribute("rel", `${rel} noopener noreferrer`.trim());
    }

    // Ajouter une indication pour les lecteurs d'écran si elle n'existe pas déjà
    if (!link.querySelector(".visually-hidden")) {
      const span = document.createElement("span");
      span.className = "visually-hidden";
      span.textContent = " (s'ouvre dans une nouvelle fenêtre)";
      link.appendChild(span);
    }
  });

  // Fonctionnalités d'accessibilité
  // Variables pour suivre l'état
  let highContrastMode = localStorage.getItem("highContrast") === "true";
  let fontSizeLevel = parseInt(localStorage.getItem("fontSizeLevel") || "0");
  let animationsDisabled =
    localStorage.getItem("animationsDisabled") === "true" ||
    prefersReducedMotion;

  // Fonction pour basculer le mode contraste élevé
  const contrastToggle = document.getElementById("contrast-toggle");
  if (contrastToggle) {
    contrastToggle.addEventListener("click", function () {
      highContrastMode = !highContrastMode;
      updateContrast();
      localStorage.setItem("highContrast", highContrastMode);
      this.classList.toggle("active", highContrastMode);

      // Annoncer le changement aux technologies d'assistance
      const statusMsg = document.createElement("div");
      statusMsg.setAttribute("role", "status");
      statusMsg.setAttribute("aria-live", "polite");
      statusMsg.className = "visually-hidden";
      statusMsg.textContent = highContrastMode
        ? "Mode contraste élevé activé"
        : "Mode contraste élevé désactivé";
      document.body.appendChild(statusMsg);
      setTimeout(() => statusMsg.remove(), 1000);
    });
  }

  // Fonction pour augmenter la taille du texte
  const fontIncrease = document.getElementById("font-increase");
  if (fontIncrease) {
    fontIncrease.addEventListener("click", function () {
      if (fontSizeLevel < 3) {
        fontSizeLevel++;
        updateFontSize();
        localStorage.setItem("fontSizeLevel", fontSizeLevel);

        // Annoncer le changement
        announceAccessibilityChange("Taille de texte augmentée");
      } else {
        announceAccessibilityChange("Taille de texte maximale atteinte");
      }
    });
  }

  // Fonction pour diminuer la taille du texte
  const fontDecrease = document.getElementById("font-decrease");
  if (fontDecrease) {
    fontDecrease.addEventListener("click", function () {
      if (fontSizeLevel > -2) {
        fontSizeLevel--;
        updateFontSize();
        localStorage.setItem("fontSizeLevel", fontSizeLevel);

        // Annoncer le changement
        announceAccessibilityChange("Taille de texte diminuée");
      } else {
        announceAccessibilityChange("Taille de texte minimale atteinte");
      }
    });
  }

  // Fonction pour désactiver les animations
  const animationsToggle = document.getElementById("animations-toggle");
  if (animationsToggle) {
    animationsToggle.addEventListener("click", function () {
      animationsDisabled = !animationsDisabled;
      updateAnimations();
      localStorage.setItem("animationsDisabled", animationsDisabled);
      this.classList.toggle("active", animationsDisabled);

      // Annoncer le changement
      announceAccessibilityChange(
        animationsDisabled ? "Animations désactivées" : "Animations activées"
      );
    });
  }

  // Fonction pour appliquer le contraste
  function updateContrast() {
    if (highContrastMode) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }

  // Fonction pour modifier la taille de police
  function updateFontSize() {
    // Supprimer les classes existantes de taille de police
    document.body.classList.remove(
      "font-size-smallest",
      "font-size-smaller",
      "font-size-larger",
      "font-size-largest"
    );

    // Ajouter la classe appropriée en fonction du niveau
    switch (fontSizeLevel) {
      case -2:
        document.body.classList.add("font-size-smallest");
        break;
      case -1:
        document.body.classList.add("font-size-smaller");
        break;
      case 1:
        document.body.classList.add("font-size-larger");
        break;
      case 2:
        document.body.classList.add("font-size-largest");
        break;
      case 3:
        document.body.classList.add("font-size-largest");
        break;
      default:
        // Taille par défaut, aucune classe nécessaire
        break;
    }
  }

  // Fonction pour gérer les animations
  function updateAnimations() {
    if (animationsDisabled) {
      document.body.classList.add("reduced-motion");
    } else {
      document.body.classList.remove("reduced-motion");
    }
  }

  // Fonction pour annoncer les changements aux technologies d'assistance
  function announceAccessibilityChange(message) {
    const statusMsg = document.createElement("div");
    statusMsg.setAttribute("role", "status");
    statusMsg.setAttribute("aria-live", "polite");
    statusMsg.className = "visually-hidden";
    statusMsg.textContent = message;
    document.body.appendChild(statusMsg);
    setTimeout(() => statusMsg.remove(), 1000);
  }

  // Initialiser les états au chargement de la page
  function initAccessibilitySettings() {
    // Appliquer les paramètres sauvegardés
    updateContrast();
    updateFontSize();
    updateAnimations();

    // Mettre à jour les états visuels des boutons
    if (contrastToggle) {
      contrastToggle.classList.toggle("active", highContrastMode);
    }
    if (animationsToggle) {
      animationsToggle.classList.toggle("active", animationsDisabled);
    }
  }

  // Appeler l'initialisation
  initAccessibilitySettings();
});
