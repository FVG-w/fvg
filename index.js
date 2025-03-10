// 🍪 Cookie Handling
document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");
  const manageCookiesBtn = document.getElementById("manage-cookies-btn");

  function enableTrackingScripts() {
    if (localStorage.getItem("cookieConsent") === "accepted") {
      const gtagScript = document.createElement("script");
      gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-9JET0VYD3C";
      gtagScript.async = true;
      document.head.appendChild(gtagScript);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9JET0VYD3C', { 'anonymize_ip': true });
      `;
      document.head.appendChild(inlineScript);
    }
  }

  function removeTrackingScripts() {
    document.querySelectorAll("script[src*='googletagmanager.com'], script[src*='google-analytics.com']").forEach(script => script.remove());
    localStorage.removeItem("cookieConsent");
  }

  function updateCookieConsent() {
    const userConsent = confirm("Would you like to enable tracking cookies?");
    if (userConsent) {
      localStorage.setItem("cookieConsent", "accepted");
      enableTrackingScripts();
      alert("Cookies enabled!");
    } else {
      localStorage.setItem("cookieConsent", "rejected");
      removeTrackingScripts();
      alert("Tracking cookies disabled.");
    }
  }

  const cookieConsent = localStorage.getItem("cookieConsent");

  if (cookieConsent === "accepted") {
    enableTrackingScripts();
    cookieBanner.classList.add("hidden");
  } else if (cookieConsent === "rejected") {
    removeTrackingScripts();
    cookieBanner.classList.add("hidden");
  }

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "accepted");
    enableTrackingScripts();
    cookieBanner.classList.add("hidden");
  });

  rejectBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "rejected");
    removeTrackingScripts();
    cookieBanner.classList.add("hidden");
  });

  manageCookiesBtn.addEventListener("click", updateCookieConsent);
});

// 📩 Secure Contact Form Submission (Frontend EmailJS + Backend reCAPTCHA)
const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector(".g-recaptcha");
const nameInput = document.querySelector("#user_name");
const emailInput = document.querySelector("#user_email");
const messageInput = document.querySelector("#message");
const agreementCheckbox = document.querySelector("#data_agreement");

const BACKEND_URL = "https://fog-back-key4.onrender.com"; 

// ✅ EmailJS Credentials
const EMAILJS_SERVICE_ID = "service_0fr6bes";
const EMAILJS_TEMPLATE_ID = "template_krmeczq";
const EMAILJS_PUBLIC_KEY = "AfUVgE7ii92j3o6lP";

// ✅ Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ✅ Validate Email Format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Reset Form
function resetForm() {
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
  grecaptcha.reset();
}

// ✅ Validate Inputs
function validateInputs() {
  if (!nameInput.value.trim()) {
    alert("❌ Name is required");
    return false;
  }
  if (!emailInput.value.trim()) {
    alert("❌ Email is required");
    return false;
  }
  if (!isValidEmail(emailInput.value)) {
    alert("❌ Invalid email format");
    return false;
  }
  if (!messageInput.value.trim()) {
    alert("❌ Message cannot be empty");
    return false;
  }
  if (!agreementCheckbox.checked) {
    alert("❌ You must agree to data processing");
    return false;
  }
  return true;
}

// ✅ Handle Form Submission
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // ✅ Ensure reCAPTCHA is loaded
  if (typeof grecaptcha === "undefined") {
    alert("❌ reCAPTCHA failed to load. Please refresh the page.");
    return;
  }

  // ✅ Validate inputs before triggering reCAPTCHA
  if (!validateInputs()) {
    return;
  }

  // ✅ Trigger Invisible reCAPTCHA before form submission
  grecaptcha.execute();
});

// ✅ Callback function for reCAPTCHA (Defined in the form)
async function onSubmit(token) {
  console.log("✅ reCAPTCHA Token Received:", token);

  if (!token) {
    alert("❌ reCAPTCHA verification failed.");
    return;
  }

  submitBtn.innerText = "Just a moment...";
  submitBtn.disabled = true;

  try {
    // ✅ Verify reCAPTCHA via Backend
    const recaptchaRes = await fetch(`${BACKEND_URL}/verify-recaptcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success) {
      alert("❌ reCAPTCHA verification failed. Please try again.");
      grecaptcha.reset();
      return;
    }

    // ✅ Send Email via EmailJS
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value
    });

    alert("✅ Message sent successfully!");
    resetForm();
  } catch (error) {
    console.error("❌ Error Sending Message:", error);
    alert("Something went wrong ❌");
  } finally {
    submitBtn.innerText = "Send";
    submitBtn.disabled = false;
  }
}