// The cart-functions use parallel arrays, and here are examples of the 
// data that they can be filled with. Replace this generic product data with your own.
// Use these arrays to help you display the product info in the shop page table and 
// wherever else cart details, such as pricing, are needed.  

const productImages = ["UltraBall.webp", "QuickBall.webp", "TimerBall.jfif", "DuskBall.webp"]
const productNames = ["Ultra Ball", "Quick Ball", "Timer Ball", "Dusk Ball" ];
const productDescriptions = ["Better catch rate than a Great Ball!", "Higher catch rate at the start of a battle!", "The longer the battle, the better the catch rate!", "Higher catch rates at night and in caves!"];
const productPrices = [8.00, 10.00, 11.00, 12.00];
const productIds = ["pb1", "pb2", "pb3", "pb4"];  

const TAXRATE = 0.085; // USE THIS IN TAX CALCULATIONS


function CreateProductsTable() {
    const tableDiv = document.getElementById("ProductsTable");
    let tableHTML = "<table><tr><th>Image</th><th>Product</th><th>Description</th><th>Price</th><th>Quantity</th><th></th></tr>";

    for (let i = 0; i < productNames.length; i++) {
        tableHTML += `
            <tr>
            <td><img src="${productImages[i]}" alt="${productNames[i]}" width="50"></td>
            <td>${productNames[i]}</td>
            <td>${productDescriptions[i]}</td>
            <td>$${productPrices[i].toFixed(2)}</td>
            <td><input type="number" class="quantity" id="qty${i}" value="1" min="1" max="1000" oninput="validateQuantity(this)"></td>
            <td><button onclick="Add2Cart(${i})"><img src="add-to-cart-button1.gif"
            onmouseover="SwapImages(this, 'add-to-cart-button2.gif')" 
            onmouseout="SwapImages(this, 'add-to-cart-button1.gif')" 
            alt="Add to Cart"></button></td>
            </tr>`
    }
    tableHTML += "</table>";
    tableDiv.innerHTML = tableHTML;
}
function validateQuantity(inputElement) {
    const MAX_QUANTITY = 1000; // Set your desired maximum quantity

    let quantity = parseInt(inputElement.value);

    if (isNaN(quantity) || quantity < 1) {
        inputElement.value = 1;  // Set to minimum if invalid
    } else if (quantity > MAX_QUANTITY) {
        inputElement.value = MAX_QUANTITY; // Set to maximum if exceeded
    }
}

function DisplayCartSummary() {

    let totalItems = 0;
    for (let i = 0; i < productIds.length; i++) {
        const qty = parseInt(localStorage.getItem(productIds[i]) || 0);
        totalItems += qty;
    }

    const cartSummaryDiv = document.getElementById("cartSummary");
    cartSummaryDiv.innerHTML = `<br>Items in your cart: ${totalItems} items`;
}


function Add2Cart(index)
{	
    const qtyInput = document.getElementById(`qty${index}`);
    let quantity = parseInt(qtyInput.value) || 1; // Default to 1 if empty or invalid

    let currentQty = parseInt(localStorage.getItem(productIds[index]) || 0);
    currentQty += quantity;
    localStorage.setItem(productIds[index], currentQty);

    DisplayCartSummary(); // Update the cart summary
}

function UpdateCartItemQuantity(index) {
    const qtyInput = document.getElementById(`cartQty${index}`);
    const newQty = parseInt(qtyInput.value);

    // Input Validation
    if (newQty >= 1 && !isNaN(newQty)) {
        localStorage.setItem(productIds[index], newQty);
        DisplayCartDetails(); // Refresh the cart display with the updated quantity and totals
        DisplayCartSummary();
    }
}

function ClearCart()
{  
    for (let i = 0; i < productIds.length; i++) {
        localStorage.setItem(productIds[i], 0); // Set quantity to 0 in localStorage
    }

    DisplayCartSummary(); // Update cart summary display
    DisplayCartDetails();  // Update cart details display
    window.location.href = "shop.html";
}

function ProceedToCart() {
    window.location.href = "cart.html"; // Redirect to the cart.html page
}

function ProceedToCheckout() {
    window.location.href = "checkout.html";
}

function ContinueShopping() {
    window.location.href = "shop.html"; // Redirect back to shop.html
}

function RemoveFromCart(index) {
    localStorage.setItem(productIds[index], 0); // Set quantity to 0 to remove from cart

    DisplayCartDetails();    // Update the cart display to remove the item
    DisplayCartSummary();   // Update the cart summary to reflect the change
}

