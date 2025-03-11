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

// ✅ Error Message Containers
const errorMessages = {
  name: document.createElement("p"),
  email: document.createElement("p"),
  message: document.createElement("p"),
  checkbox: document.createElement("p"),
};
Object.values(errorMessages).forEach(msg => {
  msg.style.color = "red";
  msg.style.fontSize = "14px";
  msg.style.marginTop = "5px";
});

nameInput.parentNode.appendChild(errorMessages.name);
emailInput.parentNode.appendChild(errorMessages.email);
messageInput.parentNode.appendChild(errorMessages.message);
agreementCheckbox.parentNode.appendChild(errorMessages.checkbox);

// ✅ Success/Error Message Box
const messageBox = document.createElement("p");
messageBox.style.color = "#ffffff";
messageBox.style.fontSize = "16px";
messageBox.style.marginTop = "10px";
messageBox.style.fontWeight = "bold";
contactForm.appendChild(messageBox);

const BACKEND_URL = "https://fog-back-key4.onrender.com"; 

// ✅ EmailJS Credentials
const EMAILJS_SERVICE_ID = "service_ufzg759";  
const EMAILJS_TEMPLATE_ID = "template_krmeczq";
const EMAILJS_PUBLIC_KEY = "AfUVgE7ii92j3o6lP";

// ✅ Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ✅ Function to show form validation messages
function showError(input, message) {
  errorMessages[input].textContent = message;
}
function clearErrors() {
  Object.values(errorMessages).forEach(msg => msg.textContent = "");
}

// ✅ Function to show messages (Success or Error)
function showMessage(text, isSuccess = true) {
  messageBox.textContent = text;
  messageBox.style.color = isSuccess ? "green" : "red";
}

// ✅ Validate Email Format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Strictly Validate Inputs
function validateInputs() {
  clearErrors(); // Remove previous errors
  let isValid = true;

  if (!nameInput.value.trim()) {
    showError("name", "❌ Name is required.");
    isValid = false;
  }
  if (!emailInput.value.trim()) {
    showError("email", "❌ Email is required.");
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError("email", "❌ Invalid email format.");
    isValid = false;
  }
  if (!messageInput.value.trim()) {
    showError("message", "❌ Message cannot be empty.");
    isValid = false;
  }
  if (!agreementCheckbox.checked) {
    showError("checkbox", "❌ You must agree to data processing.");
    isValid = false;
  }

  return isValid;
}

// ✅ Ensure reCAPTCHA Script is Loaded
function ensureRecaptchaLoaded() {
  if (typeof grecaptcha === "undefined") {
    showMessage("❌ reCAPTCHA failed to load. Please refresh the page.", false);
    return false;
  }
  return true;
}

// ✅ Handle Form Submission with **Validation First**
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // 🚨 **VALIDATION FIRST: Prevent blank submissions**
  if (!validateInputs()) {
    console.log("🚫 Form validation failed. Fix errors and try again.");
    return; // ❌ STOP FORM FROM BEING SENT
  }

  // 🚨 **Ensure reCAPTCHA is loaded before executing**
  if (!ensureRecaptchaLoaded()) {
    return;
  }

  // ✅ If everything is valid, trigger reCAPTCHA
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

// ✅ Function to process form submission **only if validation & reCAPTCHA pass**
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
      return; // ❌ STOP HERE IF reCAPTCHA FAILS
    }

    // 🚨 **Block empty message submission to EmailJS**
    if (!validateInputs()) {
      console.error("❌ Validation failed AFTER reCAPTCHA. Message NOT sent.");
      showMessage("❌ Fix the errors before sending the message.", false);
      return;
    }

    // ✅ Send Email via EmailJS after passing validation & reCAPTCHA
    console.log("📧 Sending email via EmailJS...");

    const emailResponse = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim()
    });

    console.log("✅ EmailJS Response:", emailResponse);
    showMessage("✅ Message sent successfully!", true);
    
    // ✅ Reset the form after successful submission
    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
    agreementCheckbox.checked = false;
    grecaptcha.reset();
    
  } catch (error) {
    console.error("❌ Error Sending Message:", error);
    showMessage("❌ Something went wrong. Please try again later.", false);
  } finally {
    submitBtn.innerText = "Send";
    submitBtn.disabled = false;
  }
}