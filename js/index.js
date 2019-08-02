// for user authentication and cart validation
var user = localStorage.getItem("email"); // the user object holds user email
var userNav = document.getElementById("user-nav__user"); // for user login logout
var userCart = document.getElementById("user-nav__cart"); // for cart
var cartBadge = document.getElementById("cart-badge"); // for cart conentent badge
var cart = []; // to store products
// reriveing old cart
var oldCart = localStorage.getItem(user);
if (oldCart != null && oldCart != "") {
    cart = JSON.parse(oldCart);
    cartBadge.innerHTML = cart.length;
}

if (user && user != "") {
    console.log(user);
    userNav.innerHTML = `<a class="user-nav__user-link" href="#">
    <svg class="user-nav__user-icon">
        <use
            xlink:href="img/sprite.svg#icon-user"
        ></use>
    </svg>
    <span class="user-nav__user-name">${user}</span>
</a>`;
} else {
    userNav.innerHTML = `<a class="user-nav__user-link" href="#">
    <svg class="user-nav__user-icon">
        <use
            xlink:href="img/sprite.svg#icon-user"
        ></use>
    </svg>
    <span class="user-nav__user-name">login</span>
</a>`;
}

userNav.onclick = function(e) {
    if (user && user != "") {
        let result = confirm("are you want to logout?");
        if (result) {
            localStorage.setItem("email", "");
            localStorage.setItem(user, "");
            window.location.replace("auth.html");
        }
    } else {
        window.location.replace("auth.html");
    }
};

userCart.onclick = function(e) {
    if (user && user != "") {
        window.location.replace("cart.html");
    } else {
        let result = confirm("please login to use cart");
        if (result) {
            window.location.replace("auth.html");
        }
    }
};

// for category and products
var sideNav = document.getElementById("side-nav");
var productView = document.getElementById("product-view");
var products = null;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // data has been recived so create user models
        products = JSON.parse(this.responseText);
        if (products && products.length != 0) {
            renderCategory(products);
        }
    }
};
xmlhttp.open("GET", "js/database/products.json", true);
xmlhttp.send();

function renderCategory(products) {
    products.forEach((item, index) => {
        sideNav.innerHTML += ` 
        <li id="side-nav__item-${index +
            1}" value="${index}" class="side-nav__item">
        <a href="#" class="side-nav__link">
            <svg class="side-nav__icon">
                <use
                    xlink:href="img/sprite.svg#icon-tablet"
                ></use>
            </svg>
            <span>${item.name}</span>
        </a>
    </li>
        `;
    });

    renderProducts(0);

    products.forEach((item, index) => {
        document.getElementById(
            "side-nav__item-" + (index + 1)
        ).onclick = function(e) {
            renderProducts(this.value);
        };
    });
}

function renderProducts(index) {
    productView.innerHTML = "";
    products[index].data.forEach((item, index) => {
        productView.innerHTML += `
        <div class="product-list">
        <img
            src="${item.img}"
            alt="image not found!"
            class="product-list__image"
        />
        <div class="product-list__content">
            <h2 class="product-list__content-title">
                ${item.name}
            </h2>
            <h4 class="product-list__content-subtitile">
                ${item.company}
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
                    <span>${item.current}</span>
                </div>
                <div
                    class="product-list__content__price-box-actual"
                >
                    <div
                        class="product-list__content__price-box-actual-icon"
                    >
                    ₹
                    </div>
                    <span>${item.actual}</span>
                </div>
            </div>
            <a href="#" id="add-cart-${index}" value="${index}" class="btn-text margin-top-2"
                >add to cart</a
            >
        </div>
    </div>
        `;
    });

    // add to cart
    var popup = document.getElementById("popup");
    products[index].data.forEach((item, index) => {
        document.getElementById("add-cart-" + index).onclick = function(e) {
            if (user && user != "") {
                if (cart.indexOf(item.id) == -1) {
                    cart.push(item.id);
                    cartBadge.innerHTML = cart.length;
                    console.log(JSON.stringify(cart));
                    localStorage.setItem(user, JSON.stringify(cart));
                    // display popup
                    popup.classList.add("popup-show");
                    setTimeout(function() {
                        popup.classList.remove("popup-show");
                    }, 2000);
                } else {
                    alert("Item already in cart!");
                }
            } else {
                let result = confirm("please login to use cart");
                if (result) {
                    window.location.replace("auth.html");
                }
            }
        };
    });
}
