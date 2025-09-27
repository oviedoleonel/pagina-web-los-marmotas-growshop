

// ⚠️ IMPORTANTE: Reemplaza estos valores con la URL y la clave de tu bin en JSONBin.io
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/68b0b2daae596e708fda590a';
const API_KEY = '$2a$10$ZQsqRydDmM9PLH8CLoDxLe7zCgsGIi4n.ZcNTlZPHwlf98MTn4L6K';

// Obtener elementos del DOM
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const checkoutBtn = document.getElementById('checkout-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginModal = document.getElementById('admin-login-modal');
const adminLoginSubmitBtn = document.getElementById('admin-login-submit-btn');
const adminCancelBtn = document.getElementById('admin-cancel-btn');
const adminPasswordInput = document.getElementById('admin-password');
const productMgmtSection = document.getElementById('product-mgmt-section');
const adminToggleBtn = document.getElementById('admin-toggle-btn');
const logoutBtn = document.getElementById('logout-btn');
const messageModal = document.getElementById('message-modal');
const messageModalText = document.getElementById('message-modal-text');
const messageModalClose = document.getElementById('message-modal-close');
const productFormName = document.getElementById('product-form-name');
const productFormPrice = document.getElementById('product-form-price');
const productFormCategory = document.getElementById('product-form-category');
const productFormSubmitBtn = document.getElementById('product-form-submit-btn');
const existingProductsList = document.getElementById('existing-products-list');
const formTitle = document.getElementById('form-title');
const productFormImageUrl = document.getElementById('product-form-image-url');
const productFormImageFile = document.getElementById('product-form-image-file');
const productImagePreview = document.getElementById('product-image-preview');
const previewPlaceholder = document.getElementById('preview-placeholder');
const productFormSubcategory = document.getElementById('product-form-subcategory');
const productFormSemillasEsquejesSubcategory = document.getElementById('product-form-semillas-esquejes-subcategory');
const productFormBrand = document.getElementById('product-form-brand');
const productFormDescription = document.getElementById('product-form-description');
const productFormQuantity = document.getElementById('product-form-quantity');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeImageModalBtn = document.getElementById('close-image-modal');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const adminToggleBtnMobile = document.getElementById('admin-toggle-btn-mobile');
const logoutBtnMobile = document.getElementById('logout-btn-mobile');
// NUEVOS elementos DOM para Drag & Drop y Animación
const cartContainer = document.getElementById('cart-container');


// Estado de la aplicación
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let adminMode = false;
let editingProductId = null;

let currentCategory = 'all';
let currentSubcategory = null;
let currentBrand = null;
let currentQuantity = null;

// Funciones de gestión de datos
const saveProducts = async (productsToSave) => {
    try {
        await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
            body: JSON.stringify({ "articulos": productsToSave }),
        });
    } catch (error) {
        console.error('Error al guardar los productos:', error);
    }
};

const loadProducts = async () => {
    try {
        const response = await fetch(JSONBIN_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY,
            },
        });
        const data = await response.json();
        return data.record.articulos;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
};

const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const showMessage = (message) => {
    messageModalText.textContent = message;
    messageModal.classList.remove('hidden');
};

const hideMessage = () => {
    messageModal.classList.add('hidden');
};

const showLoginModal = () => {
    adminLoginModal.classList.remove('hidden');
};

const hideLoginModal = () => {
    adminLoginModal.classList.add('hidden');
    adminPasswordInput.value = '';
};

const toggleAdminMode = () => {
    adminMode = !adminMode;
    if (adminMode) {
        productMgmtSection.classList.remove('hidden');
        adminToggleBtn.textContent = 'Modo Tienda';
        adminToggleBtnMobile.textContent = 'Modo Tienda';
        logoutBtn.classList.remove('hidden');
        logoutBtnMobile.classList.remove('hidden');
        document.body.classList.add('admin-mode');
        renderAdminProducts();
    } else {
        productMgmtSection.classList.add('hidden');
        adminToggleBtn.textContent = 'Gestión Admin';
        adminToggleBtnMobile.textContent = 'Gestión Admin';
        logoutBtn.classList.add('hidden');
        logoutBtnMobile.classList.add('hidden');
        document.body.classList.remove('admin-mode');
    }
};

