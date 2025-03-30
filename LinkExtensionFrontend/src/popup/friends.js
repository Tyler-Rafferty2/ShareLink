import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;
let user = null;

console.log("popup friends!");

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
    updateUI();

    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        user = await auth0Client.getUser();
        const userExists = await checkIfUserExists(user.email);
        if (!userExists) {
            await postUserData(user);
        }
        displayFriendsAndRequests(user.email);
    }

    document.getElementById("loadUsersBtn").addEventListener("click", async () => {
        const email = document.getElementById("searchBar").value.trim();
    
        if (!email) {
            console.log("Please enter an email.");
            return;
        }
    
        // Check if the user exists in the database
        const userExists = await checkIfUserExists(email);
    
        if (userExists) {
            console.log("User found, sending friend request...");
            
            // Fetch the logged-in user's details from Auth0
            const user = await auth0Client.getUser();

            const userId = await getUserIdFromEmail(user.email)
            const friendId = await getUserIdFromEmail(email)

            console.log("did you get ids?", userId, friendId)
            // Send friend request
            await sendFriendRequest(userId, friendId);
            
            

            document.getElementById("Success").style.display = "block";
            document.getElementById("Failure").style.display = "none";
        } else {
            console.log("User not found.");
            document.getElementById("Success").style.display = "none";
            document.getElementById("Failure").style.display = "block";
        }
    });

    
});

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        console.log("User authenticated");
    } else {
        console.log("User not authenticated");
    }
};

const checkIfUserExists = async (email) => {
    const url = `http://localhost:5000/api/user/email/${email}`;
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        console.error('Error checking user:', error);
        return false;
    }
};

const updateFriendsAdd = async (userId, field, valueId) => {
    
    console.log("updateFriendsAdd", userId, field, valueId);
    const url = `http://localhost:5000/api/user/${field}/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valueId)
        });
        const data = await response.json();
        console.log(data.message); // "Friend request sent successfully"
    } catch (error) {
        console.error(`Error updating:`, error);
    }
};

const removeRequest = async (userId, friendId) => {
    const url = `http://localhost:5000/api/user/removeRequest/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(friendId)
        });
    } catch (error) {
        console.error(`Error updating:`, error);
    }
};

const addFriend = async (userId,friendId) => {
    const url = `http://localhost:5000/api/user/addFriend/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(friendId)
        });
        await removeFriendRequest(userId,friendId);
    } catch (error) {
        console.error(`Error updating:`, error);
    }
};


const removeFriendRequest = async (userId, friendId) => {
    await removeRequest(userId,friendId);
};

const acceptFriendRequest = async (userId, friendId) => {
    await addFriend(userId, friendId);
};

const sendFriendRequest = async (userId, friendId) => {
    await updateFriendsAdd(userId, 'addFriendRequestSent', friendId);
    await updateFriendsAdd(friendId, 'addFriendRequest', userId);
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

const getEmailFromUserId = async (userId) => {
    const url = `http://localhost:5000/api/user/byUserId/${userId}`;
    try {
        const response = await fetch(url);

        if (response.ok) {
            // If user exists, response is 200 OK
            const data = await response.json();
            return data.email;  // Return just the user ID
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

const displayFriendsAndRequests = async (userEmail) => {
    const url = `http://localhost:5000/api/user/email/${userEmail}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const userData = await response.json();
            const friendsList = document.getElementById('friendsList');
            const friendRequestsList = document.getElementById('friendRequestsList');
            friendsList.innerHTML = '';
            friendRequestsList.innerHTML = '';

            for (const friend of userData.friends) {
                const friendEmail = await getEmailFromUserId(friend);
                const friendItem = document.createElement('div');
                friendItem.textContent = friendEmail;
                friendsList.appendChild(friendItem);
            }

            for (const request of userData.friendRequests) {
                const requestEmail = await getEmailFromUserId(request);
                const requestItem = document.createElement('div');
                requestItem.textContent = requestEmail;

                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'A';
                acceptButton.addEventListener('click', () => acceptFriendRequest(userData.id, request));

                const rejectButton = document.createElement('button');
                rejectButton.textContent = 'R';
                rejectButton.addEventListener('click', () => removeFriendRequest(userData.id, request));

                requestItem.appendChild(acceptButton);
                requestItem.appendChild(rejectButton);
                friendRequestsList.appendChild(requestItem);
            };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

