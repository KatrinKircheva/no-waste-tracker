document.addEventListener("DOMContentLoaded", function () {

    const mainSections = [
        document.querySelector(".banner"),
        document.querySelector(".expiring"),
        document.querySelector(".statistics"),
        document.querySelector(".expiring-title"),
        document.querySelector(".recipes"),
        document.querySelector(".recycling")
    ];

    const myProducts = document.querySelector(".my-products");

    const navLinks = document.querySelectorAll(".nav a");

    function setActive(link) {
        navLinks.forEach(a => a.classList.remove("active"));
        link.classList.add("active");
    }

    function animateIn(section) {
        section.classList.add("is-entering");
        // Next frame: remove entering state so CSS transition runs
        requestAnimationFrame(() => {
            section.classList.remove("is-entering");
        });
    }

    function showMainContent() {
        mainSections.forEach(sec => {
            sec.classList.remove("hidden");
        });

        myProducts.classList.add("hidden");

        // Optional: animate the first main section for a subtle effect
        if (mainSections[0]) animateIn(mainSections[0]);
    }

    function showMyProducts() {
        mainSections.forEach(sec => {
            sec.classList.add("hidden");
        });

        myProducts.classList.remove("hidden");
        animateIn(myProducts);
    }

    // HOME
    document.getElementById("homeLink").addEventListener("click", function (e) {
        e.preventDefault();
        showMainContent();
        setActive(this);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // MY PRODUCTS
    document.getElementById("myProductsLink").addEventListener("click", function (e) {
        e.preventDefault();
        showMyProducts();
        setActive(this);
    });

    // RECIPES
    document.getElementById("recipesLink").addEventListener("click", function () {
        showMainContent();
        setActive(this);
    });

    // STATISTICS
    document.getElementById("statisticsLink").addEventListener("click", function () {
        showMainContent();
        setActive(this);
    });

    // RECYCLING
    document.getElementById("recyclingLink").addEventListener("click", function () {
        showMainContent();
        setActive(this);
    });

    // ADD PRODUCT MODAL
    const addProductBtn = document.getElementById("addProductBtn");
    const modal = document.getElementById("addProductModal");
    const closeBtn = document.querySelector(".close");

    if (addProductBtn && modal) {
        addProductBtn.addEventListener("click", function () {
            modal.classList.remove("hidden");
        });

        closeBtn.addEventListener("click", function () {
            modal.classList.add("hidden");
        });

        // Close modal when clicking outside
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.add("hidden");
            }
        });
    }

});