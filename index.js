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

const BACKEND_URL = "https://fog-back-key4.onrender.com"; 

// ✅ Updated EmailJS Credentials
const EMAILJS_SERVICE_ID = "service_ufzg759";  // 🔹 Updated Service ID
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

// ✅ Handle Form Submission with Invisible reCAPTCHA
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

// ✅ Callback function for reCAPTCHA (defined in the form)
async function onSubmit(token) {
  console.log("✅ reCAPTCHA Token Received:", token);

  if (!token) {
    alert("❌ reCAPTCHA verification failed.");
    return;
  }

  submitBtn.innerText = "Just a moment...";
  submitBtn.disabled = true;

  await sendFormData(token);
}

// ✅ Function to process form submission
async function sendFormData(token) {
  console.log("📤 Sending form data...");

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
      alert("❌ reCAPTCHA verification failed. Please try again.");
      grecaptcha.reset();
      return;
    }

    // ✅ Send Email via EmailJS
    console.log("📧 Sending email via EmailJS...");

    const emailResponse = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value
    });

    console.log("✅ EmailJS Response:", emailResponse);
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