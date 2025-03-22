console.log("script loaded");
import { createAuth0Client } from '@auth0/auth0-spa-js';

document.addEventListener("DOMContentLoaded", async () => {
  await configureClient();
  updateUI();

  document.getElementById("btn-login").addEventListener("click", login);
  // document.getElementById("btn-logout").addEventListener("click", logout);
});

let auth0Client = null;

const fetchAuthConfig = () => fetch("./auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();

  const isAuthenticated = await auth0Client.isAuthenticated();
  console.log("User authenticated on window load:", isAuthenticated);

  if (isAuthenticated) {
    // User is already authenticated, show gated content
    return;
  }

  // Handle the redirect callback after the user is redirected back from the login page
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    console.log("Redirect callback detected. Handling login...");
    await auth0Client.handleRedirectCallback();
    updateUI();
    window.history.replaceState({}, document.title, "/");
  }
};

// Update the UI based on authentication state
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  console.log("User authenticated in updateUI:", isAuthenticated);

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;
};

// Switch to loginWithPopup() method
const login = async () => {
  console.log("login attempt");

  try {
    const options = {
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    };

    // Open the login popup
    await auth0Client.loginWithPopup(options);

    // After successful login, update UI
    updateUI();

    // Check authentication status
    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("User authenticated after popup:", isAuthenticated);
    
    if (isAuthenticated) {
      window.location.replace('./main.html');
    } else {
      console.log("User not authenticated.");
    }

  } catch (error) {
    console.error("Error during login:", error);
  }
};














// document.getElementById("toggleForm").addEventListener("click", function () {
//     window.location.href = "./createAccount.html"; 
// });

// document.getElementById('userForm').addEventListener('submit', async function (event) {
//     event.preventDefault();  // Prevent the form from submitting the usual way

//     const submitButton = document.getElementById('submitButton');  // Get the submit button element
//     submitButton.disabled = true;  // Disable the button to prevent multiple clicks
    
//     const email = document.getElementById('email').value;
//     const displayName = document.getElementById('displayName').value;

//     if (email && displayName) {
//         // Create the user object with additional fields required by the backend
//         const user = { 
//             email, 
//             displayName, 
//             friends: [],              // Empty list for friends
//             friendRequests: [],       // Empty list for friend requests
//             friendRequestsSent: [],   // Empty list for sent friend requests
//             CreatedAt: new Date()     // Use current date for creation date
//         };

//         // Send the user data to the backend
//         console.log("posted");
//         const response = await fetch('http://localhost:5000/api/user', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(user),
//         });

//         if (response.ok) {
//             const result = await response.json();
//             console.log("User created:", result);
//             alert("User created successfully!");
//         } else {
//             const errorData = await response.json();
//             console.error("Error details:", errorData);
//             alert("Failed to create user.");
//         }
//     } else {
//         alert("Please fill out both fields.");
//     }
// }, { once: true });  // This ensures that the event listener will be invoked only once
