import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;
let userId = null;
let user = null;
let userDb = null;

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
    await getUserByEmail(user.email);
    console.log(userDb);
    updateUI();

    // Auth0 login check
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        console.log("logged in");
    } else {
        console.log('No user logged in');
    }
    console.log("workingin");
    document.getElementById("linkForm").addEventListener("submit", async (event) => {
        console.log("working");
        event.preventDefault(); // Prevent form submission from refreshing the page

        // Collect user input
        const url = document.getElementById("url").value.trim();
        const title = document.getElementById("title").value.trim();
        const friends = document.getElementById("friendInput").value.trim();

        console.log(friends);
        //const description = document.getElementById("description").value.trim();

        if (!url || !title || !friends) {
            alert("URL and Title are required!");
            return;
        }

        const linkData = {
            Url: url,
            Title: title,
            Description: '',
            CreatedAt: new Date().toISOString(),
            UserId: userId,
            SharedUserIds: [friends]  // Adjust as needed
        };

        await postLink(linkData);
    });

});

// Helper function to update UI based on login state
const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    await getUserData();
    if (isAuthenticated) {  
        const user = await auth0Client.getUser();
        console.log("User authenticated");
    } else {
        console.log("User not authenticated");
    }
};


// Function to send POST request
async function postLink(linkData) {
    try {
        const response = await fetch('http://localhost:5000/api/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(linkData),
        });

        if (!response.ok) {
            throw new Error('Failed to create link');
        }

        const result = await response.json();
        console.log('Link Created Successfully:', result);  // Display success
    } catch (error) {
        console.error('Error creating link:', error);  // Display error
    }
}

const getUserByEmail = async (userEmail) => {
    const url = `http://localhost:5000/api/user/email/${userEmail}`;
    try {
        const response = await fetch(url);
       
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            userDb = data;
            userId = data.id;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
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

const getEmailsFromUserIds = async (userIds) => {
    // Use Promise.all to fetch emails for each user ID concurrently
    const emails = await Promise.all(
        userIds.map(async (userId) => {
            const email = await getEmailFromUserId(userId);  // Call the function for each user ID
            return email;  // Return the email for each user ID
        })
    );

    console.log(emails);  // The array of emails
    return emails;
};


function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += `<input type='hidden' value='${userDb.friends[i]}'>`;

            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }
  

// Assuming `userDb.allFriends` is a list of all friends data
async function getUserData() {
    let friends = await getEmailsFromUserIds(userDb.friends);
    //console.log(friends);
    //var countries = ["tyleruvaonline@gmail.com"];
    //console.log(countries)
    autocomplete(document.getElementById("friendInput"), friends);
}