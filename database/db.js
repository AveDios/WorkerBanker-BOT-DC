const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./balance.db", (err) => {
    if (err) {
        console.error("Błąd połączenia z bazą danych:", err.message);
    } else {
        console.log("Połączono z bazą danych SQLite.");
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                balance INTEGER DEFAULT 0
            )
        `);
    }
});

const getUserBalance = (userId, callback) => {
    db.get("SELECT balance FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(null);
        } else {
            callback(row ? row.balance : 0);
        }
    });
};

function setUserBalance(userId, amount, callback) {
    db.run(
        `
        INSERT INTO users (id, balance) VALUES (?, ?)
        ON CONFLICT(id) DO UPDATE SET balance = balance + ?
    `,
        [userId, amount, amount],
        (err) => {
            if (err) {
                console.error(err.message);
                callback(false);
            } else {
                callback(true);
            }
        }
    );
}

module.exports = { getUserBalance, setUserBalance };
