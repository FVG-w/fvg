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






// 📩 Secure Contact Form Submission (Frontend EmailJS + Backend reCAPTCHA)
const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector(".g-recaptcha");
const nameInput = document.querySelector("#user_name");
const emailInput = document.querySelector("#user_email");
const messageInput = document.querySelector("#message");
const agreementCheckbox = document.querySelector("#data_agreement");
const messageBox = document.createElement("p"); // ✅ Message display element

const BACKEND_URL = "https://fog-back-key4.onrender.com"; 

// ✅ Updated EmailJS Credentials
const EMAILJS_SERVICE_ID = "service_ufzg759";  
const EMAILJS_TEMPLATE_ID = "template_krmeczq";
const EMAILJS_PUBLIC_KEY = "AfUVgE7ii92j3o6lP";

// ✅ Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ✅ Add message box to form
messageBox.style.color = "#ffffff";
messageBox.style.fontSize = "16px";
messageBox.style.marginTop = "10px";
messageBox.style.fontWeight = "bold";
contactForm.appendChild(messageBox);

// ✅ Function to show messages
function showMessage(text, isSuccess = true) {
  messageBox.textContent = text;
  messageBox.style.color = isSuccess ? "green" : "red";
}

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
  let errors = [];

  if (!nameInput.value.trim()) errors.push("❌ Name is required.");
  if (!emailInput.value.trim()) errors.push("❌ Email is required.");
  if (!isValidEmail(emailInput.value)) errors.push("❌ Invalid email format.");
  if (!messageInput.value.trim()) errors.push("❌ Message cannot be empty.");
  if (!agreementCheckbox.checked) errors.push("❌ You must agree to data processing.");

  if (errors.length > 0) {
    showMessage(errors.join(" "), false);
    return false;
  }
  return true;
}

// ✅ Ensure reCAPTCHA Script is Loaded
function ensureRecaptchaLoaded() {
  if (typeof grecaptcha === "undefined") {
    showMessage("❌ reCAPTCHA failed to load. Please refresh the page.", false);
    return false;
  }
  return true;
}

// ✅ Handle Form Submission with Invisible reCAPTCHA
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!ensureRecaptchaLoaded()) return;
  if (!validateInputs()) return;

  // ✅ Trigger reCAPTCHA
  grecaptcha.execute("6LcjBPAqAAAAAKKz-7U791WtW5lgHUisYZe2Tr0k", { action: "submit" })
    .then(token => {
      console.log("✅ reCAPTCHA Token:", token);
      sendFormData(token);
    })
    .catch(err => {
      console.error("❌ Error executing reCAPTCHA:", err);
      showMessage("❌ reCAPTCHA failed. Please try again.", false);
    });
});

// ✅ Function to process form submission
async function sendFormData(token) {
  console.log("📤 Sending form data with reCAPTCHA token:", token);

  try {
    // ✅ Verify reCAPTCHA via Backend
    const recaptchaRes = await fetch(`${BACKEND_URL}/verify-recaptcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const recaptchaData = await recaptchaRes.json();
    console.log("🔍 reCAPTCHA Response:", recaptchaData);

    if (!recaptchaData.success) {
      console.error("❌ reCAPTCHA verification failed:", recaptchaData.details);
      showMessage("❌ reCAPTCHA verification failed. Please try again.", false);
      grecaptcha.reset();
      return;
    }

    // ✅ Send Email via EmailJS after reCAPTCHA success
    console.log("📧 Sending email via EmailJS...");

    const emailResponse = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value
    });

    console.log("✅ EmailJS Response:", emailResponse);
    showMessage("✅ Message sent successfully!", true);
    resetForm();
  } catch (error) {
    console.error("❌ Error Sending Message:", error);
    showMessage("❌ Something went wrong. Please try again later.", false);
  } finally {
    submitBtn.innerText = "Send";
    submitBtn.disabled = false;
  }
}