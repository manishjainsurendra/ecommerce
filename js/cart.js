var user = localStorage.getItem("email");
// setting name on header
document.getElementById("user-nav__user-name").innerHTML = user;

var cart = localStorage.getItem(user); // this is cart contantains only ids
var cartItems = []; // this will contains cart products
var productArray = []; // this will store products

// cart class objects store in cartItems array
class Cart {
    constructor(product, quantity) {
        this.product = product;
        this.current = product.current;
        this.actual = product.actual;
        this.quantity = quantity;
    }
    setQuantity = quantity => {
        if (quantity == 0) {
            alert("quantity cannot be 0");
            return [this.current, this.actual];
        }
        this.current = this.product.current * quantity;
        this.actual = this.product.actual * quantity;
        this.quantity = quantity;
        return [this.current, this.actual];
    };

    removeItem(id) {
        return cartItems.filter(item => {
            if (item.product.id == id) {
                return false;
            }
            return true;
        });
    }
}

// creating cart objects and push to cartItems array
function createCartObj(productArray) {
    let cartObjArray = [];
    productArray.forEach(item => {
        cartObjArray.push(new Cart(item, 1)); // default quantity is onw
    });
    return cartObjArray;
}

if (cart == null || cart == "") {
    // cart is empty
} else {
    // cart is not empty so retrive items
    cart = JSON.parse(cart);
    console.log(cart);

    // retriving products from json
    var products = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // data has been recived so filtering to only cart products
            products = JSON.parse(this.responseText);
            if (products && products.length != 0) {
                products.forEach(element => {
                    var data = element.data.filter(item => {
                        if (cart.indexOf(item.id) == -1) {
                            return false;
                        }
                        return true;
                    });
                    productArray = [...productArray, ...data]; // appending new data
                });
                cartItems = createCartObj(productArray); // this will return cartObjects
                if (cartItems.length > 0) {
                    renderProducts(cartItems);
                }
            }
        }
    };
    xmlhttp.open("GET", "js/database/products.json", true);
    xmlhttp.send();
}

var sectionCart = document.getElementById("section-cart");

function renderProducts(products) {
    // this function only render when there are products avalible in cart
    sectionCart.innerHTML = "";
    products.forEach((item, index) => {
        sectionCart.innerHTML += `
        <div class="product-list">
        <img
            src="${item.product.img}"
            alt="image not found!"
            class="product-list__image"
        />
        <div class="product-list__content">
            <h2 class="product-list__content-title">
                ${item.product.name}
            </h2>
            <h4 class="product-list__content-subtitile">
                ${item.product.company}
            </h4>
            <div class="product-list__content-ratings">
                <svg
                    class="product-list__content-ratings-active"
                >
                    <use
                        xlink:href="img/sprite.svg#icon-star"
                    ></use>
                </svg>
                <svg
                    class="product-list__content-ratings-active"
                >
                    <use
                        xlink:href="img/sprite.svg#icon-star"
                    ></use>
                </svg>
                <svg
                    class="product-list__content-ratings-active"
                >
                    <use
                        xlink:href="img/sprite.svg#icon-star"
                    ></use>
                </svg>
                <svg
                    class="product-list__content-ratings-active"
                >
                    <use
                        xlink:href="img/sprite.svg#icon-star"
                    ></use>
                </svg>
                <svg
                    class="product-list__content-ratings-active"
                >
                    <use
                        xlink:href="img/sprite.svg#icon-star"
                    ></use>
                </svg>
            </div>
            <div
                class="product-list__content__price-box"
            >
                <div
                    class="product-list__content__price-box-current"
                >
                    <div
                        class="product-list__content__price-box-current-icon"
                    >
                    ₹
                    </div>
                    <span id="current-${item.product.id}" >${
            item.current
        }</span>
                </div>
                <div
                    class="product-list__content__price-box-actual"
                >
                    <div
                        class="product-list__content__price-box-actual-icon"
                    >
                    ₹
                    </div>
                    <span id="actual-${item.product.id}" >${item.actual}</span>
                </div>
            </div>
            <div
                                        class="product-list__content__quantity"
                                    >
                                        <button
                                            id="btn-minus-${item.product.id}"
                                            class="product-list__content__quantity-minus"
                                        >
                                            <svg
                                                class="product-list__content__quantity-minus-icon"
                                            >
                                                <use
                                                    xlink:href="img/sprite.svg#icon-circle-with-minus"
                                                ></use>
                                            </svg>
                                        </button>
                                        <input
                                            type="number"
                                            id="input-${item.product.id}"
                                            value="1"
                                            class="product-list__content__quantity-input"
                                        />
                                        <button
                                            id="btn-plus-${item.product.id}"
                                            class="product-list__content__quantity-plus"
                                        >
                                            <svg
                                                class="product-list__content__quantity-plus-icon"
                                            >
                                                <use
                                                    xlink:href="img/sprite.svg#icon-circle-with-plus"
                                                ></use>
                                            </svg>
                                        </button>
                                    </div>
                                    <a href="#" id="delete-cart-${
                                        item.product.id
                                    }" value="${index}" class="btn-text btn-text--delete  margin-top-2"
                                    >remove</a
                                >                        
        </div>
    </div>
        `;
    });

    products.forEach(item => {
        var input = document.getElementById("input-" + item.product.id);

        var current = document.getElementById("current-" + item.product.id);
        var actual = document.getElementById("actual-" + item.product.id);

        // quantity
        document.getElementById(
            "btn-minus-" + item.product.id
        ).onclick = function(e) {
            if (parseInt(input.value) == 1) {
                alert("quantity cannot be 0");
            } else {
                input.value = parseInt(input.value) - 1;
                var price = item.setQuantity(parseInt(input.value));
                current.innerHTML = price[0];
                actual.innerHTML = price[1];
            }
        };
        document.getElementById(
            "btn-plus-" + item.product.id
        ).onclick = function(e) {
            input.value = parseInt(input.value) + 1;
            item.setQuantity(parseInt(input.value));
            var price = item.setQuantity(parseInt(input.value));
            current.innerHTML = price[0];
            actual.innerHTML = price[1];
        };
        input.onchange = function(e) {
            if (parseInt(input.value) == 1) {
                alert("quantity cannot be 0");
            } else {
                input.value = parseInt(input.value);
                var price = item.setQuantity(parseInt(input.value));
                current.innerHTML = price[0];
                actual.innerHTML = price[1];
            }
        };

        // delete button
        document.getElementById(
            "delete-cart-" + item.product.id
        ).onclick = function(e) {
            cartItems = item.removeItem(item.product.id);
            renderProducts(cartItems);
            let newCart = cartItems.map(item => item.product.id);
            if (newCart.length == 0) {
                localStorage.setItem(user, "");
            } else {
                localStorage.setItem(user, JSON.stringify(newCart));
            }
        };
    });
}

// checkout

document.getElementById("btn-checkout").onclick = function(e) {
    if (cartItems.length == 0) {
        alert("Please add some items in cart!");
    } else {
        var checkoutProducts = cartItems.map(item => [
            item.product.id,
            item.quantity
        ]);
        localStorage.setItem("checkout", JSON.stringify(checkoutProducts));
        window.location.replace("checkout.html");
    }
};
