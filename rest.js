// 🍪 Cookie Handling
document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");
  const manageCookiesBtn = document.getElementById("manage-cookies-btn");

  function enableTrackingScripts() {
    if (localStorage.getItem("cookieConsent") === "accepted") {
      console.log("✅ Tracking cookies enabled");

      // ✅ Google Analytics Script
      if (!document.getElementById("gtag-script")) {
        const gtagScript = document.createElement("script");
        gtagScript.id = "gtag-script";
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-9JET0VYD3C";
        gtagScript.async = true;
        document.head.appendChild(gtagScript);
  
        const inlineScript = document.createElement("script");
        inlineScript.id = "gtag-inline";
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9JET0VYD3C', { 'anonymize_ip': true });
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }

  function removeTrackingScripts() {
    console.log("🚫 Removing tracking scripts");

    // ✅ Remove Google Analytics Scripts
    document.querySelectorAll("#gtag-script, #gtag-inline").forEach(script => script.remove());

    // ✅ Clear tracking cookies
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });

    localStorage.removeItem("cookieConsent");
  }

  function updateCookieConsent() {
    const userConsent = confirm("Would you like to enable tracking cookies?");
    if (userConsent) {
      localStorage.setItem("cookieConsent", "accepted");
      enableTrackingScripts();
      alert("✅ Cookies enabled!");
    } else {
      localStorage.setItem("cookieConsent", "rejected");
      removeTrackingScripts();
      alert("🚫 Tracking cookies disabled.");
    }
  }

  const cookieConsent = localStorage.getItem("cookieConsent");

  if (cookieConsent === "accepted") {
    enableTrackingScripts();
    cookieBanner.style.display = "none";
  } else if (cookieConsent === "rejected") {
    removeTrackingScripts();
    cookieBanner.style.display = "none";
  }

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "accepted");
    enableTrackingScripts();
    cookieBanner.style.display = "none";
  });

  rejectBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "rejected");
    removeTrackingScripts();
    cookieBanner.style.display = "none";
  });

  // ✅ Fix: Only add event listener if the button exists
  if (manageCookiesBtn) {
    manageCookiesBtn.addEventListener("click", updateCookieConsent);
  }
});