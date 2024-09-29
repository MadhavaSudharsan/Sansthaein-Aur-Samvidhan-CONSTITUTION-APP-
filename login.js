let container = document.getElementById("container");

toggle = () => {
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
};

setTimeout(() => {
  container.classList.add("sign-in");
}, 200);

// Wrap the event listeners in a DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signup-button").addEventListener("click", signUp);
    document.getElementById("login-button").addEventListener("click", login);
    document.getElementById("send-otp-button").addEventListener("click", sendOTP);
});

async function signUp() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value || document.querySelector(".signup-email").value;
  const password = document.getElementById("signup-password").value;
  const phone = document.getElementById("phoneno").value;

  let additionalInfo = {}; // Initialize as an empty object

  const response = await fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, phone, ...additionalInfo }),
  });

  const data = await response.json();
  alert(data.message);
}

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  alert(data.message);

  if (data.message === "Login successful!") {
    localStorage.setItem("username", username); // Store username in localStorage
    localStorage.setItem("token", data.token);
    window.location.href = "intropage.html";
  }
}

async function sendOTP() {
  const email = document.querySelector(".signup-email").value;
  const otpverify = document.getElementsByClassName("otpverify")[0];

  const response = await fetch("http://localhost:5000/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (data.success) {
    alert("OTP sent to your email " + email);

    otpverify.style.display = "flex";
    const otp_inp = document.getElementById("otp_inp");
    const otp_btn = document.getElementById("otp-btn");

    otp_btn.addEventListener("click", () => {
      if (otp_inp.value == data.otp) {
        alert("Email address verified...");
        document.getElementById("signup-btn").style.display = "block";
      } else {
        alert("Invalid OTP");
      }
    });
  } else {
    alert("Failed to send OTP. Please try again.");
  }
}
