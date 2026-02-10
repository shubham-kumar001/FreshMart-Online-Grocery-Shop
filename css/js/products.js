// ===== PRODUCTS MODULE =====

const productsModule = (() => {
    // Products Data
    const products = [
        // Groceries & Staples
        {
            id: 1,
            name: "Basmati Rice",
            description: "Premium quality basmati rice, perfect for biryani",
            price: 450,
            originalPrice: 520,
            discount: 13,
            category: "groceries",
            subCategory: "rice",
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "5 kg",
            brand: "India Gate",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["staples", "rice", "indian"]
        },
        {
            id: 2,
            name: "Fortune Sunflower Oil",
            description: "Refined sunflower oil for healthy cooking",
            price: 210,
            originalPrice: 240,
            discount: 12,
            category: "groceries",
            subCategory: "oil",
            image: "https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 L",
            brand: "Fortune",
            rating: 4.3,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["oil", "cooking", "healthy"]
        },
        {
            id: 3,
            name: "Aashirvaad Atta",
            description: "Whole wheat flour for healthy rotis",
            price: 280,
            originalPrice: 310,
            discount: 10,
            category: "groceries",
            subCategory: "flour",
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "5 kg",
            brand: "Aashirvaad",
            rating: 4.6,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["atta", "flour", "wheat"]
        },
        {
            id: 4,
            name: "Tata Salt",
            description: "Iodized salt for daily cooking",
            price: 25,
            originalPrice: 28,
            discount: 11,
            category: "groceries",
            subCategory: "salt",
            image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 kg",
            brand: "Tata",
            rating: 4.7,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["salt", "iodized", "essential"]
        },
        {
            id: 5,
            name: "MDH Garam Masala",
            description: "Authentic Indian spice blend",
            price: 85,
            originalPrice: 95,
            discount: 11,
            category: "groceries",
            subCategory: "spices",
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "100 g",
            brand: "MDH",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["spices", "masala", "indian"]
        },

        // Vegetables & Fruits
        {
            id: 6,
            name: "Fresh Tomatoes",
            description: "Farm fresh tomatoes, perfect for curries",
            price: 30,
            originalPrice: 35,
            discount: 14,
            category: "vegetables",
            subCategory: "vegetables",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 kg",
            brand: "Farm Fresh",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["vegetables", "fresh", "tomato"]
        },
        {
            id: 7,
            name: "Potatoes",
            description: "Fresh potatoes for all Indian dishes",
            price: 35,
            originalPrice: 40,
            discount: 13,
            category: "vegetables",
            subCategory: "vegetables",
            image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 kg",
            brand: "Premium",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["vegetables", "potato", "staple"]
        },
        {
            id: 8,
            name: "Fresh Apples",
            description: "Crispy red apples, rich in antioxidants",
            price: 150,
            originalPrice: 180,
            discount: 17,
            category: "vegetables",
            subCategory: "fruits",
            image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 kg",
            brand: "Washington",
            rating: 4.7,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: true,
            tags: ["fruits", "apple", "fresh"]
        },
        {
            id: 9,
            name: "Bananas",
            description: "Fresh yellow bananas, naturally ripe",
            price: 50,
            originalPrice: 60,
            discount: 17,
            category: "vegetables",
            subCategory: "fruits",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 dozen",
            brand: "Farm Fresh",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["fruits", "banana", "healthy"]
        },
        {
            id: 10,
            name: "Carrots",
            description: "Fresh carrots, rich in vitamins",
            price: 40,
            originalPrice: 45,
            discount: 11,
            category: "vegetables",
            subCategory: "vegetables",
            image: "https://images.unsplash.com/photo-1598170845058-78131a90f4bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "500 g",
            brand: "Premium",
            rating: 4.3,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["vegetables", "carrot", "healthy"]
        },

        // Dairy, Bread & Eggs
        {
            id: 11,
            name: "Amul Gold Milk",
            description: "Full cream milk, pasteurized",
            price: 32,
            originalPrice: 34,
            discount: 6,
            category: "dairy",
            subCategory: "milk",
            image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "500 ml",
            brand: "Amul",
            rating: 4.6,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["dairy", "milk", "amul"]
        },
        {
            id: 12,
            name: "Fresh Eggs",
            description: "Farm fresh brown eggs",
            price: 60,
            originalPrice: 65,
            discount: 8,
            category: "dairy",
            subCategory: "eggs",
            image: "https://images.unsplash.com/photo-1562043231-4b0c897c3aa3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "6 pieces",
            brand: "Farm Fresh",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["dairy", "eggs", "protein"]
        },
        {
            id: 13,
            name: "Amul Butter",
            description: "Pure butter made from fresh cream",
            price: 50,
            originalPrice: 55,
            discount: 9,
            category: "dairy",
            subCategory: "butter",
            image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "100 g",
            brand: "Amul",
            rating: 4.7,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["dairy", "butter", "amul"]
        },
        {
            id: 14,
            name: "Britannia Bread",
            description: "Fresh whole wheat bread",
            price: 35,
            originalPrice: 40,
            discount: 13,
            category: "dairy",
            subCategory: "bread",
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "400 g",
            brand: "Britannia",
            rating: 4.3,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["dairy", "bread", "britannia"]
        },
        {
            id: 15,
            name: "Amul Cheese Slices",
            description: "Processed cheese slices",
            price: 45,
            originalPrice: 50,
            discount: 10,
            category: "dairy",
            subCategory: "cheese",
            image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "100 g",
            brand: "Amul",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["dairy", "cheese", "amul"]
        },

        // Snacks & Beverages
        {
            id: 16,
            name: "Lays Potato Chips",
            description: "Classic salted potato chips",
            price: 20,
            originalPrice: 25,
            discount: 20,
            category: "snacks",
            subCategory: "chips",
            image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "50 g",
            brand: "Lays",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["snacks", "chips", "lays"]
        },
        {
            id: 17,
            name: "Coca Cola",
            description: "Refreshing carbonated drink",
            price: 40,
            originalPrice: 45,
            discount: 11,
            category: "snacks",
            subCategory: "beverages",
            image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "750 ml",
            brand: "Coca Cola",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["beverages", "soft drink", "cola"]
        },
        {
            id: 18,
            name: "Britannia Good Day Cookies",
            description: "Butter cookies with cashew",
            price: 35,
            originalPrice: 40,
            discount: 13,
            category: "snacks",
            subCategory: "biscuits",
            image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "100 g",
            brand: "Britannia",
            rating: 4.6,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["snacks", "cookies", "britannia"]
        },
        {
            id: 19,
            name: "Maggi Noodles",
            description: "2-minute masala noodles",
            price: 15,
            originalPrice: 20,
            discount: 25,
            category: "snacks",
            subCategory: "noodles",
            image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "70 g",
            brand: "Nestle",
            rating: 4.8,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: true,
            tags: ["snacks", "noodles", "maggi"]
        },
        {
            id: 20,
            name: "Parle-G Biscuits",
            description: "Glucose biscuits, perfect with tea",
            price: 10,
            originalPrice: 12,
            discount: 17,
            category: "snacks",
            subCategory: "biscuits",
            image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "100 g",
            brand: "Parle",
            rating: 4.7,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["snacks", "biscuits", "parle"]
        },

        // Household Care
        {
            id: 21,
            name: "Surf Excel Detergent",
            description: "Matic front load detergent powder",
            price: 150,
            originalPrice: 170,
            discount: 12,
            category: "household",
            subCategory: "detergent",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 kg",
            brand: "Surf Excel",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["household", "detergent", "cleaning"]
        },
        {
            id: 22,
            name: "Domex Floor Cleaner",
            description: "Multipurpose floor cleaner",
            price: 180,
            originalPrice: 200,
            discount: 10,
            category: "household",
            subCategory: "cleaner",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 L",
            brand: "Domex",
            rating: 4.3,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["household", "cleaner", "floor"]
        },
        {
            id: 23,
            name: "Vim Dishwash Gel",
            description: "Lemon powered dishwashing gel",
            price: 85,
            originalPrice: 95,
            discount: 11,
            category: "household",
            subCategory: "dishwash",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "500 ml",
            brand: "Vim",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: false,
            tags: ["household", "dishwash", "cleaning"]
        },
        {
            id: 24,
            name: "Harpic Toilet Cleaner",
            description: "Powerful toilet cleaner",
            price: 120,
            originalPrice: 135,
            discount: 11,
            category: "household",
            subCategory: "cleaner",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 L",
            brand: "Harpic",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: true,
            isDeal: false,
            tags: ["household", "cleaner", "toilet"]
        },
        {
            id: 25,
            name: "Good Knight Mosquito Repellent",
            description: "Fast action mosquito repellent",
            price: 45,
            originalPrice: 50,
            discount: 10,
            category: "household",
            subCategory: "repellent",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "1 unit",
            brand: "Good Knight",
            rating: 4.6,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["household", "repellent", "mosquito"]
        },

        // Featured Deals
        {
            id: 26,
            name: "Dairy Milk Silk",
            description: "Premium chocolate bar",
            price: 90,
            originalPrice: 120,
            discount: 25,
            category: "snacks",
            subCategory: "chocolate",
            image: "https://images.unsplash.com/photo-1570913199992-91d07c140e7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "150 g",
            brand: "Cadbury",
            rating: 4.7,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["snacks", "chocolate", "cadbury"]
        },
        {
            id: 27,
            name: "Tata Tea Gold",
            description: "Premium tea leaves",
            price: 120,
            originalPrice: 150,
            discount: 20,
            category: "groceries",
            subCategory: "tea",
            image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "250 g",
            brand: "Tata",
            rating: 4.4,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["groceries", "tea", "tata"]
        },
        {
            id: 28,
            name: "Nivea Body Lotion",
            description: "Moisturizing body lotion",
            price: 200,
            originalPrice: 250,
            discount: 20,
            category: "personal-care",
            subCategory: "lotion",
            image: "https://images.unsplash.com/photo-1522338242990-8ea4c8c8bcc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "200 ml",
            brand: "Nivea",
            rating: 4.5,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["personal-care", "lotion", "nivea"]
        },
        {
            id: 29,
            name: "Dettol Hand Sanitizer",
            description: "Alcohol based hand sanitizer",
            price: 60,
            originalPrice: 80,
            discount: 25,
            category: "personal-care",
            subCategory: "sanitizer",
            image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "200 ml",
            brand: "Dettol",
            rating: 4.6,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["personal-care", "sanitizer", "dettol"]
        },
        {
            id: 30,
            name: "Kurkure Masala Munch",
            description: "Spicy corn snacks",
            price: 20,
            originalPrice: 25,
            discount: 20,
            category: "snacks",
            subCategory: "namkeen",
            image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            unit: "50 g",
            brand: "Kurkure",
            rating: 4.3,
            deliveryTime: "10 min",
            isFeatured: false,
            isDeal: true,
            tags: ["snacks", "namkeen", "kurkure"]
        }
    ];

    // Categories Data
    const categories = [
        {
            id: 1,
            name: "Groceries & Staples",
            icon: "fas fa-shopping-basket",
            description: "Rice, Dal, Oil, Masala & more",
            productCount: 50,
            color: "#00B894"
        },
        {
            id: 2,
            name: "Vegetables & Fruits",
            icon: "fas fa-carrot",
            description: "Fresh produce, organic options",
            productCount: 45,
            color: "#E17055"
        },
        {
            id: 3,
            name: "Dairy, Bread & Eggs",
            icon: "fas fa-cheese",
            description: "Milk, Eggs, Butter, Bread",
            productCount: 35,
            color: "#FDCB6E"
        },
        {
            id: 4,
            name: "Meat & Fish",
            icon: "fas fa-drumstick-bite",
            description: "Chicken, Mutton, Fish, Seafood",
            productCount: 25,
            color: "#D63031"
        },
        {
            id: 5,
            name: "Snacks & Beverages",
            icon: "fas fa-cookie-bite",
            description: "Chips, Drinks, Biscuits, Chocolates",
            productCount: 40,
            color: "#6C5CE7"
        },
        {
            id: 6,
            name: "Household Care",
            icon: "fas fa-home",
            description: "Cleaning, Detergents, Tools",
            productCount: 38,
            color: "#0984E3"
        },
        {
            id: 7,
            name: "Personal Care",
            icon: "fas fa-spa",
            description: "Shampoo, Soap, Cosmetics",
            productCount: 42,
            color: "#FD79A8"
        },
        {
            id: 8,
            name: "Electronics",
            icon: "fas fa-laptop",
            description: "Earphones, Chargers, Appliances",
            productCount: 22,
            color: "#636E72"
        },
        {
            id: 9,
            name: "Pharma & Wellness",
            icon: "fas fa-pills",
            description: "Medicines, Supplements, Devices",
            productCount: 30,
            color: "#00B894"
        },
        {
            id: 10,
            name: "Baby Care",
            icon: "fas fa-baby",
            description: "Diapers, Baby Food, Wipes",
            productCount: 20,
            color: "#A29BFE"
        },
        {
            id: 11,
            name: "Pet Care",
            icon: "fas fa-paw",
            description: "Pet Food, Toys, Accessories",
            productCount: 18,
            color: "#E17055"
        },
        {
            id: 12,
            name: "Home & Office",
            icon: "fas fa-building",
            description: "Stationery, Decor, Storage",
            productCount: 28,
            color: "#FDCB6E"
        }
    ];

    // State
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Public Methods
    const init = () => {
        console.log('Products module initialized');
        loadCategories();
        loadProducts();
    };

    const loadCategories = () => {
        const categoriesGrid = $('#categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = '';
        
        categories.forEach((category, index) => {
            const categoryCard = createCategoryCard(category, index);
            categoriesGrid.appendChild(categoryCard);
        });
    };

    const createCategoryCard = (category, index) => {
        const card = utils.createElement('a', 'category-card stagger-item');
        card.href = `#${category.name.toLowerCase().replace(/ /g, '-')}`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="category-icon" style="background-color: ${category.color}20; color: ${category.color}">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <span class="product-count">${category.productCount} products</span>
        `;
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            filterProductsByCategory(category.name);
            utils.scrollTo(document.getElementById(category.name.toLowerCase().replace(/ /g, '-')));
        });
        
        return card;
    };

    const loadProducts = () => {
        loadFlashSaleProducts();
        loadFeaturedProducts();
        loadCategoryProducts('groceries', 'groceriesProducts');
        loadCategoryProducts('vegetables', 'vegetablesProducts');
        loadCategoryProducts('dairy', 'dairyProducts');
        loadCategoryProducts('snacks', 'snacksProducts');
        loadCategoryProducts('household', 'householdProducts');
    };

    const loadFlashSaleProducts = () => {
        const container = $('#flashSaleProducts');
        if (!container) return;
        
        const flashProducts = products.filter(p => p.isDeal).slice(0, 4);
        container.innerHTML = '';
        
        flashProducts.forEach((product, index) => {
            const productCard = createProductCard(product, true, index);
            container.appendChild(productCard);
        });
    };

    const loadFeaturedProducts = () => {
        const container = $('#featuredProducts');
        if (!container) return;
        
        const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
        container.innerHTML = '';
        
        featuredProducts.forEach((product, index) => {
            const productCard = createProductCard(product, false, index);
            container.appendChild(productCard);
        });
    };

    const loadCategoryProducts = (category, elementId) => {
        const container = $(`#${elementId}`);
        if (!container) return;
        
        const categoryProducts = products
            .filter(p => p.category === category)
            .slice(0, 4);
        
        container.innerHTML = '';
        
        categoryProducts.forEach((product, index) => {
            const productCard = createProductCard(product, false, index);
            container.appendChild(productCard);
        });
    };

    const createProductCard = (product, isDeal = false, index = 0) => {
        const card = utils.createElement('div', `product-card stagger-item`);
        card.style.animationDelay = `${index * 0.1}s`;
        card.dataset.id = product.id;
        
        const discountPercentage = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 
            product.discount;
        
        card.innerHTML = `
            ${discountPercentage > 0 ? `<div class="product-badge">${discountPercentage}% OFF</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <div>
                        <span class="price-current">${utils.formatCurrency(product.price)}</span>
                        ${product.originalPrice ? `<span class="price-original">${utils.formatCurrency(product.originalPrice)}</span>` : ''}
                    </div>
                    ${discountPercentage > 0 ? `<span class="price-discount">${discountPercentage}% OFF</span>` : ''}
                </div>
                <p class="product-unit">${product.unit}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                    <button class="btn-favorite ${isFavorite(product.id) ? 'active' : ''}" data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const addCartBtn = card.querySelector('.btn-add-cart');
        const favoriteBtn = card.querySelector('.btn-favorite');
        
        addCartBtn.addEventListener('click', () => {
            window.addToCart(product.id, 1);
            utils.showNotification(`${product.name} added to cart!`, 'success');
            utils.animate(addCartBtn, 'animate-cart-add');
        });
        
        favoriteBtn.addEventListener('click', () => {
            toggleFavorite(product.id);
            const isFav = isFavorite(product.id);
            utils.toggleClass(favoriteBtn, 'active');
            utils.showNotification(
                isFav ? 'Added to favorites!' : 'Removed from favorites',
                isFav ? 'success' : 'info'
            );
            utils.animate(favoriteBtn, 'animate-heart-beat');
        });
        
        return card;
    };

    const getProductById = (id) => {
        return products.find(product => product.id === id);
    };

    const getProductsByCategory = (category) => {
        return products.filter(product => product.category === category);
    };

    const searchProducts = (query) => {
        const searchTerm = query.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    };

    const filterProductsByCategory = (category) => {
        const categoryProducts = getProductsByCategory(category.toLowerCase());
        // In a real app, this would update the products grid
        console.log(`Filtering by category: ${category}`, categoryProducts);
        return categoryProducts;
    };

    const getFeaturedProducts = () => {
        return products.filter(product => product.isFeatured);
    };

    const getDealProducts = () => {
        return products.filter(product => product.isDeal);
    };

    const toggleFavorite = (productId) => {
        const index = favorites.indexOf(productId);
        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }
        utils.storage.set('favorites', favorites);
        return index === -1; // Returns true if added, false if removed
    };

    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };

    const getFavorites = () => {
        return favorites.map(id => getProductById(id)).filter(Boolean);
    };

    const getAllProducts = () => {
        return products;
    };

    const getAllCategories = () => {
        return categories;
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

    // Public API
    return {
        init,
        getProductById,
        getProductsByCategory,
        searchProducts,
        filterProductsByCategory,
        getFeaturedProducts,
        getDealProducts,
        toggleFavorite,
        isFavorite,
        getFavorites,
        getAllProducts,
        getAllCategories
    };
})();

// Export to global scope
window.productsModule = productsModule;
