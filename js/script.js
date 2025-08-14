document.addEventListener('DOMContentLoaded', function() {
    // === Elementos del DOM ===
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const messageModal = document.getElementById('message-modal');
    const messageModalText = document.getElementById('message-modal-text');
    const messageModalClose = document.getElementById('message-modal-close');

    // Elementos del catálogo y carrito
    const productList = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const checkoutBtn = document.getElementById('checkout-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Elementos de administración
    const adminLoginBtn = document.getElementById('admin-login-btn'); // Botón en la sección del carrito
    const adminToggleBtn = document.getElementById('admin-toggle-btn'); // Botón en el header de escritorio
    const logoutBtn = document.getElementById('logout-btn'); // Botón de salir en el header de escritorio
    const adminToggleBtnMobile = document.getElementById('admin-toggle-btn-mobile'); // Botón en el menú móvil
    const logoutBtnMobile = document.getElementById('logout-btn-mobile'); // Botón de salir en el menú móvil

    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminCancelBtn = document.getElementById('admin-cancel-btn');
    const adminLoginSubmitBtn = document.getElementById('admin-login-submit-btn');
    const productMgmtSection = document.getElementById('product-mgmt-section');
    
    // Elementos del formulario de gestión de productos
    const productFormName = document.getElementById('product-form-name');
    const productFormPrice = document.getElementById('product-form-price');
    const productFormImageUrl = document.getElementById('product-form-image-url');
    const productFormImageFile = document.getElementById('product-form-image-file');
    const productImagePreview = document.getElementById('product-image-preview');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    const productFormCategory = document.getElementById('product-form-category');
    const productFormSubmitBtn = document.getElementById('product-form-submit-btn');
    const formTitle = document.getElementById('form-title');
    const existingProductsList = document.getElementById('existing-products-list');

    // === Variables de estado ===
    const ADMIN_PASSWORD = 'losmarmotasadmin';
    let isAdminLoggedIn = false;
    let editingProductId = null;

    // Dummy data para productos (idealmente, esto vendría de una base de datos)
    let products = JSON.parse(localStorage.getItem('growshopProducts')) || [
        { id: 1, name: 'Sustrato Premium 50L', price: 3500, image: 'https://placehold.co/400x400/000000/32CD32?text=Sustrato', category: 'sustratos' },
        { id: 2, name: 'Fertilizante Bio-Grow', price: 2800, image: 'https://placehold.co/400x400/000000/32CD32?text=Fertilizante', category: 'fertilizantes' },
        { id: 3, name: 'Kit Iluminación LED', price: 15000, image: 'https://placehold.co/400x400/000000/32CD32?text=Kit+LED', category: 'iluminacion' },
        { id: 4, name: 'Maceta de Tela 10L', price: 900, image: 'https://placehold.co/400x400/000000/32CD32?text=Maceta', category: 'accesorios' },
        { id: 5, name: 'Tijeras de Poda Pro', price: 1200, image: 'https://placehold.co/400x400/000000/32CD32?text=Tijeras', category: 'accesorios' },
        { id: 6, name: 'Medidor de PH Digital', price: 4500, image: 'https://placehold.co/400x400/000000/32CD32?text=Medidor+PH', category: 'accesorios' },
        { id: 7, name: 'Semillas Auto XXL', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Semillas', category: 'sustratos' },
        { id: 8, name: 'Regulador PH Down', price: 1500, image: 'https://placehold.co/400x400/000000/32CD32?text=PH+Down', category: 'fertilizantes' }
    ];
    let cart = [];

    // === Funciones auxiliares ===

    // Guarda los productos en localStorage
    function saveProductsToLocalStorage() {
        localStorage.setItem('growshopProducts', JSON.stringify(products));
    }

    // Muestra un mensaje en el modal personalizado
    function showMessage(message) {
        messageModalText.textContent = message;
        messageModal.classList.remove('hidden');
    }

    // Actualiza la UI de administrador (botones, visibilidad de sección)
    function updateAdminUI() {
        if (isAdminLoggedIn) {
            adminLoginBtn.classList.add('hidden'); // Oculta botón de login del carrito
            logoutBtn.classList.remove('hidden'); // Muestra botón de salir (escritorio)
            logoutBtnMobile.classList.remove('hidden'); // Muestra botón de salir (móvil)
            adminToggleBtn.textContent = 'Ocultar Gestión'; // Cambia texto
            adminToggleBtnMobile.textContent = 'Ocultar Gestión'; // Cambia texto
        } else {
            adminLoginBtn.classList.remove('hidden'); // Muestra botón de login del carrito
            logoutBtn.classList.add('hidden'); // Oculta botón de salir
            logoutBtnMobile.classList.add('hidden'); // Oculta botón de salir (móvil)
            adminToggleBtn.textContent = 'Gestión Admin'; // Restablece texto
            adminToggleBtnMobile.textContent = 'Gestión Admin'; // Restablece texto
            productMgmtSection.classList.add('hidden'); // Oculta sección de gestión
        }
    }

    // Renderiza los productos en la vista de catálogo
    function renderProducts(filterCategory = 'all') {
        productList.innerHTML = '';
        const filteredProducts = filterCategory === 'all'
            ? products
            : products.filter(p => p.category === filterCategory);

        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay productos en esta categoría.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover object-center" onerror="this.onerror=null;this.src='https://placehold.co/400x400/cccccc/333333?text=Imagen+No+Disp.'">
                    <div class="p-4">
                        <h4 class="text-lg font-bold">${product.name}</h4>
                        <p class="text-sm text-gray-500 capitalize mb-2">Categoría: ${product.category || 'Sin Categoría'}</p>
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

    // Renderiza los ítems en el carrito
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

    // Actualiza el total del carrito
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `$${total.toLocaleString('es-AR')}`;
    }

    // Añade un producto al carrito
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
    
    // Elimina un producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // Renderiza la lista de productos existentes en la sección de administración
    function renderExistingProducts() {
        existingProductsList.innerHTML = '';
        products.forEach(product => {
            const productItem = `
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg">
                    <div class="mb-2 sm:mb-0 sm:mr-4 flex-grow">
                        <span class="font-semibold block sm:inline">${product.name}</span>
                        <span class="text-sm text-gray-600 block sm:inline sm:ml-2">($${product.price.toLocaleString('es-AR')})</span>
                        <span class="text-sm text-gray-500 block sm:inline sm:ml-2 capitalize">Categoría: ${product.category || 'Sin Categoría'}</span>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <button data-id="${product.id}" class="edit-product-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition">Editar</button>
                        <button data-id="${product.id}" class="delete-product-btn px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">Eliminar</button>
                    </div>
                </div>
            `;
            existingProductsList.innerHTML += productItem;
        });

        // Adjunta listeners a los botones de eliminar
        document.querySelectorAll('.delete-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                products = products.filter(p => p.id !== productId);
                saveProductsToLocalStorage();
                renderExistingProducts();
                renderProducts(document.querySelector('.filter-btn.bg-green-500')?.dataset.category || 'all');
                showMessage('Producto eliminado exitosamente.');
            });
        });

        // Adjunta listeners a los botones de editar
        document.querySelectorAll('.edit-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                editProduct(productId);
                productMgmtSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Resetea el formulario de gestión de productos
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
        editingProductId = null;
    }

    // Carga los datos de un producto para edición
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            formTitle.textContent = `Editar Producto: ${product.name}`;
            productFormSubmitBtn.textContent = 'Guardar Cambios';
            productFormName.value = product.name;
            productFormPrice.value = product.price;
            productFormImageUrl.value = product.image;
            productFormCategory.value = product.category;
            
            if (product.image) {
                productImagePreview.src = product.image;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
            } else {
                productImagePreview.classList.add('hidden');
                previewPlaceholder.classList.remove('hidden');
            }
            productFormImageFile.value = '';
            editingProductId = productId;
        }
    }

    // === Event Listeners ===

    // Toggle del menú móvil
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Cierre del modal de mensajes
    messageModalClose.addEventListener('click', () => {
        messageModal.classList.add('hidden');
    });

    // Añadir al carrito desde la lista de productos
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Eliminar del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Finalizar compra por WhatsApp
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

    // Filtros de categoría de productos
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            button.classList.remove('bg-gray-200', 'text-gray-800');
            button.classList.add('bg-green-500', 'text-black');
            
            const category = button.getAttribute('data-category');
            renderProducts(category);
        });
    });

    // Abrir modal de login de admin
    adminLoginBtn.addEventListener('click', () => {
        adminLoginModal.classList.remove('hidden');
        adminPasswordInput.value = '';
    });

    // Cancelar login de admin
    adminCancelBtn.addEventListener('click', () => {
        adminLoginModal.classList.add('hidden');
    });

    // Intentar login de admin
    adminLoginSubmitBtn.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            adminLoginModal.classList.add('hidden');
            isAdminLoggedIn = true;
            updateAdminUI(); // Actualizar la UI después del login
            productMgmtSection.classList.remove('hidden');
            resetProductForm();
            renderExistingProducts();
            showMessage('Has iniciado sesión como administrador.');
            productMgmtSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage('Contraseña incorrecta.');
        }
    });

    // Evento para el botón de salir (desktop)
    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI(); // Actualizar la UI después del logout
        showMessage('Has cerrado sesión de administrador.');
    });

    // Evento para el botón de salir (mobile)
    logoutBtnMobile.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI(); // Actualizar la UI después del logout
        mobileMenu.classList.add('hidden'); // Cerrar menú móvil
        showMessage('Has cerrado sesión de administrador.');
    });

    // Toggle de la sección de gestión de productos (desktop)
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

    // Toggle de la sección de gestión de productos (móvil)
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

    // Manejo de la vista previa de la imagen al ingresar URL
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

    // Manejo de la vista previa de la imagen al seleccionar archivo local
    productFormImageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productImagePreview.src = e.target.result;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                productFormImageUrl.value = e.target.result; // Opcional: copia la Data URL al campo URL
                showMessage('Imagen local cargada para previsualización. Para almacenamiento permanente, esta imagen debe ser una URL pública.');
            };
            reader.readAsDataURL(file);
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Manejo del envío del formulario de productos (añadir/editar)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa todos los campos (Nombre, Precio y Categoría) y asegúrate de que el precio sea un número válido.');
            return;
        }

        if (editingProductId) {
            // Editar producto existente
            products = products.map(p =>
                p.id === editingProductId ? { ...p, name, price, image, category } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Añadir nuevo producto
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, name, price, image, category });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(document.querySelector('.filter-btn.bg-green-500')?.dataset.category || 'all');
    });

    // === Inicialización al cargar la página ===
    updateAdminUI(); // Configura los botones de admin/salir al inicio
    renderProducts(); // Muestra los productos en el catálogo
    renderCart(); // Muestra el carrito
});