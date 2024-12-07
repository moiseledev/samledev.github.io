const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');

// Configuration de Multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/projects');
    },
    filename: (req, file, cb) => {
        cb(null, `project-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Images uniquement!'));
    }
});

// Obtenir tous les projets
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un projet spécifique
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Créer un nouveau projet
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            image: req.file ? `/uploads/projects/${req.file.filename}` : null
        };

        const project = await Project.create(projectData);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mettre à jour un projet
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const projectData = {
            ...req.body
        };

        if (req.file) {
            projectData.image = `/uploads/projects/${req.file.filename}`;
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            projectData,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un projet
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
