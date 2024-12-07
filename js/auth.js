// Fonctions globales pour l'authentification
let updateAuthUI; // Déclaration globale

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    console.log('Script auth.js chargé');
    
    // Fonction pour mettre à jour l'image de profil
    function updateProfileImage(imagePath) {
        const profileImage = document.getElementById('profile-image');
        if (profileImage) {
            profileImage.src = imagePath;
        }
    }

    // Fonction pour mettre à jour l'interface utilisateur
    function updateAuthUI(isLoggedIn) {
        const authMenu = document.querySelector('.auth-menu');
        const profileCircle = document.querySelector('.profile-circle');
        
        if (isLoggedIn) {
            authMenu.innerHTML = `
                <div class="auth-menu-item" id="logoutButton">Déconnexion</div>
                <div class="auth-menu-item" onclick="openModal('profile')">Mon Profil</div>
            `;
            // Ajouter l'événement de déconnexion
            document.getElementById('logoutButton').addEventListener('click', function() {
                localStorage.removeItem('user');
                updateProfileImage('images/default-avatar.webp');
                updateAuthUI(false);
                console.log('Déconnexion effectuée');
            });
        } else {
            authMenu.innerHTML = `
                <div class="auth-menu-item" onclick="openModal('login')">Connexion</div>
                <div class="auth-menu-item" onclick="openModal('register')">Inscription</div>
            `;
            updateProfileImage('images/default-avatar.webp');
        }
    }

    // Gestion de l'affichage du mot de passe
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.add('showing');
            } else {
                input.type = 'password';
                this.classList.remove('showing');
            }
        });
    });

    // Gestion de l'aperçu de l'image
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePreview = document.getElementById('profilePreview');

    if (profilePhotoInput && profilePreview) {
        profilePhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (registerForm) {
        console.log('Formulaire d\'inscription trouvé');
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulaire soumis');
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                if (key === 'profile_photo' && value instanceof File) {
                    const reader = new FileReader();
                    reader.readAsDataURL(value);
                    reader.onload = function() {
                        data[key] = reader.result;
                    };
                } else {
                    data[key] = value;
                }
            });
            
            console.log('Données à envoyer:', data);

            try {
                const response = await fetch('auth/register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                console.log('Réponse reçue:', response);
                const result = await response.json();
                console.log('Résultat:', result);
                
                if (result.success) {
                    alert('Inscription réussie !');
                    closeModal('register');
                    if (result.user && result.user.profile_photo) {
                        updateProfileImage(result.user.profile_photo);
                    }
                    localStorage.setItem('user', JSON.stringify(result.user));
                    updateAuthUI(true);
                } else {
                    alert(result.error || 'Erreur lors de l\'inscription');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'inscription');
            }
        });
    }

    // Vérifier si l'utilisateur est déjà connecté au chargement de la page
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.profile_photo) {
            $path = `images/users/${user.profile_photo}`
            updateProfileImage($path);
        }
        updateAuthUI(true);
    }
});
