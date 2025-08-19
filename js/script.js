document.addEventListener('DOMContentLoaded', function() {
    // === DOM Elements ===
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const messageModal = document.getElementById('message-modal');
    const messageModalText = document.getElementById('message-modal-text');
    const messageModalClose = document.getElementById('message-modal-close');

    // Catalog and Cart Elements
    const productList = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const checkoutBtn = document.getElementById('checkout-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sustratosBrandButtons = document.querySelectorAll('#sustratos-brands .brand-btn');
    const fertilizantesBrandButtons = document.querySelectorAll('#fertilizantes-brands .brand-btn');
    const subcategoryButtons = document.querySelectorAll('#accessory-subcategories .subcategory-btn');
    
    // Subcategory/Brand Containers (hidden by default)
    const accessorySubcategoriesContainer = document.getElementById('accessory-subcategories');
    const sustratosBrandsContainer = document.getElementById('sustratos-brands');
    const fertilizantesBrandsContainer = document.getElementById('fertilizantes-brands');

    // Admin Elements
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminToggleBtnMobile = document.getElementById('admin-toggle-btn-mobile');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');

    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminCancelBtn = document.getElementById('admin-cancel-btn');
    const adminLoginSubmitBtn = document.getElementById('admin-login-submit-btn');
    const productMgmtSection = document.getElementById('product-mgmt-section');
    
    // Product Management Form Elements
    const productFormName = document.getElementById('product-form-name');
    const productFormPrice = document.getElementById('product-form-price');
    const productFormImageUrl = document.getElementById('product-form-image-url');
    const productFormImageFile = document.getElementById('product-form-image-file');
    const productImagePreview = document.getElementById('product-image-preview');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    const productFormCategory = document.getElementById('product-form-category');
    const productFormSubcategory = document.getElementById('product-form-subcategory'); 
    const productFormBrand = document.getElementById('product-form-brand'); 
    const productFormDescription = document.getElementById('product-form-description'); // NEW: Description field
    const productFormSubmitBtn = document.getElementById('product-form-submit-btn');
    const formTitle = document.getElementById('form-title');
    const existingProductsList = document.getElementById('existing-products-list');

    // === State Variables ===
    const ADMIN_PASSWORD = 'losmarmotasadmin';
    let isAdminLoggedIn = false;
    let editingProductId = null;
    let currentCategory = 'all'; // To maintain the active category state
    let currentBrand = 'all'; // To maintain the active brand state (for substrates/fertilizers)
    let currentSubcategory = 'all-accesorios'; // To maintain the active subcategory state (for accessories)


    // Product Data (with updated brand, subcategory info, and NEW description)
    let products = JSON.parse(localStorage.getItem('growshopProducts')) || [
        // Substrates with brands
        { id: 1, name: 'Sustrato La Pacha Premium 50L', price: 3500, image: 'https://placehold.co/400x400/000000/32CD32?text=La+Pacha', category: 'sustratos', brand: 'la-pacha-sustrato', description: 'Sustrato orgánico de alta calidad para un crecimiento robusto.' },
        { id: 16, name: 'Sustrato Tasty 50L', price: 3800, image: 'https://placehold.co/400x400/000000/32CD32?text=Tasty', category: 'sustratos', brand: 'tasty', description: 'Mezcla premium para un desarrollo óptimo de raíces.' },
        { id: 17, name: 'Sustrato Cultivate Universal', price: 3200, image: 'https://placehold.co/400x400/000000/32CD32?text=Cultivate', category: 'sustratos', brand: 'cultivate', description: 'Versátil y enriquecido para todo tipo de plantas.' },

        // Fertilizers (new brands added)
        { id: 2, name: 'Fertilizante Top Crop Deeper Under', price: 2800, image: 'https://placehold.co/400x400/000000/32CD32?text=Top+Crop', category: 'fertilizantes', brand: 'top-crop', description: 'Estimulante radicular para un inicio fuerte.' },
        { id: 19, name: 'Fertilizante Namaste Flora', price: 4200, image: 'https://placehold.co/400x400/000000/32CD32?text=Namaste', category: 'fertilizantes', brand: 'namaste', description: 'Potenciador de floración para cosechas abundantes.' },
        { id: 20, name: 'Fertilizante Biobizz Grow', price: 4500, image: 'https://placehold.co/400x400/000000/32CD32?text=Biobizz', category: 'fertilizantes', brand: 'biobizz', description: 'Base orgánica para la fase de crecimiento.' },
        { id: 21, name: 'Fertilizante Revegetar Universal', price: 3000, image: 'https://placehold.co/400x400/000000/32CD32?text=Revegetar', category: 'fertilizantes', brand: 'revegetar', description: 'Fórmula completa para revitalizar tus plantas.' },
        { id: 22, name: 'Fertilizante Mamboretá Fungi', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Mamboreta', category: 'fertilizantes', brand: 'mamboreta', description: 'Fungicida preventivo para un cultivo sano.' },
        { id: 23, name: 'Fertilizante Vamp Bloom', price: 3800, image: 'https://placehold.co/400x400/000000/32CD32?text=Vamp', category: 'fertilizantes', brand: 'vamp', description: 'Acelerador de floración para resultados rápidos.' },
        { id: 24, name: 'Fertilizante Tasty Bud', price: 3300, image: 'https://placehold.co/400x400/000000/32CD32?text=Tasty+Fert', category: 'fertilizantes', brand: 'tasty', description: 'Potenciador de sabor y densidad para tus frutos.' },

        // Lighting
        { id: 3, name: 'Kit Iluminación LED', price: 15000, image: 'https://placehold.co/400x400/000000/32CD32?text=Kit+LED', category: 'iluminacion', description: 'Kit completo de iluminación LED de bajo consumo.' },
        
        // Accessories (Parafernalia) with subcategories
        { id: 4, name: 'Filtros Celulosa y Blunt x100 Slim', price: 500, image: 'https://placehold.co/400x400/000000/32CD32?text=Filtros', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Filtros slim de celulosa para una fumada limpia.' },
        { id: 5, name: 'Filtros Celulosa y Blunt Jumbo', price: 750, image: 'https://placehold.co/400x400/000000/32CD32?text=Filtros', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Filtros jumbo para blunts, combustión lenta.' },
        { id: 6, name: 'Papelillos OCB Premium x50', price: 300, image: 'https://placehold.co/400x400/000000/32CD32?text=Papelillos', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos ultra finos para una experiencia premium.' },
        { id: 7, name: 'Papelillos Lion Rolling Circus', price: 450, image: 'https://placehold.co/400x400/000000/32CD32?text=Papelillos', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos de cáñamo con diseños divertidos.' },
        { id: 8, name: 'Picador Metálico 3 Partes', price: 1200, image: 'https://placehold.co/400x400/000000/32CD32?text=Picador', category: 'parafernalia', subcategory: 'picadores', description: 'Picador resistente de metal con tres compartimentos.' },
        { id: 9, name: 'Picador Plástico Simple', price: 600, image: 'https://placehold.co/400x400/000000/32CD32?text=Picador', category: 'parafernalia', subcategory: 'picadores', description: 'Picador básico y funcional de plástico.' },
        { id: 10, name: 'Bandeja Raw Mediana', price: 1800, image: 'https://placehold.co/400x400/000000/32CD32?text=Bandeja', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Bandeja metálica oficial de Raw, tamaño mediano.' },
        { id: 11, name: 'Cenicero de Silicona', price: 950, image: 'https://placehold.co/400x400/000000/32CD32?text=Cenicero', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Cenicero irrompible y fácil de limpiar.' },
        { id: 12, name: 'Frasco Hermético 100ml', price: 800, image: 'https://placehold.co/400x400/000000/32CD32?text=Frasco', category: 'parafernalia', subcategory: 'guardado', description: 'Frasco de cristal con cierre hermético para conservar.' },
        { id: 13, name: 'Bolsa Mylar Antiolor', price: 200, image: 'https://placehold.co/400x400/000000/32CD32?text=Bolsa', category: 'parafernalia', subcategory: 'guardado', description: 'Bolsa resellable con tecnología antiolor.' },
        { id: 14, name: 'Encendedor Bic Grande', price: 400, image: 'https://placehold.co/400x400/000000/32CD32?text=Encendedor', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor Bic clásico, duradero y confiable.' },
        { id: 15, name: 'Encendedor Recargable USB', price: 1500, image: 'https://placehold.co/400x400/000000/32CD32?text=Encendedor+USB', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor eléctrico recargable vía USB, sin llama.' },
        
        // Cultivation Accessories (with descriptions)
        { id: 18, name: 'Tijera de Poda Curva', price: 1100, image: 'https://placehold.co/400x400/000000/32CD32?text=Tijera', category: 'accesorios-de-cultivo', description: 'Tijera de precisión con punta curva para manicura.' },
        { id: 25, name: 'Medidor de PH Digital', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Medidor+PH', category: 'accesorios-de-cultivo', description: 'Medidor digital de PH para control del agua de riego.' },
        { id: 26, name: 'Malla Scrog 1x1m', price: 900, image: 'https://placehold.co/400x400/000000/32CD32?text=Malla+Scrog', category: 'accesorios-de-cultivo', description: 'Malla para método SCROG, optimiza la distribución de ramas.' },
        { id: 27, name: 'Extractor de Aire 4"', price: 8500, image: 'https://placehold.co/400x400/000000/32CD32?text=Extractor', category: 'accesorios-de-cultivo', description: 'Extractor de aire silencioso para renovación del ambiente.' },
        { id: 28, name: 'Termohigrómetro Digital', price: 1800, image: 'https://placehold.co/400x400/000000/32CD32?text=Termometro', category: 'accesorios-de-cultivo', description: 'Controla temperatura y humedad con este dispositivo digital.' },
    ];
    let cart = [];

    // Function to populate brand and subcategory options in the admin form
    function populateProductFormBrands() {
        const brands = [
            // Substrate Brands
            { value: 'tasty', text: 'Tasty (Sustratos)' },
            { value: 'cultivate', text: 'Cultivate' },
            { value: 'la-pacha-sustrato', text: 'La Pacha Sustrato' },
            // Fertilizer Brands (updated)
            { value: 'top-crop', text: 'Top Crop' },
            { value: 'namaste', text: 'Namaste' },
            { value: 'biobizz', text: 'Biobizz' },
            { value: 'revegetar', text: 'Revegetar' },
            { value: 'mamboreta', text: 'Mamboretá' },
            { value: 'vamp', text: 'Vamp' },
            { value: 'tasty-fert', text: 'Tasty (Fertilizantes)' },
        ];
        productFormBrand.innerHTML = '<option value="">Selecciona Marca</option>';
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.value;
            option.textContent = brand.text;
            productFormBrand.appendChild(option);
        });

        // Subcategory options for Parafernalia
        const subcategories = [
            { value: 'celulosa-y-blunt', text: 'Celulosa y Blunt' },
            { value: 'papelillos-y-filtros', text: 'Papelillos y Filtros' },
            { value: 'picadores', text: 'Picadores' },
            { value: 'bandejas-ceniceros', text: 'Bandejas y Ceniceros' },
            { value: 'guardado', text: 'Guardado' },
            { value: 'encendedores', text: 'Encendedores' },
        ];
        productFormSubcategory.innerHTML = '<option value="">Selecciona Subcategoría (Accesorios)</option>';
        subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.value;
            option.textContent = sub.text;
            productFormSubcategory.appendChild(option);
        });
    }

    // === Helper Functions ===

    // Saves products to localStorage
    function saveProductsToLocalStorage() {
        localStorage.setItem('growshopProducts', JSON.stringify(products));
    }

    // Displays a message in the custom modal
    function showMessage(message) {
        messageModalText.textContent = message;
        messageModal.classList.remove('hidden');
    }

    // Updates the admin UI (buttons, section visibility)
    function updateAdminUI() {
        if (isAdminLoggedIn) {
            adminLoginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            logoutBtnMobile.classList.remove('hidden');
            adminToggleBtn.textContent = 'Ocultar Gestión';
            adminToggleBtnMobile.textContent = 'Ocultar Gestión';
        } else {
            adminLoginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            logoutBtnMobile.classList.add('hidden');
            adminToggleBtn.textContent = 'Gestión Admin';
            adminToggleBtnMobile.textContent = 'Gestión Admin';
            productMgmtSection.classList.add('hidden');
        }
    }

    /**
     * Renders products in the catalog view applying filters.
     * @param {string} category - The category to filter ('all' for all).
     * @param {string} selectedBrand - The brand to filter (optional, for substrates/fertilizers).
     * @param {string} selectedSubcategory - The subcategory to filter (optional, for accessories).
     */
    function renderProducts(category, selectedBrand, selectedSubcategory) {
        productList.innerHTML = '';
        let filteredProducts = products;

        // Main filtering logic based on category
        if (category === 'parafernalia') {
            filteredProducts = products.filter(p => p.category === 'parafernalia');
            if (selectedSubcategory && selectedSubcategory !== 'all-accesorios') {
                filteredProducts = filteredProducts.filter(p => p.subcategory === selectedSubcategory);
            }
        } else if (category === 'accesorios-de-cultivo') {
            // When "Accesorios de Cultivo" is selected, filter by this category
            filteredProducts = products.filter(p => p.category === 'accesorios-de-cultivo');
            // No subfilters are applied for this category.
        } else if (category !== 'all') {
            filteredProducts = products.filter(p => p.category === category);
        }

        // Apply brand filter if the category is substrates or fertilizers and a brand is selected
        if ((category === 'sustratos' || category === 'fertilizantes') && selectedBrand && selectedBrand !== 'all-sustratos' && selectedBrand !== 'all-fertilizantes') {
            filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
        }

        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay productos en esta categoría o marca/subcategoría.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover object-center" onerror="this.onerror=null;this.src='https://placehold.co/400x400/cccccc/333333?text=Imagen+No+Disp.''">
                    <div class="p-4">
                        <h4 class="text-lg font-bold">${product.name}</h4>
                        <p class="text-sm text-gray-500 capitalize mb-2">Categoría: ${product.category || 'Sin Categoría'}${product.subcategory ? ` / Subcategoría: ${product.subcategory.replace(/-/g, ' ')}` : ''}${product.brand ? ` / Marca: ${product.brand.replace(/-/g, ' ')}` : ''}</p>
                        ${product.description ? `<p class="text-gray-700 text-sm mb-2">${product.description}</p>` : ''} <!-- NEW: Display description if it exists -->
                        <p class="text-xl font-losmarmotas text-green-600 mb-4">$${product.price.toLocaleString('es-AR')}</p>
                        <button data-id="${product.id}" class="add-to-cart-btn w-full bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });
    }

    // Renders items in the cart
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyCartMsg);
            emptyCartMsg.classList.remove('hidden');
            checkoutBtn.disabled = true;
        } else {
            emptyCartMsg.classList.add('hidden');
            cart.forEach(item => {
                const cartItem = `
                    <div class="flex justify-between items-center text-sm">
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p class="text-gray-600">$${item.price.toLocaleString('es-AR')} x ${item.quantity}</p>
                        </div>
                        <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700 font-bold">X</button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItem;
            });
            checkoutBtn.disabled = false;
        }
        updateCartTotal();
    }

    // Updates the cart total
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `$${total.toLocaleString('es-AR')}`;
    }

    // Adds a product to the cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (product) {
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            renderCart();
        }
    }
    
    // Removes a product from the cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // Renders the list of existing products in the admin section
    function renderExistingProducts() {
        existingProductsList.innerHTML = '';
        products.forEach(product => {
            const productItem = `
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg">
                    <div class="mb-2 sm:mb-0 sm:mr-4 flex-grow">
                        <span class="font-semibold block sm:inline">${product.name}</span>
                        <span class="text-sm text-gray-600 block sm:inline sm:ml-2">($${product.price.toLocaleString('es-AR')})</span>
                        <span class="text-sm text-gray-500 block sm:inline sm:ml-2 capitalize">Categoría: ${product.category || 'Sin Categoría'}${product.subcategory ? ` / Subcategoría: ${product.subcategory.replace(/-/g, ' ')}` : ''}${product.brand ? ` / Marca: ${product.brand.replace(/-/g, ' ')}` : ''}</span>
                        ${product.description ? `<p class="text-gray-600 text-xs mt-1">Descripción: ${product.description}</p>` : ''} <!-- NEW: Display description in admin list -->
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <button data-id="${product.id}" class="edit-product-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition">Editar</button>
                        <button data-id="${product.id}" class="delete-product-btn px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">Eliminar</button>
                    </div>
                </div>
            `;
            existingProductsList.innerHTML += productItem;
        });

        document.querySelectorAll('.delete-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                products = products.filter(p => p.id !== productId);
                saveProductsToLocalStorage();
                renderExistingProducts();
                renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
                showMessage('Producto eliminado exitosamente.');
            });
        });

        document.querySelectorAll('.edit-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                editProduct(productId);
                productMgmtSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Resets the product management form
    function resetProductForm() {
        formTitle.textContent = 'Añadir Nuevo Producto';
        productFormSubmitBtn.textContent = 'Añadir Producto';
        productFormName.value = '';
        productFormPrice.value = '';
        productFormImageUrl.value = '';
        productFormImageFile.value = '';
        productImagePreview.classList.add('hidden');
        previewPlaceholder.classList.remove('hidden');
        productImagePreview.src = '';
        productFormCategory.value = '';
        productFormSubcategory.classList.add('hidden'); // Hide by default
        productFormBrand.classList.add('hidden'); // Hide by default
        productFormSubcategory.value = ''; // Reset value
        productFormBrand.value = ''; // Reset value
        productFormDescription.value = ''; // NEW: Reset description field
        editingProductId = null;
    }

    // Loads product data for editing
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            formTitle.textContent = `Editar Producto: ${product.name}`;
            productFormSubmitBtn.textContent = 'Guardar Cambios';
            productFormName.value = product.name;
            productFormPrice.value = product.price;
            productFormImageUrl.value = product.image;
            productFormCategory.value = product.category;
            productFormDescription.value = product.description || ''; // NEW: Load description
            
            // Show and load subcategory if it's 'parafernalia'
            if (product.category === 'parafernalia') {
                productFormSubcategory.classList.remove('hidden');
                productFormSubcategory.value = product.subcategory || '';
                productFormBrand.classList.add('hidden'); // Hide brand field
            } else if (product.category === 'sustratos' || product.category === 'fertilizantes') {
                productFormBrand.classList.remove('hidden'); // Show brand field
                productFormBrand.value = product.brand || '';
                productFormSubcategory.classList.add('hidden'); // Hide subcategory field
            } else { // If it's any other category, including 'accesorios-de-cultivo'
                productFormSubcategory.classList.add('hidden');
                productFormBrand.classList.add('hidden');
            }
            
            if (product.image) {
                productImagePreview.src = product.image;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
            } else {
                productImagePreview.classList.add('hidden');
                previewPlaceholder.classList.remove('hidden');
                productImagePreview.src = '';
            }
            productFormImageFile.value = '';
            editingProductId = productId;
        }
    }

    // Handles product form submission (add/edit)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); // NEW: Get description

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Additional validation for subcategory or brand based on the main category
        if (category === 'parafernalia' && !subcategory) {
            showMessage('Por favor, selecciona una Subcategoría para Parafernalia.');
            return;
        }
        if ((category === 'sustratos' || category === 'fertilizantes') && !brand) {
            showMessage('Por favor, selecciona una Marca para Sustratos o Fertilizantes.');
            return;
        }

        const newProductData = {
            name,
            price,
            image,
            category,
            description // NEW: Add description to product data
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No 'subcategory' or 'brand' assigned if the category is 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edit existing product
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
    });

    // Control visibility of subcategory/brand selects in the admin form
    productFormCategory.addEventListener('change', function() {
        productFormSubcategory.classList.add('hidden');
        productFormBrand.classList.add('hidden');
        productFormSubcategory.value = ''; 
        productFormBrand.value = ''; 

        if (this.value === 'parafernalia') {
            productFormSubcategory.classList.remove('hidden');
        } else if (this.value === 'sustratos' || this.value === 'fertilizantes') {
            productFormBrand.classList.remove('hidden');
        }
        // If the selected category is 'accesorios-de-cultivo', subcategory and brand fields remain hidden.
    });


    // === Catalog Event Listeners ===

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Message modal close
    messageModalClose.addEventListener('click', () => {
        messageModal.classList.add('hidden');
    });

    // Add to cart from product list
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Remove from cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = '541123956472';
        let message = '¡Hola Los Marmotas Grow Shop! Estoy interesado en los siguientes productos:\n\n';
        
        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity})\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal estimado: $${total.toLocaleString('es-AR')}`;

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Event listener for main category filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryToFilter = button.getAttribute('data-category');
            const isBrandButton = button.classList.contains('brand-btn');
            const isSubcategoryButton = button.classList.contains('subcategory-btn');

            // Deactivate all main filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            
            // Hide all subcategory/brand containers at the start of each click
            accessorySubcategoriesContainer.classList.add('hidden');
            sustratosBrandsContainer.classList.add('hidden');
            fertilizantesBrandsContainer.classList.add('hidden');

            if (isBrandButton) {
                // Logic for brand buttons (Substrates/Fertilizers)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                if (button.closest('#sustratos-brands')) {
                    currentCategory = 'sustratos';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    sustratosBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.add('bg-green-500', 'text-black');
                } else if (button.closest('#fertilizantes-brands')) {
                    currentCategory = 'fertilizantes';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.add('bg-green-500', 'text-black');
                }
                
            } else if (isSubcategoryButton) {
                // Logic for subcategory buttons (within Parafernalia)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                currentCategory = 'parafernalia'; 
                currentSubcategory = button.getAttribute('data-subcategory');
                currentBrand = 'all'; 
                accessorySubcategoriesContainer.classList.remove('hidden'); 

                // Activate the main category button "Parafernalia"
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.remove('bg-gray-200', 'text-gray-800');
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.add('bg-green-500', 'text-black');
                
                // Ensure the "Accesorios de Cultivo" button is not active
                const accesoriosCultivoBtn = document.querySelector('.filter-btn[data-category="accesorios-de-cultivo']');
                if (accesoriosCultivoBtn) {
                    accesoriosCultivoBtn.classList.remove('bg-green-500', 'text-black');
                    accesoriosCultivoBtn.classList.add('bg-gray-200', 'text-gray-800');
                }

            } else { // Logic for main category buttons (All, Substrates, Fertilizers, Lighting, Parafernalia, Cultivation Accessories)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');
                currentCategory = categoryToFilter;
                currentBrand = 'all'; 
                currentSubcategory = 'all-accesorios'; 

                // Show relevant subcategory/brand container if applicable
                if (currentCategory === 'parafernalia') {
                    accessorySubcategoriesContainer.classList.remove('hidden');
                    // Activate the "All Accessories" button by default
                    document.querySelector('#accessory-subcategories .subcategory-btn[data-subcategory="all-accesorios"]').click();
                } else if (currentCategory === 'accesorios-de-cultivo') {
                    // If "Accesorios de Cultivo" is selected, hide subfilters
                    accessorySubcategoriesContainer.classList.add('hidden');
                    // No need to call .click() on all-accesorios here, as subfilters are not shown.
                    // The renderProducts logic will display products for this category.
                } else if (currentCategory === 'sustratos') {
                    sustratosBrandsContainer.classList.remove('hidden');
                    // Activate "All Substrates Brands" button by default
                    document.querySelector('#sustratos-brands .brand-btn[data-brand="all-sustratos"]').click();
                } else if (currentCategory === 'fertilizantes') {
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    // Activate "All Fertilizers Brands" button by default
                    document.querySelector('#fertilizantes-brands .brand-btn[data-brand="all-fertilizantes"]').click();
                }
            }
            renderProducts(currentCategory, currentBrand, currentSubcategory);
        });
    });

    // === Admin Event Listeners ===
    adminLoginBtn.addEventListener('click', () => {
        adminLoginModal.classList.remove('hidden');
        adminPasswordInput.value = '';
    });

    adminCancelBtn.addEventListener('click', () => {
        adminLoginModal.classList.add('hidden');
    });

    adminLoginSubmitBtn.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            adminLoginModal.classList.add('hidden');
            isAdminLoggedIn = true;
            updateAdminUI();
            productMgmtSection.classList.remove('hidden');
            resetProductForm();
            renderExistingProducts();
            showMessage('Has iniciado sesión como administrador.');
            productMgmtSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage('Contraseña incorrecta.');
        }
    });

    // Event for logout button (desktop)
    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        showMessage('Has cerrado sesión de administrador.');
    });

    // Event for logout button (mobile)
    logoutBtnMobile.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        mobileMenu.classList.add('hidden');
        showMessage('Has cerrado sesión de administrador.');
    });

    // Toggle product management section (desktop)
    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtn.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Toggle product management section (mobile)
    if (adminToggleBtnMobile) {
        adminToggleBtnMobile.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtnMobile.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Handle image preview when entering URL
    productFormImageUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
            productImagePreview.src = url;
            productImagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handle image preview when selecting local file
    productFormImageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productImagePreview.src = e.target.result;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                productFormImageUrl.value = e.target.result;
                showMessage('Imagen local cargada para previsualización. Para almacenamiento permanente, esta imagen debe ser una URL pública.');
            };
            reader.readAsDataURL(file);
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handles product form submission (add/edit)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); // NEW: Get description

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Additional validation for subcategory or brand based on the main category
        if (category === 'parafernalia' && !subcategory) {
            showMessage('Por favor, selecciona una Subcategoría para Parafernalia.');
            return;
        }
        if ((category === 'sustratos' || category === 'fertilizantes') && !brand) {
            showMessage('Por favor, selecciona una Marca para Sustratos o Fertilizantes.');
            return;
        }

        const newProductData = {
            name,
            price,
            image,
            category,
            description // NEW: Add description to product data
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No 'subcategory' or 'brand' assigned if the category is 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edit existing product
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
    });

    // Control visibility of subcategory/brand selects in the admin form
    productFormCategory.addEventListener('change', function() {
        productFormSubcategory.classList.add('hidden');
        productFormBrand.classList.add('hidden');
        productFormSubcategory.value = ''; 
        productFormBrand.value = ''; 

        if (this.value === 'parafernalia') {
            productFormSubcategory.classList.remove('hidden');
        } else if (this.value === 'sustratos' || this.value === 'fertilizantes') {
            productFormBrand.classList.remove('hidden');
        }
        // If the selected category is 'accesorios-de-cultivo', subcategory and brand fields remain hidden.
    });


    // === Catalog Event Listeners ===

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Message modal close
    messageModalClose.addEventListener('click', () => {
        messageModal.classList.add('hidden');
    });

    // Add to cart from product list
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Remove from cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = '541123956472';
        let message = '¡Hola Los Marmotas Grow Shop! Estoy interesado en los siguientes productos:\n\n';
        
        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity})\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal estimado: $${total.toLocaleString('es-AR')}`;

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Event listener for main category filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryToFilter = button.getAttribute('data-category');
            const isBrandButton = button.classList.contains('brand-btn');
            const isSubcategoryButton = button.classList.contains('subcategory-btn');

            // Deactivate all main filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            
            // Hide all subcategory/brand containers at the start of each click
            accessorySubcategoriesContainer.classList.add('hidden');
            sustratosBrandsContainer.classList.add('hidden');
            fertilizantesBrandsContainer.classList.add('hidden');

            if (isBrandButton) {
                // Logic for brand buttons (Substrates/Fertilizers)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                if (button.closest('#sustratos-brands')) {
                    currentCategory = 'sustratos';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    sustratosBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.add('bg-green-500', 'text-black');
                } else if (button.closest('#fertilizantes-brands')) {
                    currentCategory = 'fertilizantes';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.add('bg-green-500', 'text-black');
                }
                
            } else if (isSubcategoryButton) {
                // Logic for subcategory buttons (within Parafernalia)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                currentCategory = 'parafernalia'; 
                currentSubcategory = button.getAttribute('data-subcategory');
                currentBrand = 'all'; 
                accessorySubcategoriesContainer.classList.remove('hidden'); 

                // Activate the main category button "Parafernalia"
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.remove('bg-gray-200', 'text-gray-800');
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.add('bg-green-500', 'text-black');
                
                // Ensure the "Accesorios de Cultivo" button is not active
                const accesoriosCultivoBtn = document.querySelector('.filter-btn[data-category="accesorios-de-cultivo"]');
                if (accesoriosCultivoBtn) {
                    accesoriosCultivoBtn.classList.remove('bg-green-500', 'text-black');
                    accesoriosCultivoBtn.classList.add('bg-gray-200', 'text-gray-800');
                }

            } else { // Logic for main category buttons (All, Substrates, Fertilizers, Lighting, Parafernalia, Cultivation Accessories)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');
                currentCategory = categoryToFilter;
                currentBrand = 'all'; 
                currentSubcategory = 'all-accesorios'; 

                // Show relevant subcategory/brand container if applicable
                if (currentCategory === 'parafernalia') {
                    accessorySubcategoriesContainer.classList.remove('hidden');
                    // Activate the "All Accessories" button by default
                    document.querySelector('#accessory-subcategories .subcategory-btn[data-subcategory="all-accesorios"]').click();
                } else if (currentCategory === 'accesorios-de-cultivo') {
                    // If "Accesorios de Cultivo" is selected, hide subfilters
                    accessorySubcategoriesContainer.classList.add('hidden');
                    // No need to call .click() on all-accesorios here, as subfilters are not shown.
                    // The renderProducts logic will display products for this category.
                } else if (currentCategory === 'sustratos') {
                    sustratosBrandsContainer.classList.remove('hidden');
                    // Activate "All Substrates Brands" button by default
                    document.querySelector('#sustratos-brands .brand-btn[data-brand="all-sustratos"]').click();
                } else if (currentCategory === 'fertilizantes') {
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    // Activate "All Fertilizers Brands" button by default
                    document.querySelector('#fertilizantes-brands .brand-btn[data-brand="all-fertilizantes"]').click();
                }
            }
            renderProducts(currentCategory, currentBrand, currentSubcategory);
        });
    });

    // === Admin Event Listeners ===
    adminLoginBtn.addEventListener('click', () => {
        adminLoginModal.classList.remove('hidden');
        adminPasswordInput.value = '';
    });

    adminCancelBtn.addEventListener('click', () => {
        adminLoginModal.classList.add('hidden');
    });

    adminLoginSubmitBtn.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            adminLoginModal.classList.add('hidden');
            isAdminLoggedIn = true;
            updateAdminUI();
            productMgmtSection.classList.remove('hidden');
            resetProductForm();
            renderExistingProducts();
            showMessage('Has iniciado sesión como administrador.');
            productMgmtSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage('Contraseña incorrecta.');
        }
    });

    // Event for logout button (desktop)
    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        showMessage('Has cerrado sesión de administrador.');
    });

    // Event for logout button (mobile)
    logoutBtnMobile.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        mobileMenu.classList.add('hidden');
        showMessage('Has cerrado sesión de administrador.');
    });

    // Toggle product management section (desktop)
    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtn.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Toggle product management section (mobile)
    if (adminToggleBtnMobile) {
        adminToggleBtnMobile.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtnMobile.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Handle image preview when entering URL
    productFormImageUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
            productImagePreview.src = url;
            productImagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handle image preview when selecting local file
    productFormImageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productImagePreview.src = e.target.result;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                productFormImageUrl.value = e.target.result;
                showMessage('Imagen local cargada para previsualización. Para almacenamiento permanente, esta imagen debe ser una URL pública.');
            };
            reader.readAsDataURL(file);
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handles product form submission (add/edit)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); // NEW: Get description

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Additional validation for subcategory or brand based on the main category
        if (category === 'parafernalia' && !subcategory) {
            showMessage('Por favor, selecciona una Subcategoría para Parafernalia.');
            return;
        }
        if ((category === 'sustratos' || category === 'fertilizantes') && !brand) {
            showMessage('Por favor, selecciona una Marca para Sustratos o Fertilizantes.');
            return;
        }

        const newProductData = {
            name,
            price,
            image,
            category,
            description // NEW: Add description to product data
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No 'subcategory' or 'brand' assigned if the category is 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edit existing product
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
    });

    // Control visibility of subcategory/brand selects in the admin form
    productFormCategory.addEventListener('change', function() {
        productFormSubcategory.classList.add('hidden');
        productFormBrand.classList.add('hidden');
        productFormSubcategory.value = ''; 
        productFormBrand.value = ''; 

        if (this.value === 'parafernalia') {
            productFormSubcategory.classList.remove('hidden');
        } else if (this.value === 'sustratos' || this.value === 'fertilizantes') {
            productFormBrand.classList.remove('hidden');
        }
        // If the selected category is 'accesorios-de-cultivo', subcategory and brand fields remain hidden.
    });


    // === Catalog Event Listeners ===

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Message modal close
    messageModalClose.addEventListener('click', () => {
        messageModal.classList.add('hidden');
    });

    // Add to cart from product list
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Remove from cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = '541123956472';
        let message = '¡Hola Los Marmotas Grow Shop! Estoy interesado en los siguientes productos:\n\n';
        
        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity})\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal estimado: $${total.toLocaleString('es-AR')}`;

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Event listener for main category filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryToFilter = button.getAttribute('data-category');
            const isBrandButton = button.classList.contains('brand-btn');
            const isSubcategoryButton = button.classList.contains('subcategory-btn');

            // Deactivate all main filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            
            // Hide all subcategory/brand containers at the start of each click
            accessorySubcategoriesContainer.classList.add('hidden');
            sustratosBrandsContainer.classList.add('hidden');
            fertilizantesBrandsContainer.classList.add('hidden');

            if (isBrandButton) {
                // Logic for brand buttons (Substrates/Fertilizers)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                if (button.closest('#sustratos-brands')) {
                    currentCategory = 'sustratos';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    sustratosBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.add('bg-green-500', 'text-black');
                } else if (button.closest('#fertilizantes-brands')) {
                    currentCategory = 'fertilizantes';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.add('bg-green-500', 'text-black');
                }
                
            } else if (isSubcategoryButton) {
                // Logic for subcategory buttons (within Parafernalia)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                currentCategory = 'parafernalia'; 
                currentSubcategory = button.getAttribute('data-subcategory');
                currentBrand = 'all'; 
                accessorySubcategoriesContainer.classList.remove('hidden'); 

                // Activate the main category button "Parafernalia"
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.remove('bg-gray-200', 'text-gray-800');
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.add('bg-green-500', 'text-black');
                
                // Ensure the "Accesorios de Cultivo" button is not active
                const accesoriosCultivoBtn = document.querySelector('.filter-btn[data-category="accesorios-de-cultivo"]');
                if (accesoriosCultivoBtn) {
                    accesoriosCultivoBtn.classList.remove('bg-green-500', 'text-black');
                    accesoriosCultivoBtn.classList.add('bg-gray-200', 'text-gray-800');
                }

            } else { // Logic for main category buttons (All, Substrates, Fertilizers, Lighting, Parafernalia, Cultivation Accessories)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');
                currentCategory = categoryToFilter;
                currentBrand = 'all'; 
                currentSubcategory = 'all-accesorios'; 

                // Show relevant subcategory/brand container if applicable
                if (currentCategory === 'parafernalia') {
                    accessorySubcategoriesContainer.classList.remove('hidden');
                    // Activate the "All Accessories" button by default
                    document.querySelector('#accessory-subcategories .subcategory-btn[data-subcategory="all-accesorios"]').click();
                } else if (currentCategory === 'accesorios-de-cultivo') {
                    // If "Accesorios de Cultivo" is selected, hide subfilters
                    accessorySubcategoriesContainer.classList.add('hidden');
                    // No need to call .click() on all-accesorios here, as subfilters are not shown.
                    // The renderProducts logic will display products for this category.
                } else if (currentCategory === 'sustratos') {
                    sustratosBrandsContainer.classList.remove('hidden');
                    // Activate "All Substrates Brands" button by default
                    document.querySelector('#sustratos-brands .brand-btn[data-brand="all-sustratos"]').click();
                } else if (currentCategory === 'fertilizantes') {
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    // Activate "All Fertilizers Brands" button by default
                    document.querySelector('#fertilizantes-brands .brand-btn[data-brand="all-fertilizantes"]').click();
                }
            }
            renderProducts(currentCategory, currentBrand, currentSubcategory);
        });
    });

    // === Admin Event Listeners ===
    adminLoginBtn.addEventListener('click', () => {
        adminLoginModal.classList.remove('hidden');
        adminPasswordInput.value = '';
    });

    adminCancelBtn.addEventListener('click', () => {
        adminLoginModal.classList.add('hidden');
    });

    adminLoginSubmitBtn.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            adminLoginModal.classList.add('hidden');
            isAdminLoggedIn = true;
            updateAdminUI();
            productMgmtSection.classList.remove('hidden');
            resetProductForm();
            renderExistingProducts();
            showMessage('Has iniciado sesión como administrador.');
            productMgmtSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage('Contraseña incorrecta.');
        }
    });

    // Event for logout button (desktop)
    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        showMessage('Has cerrado sesión de administrador.');
    });

    // Event for logout button (mobile)
    logoutBtnMobile.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        mobileMenu.classList.add('hidden');
        showMessage('Has cerrado sesión de administrador.');
    });

    // Toggle product management section (desktop)
    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtn.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Toggle product management section (mobile)
    if (adminToggleBtnMobile) {
        adminToggleBtnMobile.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtnMobile.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Handle image preview when entering URL
    productFormImageUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
            productImagePreview.src = url;
            productImagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handle image preview when selecting local file
    productFormImageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productImagePreview.src = e.target.result;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                productFormImageUrl.value = e.target.result;
                showMessage('Imagen local cargada para previsualización. Para almacenamiento permanente, esta imagen debe ser una URL pública.');
            };
            reader.readAsDataURL(file);
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // === Initialization on page load ===
    updateAdminUI();
    populateProductFormBrands();
    renderProducts(currentCategory, currentBrand, currentSubcategory); // Display products initially
    document.getElementById('filter-all').click(); // Activate "All" button on start
    renderCart();
});
