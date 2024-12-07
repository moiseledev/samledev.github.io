const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
    constructor(userData) {
        this.name = userData.name;
        this.email = userData.email;
        this.password = userData.password;
    }

    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [userData.name, userData.email, hashedPassword]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }

    static async matchPassword(enteredPassword, hashedPassword) {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    }
}

module.exports = User;
