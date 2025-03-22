import { firebaseApp } from './firebase_config'
import {
    getAuth,
    onAuthStateChanged,

} from 'firebase/auth';
import { getFirestore, collection, getDoc, query, where, doc, updateDoc, arrayUnion, getDocs, arrayRemove } from "firebase/firestore";

const db = getFirestore(firebaseApp);
// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);
let user = null;

console.log("popup links!");

async function displayFriendsAndRequests(userId) {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    const friendsList = document.getElementById('friendsList');

    let friends = userDoc.data().friends;

    // Clear previous data
    friendsList.innerHTML = '';

    // Display friends
    friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.textContent = friend;

        friendsList.appendChild(friendItem);
    });

}


document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, currentUser => {
        if (currentUser) {
            // If a user is logged in, update the global user variable
            user = currentUser;
            displayFriendsAndRequests(user.uid);
            console.log('Current user:', user); // You can access 'user' globally now
        } else {
            // If no user is logged in, set the global user variable to null
            user = null;
            console.log('No user is logged in.');
        }
    });
})
