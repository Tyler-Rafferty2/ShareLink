// import { firebaseApp } from './firebase_config'
// import {
//     getAuth,
//     onAuthStateChanged,

// } from 'firebase/auth';
// import { getFirestore, collection, getDoc, query, where, doc, updateDoc, arrayUnion, getDocs, arrayRemove } from "firebase/firestore";

// const db = getFirestore(firebaseApp);
// // Auth instance for the current firebaseApp
// const auth = getAuth(firebaseApp);
// let user = null;

// console.log("popup friends!")

// async function removeFriendRequest(userId, email) {
//     try {
//         const userRef = doc(db, "users", userId);
//         await updateDoc(userRef, {
//             friendRequests: arrayRemove(email)
//         });
//         console.log(`Removed ${email} from friendRequests.`);
//         //window.location.reload();
//     } catch (error) {
//         console.error("Error removing friend request:", error);
//     }
// }

// async function removeFriendRequestSent(userId, email) {
//     try {
//         const userRef = doc(db, "users", userId);
//         await updateDoc(userRef, {
//             friendRequestsSent: arrayRemove(email)
//         });
//         console.log(`Removed ${email} from friendRequests.`);
//         //window.location.reload();
//     } catch (error) {
//         console.error("Error removing friend request:", error);
//     }
// }

// async function acceptFriendRequest(userId, email) {
//     try {
//         const userRef = doc(db, "users", userId);
//         await updateDoc(userRef, {
//             friends: arrayUnion(email)
//         });
//         console.log(`Added ${email} as a friend.`);
//         const usersRef = collection(db, "users");

//         const q = query(usersRef, where("email", "==", email.toLowerCase()));
//         const querySnapshot = await getDocs(q);
//         const friendDoc = querySnapshot.docs[0]; // Get the first matching document
//         const friendRef = doc(db, "users", friendDoc.id);
//         await updateDoc(friendRef, {
//             friends: arrayUnion(user.email)
//         });
//         console.log(friendRef.id);
//         console.log(user.email);
//         await removeFriendRequestSent(friendRef.id, user.email);
//         await removeFriendRequest(userId, email);
//         window.location.reload();
//     } catch (error) {
//         console.error("Error removing friend request:", error);
//     }
// }

// async function addFriendToList(userId, friendId) {
//     try {
//         // Reference to the user's document in the 'users' collection

//         const userRef = doc(db, "users", userId);
//         const friendRef = doc(db, "users", friendId);

//         const userDoc = await getDoc(userRef);
//         const friendDoc = await getDoc(friendRef);
//         // Append the friend's email to the friends array in the user's document

//         await updateDoc(userRef, {
//             friendRequestsSent: arrayUnion(friendDoc.data().email) // Appends to the 'friends' array field
//         });
//         await updateDoc(friendRef, {
//             friendRequests: arrayUnion(userDoc.data().email) 
//         });

//         //console.log(`Added ${friendEmail} to the friendsRequestsSent list.`);
//     } catch (error) {
//         console.error("Error adding friend:", error);
//     }
// }

// async function checkIfEmailExists(email) {
//     try {
//         // Create a query to find users with the given email
//         const usersRef = collection(db, "users");
//         const q = query(usersRef, where("email", "==", email.toLowerCase()));
//         const userName = query(usersRef, where("email", "==", user.email.toLowerCase()));

//         // Execute the query
//         const querySnapshot = await getDocs(q);
//         const querySnapshotUser = await getDocs(userName);

//         if (!querySnapshot.empty) {
//             console.log("in here");
//             const doc = querySnapshot.docs[0];  // Get the first document
//             const userData = doc.data();
//             console.log("in here");
//             const docUser = querySnapshotUser.docs[0];  // Get the first document
//             const userDataName = docUser.data();
//             console.log("in here");
//             if (userData.email !== user.email && !userDataName.friendRequestsSent.includes(userData.email)) {
//                 console.log(`Email ${userData.email} exists in the system.`);
//                 return true;
//             }else if (!(userData.email !== user.email)){
//                 console.log("This is the current user's email.");
//                 return false;
//             }else{
//                 console.log("You have already sent a request to this email.");
//                 return false;
//             }
//         } else {
//             console.log(`Email ${email} does NOT exist in the system.`);
//             return false;
//         }
//     } catch (error) {
//         console.error("Error checking email:", error);
//         return false;
//     }
// }

