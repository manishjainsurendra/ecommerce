var user = localStorage.getItem("email");
// setting name on header
document.getElementById("user-nav__user-name").innerHTML = user;

var sectionCheckout = document.getElementById("section-checkout");
var sectionCheckoutTable = document.getElementById("section-checkout-table");
var checkoutItems = []; // this will hold checkouts objects
var checkout = localStorage.getItem("checkout");
var xmlhttp = new XMLHttpRequest();

if (checkout && checkout != "") {
    checkout = JSON.parse(checkout); // converted to array
    retriveProducts(checkout);
}

function retriveProducts(data) {
    console.log(data);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // data has been recived so filtering to only cart products
            var products = JSON.parse(this.responseText);
            if (products && products.length != 0) {
                console.log(products);
                var filteredProducts = [];
                products.forEach(element => {
                    let temp = element.data.filter(product => {
                        return data.some(item => item[0] == product.id);
                    });
                    filteredProducts = [...filteredProducts, ...temp];
                });
                console.log(filteredProducts);
                // converting to checkout objects
                filteredProducts.forEach((item, index) => {
                    createCheckoutObj(item, checkout[index][1]); // this will create checkout object and push in checkoutItems array
                });

                console.log(checkoutItems);

                if (checkoutItems.length > 0) {
                    renderProducts(checkoutItems);
                }
            }
        }
    };
    xmlhttp.open("GET", "js/database/products.json", true);
    xmlhttp.send();
}

class Checkout {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
        this.total = product.current * quantity;
        this.saved = Math.round((1 - product.current / product.actual) * 100);
    }
}

function createCheckoutObj(product, quantity) {
    // creating checkout object and pushing to checkoutItems array
    checkoutItems.push(new Checkout(product, quantity));
}

function renderProducts(checkoutItems) {
    // this block will render only if there are products in checkout array
    var grandTotal = 0;
    var grandSaved = 0;
    sectionCheckoutTable.innerHTML = `
    <tr class="table-row">
    <th class="table-heading">sr.</th>
    <th class="table-heading">name</th>
    <th class="table-heading">price</th>
    <th class="table-heading">quantity</th>
    <th class="table-heading">total</th>
    <th class="table-heading">saved</th>
    </tr>
    `;
    checkoutItems.forEach((item, index) => {
        sectionCheckoutTable.innerHTML += `
        <tr class="table-row">
        <td class="table-column">${index + 1}</td>
        <td class="table-column">${item.product.name}</td>
        <td class="table-column">${item.product.current}</td>
        <td class="table-column">${item.quantity}</td>
        <td class="table-column">${item.total}</td>
        <td class="table-column table-highlight">
            ${item.saved}%
        </td>
    </tr>
        `;

        grandTotal += item.total;
        grandSaved += item.saved;
    });

    // total calculation
    sectionCheckoutTable.innerHTML += `
        <tr class="table-row">
        <td colspan="4" class="table-column table-bold">Total</td>
        <td class="table-column table-bold">${grandTotal}</td>
        <td class="table-column table-highlight">
            ${(grandSaved / checkoutItems.length).toPrecision(2)}%
        </td>
    </tr>
        `;

    sectionCheckout.innerHTML += `
            <textarea
            rows="10"
            id="address"
            class="textarea"
            placeholder="Address"
        ></textarea>

        <div class="float-box">
            <a
                class="btn btn--primary btn--animated"
                id = "btn-place-order"
                href="#"
                id="btn-sign-in"
            >
                place order
            </a>
        </div>
    `;

    document.getElementById("btn-place-order").onclick = function(e) {
        var address = document.getElementById("address").value;
        if (address && address != "") {
            // order is placed so clearing cart and checkout
            localStorage.setItem(user, "");
            localStorage.setItem("checkout", "");
            alert("Thank you!, your order has been placed! ");
            window.location.replace("index.html");
        } else {
            alert("Please enter your address!");
        }
    };
}
