// Données des projets
const projects = [
    {
        id: 1,
        title: "Portfolio Interactif",
        description: "Portfolio personnel avec authentification et gestion de profil",
        fullDescription: "Un portfolio moderne et interactif développé avec les dernières technologies web. Comprend un système d'authentification complet, une gestion de profil avec upload de photo, et une interface utilisateur responsive.",
        image: "images/projets/logo.png",
        category: "web",
        tags: ["HTML", "CSS", "JavaScript", "Authentication"],
        techStack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
        features: [
            "Authentification utilisateur",
            "Upload de photo de profil",
            "Interface responsive",
            "Animations fluides",
            "Validation des formulaires"
        ],
        date: "2024",
        liveLink: "#",
        githubLink: "#",
        gallery: [
            "images/projets/logo.png"
        ]
    },
    // Ajoutez vos autres projets ici
];

// Filtrage des projets
let currentFilter = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation
    renderProjects();
    initializeFilters();
    initializeSearch();
});

// Rendu des projets
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    const template = document.querySelector('#project-template');
    projectsGrid.innerHTML = '';

    const filteredProjects = projects.filter(project => {
        const matchesFilter = currentFilter === 'all' || project.category === currentFilter;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filteredProjects.forEach(project => {
        const projectElement = template.content.cloneNode(true);
        
        // Remplissage des données
        const img = projectElement.querySelector('img');
        img.src = project.image;
        img.alt = project.title;

        projectElement.querySelector('.project-title').textContent = project.title;
        projectElement.querySelector('.project-description').textContent = project.description;
        
        // Tags
        const tagsContainer = projectElement.querySelector('.project-tags');
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'project-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        // Date
        projectElement.querySelector('.project-date').textContent = project.date;

        // Liens
        const liveLink = projectElement.querySelector('.project-link.live');
        const githubLink = projectElement.querySelector('.project-link.github');
        liveLink.href = project.liveLink;
        githubLink.href = project.githubLink;

        // Bouton détails
        const detailsBtn = projectElement.querySelector('.project-details-btn');
        detailsBtn.addEventListener('click', () => openProjectModal(project));

        projectsGrid.appendChild(projectElement);
    });

    // Message si aucun projet trouvé
    if (filteredProjects.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'Aucun projet ne correspond à votre recherche.';
        projectsGrid.appendChild(noResults);
    }
}

// Initialisation des filtres
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mise à jour du filtre actif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentFilter = button.dataset.filter;
            renderProjects();
        });
    });
}

// Initialisation de la recherche
function initializeSearch() {
    const searchInput = document.querySelector('#project-search');
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProjects();
    });
}

// Gestion du modal de détails
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    
    // Remplissage des données du modal
    modal.querySelector('.modal-header h2').textContent = project.title;
    modal.querySelector('.project-full-description').textContent = project.fullDescription;
    
    // Galerie d'images
    const gallery = modal.querySelector('.project-gallery');
    gallery.innerHTML = '';
    project.gallery.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = project.title;
        gallery.appendChild(img);
    });

    // Technologies
    const techStack = modal.querySelector('.project-tech-stack');
    techStack.innerHTML = '';
    project.techStack.forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag';
        techTag.innerHTML = `<i class="fas fa-code"></i>${tech}`;
        techStack.appendChild(techTag);
    });

    // Fonctionnalités
    const features = modal.querySelector('.project-features');
    features.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        features.appendChild(li);
    });

    // Liens
    const liveBtn = modal.querySelector('.primary-btn');
    const githubBtn = modal.querySelector('.secondary-btn');
    liveBtn.href = project.liveLink;
    githubBtn.href = project.githubLink;

    // Affichage du modal
    modal.style.display = 'block';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
}

// Fermeture du modal en cliquant en dehors
window.addEventListener('click', (e) => {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Animation au scroll
function animateOnScroll() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    projectCards.forEach(card => {
        observer.observe(card);
    });
}

// Initialisation des animations au chargement
document.addEventListener('DOMContentLoaded', animateOnScroll);
