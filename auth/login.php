<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../models/User.php';

try {
    // Récupération des données
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Validation des données
    if (empty($email) || empty($password)) {
        throw new Exception('Tous les champs sont requis');
    }
    
    if (!$email) {
        throw new Exception('Email invalide');
    }
    
    // Tentative de connexion
    $user = new User();
    $userData = $user->login($email, $password);
    
    if ($userData) {
        echo json_encode([
            'success' => true,
            'message' => 'Connexion réussie !',
            'user' => $userData
        ]);
    } else {
        throw new Exception('Email ou mot de passe incorrect');
    }
    
} catch (Exception $e) {
    error_log("Erreur de connexion : " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