// async function displayFriendsAndRequests(userId) {
//     const userRef = doc(db, "users", userId);
//     const userDoc = await getDoc(userRef);

//     const friendsList = document.getElementById('friendsList');
//     const friendRequestsList = document.getElementById('friendRequestsList');

//     let friends = userDoc.data().friends;
//     let friendRequests = userDoc.data().friendRequests;

//     // Clear previous data
//     friendsList.innerHTML = '';
//     friendRequestsList.innerHTML = '';

//     // Display friends
//     friends.forEach(friend => {
//         const friendItem = document.createElement('div');
//         friendItem.textContent = friend;

//         // const viewButton = document.createElement('button');
//         // viewButton.textContent = 'View';
//         // // Add an event listener for the "View" button, if needed
//         // viewButton.addEventListener('click', () => {
//         //     console.log(`Viewing profile of ${friend}`);
//         // });

//         const removeButton = document.createElement('button');
//         removeButton.textContent = 'R';
//         // Add an event listener for the "Remove" button
//         removeButton.addEventListener('click', () => {
//             console.log(`Removing ${friend}`);
//         });

//         //friendItem.appendChild(viewButton);
//         friendItem.appendChild(removeButton);
//         friendsList.appendChild(friendItem);
//     });

//     // Display friend requests
//     friendRequests.forEach(request => {
//         const requestItem = document.createElement('div');
//         requestItem.textContent = request;

//         const acceptButton = document.createElement('button');
//         acceptButton.textContent = 'A';
//         acceptButton.addEventListener('click', () => {
//             console.log(`Accepting request from ${request}`);
//             acceptFriendRequest(userId, request)
//         });

//         const rejectButton = document.createElement('button');
//         rejectButton.textContent = 'R';
//         rejectButton.addEventListener('click', () => {
//             console.log(`Rejecting request from ${request}`);
//             removeFriendRequest(userId, request)
//         });

//         requestItem.appendChild(acceptButton);
//         requestItem.appendChild(rejectButton);
//         friendRequestsList.appendChild(requestItem);
//     });
// }


// document.addEventListener('DOMContentLoaded', () => {
//     onAuthStateChanged(auth, currentUser => {
//         if (currentUser) {
//             // If a user is logged in, update the global user variable
//             user = currentUser;
//             displayFriendsAndRequests(user.uid);
//             console.log('Current user:', user); // You can access 'user' globally now
//         } else {
//             // If no user is logged in, set the global user variable to null
//             user = null;
//             console.log('No user is logged in.');
//         }
//     });


//     const searchBar = document.getElementById('searchBar');
//     const loadUsersBtn = document.getElementById('loadUsersBtn');
//     const successElement = document.getElementById('Success');
//     const failureElement = document.getElementById('Failure');

//     let exists;
//     loadUsersBtn.addEventListener('click', async () => {
//         const email = searchBar.value.trim(); // Get the text from the search bar
//         if (email) {
//             exists = await checkIfEmailExists(email); // Call the function with the email
//             if (exists) {

//                 const usersRef = collection(db, "users");
//                 const q = query(usersRef, where("email", "==", email.toLowerCase()));
//                 const querySnapshot = await getDocs(q);
//                 const doc = querySnapshot.docs[0];  // Get the first document

//                 addFriendToList(user.uid, doc.id);
//                 successElement.style.display = 'block';
//                 failureElement.style.display = 'none';
//             } else {
//                 console.log("failed")
//                 successElement.style.display = 'none';
//                 failureElement.style.display = 'block';
//             }
//         } else {
//             console.log("Please enter an email.");
//         }
//     });
// })

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

