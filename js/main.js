/* =========================================================
   HOME FASHION
   MAIN JAVASCRIPT
   V4 - FUNCTIONAL SHOPPING CART
========================================================= */


/* =========================================================
   CART STORAGE
========================================================= */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("homeFashionCart")) || [];
    } catch (error) {
        console.error("Could not read cart:", error);
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        "homeFashionCart",
        JSON.stringify(cart)
    );
}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart = getCart();

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const totalQuantity = cart.reduce(
        function (total, item) {
            return total + item.quantity;
        },
        0
    );

    cartCount.textContent = totalQuantity;
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const product = products.find(
        function (item) {
            return item.id === Number(productId);
        }
    );

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    let cart = getCart();

    const existingItem = cart.find(
        function (item) {
            return item.id === product.id;
        }
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();

    console.log("Cart:", cart);

    showCartMessage(
        product.name + " added to your cart."
    );
}


/* =========================================================
   CART MESSAGE
========================================================= */

function showCartMessage(message) {

    let messageBox =
        document.getElementById("cart-message");

    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id = "cart-message";

        document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;

    messageBox.classList.add("show");

    setTimeout(function () {

        messageBox.classList.remove("show");

    }, 2000);
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    return `
        <article class="product-card">

            <div class="product-image">

                ${
                    product.featured
                        ? `<span class="badge">FEATURED</span>`
                        : ""
                }

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <button
                    type="button"
                    class="quick-add"
                    onclick="addToCart(${product.id})"
                >
                    ADD TO CART
                </button>

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>

                <p class="price">
                    $${product.price.toFixed(2)}
                </p>

            </div>

        </article>
    `;
}


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts(
    containerId,
    productList
) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML =
        productList
            .map(createProductCard)
            .join("");
}


/* =========================================================
   FEATURED PRODUCTS
========================================================= */

function loadFeaturedProducts() {

    if (typeof products === "undefined") {
        return;
    }

    const featuredProducts =
        products.filter(function (product) {
            return product.featured;
        });

    displayProducts(
        "featured-products",
        featuredProducts
    );
}


/* =========================================================
   SHOP PRODUCTS
========================================================= */

