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
            <img src="${imageUrl}" onerror="this.onerror=null;this.src='https://placehold.co/400x300/e879f9/ffffff?text=Error+al+Cargar+Imagen';" alt="${product.name}" class="w-full h-48 object-cover object-center cursor-pointer">
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

const renderAdminProducts = () => {
    existingProductsList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm';
        productItem.innerHTML = `
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
            option.value = brand;
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
        if (productToAdd) {
            if (cart[productId]) {
                cart[productId].quantity++;
            } else {
                cart[productId] = { ...productToAdd, quantity: 1 };
            }
            updateCartDisplay();
            showMessage(`¡Se agregó "${productToAdd.name}" al carrito!`);
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
    if (products.length === 0) {
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
            { id: '10', name: 'Esqueje Lemon Haze', price: 8000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/esquejes-1-f117c462372565696116174771744594-640-0.jpg', category: 'semillas-y-esquejes', subcategory: 'esquejes', description: 'Clon de alta calidad de la cepa Lemon Haze, listo para trasplantar.' },
            { id: '11', name: 'Papelillos Raw Classic', price: 500, imageUrl: 'https://static.wixstatic.com/media/25292c_2b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b.jpg', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos de cáñamo sin blanquear.' },
            { id: '12', name: 'Picador de Metal', price: 2500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/picador-metal-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'parafernalia', subcategory: 'picadores', description: 'Picador de metal de 4 partes, compacto y eficiente.' },
            { id: '13', name: 'Medidor de PH Digital', price: 12000, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/medidor-ph-digital-1638379468087_large.jpg', category: 'accesorios-de-cultivo', description: 'Medidor digital para controlar el nivel de acidez del agua.' },
            { id: '14', name: 'Tijeras de Poda Curvas', price: 3500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/tijeras-curvas-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'accesorios-de-cultivo', description: 'Tijeras de precisión para la manicura y poda de plantas.' },
            { id: '15', name: 'Kit de Medición pH y EC', price: 25000, imageUrl: 'https://m.media-amazon.com/images/I/71YyXn1u8BL._AC_UF894,1000_QL80_.jpg', category: 'accesorios-de-cultivo', description: 'Kit completo para medir pH y conductividad eléctrica.' },
            { id: '16', name: 'Fertilizante Top Veg', price: 5200, imageUrl: 'https://www.topcrop.es/img/productos/top-veg.jpg', category: 'fertilizantes', brand: 'top-crop', description: 'Abono para la fase de crecimiento de tus plantas.' },
            { id: '17', name: 'Sustrato Cultivate Indoor', price: 6800, imageUrl: 'https://growshops.com.ar/wp-content/uploads/2023/11/cultivate-indoor.jpg', category: 'sustratos', brand: 'cultivate', description: 'Sustrato específico para cultivos de interior, con excelente aireación.' },
            { id: '18', name: 'Lámpara de Sodio 400W', price: 85000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/lampara-sodio-400w-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'iluminacion', description: 'Lámpara de alta presión para floración y crecimiento.' },
            { id: '19', name: 'Semillas Gorilla Glue x 5', price: 20000, imageUrl: 'https://www.royalqueenseeds.es/img/t/172-172-gorilla-glue.jpg', category: 'semillas-y-esquejes', subcategory: 'semillas', quantity: 5, description: 'Paquete de 5 semillas feminizadas de la potente Gorilla Glue.' },
            { id: '20', name: 'Esqueje Northern Lights', price: 9000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/esqueje-northern-lights-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'semillas-y-esquejes', subcategory: 'esquejes', description: 'Clon de la clásica cepa Northern Lights.' },
            { id: '21', name: 'Sustrato Growmix Premium', price: 7200, imageUrl: 'https://growshops.com.ar/wp-content/uploads/2023/11/growmix-premium-80-litros.jpg', category: 'sustratos', brand: 'cultivate', description: 'Mezcla premium con perlita, turba y humus de lombriz.' },
            { id: '22', name: 'Namaste Base A+B', price: 8500, imageUrl: 'https://www.namastecultivos.com.ar/wp-content/uploads/2021/03/baseab.jpg', category: 'fertilizantes', brand: 'namaste', description: 'Nutrientes base para crecimiento y floración.' },
            { id: '23', name: 'Filtro de Carbón Activado', price: 18000, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/filtro-carbon-activo-1638379468087_large.jpg', category: 'accesorios-de-cultivo', description: 'Elimina olores y purifica el aire de tu cultivo.' },
            { id: '24', name: 'Papelillos Gizeh Slim', price: 450, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7k-4b9b_W_sSjK6-8l_K-w_8l_K-w_8l_K-w_8l&s', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos extrafinos para un quemado lento.' },
            { id: '25', name: 'Semillas Auto x3', price: 18000, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/baf5696d-1763-4416-8684-25c7554f67d2_original_large.jpg', category: 'semillas-y-esquejes', subcategory: 'semillas', quantity: 3, description: 'Paquete de 3 semillas autoflorecientes de última generación.' },
            { id: '26', name: 'Semillas Fotoperiódicas x4', price: 22000, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/baf5696d-1763-4416-8684-25c7554f67d2_original_large.jpg', category: 'semillas-y-esquejes', subcategory: 'semillas', quantity: 4, description: 'Paquete de 4 semillas para cultivo con fotoperíodo controlado.' },
            { id: '27', name: 'Semillas XXL x12', price: 50000, imageUrl: 'https://d26ae3qf3k95a3.cloudfront.net/products/b04e66d7-b0aa-4d87-9be2-4f8eeb7577c0 (2)-fotor-2025081620041.png', category: 'semillas-y-esquejes', subcategory: 'semillas', quantity: 12, description: 'Paquete de 12 semillas para una cosecha abundante.' },
            { id: '28', name: 'Blunt King Palm', price: 1200, imageUrl: 'https://www.smokerparadise.co/cdn/shop/files/bluntkingpalm.jpg?v=1704200466', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Blunt de hoja natural de palma.' },
            { id: '29', name: 'Encendedor Clipper', price: 800, imageUrl: 'https://www.clipper.com.ar/wp-content/uploads/2021/07/clipper-encendedor.jpg', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor recargable y de diseño ergonómico.' },
            { id: '30', name: 'Bandeja de Armado Pequeña', price: 1500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/bandeja-armado-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Bandeja metálica para organizar tus accesorios.' },
            { id: '31', name: 'Frasco de Vidrio Curado', price: 3000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/frasco-curado-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'parafernalia', subcategory: 'guardado', description: 'Frasco hermético ideal para curar y guardar flores.' },
            { id: '32', name: 'Kit de Fertilización Vamp', price: 10000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/vamp-kit-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'fertilizantes', brand: 'vamp', description: 'Kit completo de fertilizantes para todo el ciclo de la planta.' },
            { id: '33', name: 'Fungicida Mamboretá H', price: 4500, imageUrl: 'https://www.mamboreta.com.ar/images/productos/h-thumb.jpg', category: 'fertilizantes', brand: 'mamboreta', description: 'Fungicida sistémico para prevenir y curar enfermedades fúngicas.' },
            { id: '34', name: 'Insecticida Mamboretá D', price: 4200, imageUrl: 'https://www.mamboreta.com.ar/images/productos/d-thumb.jpg', category: 'fertilizantes', brand: 'mamboreta', description: 'Insecticida para el control de plagas como araña roja y mosca blanca.' },
            { id: '35', name: 'Biobizz Bio-Grow', price: 6000, imageUrl: 'https://www.biobizz.com/wp-content/uploads/2019/11/BIO-GROW-FRONT.png', category: 'fertilizantes', brand: 'biobizz', description: 'Fertilizante orgánico líquido para crecimiento.' },
            { id: '36', name: 'Biobizz Bio-Bloom', price: 6200, imageUrl: 'https://www.biobizz.com/wp-content/uploads/2019/11/BIO-BLOOM-FRONT.png', category: 'fertilizantes', brand: 'biobizz', description: 'Fertilizante orgánico líquido para floración.' },
            { id: '37', name: 'Revegetar Micorrizas', price: 3500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/revegetar-micorrizas-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'fertilizantes', brand: 'revegetar', description: 'Hongos benéficos para mejorar la absorción de nutrientes.' },
            { id: '38', name: 'Kit de Sustrato Tasty', price: 8500, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/tasty-kit-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'sustratos', brand: 'tasty', description: 'Kit de sustrato y aditivos de la marca Tasty.' },
            { id: '39', name: 'Fertilizante Tasty Grow', price: 5000, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/tasty-grow-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'fertilizantes', brand: 'tasty-fert', description: 'Fertilizante para la fase de crecimiento de Tasty.' },
            { id: '40', name: 'Fertilizante Tasty Bloom', price: 5300, imageUrl: 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/061/365/products/tasty-bloom-1-1b6a711c7d2c3e1e9c16174780517724-640-0.jpg', category: 'fertilizantes', brand: 'tasty-fert', description: 'Fertilizante para la fase de floración de Tasty.' }
        ];
        products = initialProducts;
    }
    renderProducts();
    updateCartDisplay();
};


init();