function DisplayCartDetails() { 
    if (window.location.pathname.endsWith("checkout.html")) {
        return; // Don't display full details on checkout.html
    }

    const cartDetailsDiv = document.getElementById("cartDetails");
    let cartEmpty = true;
    let tableHTML = "<table><tr><th>Image</th><th>Product</th><th>Description</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>";
    let subtotal = 0;
    let tax = 0;

    for (let i = 0; i < productNames.length; i++) {
        const qty = parseInt(localStorage.getItem(productIds[i]) || 0);
        if (qty > 0) {
            cartEmpty = false;
            const itemSubtotal = qty * productPrices[i];
            subtotal += itemSubtotal;
            tableHTML += `
        <tr>
          <td><img src="${productImages[i]}" alt="${productNames[i]}" width="50"></td>
          <td>${productNames[i]}</td>
          <td>${productDescriptions[i]}</td>
          <td>$${productPrices[i].toFixed(2)}</td>
          <td>
            <input type="number" class="quantity" id="cartQty${i}" value="${qty}" min="1" max="1000" onchange="UpdateCartItemQuantity(${i})" oninput="validateQuantity(this)" onchange="DisplayCartSummary()">
          </td>
          <td>$${itemSubtotal.toFixed(2)}</td>
          <td><button onclick="RemoveFromCart(${i})">Remove</button></td>
        </tr>`;
        }
    }

    if (cartEmpty) {
        cartDetailsDiv.innerHTML = "<p>Your cart is empty. Please go back to the shop to add items.</p>";
    } else {
        tax = subtotal * TAXRATE;
        const grandTotal = subtotal + tax;
        tableHTML += `
      <tr>
        <td colspan="5"></td> 
        <td><b>Subtotal:</b></td>
        <td>$${subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="5"></td>
        <td><b>Tax:</b></td>
        <td>$${tax.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="5"></td>
        <td><b>Grand Total:</b></td>
        <td>$${grandTotal.toFixed(2)}</td>
      </tr>
    `;

        cartDetailsDiv.innerHTML = tableHTML;
        cartDetailsDiv.innerHTML += `

      <button onclick="ProceedToCheckout()">Proceed to Checkout</button>
      <button onclick="ClearCart()">Clear Cart</button>
      <button onclick="ContinueShopping()">Continue Shopping</button>
    `;
    }
}

function DisplayCartSummaryAtCheckout() {
    const cartSummaryCheckoutDiv = document.getElementById("cartSummaryCheckout");

    let cartEmpty = true;
    let subtotal = 0;
    let tax = 0;
    let shippingCost = 0;

    for (let i = 0; i < productNames.length; i++) {
        const qty = parseInt(localStorage.getItem(productIds[i]) || 0);
        if (qty > 0) {
            cartEmpty = false;
            const itemSubtotal = qty * productPrices[i];
            subtotal += itemSubtotal;
        }
    }

    const selectedShippingOption = document.querySelector('input[name="shipping"]:checked');
    shippingCost = parseFloat(selectedShippingOption.value);

    tax = subtotal * TAXRATE;
    const grandTotal = subtotal + tax + shippingCost;

    if (cartEmpty) {
        cartSummaryCheckoutDiv.innerHTML = `
        <p style="font-weight: bold;">Your shopping cart is currently empty!</p>
        <p>We recommend you go straight to our <a href="shop.html">shopping page</a> to fill it up now!</p>
    `;

        document.getElementById("checkoutForm").style.display = "none";
    } else {

        let tableHTML = `<table class="cart-summary-table">
                        <tr>
                            <th class="quantity-header">Quantity</th>
                            <th class="description-header">Description</th>
                            <th class="price-header">Price</th>
                            <th class="total-header">Product Total</th>
                        </tr>`;


        productNames.forEach((name, i) => {
            const qty = parseInt(localStorage.getItem(productIds[i]) || 0);
            if (qty > 0) {
                const itemSubtotal = qty * productPrices[i];
                tableHTML += `
          <tr>
            <td>${qty}</td>
            <td>${productNames[i]}</td>
            <td>$${productPrices[i].toFixed(2)}</td>
            <td class="product-total">$${itemSubtotal.toFixed(2)}</td>
          </tr>`;
            }
        });

        // Add rows for subtotals, tax, shipping, and grand total
        tableHTML += `
        <tr class="summary-row">
          <td colspan="2"></td>
          <td><b>Subtotal:</b></td>
          <td class="product-total">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr class="summary-row">
          <td colspan="2"></td>
          <td><b>Tax:</b></td>
          <td class="product-total">$${tax.toFixed(2)}</td>
        </tr>
        <tr class="summary-row">
          <td colspan="2"></td>
          <td><b>Shipping:</b></td>
          <td class="product-total">$${shippingCost.toFixed(2)}</td>
        </tr>
        <tr class="summary-row">
          <td colspan="2"></td>
          <td><b>Grand Total:</b></td>
          <td class="product-total">$${grandTotal.toFixed(2)}</td>
        </tr>
      </table>`;

        cartSummaryCheckoutDiv.innerHTML = tableHTML;
    }

    // Event listener for shipping method change
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            DisplayCartSummaryAtCheckout();
        });
    });
}