function loadShopProducts() {

    if (typeof products === "undefined") {
        return;
    }

    displayProducts(
        "shop-products",
        products
    );
}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function loadProductDetails() {

    const container =
        document.getElementById("product-detail");

    if (!container) {
        return;
    }

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        Number(urlParams.get("id"));

    const product =
        products.find(function (item) {
            return item.id === productId;
        });

    if (!product) {

        container.innerHTML = `
            <div class="container">

                <h2>Product Not Found</h2>

                <p>
                    The product you are looking
                    for does not exist.
                </p>

                <a
                    href="shop.html"
                    class="btn btn-dark"
                >
                    BACK TO SHOP
                </a>

            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="container">

            <div class="product-detail-grid">

                <div class="product-detail-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-detail-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h1>
                        ${product.name}
                    </h1>

                    <div class="rating">
                        ★★★★★
                        <span>
                            ${product.rating} / 5
                        </span>
                    </div>

                    <p class="detail-price">
                        $${product.price.toFixed(2)}
                    </p>

                    <p class="description">
                        ${product.description}
                    </p>


                    <div class="product-option">

                        <label for="size">
                            Size
                        </label>

                        <select id="size">

                            <option value="standard">
                                Standard
                            </option>

                            <option value="small">
                                Small
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="large">
                                Large
                            </option>

                        </select>

                    </div>


                    <div class="quantity">

                        <button
                            type="button"
                            onclick="changeProductQuantity(-1)"
                        >
                            −
                        </button>

                        <span id="product-quantity">
                            1
                        </span>

                        <button
                            type="button"
                            onclick="changeProductQuantity(1)"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="btn btn-dark full-width"
                        onclick="addProductFromDetails(${product.id})"
                    >
                        ADD TO CART
                    </button>


                    <div class="product-benefits">

                        <p>
                            ✓ ${product.stock} items available
                        </p>

                        <p>
                            ✓ Secure checkout
                        </p>

                        <p>
                            ✓ Quality home products
                        </p>

                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   PRODUCT PAGE QUANTITY
========================================================= */

let productPageQuantity = 1;


function changeProductQuantity(amount) {

    productPageQuantity += amount;

    if (productPageQuantity < 1) {
        productPageQuantity = 1;
    }

    const quantityElement =
        document.getElementById(
            "product-quantity"
        );

    if (quantityElement) {

        quantityElement.textContent =
            productPageQuantity;
    }
}


/* =========================================================
   ADD FROM PRODUCT DETAILS
========================================================= */

function addProductFromDetails(productId) {

    const product =
        products.find(function (item) {
            return item.id === Number(productId);
        });

    if (!product) {
        return;
    }

    let cart = getCart();

    const existingItem =
        cart.find(function (item) {
            return item.id === product.id;
        });


    if (existingItem) {

        existingItem.quantity +=
            productPageQuantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: productPageQuantity

        });
    }


    saveCart(cart);

    updateCartCount();

    showCartMessage(
        product.name + " added to your cart."
    );


    productPageQuantity = 1;

    const quantityElement =
        document.getElementById(
            "product-quantity"
        );

    if (quantityElement) {
        quantityElement.textContent = "1";
    }
}


/* =========================================================
   CART PAGE
========================================================= */

function loadCartPage() {

    const cartItems =
        document.getElementById("cart-items");

    const cartSummary =
        document.getElementById("cart-summary");

    if (!cartItems) {
        return;
    }

    const cart = getCart();


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your Cart Is Empty
                </h2>

                <p>
                    You haven't added any products yet.
                </p>

                <a
                    href="shop.html"
                    class="btn btn-dark"
                >
                    CONTINUE SHOPPING
                </a>

            </div>
        `;

        if (cartSummary) {
            cartSummary.innerHTML = "";
        }

        return;
    }


    /* CART ITEMS */

    cartItems.innerHTML =
        cart.map(function (item) {

            const itemTotal =
                item.price * item.quantity;

            return `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >


                    <div class="cart-item-info">

                        <p class="product-category">
                            ${getCategory(item.id)}
                        </p>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            $${item.price.toFixed(2)}
                            each
                        </p>

                    </div>


                    <div class="cart-quantity">

                        <button
                            type="button"
                            onclick="changeCartQuantity(${item.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="changeCartQuantity(${item.id}, 1)"
                        >
                            +
                        </button>

                    </div>


                    <strong class="cart-item-total">

                        $${itemTotal.toFixed(2)}

                    </strong>


                    <button
                        type="button"
                        class="remove-cart-item"
                        onclick="removeCartItem(${item.id})"
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");


    /* TOTAL */

    const subtotal =
        cart.reduce(function (
            total,
            item
        ) {

            return total +
                (item.price * item.quantity);

        }, 0);


    if (cartSummary) {

        cartSummary.innerHTML = `

            <h2>
                Order Summary
            </h2>


            <div class="summary-row">

                <span>
                    Subtotal
                </span>

                <strong>
                    $${subtotal.toFixed(2)}
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Delivery
                </span>

                <strong>
                    FREE
                </strong>

            </div>


            <div class="summary-total">

                <span>
                    Total
                </span>

                <strong>
                    $${subtotal.toFixed(2)}
                </strong>

            </div>


            <button
                type="button"
                class="btn btn-dark full-width"
                onclick="checkout()"
            >
                PROCEED TO CHECKOUT
            </button>

        `;
    }
}


/* =========================================================
   GET CATEGORY
========================================================= */

function getCategory(productId) {

    const product =
        products.find(function (item) {
            return item.id === Number(productId);
        });

    if (!product) {
        return "";
    }

    return product.category;
}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(
    productId,
    change
) {

    let cart = getCart();

    const item =
        cart.find(function (cartItem) {
            return cartItem.id === Number(productId);
        });

    if (!item) {
        return;
    }

    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(function (cartItem) {
                return cartItem.id !== Number(productId);
            });
    }


    saveCart(cart);

    updateCartCount();

    loadCartPage();
}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeCartItem(productId) {

    let cart = getCart();

    cart =
        cart.filter(function (item) {
            return item.id !== Number(productId);
        });

    saveCart(cart);

    updateCartCount();

    loadCartPage();
}


/* =========================================================
   CHECKOUT
========================================================= */

function checkout() {

    alert(
        "Checkout will be implemented in a later version."
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.querySelector(".menu-btn");

    const nav =
        document.querySelector(".nav");

    if (!menuButton || !nav) {
        return;
    }

    menuButton.addEventListener(
        "click",
        function () {

            nav.classList.toggle("show");

        }
    );
}


/* =========================================================
   SEARCH BOX
========================================================= */

function setupSearch() {

    const searchButton =
        document.querySelector(".search-btn");

    const searchBox =
        document.querySelector(".search-box");

    if (!searchButton || !searchBox) {
        return;
    }

    searchButton.addEventListener(
        "click",
        function () {

            searchBox.classList.toggle("show");

        }
    );
}


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadFeaturedProducts();

        loadShopProducts();

        loadProductDetails();

        loadCartPage();

        setupMobileMenu();

        setupSearch();

    }
);