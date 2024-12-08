// JavaScript Document with name related functions to manage the customers sign-in / sign-out activities

function SaveName(fullName) {
    if (fullName.trim() !== "") {
        const firstName = fullName.split(' ')[0]; // Get the first name
        localStorage.setItem('customerName', firstName);
        DisplayName();
    } else {
        alert("Please enter a valid name.");
    }
}

function ClearName() {
    localStorage.removeItem('customerName');
    ClearCart(); // Clear the cart when signing out
    DisplayName(); // Update the display immediately
    
}


function DisplayName() {
    const welcomeDiv = document.getElementById("welcome");
    const savedName = localStorage.getItem('customerName');

    if (savedName) {
        welcomeDiv.innerHTML = `<b>Welcome ${savedName}!</b> 
        <br><br><button onclick="ClearName()">Sign Out</button>`;
    } else {
        welcomeDiv.innerHTML = `
      <b>Welcome, guest!</b> 
      <br><br><input type="text" id="nameInput" placeholder="Enter your name">
      <br><br><button onclick="SaveName(document.getElementById('nameInput').value)">Sign In</button>`;
    }
}