const updateCartDisplay = () => {
    cartItems.innerHTML = '';
    let total = 0;
    let hasItems = false;
    for (const productId in cart) {
        if (cart[productId].quantity > 0) {
            hasItems = true;
            const item = cart[productId];
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center';
            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <div class="flex items-center space-x-2">
                    <span class="font-bold">$${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700 transition" data-id="${item.id}" aria-label="Eliminar del carrito">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            `;
            cartItems.appendChild(li);
            total += item.price * item.quantity;
        }
    }
    cartTotal.textContent = `$${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    if (hasItems) {
        emptyCartMsg.classList.add('hidden');
        checkoutBtn.disabled = false;
    } else {
        emptyCartMsg.classList.remove('hidden');
        checkoutBtn.disabled = true;
    }
    saveCartToLocalStorage();
};

const renderProducts = () => {
    productList.innerHTML = '';
    const filteredProducts = products.filter(product => {
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        const subcategoryMatch = !currentSubcategory || currentSubcategory === 'all-accesorios' || currentSubcategory === 'all-semillas-esquejes' || product.subcategory === currentSubcategory;
        const brandMatch = !currentBrand || currentBrand === 'all-sustratos' || currentBrand === 'all-fertilizantes' || product.brand === currentBrand;
        const quantityMatch = !currentQuantity || product.quantity === currentQuantity;

        return categoryMatch && subcategoryMatch && brandMatch && quantityMatch;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = `<p class="text-center text-gray-500 md:col-span-3">No hay productos en esta categoría.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl product-card';
        
        const imageUrl = product.imageUrl && (product.imageUrl.startsWith('http') || product.imageUrl.startsWith('data:'))
            ? product.imageUrl
            : 'https://placehold.co/400x300/e879f9/ffffff?text=Imagen+No+Disponible';
            
        const descriptionText = product.description || 'Sin descripción.';
        const isLongDescription = descriptionText.length > 150;
        const descriptionClass = isLongDescription ? 'description-clamp' : '';

        productCard.innerHTML = `
            <img src="${imageUrl}" onerror="this.onerror=null;this.src='https://placehold.co/400x300/e879f9/ffffff?text=Error+al+Cargar+Imagen';" alt="${product.name}" class="w-full h-48 object-cover object-center cursor-pointer product-image-to-animate">
            <div class="p-4">
                <h3 class="text-xl font-bold mb-1">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-2 ${descriptionClass}">${descriptionText}</p>
                ${isLongDescription ? `<button class="read-more-btn text-green-500 hover:text-green-600 font-semibold text-sm mt-1">Ver más</button>` : ''}
                <div class="flex items-center justify-between mt-2">
                    <span class="text-2xl font-bold text-green-600">$${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    <button class="add-to-cart-btn bg-green-500 text-black font-bold py-2 px-4 rounded-full hover:bg-green-600 transition" data-id="${product.id}">
                        Añadir
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });

    productList.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const descriptionElement = e.target.previousElementSibling;
            if (descriptionElement.classList.contains('description-clamp')) {
                descriptionElement.classList.remove('description-clamp');
                e.target.textContent = 'Ver menos';
            } else {
                descriptionElement.classList.add('description-clamp');
                e.target.textContent = 'Ver más';
            }
        });
    });
};

// Lógica de Drag & Drop para el modo administrador
let draggedItem = null;

const handleDragStart = (e) => {
    draggedItem = e.currentTarget;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const currentItem = e.currentTarget;
    if (currentItem !== draggedItem) {
        const bounding = currentItem.getBoundingClientRect();
        const offset = bounding.y + (bounding.height / 2);
        if (e.clientY > offset) {
            existingProductsList.insertBefore(draggedItem, currentItem.nextSibling);
        } else {
            existingProductsList.insertBefore(draggedItem, currentItem);
        }
    }
};

const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    const newOrder = Array.from(existingProductsList.children).map(item => item.dataset.id);

    // Reordenar el array de productos
    const newProducts = [];
    newOrder.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            newProducts.push(product);
        }
    });

    products = newProducts;
    saveProducts(products); // Guardar el nuevo orden
    renderProducts(); // Actualizar la vista de la tienda

    draggedItem = null;
};

const renderAdminProducts = () => {
    existingProductsList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm admin-product-item';
        productItem.setAttribute('draggable', true);
        productItem.dataset.id = product.id;

        // Añadir manejadores de Drag & Drop
        productItem.addEventListener('dragstart', handleDragStart);
        productItem.addEventListener('dragover', handleDragOver);
        productItem.addEventListener('dragend', handleDragEnd);

        productItem.innerHTML = `
            <div class="drag-handle mr-3 cursor-grab text-gray-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1zM10 17a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1zM3 10a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1zM17 10a1 1 0 01-1-1h-2a1 1 0 110 2h2a1 1 0 011-1zM5.636 5.636a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L7.05 7.05a1 1 0 01-1.414 0zM14.364 5.636a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 010-1.414zM5.636 14.364a1 1 0 010 1.414l1.414 1.414a1 1 0 011.414 0l1.414-1.414a1 1 0 01-1.414-1.414l-1.414 1.414a1 1 0 010 1.414zM14.364 14.364a1 1 0 011.414 0l1.414-1.414a1 1 0 010-1.414l-1.414-1.414a1 1 0 01-1.414 1.414l1.414 1.414a1 1 0 010 1.414z"/></svg>
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-bold truncate">${product.name}</p>
                <p class="text-sm text-gray-500">$${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} - Cat: ${product.category}${product.subcategory ? ` (${product.subcategory})` : ''}${product.brand ? `, Marca: ${product.brand}` : ''}${product.quantity ? `, Cantidad: x${product.quantity}` : ''}</p>
            </div>
            <div class="flex space-x-2 ml-4">
                <button class="edit-product-btn text-blue-500 hover:text-blue-700 transition" data-id="${product.id}" aria-label="Editar producto">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.794.793-2.828-2.828.794-.793zm-3.11 4.293l-5.657 5.657-1.414-1.414 5.657-5.657 1.414 1.414zM10 13a3 3 0 100-6 3 3 0 000 6z"></path></svg>
                </button>
                <button class="delete-product-btn text-red-500 hover:text-red-700 transition" data-id="${product.id}" aria-label="Eliminar producto">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        `;
        existingProductsList.appendChild(productItem);
    });
};

// Función para la animación "Fly to Cart"
const flyToCartAnimation = (imageElement) => {
    // 1. Clonar la imagen para la animación
    const flyingImage = imageElement.cloneNode();
    flyingImage.classList.remove('product-image-to-animate');
    flyingImage.style.cssText = `
        position: fixed;
        width: ${imageElement.offsetWidth}px;
        height: ${imageElement.offsetHeight}px;
        top: ${imageElement.getBoundingClientRect().top}px;
        left: ${imageElement.getBoundingClientRect().left}px;
        opacity: 1;
        z-index: 500;
        transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border-radius: 50%; /* Opcional: para que parezca una bolita de item */
        object-fit: cover;
    `;
    document.body.appendChild(flyingImage);

    // 2. Determinar la posición final (el carrito)
    const cartRect = cartContainer.getBoundingClientRect();
    const finalX = cartRect.left + cartRect.width / 2 - 25; // Centrado
    const finalY = cartRect.top + 20; // Cerca del ícono

    // 3. Iniciar la animación
    setTimeout(() => {
        flyingImage.style.top = `${finalY}px`;
        flyingImage.style.left = `${finalX}px`;
        flyingImage.style.width = '50px';
        flyingImage.style.height = '50px';
        flyingImage.style.opacity = '0';
    }, 10);

    // 4. Limpiar el clon y dar feedback visual al carrito
    setTimeout(() => {
        flyingImage.remove();
        // Feedback visual en el carrito (ej. un pequeño "salto")
        cartContainer.classList.add('cart-animate-pop');
        setTimeout(() => {
            cartContainer.classList.remove('cart-animate-pop');
        }, 300);
    }, 700);
};


const handleFilterClick = (e) => {
    const category = e.target.dataset.category;
    if (category) {
        currentCategory = category;
        currentSubcategory = null;
        currentBrand = null;
        currentQuantity = null;

        document.getElementById('accessory-subcategories').classList.add('hidden');
        document.getElementById('sustratos-brands').classList.add('hidden');
        document.getElementById('fertilizantes-brands').classList.add('hidden');
        document.getElementById('semillas-y-esquejes-subcategories').classList.add('hidden');
        document.getElementById('semillas-quantity-filters').classList.add('hidden');

        // Se mantiene la lógica para mostrar los filtros que aplican
        if (category === 'parafernalia') {
            document.getElementById('accessory-subcategories').classList.remove('hidden');
        } else if (category === 'sustratos') {
            document.getElementById('sustratos-brands').classList.remove('hidden');
        } else if (category === 'fertilizantes') {
            document.getElementById('fertilizantes-brands').classList.remove('hidden');
        } else if (category === 'semillas-y-esquejes') {
            document.getElementById('semillas-y-esquejes-subcategories').classList.remove('hidden');
            document.querySelector('.subcategory-btn[data-subcategory="all-semillas-esquejes"]').click();
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('bg-green-500', 'text-black');
            btn.classList.add('bg-gray-200', 'text-gray-800');
        });
        document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(btn => {
            btn.classList.add('bg-green-500', 'text-black');
            btn.classList.remove('bg-gray-200', 'text-gray-800');
        });
        renderProducts();
    }

    const subcategory = e.target.dataset.subcategory;
    if (subcategory) {
        currentSubcategory = subcategory === 'all-accesorios' || subcategory === 'all-semillas-esquejes' ? null : subcategory;
        currentQuantity = null;
        document.getElementById('semillas-quantity-filters').classList.add('hidden');

        if (subcategory === 'semillas') {
            document.getElementById('semillas-quantity-filters').classList.remove('hidden');
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            const allSemillasBtn = document.querySelector('.quantity-btn[data-quantity="all-semillas"]');
            if (allSemillasBtn) {
                allSemillasBtn.classList.add('bg-green-500', 'text-black');
                allSemillasBtn.classList.remove('bg-gray-200', 'text-gray-800');
            }
        }

        document.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.classList.remove('bg-green-500', 'text-black');
            btn.classList.add('bg-gray-200', 'text-gray-800');
        });
        e.target.classList.add('bg-green-500', 'text-black');
        e.target.classList.remove('bg-gray-200', 'text-gray-800');
        
        renderProducts();
    }

    const brand = e.target.dataset.brand;
    if (brand) {
        currentBrand = brand === 'all-sustratos' || brand === 'all-fertilizantes' ? null : brand;
        document.querySelectorAll('.brand-btn').forEach(btn => {
            btn.classList.remove('bg-green-500', 'text-black');
            btn.classList.add('bg-gray-200', 'text-gray-800');
        });
        e.target.classList.add('bg-green-500', 'text-black');
        e.target.classList.remove('bg-gray-200', 'text-gray-800');
        renderProducts();
    }

    const quantity = e.target.dataset.quantity;
    if (quantity) {
        currentQuantity = quantity === 'all-semillas' ? null : parseInt(quantity);
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.classList.remove('bg-green-500', 'text-black');
            btn.classList.add('bg-gray-200', 'text-gray-800');
        });
        e.target.classList.add('bg-green-500', 'text-black');
        e.target.classList.remove('bg-gray-200', 'text-gray-800');
        renderProducts();
    }
};

const populateBrandOptions = (category) => {
    const brandSelect = document.getElementById('product-form-brand');
    brandSelect.innerHTML = '<option value="">Selecciona Marca</option>';

    // Si la categoría es fertilizantes, cargamos las marcas fijas
    if (category === 'fertilizantes') {
        const fertilizerBrands = [
            'Biobizz', 
            'Vamp', 
            'Revegetar', 
            'Mamboreta', 
            'Tasty', 
            'Top Crop', 
            'Namaste'
        ];

        fertilizerBrands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.toLowerCase().replace(/\s/g, '-'); // Normalizar para la base de datos
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    } else {
        // Si no es fertilizante, dejamos el comportamiento original
        const brands = [...new Set(products.filter(p => p.category === category && p.brand).map(p => p.brand))];
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
            brandSelect.appendChild(option);
        });
    }
};


// Eventos
document.addEventListener('click', (e) => {
    handleFilterClick(e);

    const clickedImage = e.target.closest('.product-card img');
    if (clickedImage) {
        modalImage.src = clickedImage.src;
        imageModal.classList.remove('hidden');
    }

    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.dataset.id;
        const productToAdd = products.find(p => p.id === productId);
        
        // Determinar la imagen para la animación
        const productCard = e.target.closest('.product-card');
        const imageElement = productCard ? productCard.querySelector('.product-image-to-animate') : null;

        if (productToAdd) {
            if (cart[productId]) {
                cart[productId].quantity++;
            } else {
                cart[productId] = { ...productToAdd, quantity: 1 };
            }
            updateCartDisplay();
            showMessage(`¡Se agregó "${productToAdd.name}" al carrito!`);
            
            // Iniciar la animación solo si encontramos la imagen
            if (imageElement) {
                flyToCartAnimation(imageElement);
            }
        }
    }

    if (e.target.closest('.remove-from-cart-btn')) {
        const productId = e.target.closest('.remove-from-cart-btn').dataset.id;
        if (cart[productId]) {
            cart[productId].quantity--;
            if (cart[productId].quantity <= 0) {
                delete cart[productId];
            }
        }
        updateCartDisplay();
    }

    if (e.target.closest('.edit-product-btn')) {
        const productId = e.target.closest('.edit-product-btn').dataset.id;
        const productToEdit = products.find(p => p.id === productId);
        if (productToEdit) {
            editingProductId = productId;
            formTitle.textContent = `Editar Producto: ${productToEdit.name}`;
            productFormName.value = productToEdit.name;
            productFormPrice.value = productToEdit.price;
            productFormCategory.value = productToEdit.category;
            productFormImageUrl.value = productToEdit.imageUrl;
            productFormDescription.value = productToEdit.description || '';
            productFormQuantity.value = productToEdit.quantity || '';
            productFormSubmitBtn.textContent = 'Guardar Cambios';

            productImagePreview.src = productToEdit.imageUrl;
            productImagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
            productFormImageUrl.disabled = false;
            productFormImageFile.disabled = false;

            const categorySelect = document.getElementById('product-form-category');
            productFormSubcategory.classList.add('hidden');
            productFormSemillasEsquejesSubcategory.classList.add('hidden');
            productFormBrand.classList.add('hidden');
            productFormQuantity.classList.add('hidden');

            if (categorySelect.value === 'parafernalia') {
                productFormSubcategory.classList.remove('hidden');
                productFormSubcategory.value = productToEdit.subcategory || '';
            } else if (categorySelect.value === 'semillas-y-esquejes') {
                productFormSemillasEsquejesSubcategory.classList.remove('hidden');
                productFormSemillasEsquejesSubcategory.value = productToEdit.subcategory || '';
                if (productToEdit.subcategory === 'semillas') {
                    productFormQuantity.classList.remove('hidden');
                    productFormQuantity.value = productToEdit.quantity || '';
                }
            } else if (categorySelect.value === 'sustratos' || categorySelect.value === 'fertilizantes') {
                productFormBrand.classList.remove('hidden');
                populateBrandOptions(categorySelect.value);
                productFormBrand.value = productToEdit.brand || '';
            }
            
            // Si la categoría no es ninguna de las anteriores, asegúrate de que los selectores de subcategoría y marca estén ocultos
            if (categorySelect.value !== 'parafernalia' && categorySelect.value !== 'semillas-y-esquejes' && categorySelect.value !== 'sustratos' && categorySelect.value !== 'fertilizantes') {
                productFormSubcategory.classList.add('hidden');
                productFormSemillasEsquejesSubcategory.classList.add('hidden');
                productFormBrand.classList.add('hidden');
            }

            window.scrollTo({ top: productMgmtSection.offsetTop, behavior: 'smooth' });
        }
    }

    if (e.target.closest('.delete-product-btn')) {
        const productId = e.target.closest('.delete-product-btn').dataset.id;
        products = products.filter(p => p.id !== productId);
        saveProducts(products);
        renderAdminProducts();
        renderProducts();
        showMessage('Producto eliminado correctamente.');
    }
});

adminLoginBtn.addEventListener('click', showLoginModal);
adminToggleBtnMobile.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    if (adminMode) {
        toggleAdminMode();
    } else {
        showLoginModal();
    }
});
adminToggleBtn.addEventListener('click', () => {
    if (adminMode) {
        toggleAdminMode();
    } else {
        showLoginModal();
    }
});
logoutBtn.addEventListener('click', toggleAdminMode);
logoutBtnMobile.addEventListener('click', toggleAdminMode);
messageModalClose.addEventListener('click', hideMessage);
adminCancelBtn.addEventListener('click', hideLoginModal);
window.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) {
        hideLoginModal();
    }
    if (e.target === messageModal) {
        hideMessage();
    }
});

closeImageModalBtn.addEventListener('click', () => {
    imageModal.classList.add('hidden');
});

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        imageModal.classList.add('hidden');
    }
});

adminLoginSubmitBtn.addEventListener('click', () => {
    if (adminPasswordInput.value === 'losmarmotasadmin') {
        hideLoginModal();
        toggleAdminMode();
    } else {
        showMessage('Contraseña incorrecta.');
    }
});

productFormCategory.addEventListener('change', (e) => {
    const category = e.target.value;
    productFormSubcategory.classList.add('hidden');
    productFormSemillasEsquejesSubcategory.classList.add('hidden');
    productFormBrand.classList.add('hidden');
    productFormQuantity.classList.add('hidden');

    // Se mantiene la lógica para mostrar los filtros que aplican
    if (category === 'parafernalia') {
        productFormSubcategory.classList.remove('hidden');
    } else if (category === 'semillas-y-esquejes') {
        productFormSemillasEsquejesSubcategory.classList.remove('hidden');
    } else if (category === 'sustratos' || category === 'fertilizantes') {
        productFormBrand.classList.remove('hidden');
        populateBrandOptions(category);
    }
});

productFormSemillasEsquejesSubcategory.addEventListener('change', (e) => {
    const subcategory = e.target.value;
    productFormQuantity.classList.add('hidden');
    if (subcategory === 'semillas') {
        productFormQuantity.classList.remove('hidden');
    }
});

const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
};

productFormSubmitBtn.addEventListener('click', async () => {
    const name = productFormName.value.trim();
    const price = parseFloat(productFormPrice.value);
    const category = productFormCategory.value;
    const imageUrl = productFormImageUrl.value;
    const description = productFormDescription.value.trim();
    const subcategory = productFormCategory.value === 'semillas-y-esquejes' 
        ? productFormSemillasEsquejesSubcategory.value 
        : productFormCategory.value === 'parafernalia' ? productFormSubcategory.value : null;
    const brand = productFormBrand.value;
    const quantity = productFormQuantity.value ? parseInt(productFormQuantity.value) : null;

    if (!name || isNaN(price) || !category) {
        showMessage('Por favor, completa todos los campos obligatorios (Nombre, Precio y Categoría).');
        return;
    }

    const newProduct = {
        name,
        price,
        category,
        imageUrl,
        description,
        subcategory: subcategory || null,
        brand: brand || null,
        quantity: quantity || null
    };

    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...newProduct };
        }
        editingProductId = null;
        formTitle.textContent = 'Añadir Nuevo Producto';
        productFormSubmitBtn.textContent = 'Añadir Producto';
        showMessage('Producto editado correctamente.');
    } else {
        newProduct.id = generateUniqueId();
        products.push(newProduct);
        showMessage('Producto añadido correctamente.');
    }

    saveProducts(products);
    renderAdminProducts();
    renderProducts();
    productFormName.value = '';
    productFormPrice.value = '';
    productFormCategory.value = '';
    productFormImageUrl.value = '';
    productFormImageFile.value = '';
    productImagePreview.classList.add('hidden');
    previewPlaceholder.classList.remove('hidden');
    productFormDescription.value = '';
    productFormSubcategory.classList.add('hidden');
    productFormSemillasEsquejesSubcategory.classList.add('hidden');
    productFormBrand.classList.add('hidden');
    productFormQuantity.classList.add('hidden');
});

productFormImageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            productImagePreview.src = e.target.result;
            productImagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

productFormImageUrl.addEventListener('input', (e) => {
    const url = e.target.value;
    if (url) {
        productImagePreview.src = url;
        productImagePreview.classList.remove('hidden');
        previewPlaceholder.classList.add('hidden');
    } else {
        productImagePreview.classList.add('hidden');
        previewPlaceholder.classList.remove('hidden');
    }
});

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// NUEVO: Manejador de evento para el botón de Finalizar Compra
checkoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        showMessage('El carrito está vacío. Por favor, añade productos antes de finalizar la compra.');
        return;
    }

    let message = '¡Hola Los Marmotas Grow Shop! Me gustaría hacer el siguiente pedido:\n\n';
    let total = 0;

    for (const productId in cart) {
        if (cart[productId].quantity > 0) {
            const item = cart[productId];
            message += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n`;
            total += item.price * item.quantity;
        }
    }

    message += `\nTotal: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '541123956472';
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    cart = {};
    updateCartDisplay();
    showMessage('¡Gracias por tu compra! Te hemos redirigido a WhatsApp para que finalices el pedido.');
});


// Inicialización
const init = async () => {
    products = await loadProducts();
    // Si no hay productos cargados de la base de datos, usa los iniciales
    if (!products || products.length === 0) {
        const initialProducts = [
            { id: '1', name: 'Growmix Evolution Light', price: 6500, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/baf5696d-1763-4416-8684-25c7554f67d2_original_large.jpg', category: 'sustratos', brand: 'tasty', description: 'Tierra abonada ideal para el cultivo de semillas y esquejes.' },
            { id: '2', name: 'Growmix Multi-Pro', price: 6000, imageUrl: 'https://growshops.com.ar/wp-content/uploads/2023/11/growmix-multipro-80-litros.jpg', category: 'sustratos', brand: 'cultivate', description: 'Mezcla de sustratos para una nutrición completa.' },
            { id: '3', name: 'Sustrato Premium La Pacha', price: 5800, imageUrl: 'https://cultivocana.com.ar/wp-content/uploads/2022/04/sustrato-la-pacha-cultivocana.jpg', category: 'sustratos', brand: 'la-pacha-sustrato', description: 'Sustrato orgánico de alta calidad.' },
            { id: '4', name: 'Top Crop Deeper Underground', price: 4500, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/deeper-underground-250-ml-top-crop-1638202535039_large.jpg', category: 'fertilizantes', brand: 'top-crop', description: 'Estimulador de raíces para un desarrollo vigoroso.' },
            { id: '5', name: 'Top Bloom', price: 5500, imageUrl: 'https://www.topcrop.es/img/productos/top-bloom.jpg', category: 'fertilizantes', brand: 'top-crop', description: 'Abono para la fase de floración.' },
            { id: '6', name: 'Namaste Flora Booster', price: 4800, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/namaste-flora-booster-500-cc-1627916327663_large.jpg', category: 'fertilizantes', brand: 'namaste', description: 'Potenciador de floración a base de algas.' },
            { id: '7', name: 'Panel LED 150W', price: 50000, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/panel-led-150w-full-spectrum-1638379468087_large.jpg', category: 'iluminacion', description: 'Panel LED de bajo consumo, ideal para pequeños cultivos.' },
            { id: '8', name: 'Kit de Iluminación 250W', price: 75000, imageUrl: 'https://www.cultivo.com.ar/wp-content/uploads/2020/09/kit-250w.jpg', category: 'iluminacion', description: 'Kit completo de iluminación para cultivo de interior.' },
            { id: '9', name: 'Semillas Ak-47 x 3', price: 15000, imageUrl: 'https://www.growbarato.net/2143-large_default/semillas-ak-47.jpg', category: 'semillas-y-esquejes', subcategory: 'semillas', quantity: 3, description: 'Paquete de 3 semillas feminizadas de Ak-47.' },
            { id: '10', name: 'Esqueje Lemon Haze', price: 8000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/418/691/products/c600-s-l-1250-w-80h-1681223945-802c63d414a90586e316812239634710-1024-1024.webp', category: 'semillas-y-esquejes', subcategory: 'esquejes', description: 'Esqueje con raíces de Lemon Haze.' },
            { id: '11', name: 'Bandeja de Liado', price: 2500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/696/754/products/raw-classic-rolling-tray1-4c126d40d9b439c2c016428751502444-640-0.jpg', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Bandeja metálica para liar cómodamente.' },
            { id: '12', name: 'Picador Metálico 4 partes', price: 4000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/170/393/products/picador-metaltico-40mm-silver-4-partes-mkt-03-37e42d627c5148386a15886915128038-640-0.jpeg', category: 'parafernalia', subcategory: 'picadores', description: 'Picador de aluminio de 4 partes.' },
            { id: '13', name: 'Celulosa King Size', price: 1500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/696/754/products/celulosa-lion-rolling-circus-king-size-x-1-unidad1-60a638b97d8120e2a416805492404095-640-0.jpg', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Papel de celulosa transparente de tamaño King Size.' },
            { id: '14', name: 'Medidor de PH Digital', price: 12000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/309/781/products/medidor-ph-digital1-766b965c40498b5e6116668705035255-640-0.webp', category: 'accesorios-de-cultivo', description: 'Medidor de pH para soluciones nutritivas.' },
            { id: '15', name: 'Tijeras de Poda', price: 3000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/309/781/products/tijeras-de-poda-para-indoor-y-exterior-1-8a9d18728d7168d24916298177405108-640-0.webp', category: 'accesorios-de-cultivo', description: 'Tijeras de punta fina para manicurado y poda.' }
        ];
        products = initialProducts;
        saveProducts(products);
    }
    renderProducts();
    updateCartDisplay();
};

init();
