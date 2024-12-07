<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function create($name, $email, $password, $profile_photo) {
        try {
            // Vérifier si l'email existe déjà
            if ($this->findByEmail($email)) {
                throw new Exception('Cet email est déjà utilisé');
            }
            
            // Hash du mot de passe
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            // Préparation de la requête
            $query = "INSERT INTO users (name, email, password, profile_photo) VALUES (:name, :email, :password, :profile_photo)";
            $stmt = $this->db->prepare($query);
            
            // Exécution de la requête
            $success = $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password' => $hashedPassword,
                ':profile_photo' => $profile_photo
            ]);
            
            if ($success) {
                return $this->db->lastInsertId();
            }
            
            return false;
            
        } catch (PDOException $e) {
            error_log("Erreur lors de la création de l'utilisateur: " . $e->getMessage());
            throw new Exception("Une erreur est survenue lors de la création du compte");
        }
    }
    
    public function findByEmail($email) {
        try {
            $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute([':email' => $email]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Erreur lors de la recherche par email: " . $e->getMessage());
            return false;
        }
    }
    
    public function login($email, $password) {
        try {
            $user = $this->findByEmail($email);
            
            if (!$user) {
                throw new Exception('Email ou mot de passe incorrect');
            }
            
            if (!password_verify($password, $user['password'])) {
                throw new Exception('Email ou mot de passe incorrect');
            }
            
            // Retourner les informations de l'utilisateur sans le mot de passe
            unset($user['password']);
            return $user;
            
        } catch (PDOException $e) {
            error_log("Erreur lors de la connexion: " . $e->getMessage());
            throw new Exception("Une erreur est survenue lors de la connexion");
        }
    }
}
