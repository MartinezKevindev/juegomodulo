document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    // Inicializar logs por defecto estructurados si LocalStorage está vacío
    let reviews = JSON.parse(localStorage.getItem('game_reviews')) || [
        {
            user: "Agente Kennedy",
            rating: 5,
            comment: "El sistema de inventario limitado captura perfectamente la vibra clásica de los survival horror. ¡Gran trabajo del equipo!"
        },
        {
            user: "Ada_W",
            rating: 4,
            comment: "Increíble atmósfera visual. Las cámaras fijas se sienten modernas y pulidas."
        }
    ];

    // Función para renderizar el Log en la interfaz de pantalla
    function displayReviews() {
        // Limpieza de contenedor principal
        reviewsList.innerHTML = '';
        
        // Manejo de estado vacío
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p style="color: #666; font-style: italic; font-family: monospace;">No hay registros en el log actualmente. Transmisión limpia.</p>';
            return;
        }

        // Iteración y construcción del árbol DOM modular
        reviews.forEach(review => {
            const stars = '⭐'.repeat(review.rating);
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item');
            
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="review-user">${escapeHTML(review.user)}</span>
                    <span class="review-rating">${stars}</span>
                </div>
                <p class="review-text">${escapeHTML(review.comment)}</p>
            `;
            reviewsList.appendChild(reviewElement);
        });
    }

    // Algoritmo de filtrado contra inyecciones de script maliciosas (XSS)
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ 
                '&': '&amp;', 
                '<': '&lt;', 
                '>': '&gt;', 
                "'": '&#39;', 
                '"': '&quot;' 
            }[tag] || tag)
        );
    }

    // Controlador de eventos para interceptar capturas de formulario
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username');
        const ratingInput = document.getElementById('rating');
        const commentInput = document.getElementById('comment');

        // Construcción de la nueva entidad de datos limpia
        const newReview = {
            user: usernameInput.value.trim(),
            rating: parseInt(ratingInput.value),
            comment: commentInput.value.trim()
        };

        // Inserción en la cabecera del array para orden cronológico descendente
        reviews.unshift(newReview);

        // Persistencia síncrona en LocalStorage
        localStorage.setItem('game_reviews', JSON.stringify(reviews));

        // Refresco de componentes de la UI y reinicio físico de los inputs
        displayReviews();
        reviewForm.reset();
    });

    // Disparo y carga inicial automatizada al renderizar la ventana
    displayReviews();
});