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






// 📩 Secure Contact Form Submission with Validation + reCAPTCHA
const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector(".submit-btn");
const nameInput = document.querySelector("#user_name");
const emailInput = document.querySelector("#user_email");
const messageInput = document.querySelector("#message");
const agreementCheckbox = document.querySelector("#data_agreement");
const statusMessage = document.getElementById("form-status");

// ✅ Backend API URL
const BACKEND_URL = "https://fog-back-key4.onrender.com"; 

// ✅ EmailJS Credentials
const EMAILJS_SERVICE_ID = "service_ufzg759";  
const EMAILJS_TEMPLATE_ID = "template_krmeczq";
const EMAILJS_PUBLIC_KEY = "AfUVgE7ii92j3o6lP";

// ✅ Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ✅ Function to display success/error messages
function showStatusMessage(text, isSuccess = true) {
  statusMessage.textContent = text;
  statusMessage.style.color = isSuccess ? "green" : "red";
}

// ✅ Validate Email Format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Validate Inputs
function validateInputs() {
  let isValid = true;

  document.querySelectorAll(".error-message").forEach(msg => msg.textContent = ""); // Clear previous errors

  if (!nameInput.value.trim()) {
    document.getElementById("error-name").textContent = "❌ Name is required.";
    isValid = false;
  }
  if (!emailInput.value.trim()) {
    document.getElementById("error-email").textContent = "❌ Email is required.";
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    document.getElementById("error-email").textContent = "❌ Invalid email format.";
    isValid = false;
  }
  if (!messageInput.value.trim()) {
    document.getElementById("error-message").textContent = "❌ Message cannot be empty.";
    isValid = false;
  }
  if (!agreementCheckbox.checked) {
    document.getElementById("error-checkbox").textContent = "❌ You must agree to data processing.";
    isValid = false;
  }

  return isValid;
}

// ✅ Handle Form Submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateInputs()) return;

  submitBtn.innerText = "Just a moment...";
  submitBtn.disabled = true;

  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    showStatusMessage("❌ Please complete reCAPTCHA.", false);
    submitBtn.innerText = "Send";
    submitBtn.disabled = false;
    return;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value
    });

    showStatusMessage("✅ Message sent successfully!", true);
    contactForm.reset();
    grecaptcha.reset();
  } catch (error) {
    showStatusMessage("❌ Something went wrong.", false);
  }

  submitBtn.innerText = "Send";
  submitBtn.disabled = false;
});