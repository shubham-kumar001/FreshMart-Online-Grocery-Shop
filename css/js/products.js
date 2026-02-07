// Enhanced Products Data and Functions for QuickCart Pro

const Products = {
    // Enhanced category data
    categories: [
        {
            id: 1,
            name: "Fresh Produce",
            icon: "🥦",
            description: "Vegetables & Fruits",
            image: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1192&q=80",
            color: "#4CAF50",
            featured: true
        },
        {
            id: 2,
            name: "Dairy & Eggs",
            icon: "🥛",
            description: "Milk, Cheese, Eggs",
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
            color: "#FF9800",
            featured: true
        },
        {
            id: 3,
            name: "Meat & Seafood",
            icon: "🥩",
            description: "Fresh Meat & Fish",
            image: "https://images.unsplash.com/photo-1559314809-2b99056a8c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            color: "#F44336",
            featured: true
        },
        {
            id: 4,
            name: "Beverages",
            icon: "🥤",
            description: "Juices, Sodas, Water",
            image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1257&q=80",
            color: "#2196F3",
            featured: true
        },
        {
            id: 5,
            name: "Bakery",
            icon: "🍞",
            description: "Bread & Pastries",
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80",
            color: "#795548",
            featured: false
        },
        {
            id: 6,
            name: "Pantry Staples",
            icon: "🍚",
            description: "Rice, Pasta, Oil",
            image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1065&q=80",
            color: "#607D8B",
            featured: false
        },
        {
            id: 7,
            name: "Snacks",
            icon: "🍫",
            description: "Chips, Cookies, Candy",
            image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=1167&q=80",
            color: "#9C27B0",
            featured: false
        },
        {
            id: 8,
            name: "Frozen Foods",
            icon: "❄️",
            description: "Frozen Meals & Veggies",
            image: "https://images.unsplash.com/photo-1613243555978-636c48dc653c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            color: "#03A9F4",
            featured: false
        },
        {
            id: 9,
            name: "Organic",
            icon: "🌿",
            description: "Organic Products",
            image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            color: "#8BC34A",
            featured: true
        },
        {
            id: 10,
            name: "Household",
            icon: "🏠",
            description: "Cleaning & Essentials",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1158&q=80",
            color: "#9E9E9E",
            featured: false
        }
    ],

    // Enhanced product data with more details
    products: [
        // Fresh Produce
        {
            id: 101,
            name: "Organic Bananas",
            category: "Fresh Produce",
            subcategory: "Fruits",
            price: 0.69,
            originalPrice: 0.79,
            description: "Fresh organic bananas, perfect for smoothies or snacks. Grown sustainably in Ecuador.",
            image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=627&q=80",
            unit: "per lb",
            weight: "1 lb",
            organic: true,
            featured: true,
            deal: false,
            rating: 4.5,
            reviews: 128,
            stock: 150,
            tags: ["organic", "fruit", "healthy"]
        },
        {
            id: 102,
            name: "Fresh Strawberries",
            category: "Fresh Produce",
            subcategory: "Berries",
            price: 3.99,
            originalPrice: 4.99,
            description: "Sweet and juicy California strawberries. Picked at peak ripeness for maximum flavor.",
            image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "1 lb container",
            weight: "1 lb",
            organic: false,
            featured: true,
            deal: true,
            rating: 4.8,
            reviews: 89,
            stock: 75,
            tags: ["berry", "fresh", "sweet"]
        },
        {
            id: 103,
            name: "Organic Avocados",
            category: "Fresh Produce",
            subcategory: "Vegetables",
            price: 1.99,
            originalPrice: 2.49,
            description: "Creamy Hass avocados, perfect for guacamole, salads, or toast. Organic and sustainably grown.",
            image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
            unit: "each",
            weight: "medium",
            organic: true,
            featured: true,
            deal: false,
            rating: 4.6,
            reviews: 203,
            stock: 200,
            tags: ["organic", "healthy", "superfood"]
        },
        {
            id: 104,
            name: "Fresh Milk",
            category: "Dairy & Eggs",
            subcategory: "Dairy",
            price: 3.49,
            originalPrice: null,
            description: "Whole milk, 1 gallon. From local farms, pasteurized for safety and freshness.",
            image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1156&q=80",
            unit: "1 gallon",
            weight: "1 gallon",
            organic: false,
            featured: false,
            deal: false,
            rating: 4.3,
            reviews: 156,
            stock: 120,
            tags: ["dairy", "fresh", "local"]
        },
        {
            id: 105,
            name: "Organic Eggs",
            category: "Dairy & Eggs",
            subcategory: "Eggs",
            price: 4.99,
            originalPrice: 5.99,
            description: "Free-range organic eggs, dozen. From chickens raised on organic feed with access to pasture.",
            image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "dozen",
            weight: "12 eggs",
            organic: true,
            featured: true,
            deal: true,
            rating: 4.7,
            reviews: 312,
            stock: 180,
            tags: ["organic", "free-range", "protein"]
        },
        {
            id: 106,
            name: "Cheddar Cheese",
            category: "Dairy & Eggs",
            subcategory: "Cheese",
            price: 4.49,
            originalPrice: null,
            description: "Sharp cheddar cheese block. Aged for 6 months for rich, tangy flavor.",
            image: "https://images.unsplash.com/photo-1566385101042-1a0f0c126a96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1331&q=80",
            unit: "8 oz",
            weight: "8 oz",
            organic: false,
            featured: false,
            deal: false,
            rating: 4.4,
            reviews: 89,
            stock: 95,
            tags: ["cheese", "dairy", "aged"]
        },
        {
            id: 107,
            name: "Ground Beef",
            category: "Meat & Seafood",
            subcategory: "Beef",
            price: 5.99,
            originalPrice: 6.99,
            description: "80/20 lean ground beef. Perfect for burgers, meatballs, or tacos.",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "per lb",
            weight: "1 lb",
            organic: false,
            featured: true,
            deal: true,
            rating: 4.5,
            reviews: 167,
            stock: 80,
            tags: ["beef", "protein", "fresh"]
        },
        {
            id: 108,
            name: "Atlantic Salmon",
            category: "Meat & Seafood",
            subcategory: "Seafood",
            price: 9.99,
            originalPrice: 12.99,
            description: "Fresh Atlantic salmon fillets. Wild-caught, rich in omega-3 fatty acids.",
            image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "per lb",
            weight: "1 lb",
            organic: false,
            featured: true,
            deal: true,
            rating: 4.9,
            reviews: 245,
            stock: 45,
            tags: ["seafood", "healthy", "omega-3"]
        },
        {
            id: 109,
            name: "Boneless Chicken Breast",
            category: "Meat & Seafood",
            subcategory: "Poultry",
            price: 3.99,
            originalPrice: null,
            description: "Fresh boneless skinless chicken breast. Raised without antibiotics.",
            image: "https://images.unsplash.com/photo-1604503468506-9f2c0fcb8e6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "per lb",
            weight: "1 lb",
            organic: false,
            featured: false,
            deal: false,
            rating: 4.6,
            reviews: 189,
            stock: 150,
            tags: ["chicken", "protein", "antibiotic-free"]
        },
        // Add more products for variety
        {
            id: 110,
            name: "Orange Juice",
            category: "Beverages",
            subcategory: "Juices",
            price: 3.79,
            originalPrice: 4.29,
            description: "100% pure orange juice, not from concentrate. No added sugars or preservatives.",
            image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
            unit: "64 oz",
            weight: "64 oz",
            organic: false,
            featured: false,
            deal: true,
            rating: 4.4,
            reviews: 134,
            stock: 200,
            tags: ["juice", "vitamin-c", "fresh"]
        },
        {
            id: 111,
            name: "Bottled Water",
            category: "Beverages",
            subcategory: "Water",
            price: 4.99,
            originalPrice: null,
            description: "Purified drinking water, 24-pack. Great for hydration at home or on the go.",
            image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "24-pack",
            weight: "24 bottles",
            organic: false,
            featured: false,
            deal: false,
            rating: 4.2,
            reviews: 78,
            stock: 300,
            tags: ["water", "hydration", "essential"]
        },
        {
            id: 112,
            name: "Artisan Bread",
            category: "Bakery",
            subcategory: "Bread",
            price: 4.49,
            originalPrice: 4.99,
            description: "Freshly baked artisan sourdough bread. Made with simple, natural ingredients.",
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80",
            unit: "loaf",
            weight: "1 lb",
            organic: true,
            featured: true,
            deal: false,
            rating: 4.7,
            reviews: 156,
            stock: 60,
            tags: ["bread", "artisan", "sourdough"]
        },
        {
            id: 113,
            name: "Organic Spinach",
            category: "Fresh Produce",
            subcategory: "Leafy Greens",
            price: 2.99,
            originalPrice: null,
            description: "Fresh organic baby spinach. Perfect for salads, smoothies, or sautéing.",
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "5 oz bag",
            weight: "5 oz",
            organic: true,
            featured: false,
            deal: false,
            rating: 4.5,
            reviews: 98,
            stock: 120,
            tags: ["organic", "greens", "healthy"]
        },
        {
            id: 114,
            name: "Greek Yogurt",
            category: "Dairy & Eggs",
            subcategory: "Yogurt",
            price: 1.29,
            originalPrice: 1.49,
            description: "Plain non-fat Greek yogurt. High in protein, perfect for breakfast or snacks.",
            image: "https://images.unsplash.com/photo-1551782450-17144ef8c57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
            unit: "5.3 oz",
            weight: "5.3 oz",
            organic: false,
            featured: false,
            deal: true,
            rating: 4.6,
            reviews: 210,
            stock: 250,
            tags: ["yogurt", "protein", "healthy"]
        },
        {
            id: 115,
            name: "Fresh Tomatoes",
            category: "Fresh Produce",
            subcategory: "Vegetables",
            price: 1.99,
            originalPrice: null,
            description: "Vine-ripened tomatoes. Juicy and flavorful, great for salads or cooking.",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "per lb",
            weight: "1 lb",
            organic: false,
            featured: false,
            deal: false,
            rating: 4.3,
            reviews: 76,
            stock: 180,
            tags: ["vegetable", "fresh", "versatile"]
        },
        {
            id: 116,
            name: "Potato Chips",
            category: "Snacks",
            subcategory: "Chips",
            price: 2.99,
            originalPrice: 3.49,
            description: "Classic potato chips. Thinly sliced and perfectly salted for maximum crunch.",
            image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "8 oz bag",
            weight: "8 oz",
            organic: false,
            featured: false,
            deal: true,
            rating: 4.1,
            reviews: 145,
            stock: 300,
            tags: ["snack", "chips", "crunchy"]
        },
        {
            id: 117,
            name: "Organic Quinoa",
            category: "Pantry Staples",
            subcategory: "Grains",
            price: 5.99,
            originalPrice: 6.99,
            description: "Organic quinoa. High-protein ancient grain, perfect for salads and bowls.",
            image: "https://images.unsplash.com/photo-1598962084154-7c91a6241a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "16 oz bag",
            weight: "16 oz",
            organic: true,
            featured: true,
            deal: true,
            rating: 4.8,
            reviews: 189,
            stock: 90,
            tags: ["organic", "grain", "protein"]
        },
        {
            id: 118,
            name: "Extra Virgin Olive Oil",
            category: "Pantry Staples",
            subcategory: "Oils",
            price: 8.99,
            originalPrice: 10.99,
            description: "Premium extra virgin olive oil. Cold-pressed for maximum flavor and nutrients.",
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "17 oz bottle",
            weight: "17 oz",
            organic: true,
            featured: true,
            deal: false,
            rating: 4.9,
            reviews: 267,
            stock: 75,
            tags: ["oil", "healthy", "premium"]
        },
        {
            id: 119,
            name: "Dark Chocolate",
            category: "Snacks",
            subcategory: "Chocolate",
            price: 3.49,
            originalPrice: 3.99,
            description: "70% dark chocolate bar. Rich in antioxidants with a smooth, bittersweet flavor.",
            image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
            unit: "3.5 oz bar",
            weight: "3.5 oz",
            organic: true,
            featured: false,
            deal: true,
            rating: 4.7,
            reviews: 198,
            stock: 150,
            tags: ["chocolate", "dark", "antioxidants"]
        },
        {
            id: 120,
            name: "Frozen Mixed Berries",
            category: "Frozen Foods",
            subcategory: "Frozen Fruits",
            price: 6.99,
            originalPrice: 7.99,
            description: "Frozen mixed berries. Perfect for smoothies, baking, or as a healthy dessert.",
            image: "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            unit: "32 oz bag",
            weight: "32 oz",
            organic: false,
            featured: false,
            deal: false,
            rating: 4.4,
            reviews: 112,
            stock: 200,
            tags: ["frozen", "berries", "smoothie"]
        }
    ],

    // Enhanced product methods
    getAllProducts: function() {
        return this.products;
    },

    getFeaturedProducts: function() {
        return this.products.filter(product => product.featured);
    },

    getDealProducts: function() {
        return this.products.filter(product => product.deal);
    },

    getProductsByCategory: function(category) {
        return this.products.filter(product => product.category === category);
    },

    getProductById: function(id) {
        return this.products.find(product => product.id === id);
    },

    getAllCategories: function() {
        return this.categories;
    },

    getFeaturedCategories: function() {
        return this.categories.filter(category => category.featured);
    },

    searchProducts: function(query) {
        if (!query) return [];
        
        const searchTerm = query.toLowerCase().trim();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.subcategory.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    },

    filterProducts: function(options) {
        let filtered = [...this.products];
        
        if (options.category) {
            filtered = filtered.filter(p => p.category === options.category);
        }
        
        if (options.organic) {
            filtered = filtered.filter(p => p.organic === true);
        }
        
        if (options.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= options.minPrice);
        }
        
        if (options.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= options.maxPrice);
        }
        
        if (options.sortBy) {
            switch (options.sortBy) {
                case 'price-asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case 'name':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }
        
        return filtered;
    },

    getRelatedProducts: function(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];
        
        return this.products
            .filter(p => 
                p.id !== productId && 
                (p.category === product.category || p.subcategory === product.subcategory)
            )
            .slice(0, limit);
    },

    getTopRatedProducts: function(limit = 6) {
        return [...this.products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    },

    getNewArrivals: function() {
        // Simulate new arrivals by selecting some products
        return this.products.filter(p => [101, 108, 117, 119].includes(p.id));
    },

    getBestsellers: function() {
        // Simulate bestsellers by selecting products with high ratings and reviews
        return this.products
            .filter(p => p.rating >= 4.5 && p.reviews > 100)
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 8);
    },

    // Generate product SKU
    generateSKU: function(product) {
        const categoryCode = product.category.substring(0, 3).toUpperCase();
        const idCode = product.id.toString().padStart(4, '0');
        return `QC-${categoryCode}-${idCode}`;
    },

    // Calculate savings percentage
    calculateSavings: function(product) {
        if (!product.originalPrice || product.originalPrice <= product.price) {
            return 0;
        }
        return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    },

    // Get product rating stars HTML
    getRatingStars: function(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        
        return stars;
    }
};

// Export Products globally
window.Products = Products;