function isValidPhoneNo() {
    const phoneNumber = document.getElementById("phoneNumber").value;
    const phoneNumberPattern = /^\d{3}-\d{3}-\d{4}$/; // Regular Expression used for the phone format
    const isPhoneFormatValid = phoneNumberPattern.test(phoneNumber);

    const hint = document.getElementById("phoneFormatHint");

    if (isPhoneFormatValid) {
        hint.style.color = "black";
        hint.style.fontWeight = "normal";
    }
    else {
        hint.style.color = "red";
        hint.style.fontWeight = "bold";
    }

    return isPhoneFormatValid;
}

function isValidCardNo() {
    const cardNumber = document.getElementById("cardNo").value;
    const cardNumberPattern = /^\d{12}$/; // Regular Expression for card number format
    const isCardFormatValid = cardNumberPattern.test(cardNumber)

    const hint = document.getElementById("cardFormatHint");

    if (isCardFormatValid) {
        hint.style.color = "black";
        hint.style.fontWeight = "normal";
    }
    else {
        hint.style.color = "red";
        hint.style.fontWeight = "bold";
    }

    return isCardFormatValid;
}

function isValidName(nameInput) {
    const name = nameInput.value.trim();

    // Check if name is empty
    if (name === "") {
        alert("Please enter your name.");
        return false;
    }

    const namePattern = /^[A-Za-z\s'-]+$/;
    if (!namePattern.test(name)) {
        alert("Name can only contain letters, spaces, hyphens, and apostrophes.");
        return false;
    }

    return true; // Valid name
}

function isValidStreetAddress(streetAddressInput) {
    const streetAddress = streetAddressInput.value.trim();

    if (streetAddress === "" && !/\d/.test(streetAddress)) {
        alert("Please enter a valid street address (including a number).");
        return false;
    }

    return true;
}

function isValidCity(cityInput) {
    const city = cityInput.value.trim();

    const cityPattern = /^[A-Za-z\s]+$/;
    if (city === "" || !cityPattern.test(city)) {
        alert("Please enter a valid city name (letters and spaces only).");
        return false;
    }

    return true;
}

function isValidState(stateInput) {
    const state = stateInput.value.trim();

    if (state === "") {
        alert("Please enter a valid state.");
        return false;
    }

    return true;
}

function isValidZip(zipInput) {
    const zip = zipInput.value.trim();
    const zipPattern = /^\d{5}/

    if (!zipPattern.test(zip)) {
        alert("Please enter a valid 5-digit zip code")
        return false;
    }
    return true;
}


function isValidCountry(countryInput) {
    const country = countryInput.value.trim();

    if (country === "") {
        alert("Please enter a valid country.");
        return false;
    }

    return true;
}


function ValidateCheckout() {
    isValidName(document.getElementById('fullname'))
    isValidStreetAddress(document.getElementById('streetAddress'))
    isValidCity(document.getElementById('city'))
    isValidState(document.getElementById('state'))
    isValidZip(document.getElementById('zip'))
    isValidCountry(document.getElementById('country'))
    isValidPhoneNo();
    isValidCardNo();

    if (isValidName(document.getElementById('fullname')) && isValidStreetAddress(document.getElementById('streetAddress')) &&
        isValidCity(document.getElementById('city')) && isValidState(document.getElementById('state')) &&
        isValidZip(document.getElementById('zip')) && isValidCountry(document.getElementById('country')) && isValidPhoneNo() && isValidCardNo()) {
        ClearCart();
        window.location.href = "thankyou.html"; // Redirect if valid
        return true; // Allow form submission
    }
    else {
        return false; // Prevent form submission if not valid
    }
}

function PreFillShippingName() {
    const savedName = localStorage.getItem('customerName');
    const fullnameInput = document.getElementById("fullname"); // Get the fullname input field

    if (savedName && fullnameInput) { // Check if name is saved and input field exists
        fullnameInput.value = savedName;
    }
}