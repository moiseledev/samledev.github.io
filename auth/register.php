<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../models/User.php';

// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Récupérer les données du formulaire
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Validation des champs
    if (empty($name) || empty($email) || empty($password)) {
        throw new Exception('Tous les champs sont requis');
    }

    if (strlen($name) < 3) {
        throw new Exception('Le nom doit contenir au moins 3 caractères');
    }

    if (!$email) {
        throw new Exception('Email invalide');
    }

    if (strlen($password) < 8) {
        throw new Exception('Le mot de passe doit contenir au moins 8 caractères');
    }

    $user = new User();
    
    // Vérifier si l'email existe déjà
    if ($user->findByEmail($email)) {
        throw new Exception('Cet email est déjà utilisé');
    }

    // Traitement de l'image de profil
    $profilePhotoPath = 'images/default-avatar.webp';
    if (isset($_FILES['profile_photo']) && $_FILES['profile_photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../images/users/';
        
        // Créer le dossier s'il n'existe pas
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception("Impossible de créer le dossier pour les images");
            }
        }

        // Vérifier le type de fichier
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($_FILES['profile_photo']['tmp_name']);
        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP.');
        }

        // Générer un nom unique pour le fichier
        $extension = pathinfo($_FILES['profile_photo']['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . '.' . $extension;
        $targetPath = $uploadDir . $fileName;

        // Déplacer le fichier
        if (move_uploaded_file($_FILES['profile_photo']['tmp_name'], $targetPath)) {
            $profilePhotoPath = 'images/users/' . $fileName;
            error_log("Image de profil sauvegardée : " . $profilePhotoPath);
        } else {
            error_log("Erreur lors du déplacement du fichier vers : " . $targetPath);
            throw new Exception("Impossible de sauvegarder l'image de profil");
        }
    }

    // Créer l'utilisateur
    $userId = $user->create($name, $email, $password, $profilePhotoPath);

    echo json_encode([
        'success' => true,
        'message' => 'Inscription réussie !',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'profile_photo' => $profilePhotoPath
        ]
    ]);

} catch (Exception $e) {
    error_log("Erreur d'inscription : " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
