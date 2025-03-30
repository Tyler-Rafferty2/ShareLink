import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;
let userId = null;
let user = null;

console.log("popup main!");

const configureClient = async () => {
    const response = await fetch("./auth_config.json");
    const config = await response.json();
    
    auth0Client = await createAuth0Client({
        domain: config.domain,
        clientId: config.clientId
    });
};

document.addEventListener("DOMContentLoaded", async () => {
    await configureClient();
    user = await auth0Client.getUser();
    userId = await getUserIdFromEmail(user.email);
    updateUI();

    // Auth0 login check
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0Client.getUser();

        // Send the user data to your server (POST request)
        const userExists = await checkIfUserExists(user.email);
        console.log(userExists);
        // If user does not exist, post the user data
        if (!userExists) {
            await postUserData(user);
        } else {
            console.log('User already exists on the server.');
        }
    } else {
        console.log('No user logged in');
    }


    document.getElementById("friendsButton").addEventListener("click", function () {
        window.location.replace('./friends.html'); // Redirects to friends.html
    });

    document.getElementById("linksButton").addEventListener("click", function () {
        //window.location.replace('./links.html'); // Redirects to links.html
        window.location.replace('./createAccount.html'); // Redirects to links.html
    });

    document.getElementById("createLinkButton").addEventListener("click", function () {
        window.location.replace('./createLink.html'); // Redirects to links.html
    });
});

// Helper function to update UI based on login state
const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    await fetchAndUpdateText();
    if (isAuthenticated) {  
        const user = await auth0Client.getUser();
        console.log("User authenticated");
    } else {
        console.log("User not authenticated");
    }
};

// Function to send user data to the backend
const postUserData = async (user) => {
    const url = 'http://localhost:5000/api/user'; 
    const data = {
        email: user.email,                     // e.g., "test@example.com"
        displayName: user.nickname,         // e.g., "John Doe"
        friends: [],                           // Empty array (or actual friend emails)
        friendRequests: [],                    // Empty array (or actual friend requests)
        friendRequestsSent: [],                // Empty array (or actual sent friend requests)
    };

    try {
        const response = await fetch(url, {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(data), // Convert the data to JSON
        });

        if (response.ok) {
            console.log('User data successfully sent to the server');
        } else {
            console.error('Failed to send user data');
        }
    } catch (error) {
        console.error('Error while sending user data:', error);
    }
};

const checkIfUserExists = async (email) => {
    const url = `http://localhost:5000/api/user/email/${email}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            // If user exists, response is 200 OK
            const user = await response.json();
            return true;
        } else if (response.status === 404) {
            // If user doesn't exist, response is 404 Not Found
            return false;
        }
    } catch (error) {
        console.error('Error checking user:', error);
        return false;
    }
};

const getUserIdFromEmail = async (email) => {
    const url = `http://localhost:5000/api/user/byEmail/${email}`;
    try {
        const response = await fetch(url);

        if (response.ok) {
            // If user exists, response is 200 OK
            const data = await response.json();
            return data.id;  // Return just the user ID
        } else if (response.status === 404) {
            // If user doesn't exist, response is 404 Not Found
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
};

function updateLinksList(links) {
    const displayTextElement = document.getElementById("displayText");

    // Clear previous content
    displayTextElement.innerHTML = '';

    // Iterate over each link in the array
    links.forEach(link => {
        // Assuming 'word' refers to the title or description (you can adjust this based on your needs)
        const word = link.title; // You can change this to link.description if you prefer
        
        // Set the inner HTML to display the word and a clickable URL
        displayTextElement.innerHTML += `${word} <a href="${link.url}" target="_blank">${link.url}</a><br>`;
    });
}


async function fetchAndUpdateText() {
    try {
        const response = await fetch(`http://localhost:5000/api/link/linksList/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch text");
        }
        const data = await response.json(); // Assuming backend returns { word, url }
        console.log("fetch", data);
        await updateLinksList(data);
    } catch (error) {
        console.error("Error fetching text:", error);
        await updateText("Error:", "#");
    }
}

