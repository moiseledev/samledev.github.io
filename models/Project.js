const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    fullDescription: {
        type: String,
        required: [true, 'La description complète est requise']
    },
    image: {
        type: String,
        required: [true, 'L\'image est requise']
    },
    category: {
        type: String,
        required: [true, 'La catégorie est requise'],
        enum: ['web', 'mobile', 'desktop', 'robotique', 'ai']
    },
    tags: [{
        type: String
    }],
    techStack: [{
        type: String
    }],
    features: [{
        type: String
    }],
    liveLink: String,
    githubLink: String,
    gallery: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Mise à jour de la date de modification
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Project', projectSchema);
