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
    const productFormDescription = document.getElementById('product-form-description'); 
    const productFormSubmitBtn = document.getElementById('product-form-submit-btn');
    const formTitle = document.getElementById('form-title');
    const existingProductsList = document.getElementById('existing-products-list');

    // === State Variables ===
    const ADMIN_PASSWORD = 'losmarmotasadmin';
    const MAX_LINES_DISPLAY = 5; // Max lines to show initially
    let isAdminLoggedIn = false;
    let editingProductId = null;
    let currentCategory = 'all'; // To maintain the active category state
    let currentBrand = 'all'; // To maintain the active brand state (for substrates/fertilizers)
    let currentSubcategory = 'all-accesorios'; // To maintain the active subcategory state (for accessories)


    // Product Data (with updated brand, subcategory info, and longer descriptions)
    let products = JSON.parse(localStorage.getItem('growshopProducts')) || [
        // Sustratos con marcas
        { id: 1, name: 'Sustrato La Pacha Premium 50L', price: 3500, image: 'https://placehold.co/400x400/000000/32CD32?text=La+Pacha', category: 'sustratos', brand: 'la-pacha-sustrato', description: 'Sustrato orgánico de alta calidad para un crecimiento robusto.\nIdeal para todas las fases de tu cultivo.\nContiene una mezcla equilibrada de turba, perlita y humus de lombriz, proporcionando la aireación y retención de humedad perfectas.\nFomenta un desarrollo radicular explosivo, lo que se traduce en plantas más sanas y productivas.\nEs apto para cultivos de interior y exterior, y se adapta a una amplia variedad de especies vegetales.\n¡Un sustrato en el que puedes confiar para obtener los mejores resultados!' },
        { id: 16, name: 'Sustrato Tasty 50L', price: 3800, image: 'https://placehold.co/400x400/000000/32CD32?text=Tasty', category: 'sustratos', brand: 'tasty', description: 'Mezcla premium para un desarrollo óptimo de raíces.\nFormulado con los mejores componentes para garantizar una nutrición balanceada y constante.\nSu estructura ligera previene la compactación y asegura un drenaje excelente, evitando el exceso de humedad.\nEnriquece el suelo con microorganismos beneficiosos que mejoran la absorción de nutrientes.\nDiseñado para maximizar el potencial genético de tus plantas desde la germinación hasta la cosecha.' },
        { id: 17, name: 'Sustrato Cultivate Universal', price: 3200, image: 'https://placehold.co/400x400/000000/32CD32?text=Cultivate', category: 'sustratos', brand: 'cultivate', description: 'Versátil y enriquecido para todo tipo de plantas.\nEste sustrato es la base perfecta para cualquier tipo de cultivo, ofreciendo un soporte ideal.\nSu composición promueve una rápida germinación y un enraizamiento vigoroso, estableciendo bases sólidas.\nPosee una capacidad de aireación superior y una óptima gestión del agua, crucial para la salud de las raíces.\nUna opción confiable para cultivadores principiantes y experimentados que buscan eficiencia y simplicidad.' },

        // Fertilizantes (marcas nuevas añadidas)
        { id: 2, name: 'Fertilizante Top Crop Deeper Under', price: 2800, image: 'https://placehold.co/400x400/000000/32CD32?text=Top+Crop', category: 'fertilizantes', brand: 'top-crop', description: 'Estimulante radicular para un inicio fuerte.\nDeeper Underground de Top Crop es un poderoso enraizador que promueve un crecimiento explosivo del sistema radicular.\nSu formulación única a base de ácidos húmicos y fúlvicos, junto con extractos de algas, estimula la creación de nuevas raíces.\nEs ideal para usar durante las primeras semanas de vida de la planta, trasplantes y situaciones de estrés.\nCompatible con todo tipo de sustratos y sistemas de cultivo, es el secreto para maximizar el potencial de tus plantas.' },
        { id: 19, name: 'Fertilizante Namaste Flora', price: 4200, image: 'https://placehold.co/400x400/000000/32CD32?text=Namaste', category: 'fertilizantes', brand: 'namaste', description: 'Potenciador de floración para cosechas abundantes.\nNamaste Flora es un fertilizante orgánico diseñado específicamente para potenciar la fase de floración de tus plantas.\nSu composición rica en fósforo y potasio es esencial para la formación de flores grandes y densas.\nIncorpora microelementos y extractos vegetales que promueven una floración explosiva y una mayor producción de resinas.\nEste producto es ideal para optimizar el rendimiento y la calidad de tus cosechas, aportando los elementos necesarios para que las flores se desarrollen al máximo.\nSu origen orgánico asegura un cultivo limpio y respetuoso con el medio ambiente, sin dejar residuos no deseados en el producto final.' },
        { id: 20, name: 'Fertilizante Biobizz Grow', price: 4500, image: 'https://placehold.co/400x400/000000/32CD32?text=Biobizz', category: 'fertilizantes', brand: 'biobizz', description: 'Base orgánica para la fase de crecimiento.\nBiobizz Bio·Grow es un fertilizante líquido de crecimiento 100% orgánico, formulado a base de extracto de remolacha azucarera holandesa.\nSu alto contenido de nitrógeno, junto con otros nutrientes esenciales, promueve un crecimiento vegetativo exuberante.\nEs adecuado para ser utilizado en la mayoría de los tipos de suelos y sustratos.\nBio·Grow también ayuda a mejorar la estructura del suelo, aumentando la actividad microbiana y garantizando una base saludable para plantas vigorosas.\nEs la opción ideal para un crecimiento orgánico y sostenible.' },
        { id: 21, name: 'Fertilizante Revegetar Universal', price: 3000, image: 'https://placehold.co/400x400/000000/32CD32?text=Revegetar', category: 'fertilizantes', brand: 'revegetar', description: 'Fórmula completa para revitalizar tus plantas.\nRevegetar Universal es un fertilizante versátil diseñado para proporcionar una nutrición equilibrada durante todas las etapas de crecimiento de tus plantas.\nSu fórmula NPK (Nitrógeno, Fósforo, Potasio) está optimizada para promover tanto un desarrollo vegetativo fuerte como una floración abundante.\nEnriquecido con microelementos esenciales como el hierro, zinc y manganeso, este fertilizante previene deficiencias nutricionales.\nEs fácil de usar y se disuelve completamente en agua, lo que facilita su aplicación tanto foliar como radicular.\nIdeal para aquellos que buscan una solución integral y eficaz para mantener sus plantas sanas y productivas en cualquier momento del ciclo.' },
        { id: 22, name: 'Fertilizante Mamboretá Fungi', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Mamboreta', category: 'fertilizantes', brand: 'mamboreta', description: 'Fungicida preventivo para un cultivo sano.\nMamboretá Fungi es un fungicida sistémico y de contacto, especialmente formulado para proteger tus plantas de una amplia gama de enfermedades causadas por hongos.\nActúa de forma preventiva y curativa, controlando oídio, mildiu, roya y otras infecciones fúngicas.\nSu aplicación es sencilla y eficaz, penetrando en el tejido vegetal para una protección interna y externa.\nEs fundamental seguir las indicaciones de dosificación y seguridad para asegurar una protección óptima sin dañar tus plantas ni el medio ambiente.\nUn aliado indispensable para mantener tus plantas libres de hongos y asegurar un desarrollo vigoroso.' },
        { id: 23, name: 'Fertilizante Vamp Bloom', price: 3800, image: 'https://placehold.co/400x400/000000/32CD32?text=Vamp', category: 'fertilizantes', brand: 'vamp', description: 'Acelerador de floración para resultados rápidos.\nVamp Bloom es un potente bioestimulante de floración diseñado para acelerar y magnificar la producción de flores y frutos en tus plantas.\nFavorece una floración temprana y explosiva, aumentando el número y el tamaño de los cogollos, así como la concentración de resinas y aceites esenciales.\nEs ideal para usar durante la transición de crecimiento a floración y a lo largo de toda la etapa de floración, complementando tu programa de nutrición habitual.\nCon Vamp Bloom, tus plantas alcanzarán su máximo potencial de producción, obteniendo cosechas más abundantes y de mayor calidad.\n¡Prepárate para una explosión floral!' },
        { id: 24, name: 'Fertilizante Tasty Bud', price: 3300, image: 'https://placehold.co/400x400/000000/32CD32?text=Tasty+Fert', category: 'fertilizantes', brand: 'tasty', description: 'Potenciador de sabor y densidad para tus frutos.\nTasty Bud es un aditivo avanzado para la floración, diseñado para mejorar el perfil de sabor, aroma y la densidad de tus cosechas.\nContiene una mezcla única de carbohidratos, azúcares y aminoácidos que nutren la planta y la vida microbiana del sustrato.\nEstos componentes estimulan la producción de terpenos y resinas, resultando en flores y frutos más aromáticos y con un sabor más pronunciado y auténtico.\nTambién contribuye al engorde de las flores, aumentando su peso y compactación, lo que se traduce en una mayor cantidad de producto final.\nEs perfecto para las últimas semanas de floración, asegurando que tus cosechas alcancen su máximo potencial en calidad y rendimiento. Ideal para aquellos que buscan la excelencia en sus cultivos.' },
        { id: 29, name: 'Flora Booster 100ml', price: 3000, image: 'https://placehold.co/400x400/000000/32CD32?text=Flora+Booster', category: 'fertilizantes', brand: 'namaste', description: 'Flora Booster es un estimulador de floración diseñado para potenciar el desarrollo de las flores, logrando mayor tamaño, densidad y calidad en las cosechas. Aporta nutrientes esenciales y bioestimulantes que favorecen la producción de resinas y mejoran el aroma natural de la planta. Ideal para maximizar el rendimiento en la etapa clave del cultivo.'},

        // Iluminación
        { id: 3, name: 'Kit Iluminación LED', price: 15000, image: 'https://placehold.co/400x400/000000/32CD32?text=Kit+LED', category: 'iluminacion', description: 'Kit completo de iluminación LED de bajo consumo.\nEste sistema de iluminación LED de última generación es perfecto para optimizar el crecimiento de tus plantas en interiores.\nSu diseño de espectro completo proporciona la luz necesaria para todas las etapas del cultivo, desde la germinación hasta la floración, maximizando la fotosíntesis.\nAdemás, su tecnología de bajo consumo energético reduce significativamente tus facturas de electricidad en comparación con las luces tradicionales, mientras genera menos calor, lo que facilita el control de la temperatura en tu espacio de cultivo.\nDuradero y fácil de instalar, este kit es una inversión inteligente para cultivadores que buscan eficiencia, rendimiento y sostenibilidad.' },
        
        // Accesorios (Parafernalia) con subcategorías
        { id: 4, name: 'Filtros Celulosa y Blunt x100 Slim', price: 500, image: 'https://placehold.co/400x400/000000/32CD32?text=Filtros', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Filtros slim de celulosa para una fumada limpia.\nEstos filtros son ideales para quienes prefieren una experiencia de fumada más suave y pura.\nSu composición de celulosa natural ayuda a filtrar impurezas.\nVienen en un práctico paquete de 100 unidades.\nDiseño slim, perfecto para enrollar con precisión y comodidad.\nUn accesorio esencial para disfrutar al máximo de tus momentos.' },
        { id: 5, name: 'Filtros Celulosa y Blunt Jumbo', price: 750, image: 'https://placehold.co/400x400/000000/32CD32?text=Filtros', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Filtros jumbo para blunts, combustión lenta.\nDiseñados para una combustión lenta y uniforme.\nEl tamaño jumbo asegura una mayor superficie de filtración y una fumada más fresca.\nFabricados con celulosa de alta calidad, son resistentes y no alteran el sabor.\nPack económico para los verdaderos conocedores.' },
        { id: 6, name: 'Papelillos OCB Premium x50', price: 300, image: 'https://placehold.co/400x400/000000/32CD32?text=Papelillos', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos ultra finos para una experiencia premium.\nLos OCB Premium son conocidos mundialmente por su delgadez y combustión lenta.\nCada paquete contiene 50 hojas de papel de arroz.\nAdhesivo natural de goma arábiga para un cierre perfecto.\nImprescindibles para cualquier aficionado.' },
        { id: 7, name: 'Papelillos Lion Rolling Circus', price: 450, image: 'https://placehold.co/400x400/000000/32CD32?text=Papelillos', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos de cáñamo con diseños divertidos.\nSumérgete en el mundo de Lion Rolling Circus con estos papelillos únicos y coloridos.\nFabricados con cáñamo natural, ofrecen una combustión limpia y uniforme.\nCada librillo presenta ilustraciones originales de personajes del circo.\nUna opción ecológica y estilosa para los que buscan algo diferente.' },
        { id: 8, name: 'Picador Metálico 3 Partes', price: 1200, image: 'https://placehold.co/400x400/000000/32CD32?text=Picador', category: 'parafernalia', subcategory: 'picadores', description: 'Picador resistente de metal con tres compartimentos.\nEste picador de metal está diseñado para durar y ofrecer un triturado perfecto en cada uso.\nSus tres partes permiten un molido eficiente y un compartimento inferior para el polen.\nLos dientes afilados garantizan una consistencia uniforme.\nCompacto y discreto, es el compañero ideal para llevar a cualquier parte.' },
        { id: 9, name: 'Picador Plástico Simple', price: 600, image: 'https://placehold.co/400x400/000000/32CD32?text=Picador', category: 'parafernalia', subcategory: 'picadores', description: 'Picador básico y funcional de plástico.\nLigero y fácil de transportar.\nCumple su función de manera eficiente con sus dientes afilados.\nDisponible en varios colores vibrantes para adaptarse a tu estilo.\nIdeal para quienes buscan una herramienta sencilla y efectiva sin complicaciones.' },
        { id: 10, name: 'Bandeja Raw Mediana', price: 1800, image: 'https://placehold.co/400x400/000000/32CD32?text=Bandeja', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Bandeja metálica oficial de Raw, tamaño mediano.\nLa bandeja Raw Mediana es el accesorio definitivo para mantener tu espacio de preparación limpio y organizado.\nFabricada en metal resistente, cuenta con los icónicos logotipos de Raw y bordes elevados que evitan derrames.\nSu tamaño es ideal para acomodar todos tus accesorios de fumada sin ocupar demasiado espacio.\nPerfecta para coleccionistas y para uso diario, una pieza esencial para cualquier aficionado a Raw.' },
        { id: 11, name: 'Cenicero de Silicona', price: 950, image: 'https://placehold.co/400x400/000000/32CD32?text=Cenicero', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Cenicero irrompible y fácil de limpiar.\nEste cenicero de silicona es la solución perfecta para evitar roturas accidentales y facilitar la limpieza.\nSu material flexible y resistente al calor lo hace ideal para uso en interiores y exteriores.\nDiseño moderno y disponible en varios colores.\nUn accesorio práctico y duradero para tu hogar o espacio de ocio.' },
        { id: 12, name: 'Frasco Hermético 100ml', price: 800, image: 'https://placehold.co/400x400/000000/32CD32?text=Frasco', category: 'parafernalia', subcategory: 'guardado', description: 'Frasco de cristal con cierre hermético para conservar.\nEste frasco de cristal de 100ml es ideal para preservar la frescura y las propiedades de tus hierbas.\nEl cierre hermético de alta calidad asegura que el contenido se mantenga protegido del aire y la luz.\nSu tamaño compacto lo hace perfecto para el almacenamiento discreto y fácil de transportar.\nUn indispensable para mantener la calidad de tus productos intacta.' },
        { id: 13, name: 'Bolsa Mylar Antiolor', price: 200, image: 'https://placehold.co/400x400/000000/32CD32?text=Bolsa', category: 'parafernalia', subcategory: 'guardado', description: 'Bolsas Mylar antiolor son la solución más eficaz para el almacenamiento discreto y seguro de productos aromáticos.\nFabricadas con múltiples capas de Mylar, bloquean los olores y protegen el contenido de la humedad y la luz UV.\nCierre zip resellable que garantiza la hermeticidad y la frescura del interior.\nPerfectas para viajes o para mantener la discreción en casa.' },
        { id: 14, name: 'Encendedor Bic Grande', price: 400, image: 'https://placehold.co/400x400/000000/32CD32?text=Encendedor', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor Bic clásico, duradero y confiable.\nEl encendedor Bic Grande es un ícono de confiabilidad y durabilidad, un clásico que nunca falla.\nSu diseño simple y robusto lo hace perfecto para el uso diario.\nSeguro y fácil de usar, con llama ajustable y resistente al viento.\nUn producto esencial que combina eficiencia y economía en un solo diseño atemporal.' },
        { id: 15, name: 'Encendedor Recargable USB', price: 1500, image: 'https://placehold.co/400x400/000000/32CD32?text=Encendedor+USB', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor eléctrico recargable vía USB, sin llama.\nOlvídate del gas y las llamas con este moderno encendedor recargable USB.\nFunciona con un arco eléctrico que enciende al instante, incluso en condiciones de viento.\nSe carga fácilmente a través de cualquier puerto USB, lo que lo convierte en una opción ecológica y económica.\nSu diseño elegante y compacto lo hace ideal para llevar en el bolsillo o en el bolso.\nInnovación y practicidad unidas en este dispositivo de última generación.' },
        
        // Accesorios de Cultivo (con descripciones)
        { id: 18, name: 'Tijera de Poda Curva', price: 1100, image: 'https://placehold.co/400x400/000000/32CD32?text=Tijera', category: 'accesorios-de-cultivo', description: 'Tijera de precisión con punta curva para manicura.\nEsta tijera de poda con punta curva es la herramienta indispensable para una manicura precisa y delicada de tus plantas.\nSus hojas de acero inoxidable afiladas permiten realizar cortes limpios y exactos.\nEl diseño ergonómico y las empuñaduras antideslizantes aseguran un agarre cómodo y reducen la fatiga.\nIdeal para trabajos finos en plantas delicadas, te ayudará a mantener la salud y la estética de tus cultivos con facilidad y eficiencia.' },
        { id: 25, name: 'Medidor de PH Digital', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Medidor+PH', category: 'accesorios-de-cultivo', description: 'Medidor digital de PH para control del agua de riego.\nControlar el pH de tu solución de riego es crucial para la salud de tus plantas.\nProporciona lecturas rápidas y fiables, asegurando que tus plantas absorban los nutrientes de manera óptima.\nCompacto y fácil de calibrar, es una herramienta esencial para cualquier cultivador.\nUna pequeña inversión que marca una gran diferencia en la calidad y el rendimiento de tus cultivos.' },
        { id: 26, name: 'Malla Scrog 1x1m', price: 900, image: 'https://placehold.co/400x400/000000/32CD32?text=Malla+Scrog', category: 'accesorios-de-cultivo', description: 'Malla para método SCROG, optimiza la distribución de ramas.\nLa malla SCROG (Screen of Green) de 1x1 metro es una técnica avanzada para maximizar la producción.\nPermite guiar el crecimiento horizontal de las ramas, creando un dosel uniforme y optimizando la exposición a la luz.\nFabricada con materiales resistentes y duraderos, es fácil de instalar y reutilizar en múltiples ciclos de cultivo.\nIdeal para quienes buscan un mayor rendimiento y una distribución equitativa de la energía en sus plantas.' },
        { id: 27, name: 'Extractor de Aire 4"', price: 8500, image: 'https://placehold.co/400x400/000000/32CD32?text=Extractor', category: 'accesorios-de-cultivo', description: 'Extractor de aire silencioso para renovación del ambiente.\nUn extractor de aire de 4 pulgadas es fundamental para mantener un ambiente de cultivo óptimo.\nSu funcionamiento silencioso asegura que no perturbará tu entorno.\nElimina el aire viciado y el exceso de calor, previniendo problemas como moho y plagas.\nFácil de instalar, es una pieza clave para cualquier sistema de ventilación de cultivo interior.' },
        { id: 28, name: 'Termohigrómetro Digital', price: 1800, image: 'https://placehold.co/400x400/000000/32CD32?text=Termometro', category: 'accesorios-de-cultivo', description: 'Controla temperatura y humedad con este dispositivo digital.\nEl termohigrómetro digital es una herramienta esencial para monitorear y optimizar las condiciones ambientales.\nProporciona lecturas precisas de temperatura y humedad, dos factores críticos que impactan directamente en el crecimiento y la salud.\nSu pantalla de fácil lectura y la capacidad de registrar máximos y mínimos te permiten mantener un control constante.\nCompacto y fiable, es el aliado perfecto para asegurar que tus plantas prosperen en el ambiente ideal.' },
    ];
    let cart = [];

    // Función para poblar las opciones de marca y subcategoría en el formulario de administrador
    function populateProductFormBrands() {
        const brands = [
            // Marcas de Sustratos
            { value: 'tasty', text: 'Tasty (Sustratos)' },
            { value: 'cultivate', text: 'Cultivate' },
            { value: 'la-pacha-sustrato', text: 'La Pacha Sustrato' },
            // Marcas de Fertilizantes (actualizadas)
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

        // Opciones de subcategoría para Parafernalia
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
     * Renderiza los productos en la vista de catálogo aplicando filtros.
     * @param {string} category - La categoría a filtrar ('all' para todos).
     * @param {string} selectedBrand - La marca a filtrar (opcional, para sustratos/fertilizantes).
     * @param {string} selectedSubcategory - La subcategoría a filtrar (opcional, para accesorios).
     */
    function renderProducts(category, selectedBrand, selectedSubcategory) {
        productList.innerHTML = '';
        let filteredProducts = products;

        // Lógica de filtrado principal basada en la categoría
        if (category === 'parafernalia') {
            filteredProducts = products.filter(p => p.category === 'parafernalia');
            if (selectedSubcategory && selectedSubcategory !== 'all-accesorios') {
                filteredProducts = filteredProducts.filter(p => p.subcategory === selectedSubcategory);
            }
        } else if (category === 'accesorios-de-cultivo') {
            // Cuando se selecciona "Accesorios de Cultivo", filtra por esta categoría
            filteredProducts = products.filter(p => p.category === 'accesorios-de-cultivo');
            // No se aplican subfiltros para esta categoría.
        } else if (category !== 'all') {
            filteredProducts = products.filter(p => p.category === category);
        }

        // Aplica el filtro de marca si la categoría es sustratos o fertilizantes y se selecciona una marca
        if ((category === 'sustratos' || category === 'fertilizantes') && selectedBrand && selectedBrand !== 'all-sustratos' && selectedBrand !== 'all-fertilizantes') {
            filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
        }

        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay productos en esta categoría o marca/subcategoría.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            let descriptionHtml = '';
            let toggleButtonHtml = '';
            if (product.description) {
                const lines = product.description.split('\n').filter(line => line.trim() !== '');
                const needsToggle = lines.length > MAX_LINES_DISPLAY;
                
                // Todas las líneas van dentro de este único wrapper
                descriptionHtml += `<div class="product-description-wrapper text-gray-700 text-sm mb-2 ${needsToggle ? 'product-description-collapsed' : ''}">`;
                lines.forEach(line => {
                    descriptionHtml += `<p class="leading-tight">${line}</p>`;
                });
                descriptionHtml += `</div>`; // Cierra product-description-wrapper

                if (needsToggle) {
                    toggleButtonHtml = `<button class="toggle-description-btn text-green-600 hover:text-green-800 font-semibold mt-2 flex items-center justify-start">
                                            Ver más... <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </button>`;
                }
            }

            const productCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover object-center" onerror="this.onerror=null;this.src='https://placehold.co/400x400/cccccc/333333?text=Imagen+No+Disp.''">
                    <div class="p-4">
                        <h4 class="text-lg font-bold">${product.name}</h4>
                        <p class="text-sm text-gray-500 capitalize mb-2">Categoría: ${product.category || 'Sin Categoría'}${product.subcategory ? ` / Subcategoría: ${product.subcategory.replace(/-/g, ' ')}` : ''}${product.brand ? ` / Marca: ${product.brand.replace(/-/g, ' ')}` : ''}</p>
                        ${descriptionHtml}
                        ${toggleButtonHtml}
                        <p class="text-xl font-losmarmotas text-green-600 mb-4">$${product.price.toLocaleString('es-AR')}</p>
                        <button data-id="${product.id}" class="add-to-cart-btn w-full bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });

        // Añadir listeners de eventos para los nuevos botones de alternancia después de renderizar los productos
        document.querySelectorAll('.toggle-description-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const wrapper = e.target.previousElementSibling; // product-description-wrapper
                if (wrapper) {
                    wrapper.classList.toggle('product-description-collapsed');
                    const svgIcon = e.target.querySelector('svg');
                    if (wrapper.classList.contains('product-description-collapsed')) {
                        e.target.innerHTML = `Ver más... <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`;
                    } else {
                        e.target.innerHTML = `Ver menos... <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`;
                    }
                }
            });
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
                        <span class="text-sm text-gray-500 block sm:inline sm:ml-2 capitalize">Categoría: ${product.category || 'Sin Categoría'}${product.subcategory ? ` / Subcategoría: ${product.subcategory.replace(/-/g, ' ')}` : ''}${product.brand ? ` / Marca: ${product.brand.replace(/-/g, ' ')}` : ''}</span>
                        ${product.description ? `<p class="text-gray-600 text-xs mt-1">Descripción: ${product.description.split('\n')[0]}...</p>` : ''} <!-- Muestra solo la primera línea de la descripción en la lista de administración -->
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
                renderProducts(currentCategory, currentBrand, currentSubcategory); // Vuelve a renderizar con los filtros actuales
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
        productFormSubcategory.classList.add('hidden'); // Ocultar por defecto
        productFormBrand.classList.add('hidden'); // Ocultar por defecto
        productFormSubcategory.value = ''; // Resetear valor
        productFormBrand.value = ''; // Resetear valor
        productFormDescription.value = ''; 
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
            productFormDescription.value = product.description || ''; 
            
            // Mostrar y cargar subcategoría si es 'parafernalia'
            if (product.category === 'parafernalia') {
                productFormSubcategory.classList.remove('hidden');
                productFormSubcategory.value = product.subcategory || '';
                productFormBrand.classList.add('hidden'); // Ocultar campo de marca
            } else if (product.category === 'sustratos' || product.category === 'fertilizantes') {
                productFormBrand.classList.remove('hidden'); // Mostrar campo de marca
                productFormBrand.value = product.brand || '';
                productFormSubcategory.classList.add('hidden'); // Ocultar campo de subcategoría
            } else { // Si es cualquier otra categoría, incluyendo 'accesorios-de-cultivo'
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

    // Maneja el envío del formulario de productos (añadir/editar)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); 

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Validación adicional para subcategoría o marca según la categoría principal
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
            description 
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No se asigna 'subcategory' ni 'brand' si la categoría es 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edita el producto existente
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Añade un nuevo producto
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Vuelve a renderizar con los filtros actuales
    });

    // Controla la visibilidad de los selectores de subcategoría/marca en el formulario de administración
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
        // Si la categoría seleccionada es 'accesorios-de-cultivo', los campos de subcategoría y marca permanecen ocultos.
    });


    // === Event Listeners del Catálogo ===

    // Alternar menú móvil
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Cerrar modal de mensajes
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

    // Listener de eventos para los botones de filtro de categoría principal
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryToFilter = button.getAttribute('data-category');
            const isBrandButton = button.classList.contains('brand-btn');
            const isSubcategoryButton = button.classList.contains('subcategory-btn');

            // Desactiva todos los botones de filtro principales
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            
            // Oculta todos los contenedores de subcategoría/marca al inicio de cada clic
            accessorySubcategoriesContainer.classList.add('hidden');
            sustratosBrandsContainer.classList.add('hidden');
            fertilizantesBrandsContainer.classList.add('hidden');

            if (isBrandButton) {
                // Lógica para botones de marca (Sustratos/Fertilizantes)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                if (button.closest('#sustratos-brands')) {
                    currentCategory = 'sustratos';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.add('bg-green-500', 'text-black');
                    sustratosBrandsContainer.classList.remove('hidden');
                } else if (button.closest('#fertilizantes-brands')) {
                    currentCategory = 'fertilizantes';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.add('bg-green-500', 'text-black');
                    fertilizantesBrandsContainer.classList.remove('hidden');
                }
                
            } else if (isSubcategoryButton) {
                // Lógica para botones de subcategoría (dentro de Parafernalia)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                currentCategory = 'parafernalia'; 
                currentSubcategory = button.getAttribute('data-subcategory');
                currentBrand = 'all'; 
                accessorySubcategoriesContainer.classList.remove('hidden'); 

                // Activa el botón de categoría principal "Parafernalia"
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.remove('bg-gray-200', 'text-gray-800');
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.add('bg-green-500', 'text-black');
                
                // Asegúrate de que el botón "Accesorios de Cultivo" no esté activo
                const accesoriosCultivoBtn = document.querySelector('.filter-btn[data-category="accesorios-de-cultivo"]');
                if (accesoriosCultivoBtn) {
                    accesoriosCultivoBtn.classList.remove('bg-green-500', 'text-black');
                    accesoriosCultivoBtn.classList.add('bg-gray-200', 'text-gray-800');
                }

            } else { // Lógica para botones de categoría principal (Todos, Sustratos, Fertilizantes, Iluminación, Parafernalia, Accesorios de Cultivo)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');
                currentCategory = categoryToFilter;
                currentBrand = 'all'; 
                currentSubcategory = 'all-accesorios'; 

                // Muestra el contenedor de subcategoría/marca relevante si aplica
                if (currentCategory === 'parafernalia') {
                    accessorySubcategoriesContainer.classList.remove('hidden');
                    // Activa el botón "Todos los Accesorios" por defecto
                    document.querySelector('#accessory-subcategories .subcategory-btn[data-subcategory="all-accesorios"]').click();
                } else if (currentCategory === 'accesorios-de-cultivo') {
                    // Si se selecciona "Accesorios de Cultivo", oculta los subfiltros
                    accessorySubcategoriesContainer.classList.add('hidden');
                } else if (currentCategory === 'sustratos') {
                    sustratosBrandsContainer.classList.remove('hidden');
                    // Activa el botón "Todas las Marcas (Sustratos)" por defecto
                    document.querySelector('#sustratos-brands .brand-btn[data-brand="all-sustratos"]').click();
                } else if (currentCategory === 'fertilizantes') {
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    // Activa el botón "Todas las Marcas (Fertilizantes)" por defecto
                    document.querySelector('#fertilizantes-brands .brand-btn[data-brand="all-fertilizantes"]').click();
                }
            }
            renderProducts(currentCategory, currentBrand, currentSubcategory);
        });
    });

    // === Event Listeners de Administración ===
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

    // Evento para el botón de cerrar sesión (escritorio)
    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        showMessage('Has cerrado sesión de administrador.');
    });

    // Evento para el botón de cerrar sesión (móvil)
    logoutBtnMobile.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        mobileMenu.classList.add('hidden');
        showMessage('Has cerrado sesión de administrador.');
    });

    // Alternar sección de gestión de productos (escritorio)
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

    // Alternar sección de gestión de productos (móvil)
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

    // Manejar la vista previa de la imagen al ingresar la URL
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

    // Manejar la vista previa de la imagen al seleccionar un archivo local
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

    // Maneja el envío del formulario de productos (añadir/editar)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); 

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Validación adicional para subcategoría o marca según la categoría principal
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
            description 
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No se asigna 'subcategory' ni 'brand' si la categoría es 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edita el producto existente
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Añade un nuevo producto
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Vuelve a renderizar con los filtros actuales
    });

    // Controla la visibilidad de los selectores de subcategoría/marca en el formulario de administración
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
        // Si la categoría seleccionada es 'accesorios-de-cultivo', los campos de subcategoría y marca permanecen ocultos.
    });


    // === Inicialización al cargar la página ===
    updateAdminUI();
    populateProductFormBrands();
    renderProducts(currentCategory, currentBrand, currentSubcategory); // Muestra los productos inicialmente
    document.getElementById('filter-all').click(); // Activa el botón "Todos" al inicio
    renderCart();
});
