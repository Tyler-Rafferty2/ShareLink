import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;
let user = null;
let userId = null;
const fetchAuthConfig = () => fetch("./auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0Client = await createAuth0Client({
        domain: config.domain,
        clientId: config.clientId
    });
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

const displayFriendsAndRequests = async () => {
    const url = `http://localhost:5000/api/user/friendsEmail/${userId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch friends");
        }
        const friends = await response.json();
        
        const friendsList = document.getElementById('friendsList');
        friendsList.innerHTML = '';

        friends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.textContent = friend.email;
            friendsList.appendChild(friendItem);
        });
    } catch (error) {
        console.error("Error fetching friends:", error);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await configureClient();

    user = await auth0Client.getUser();

    userId = await getUserIdFromEmail(user.email);

    await updateUI();


    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("User authenticated:", isAuthenticated);

    if (isAuthenticated) {
        const userProfile = await auth0Client.getUser();
        user = userProfile;
        console.log('Current user:', user);
    }
});

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("User authenticated in updateUI:", isAuthenticated);
    console.log("userId", userId);
    displayFriendsAndRequests(userId);
    //document.getElementById("btn-logout").disabled = !isAuthenticated;
    //document.getElementById("btn-login").disabled = isAuthenticated;
};
