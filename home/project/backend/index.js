const express = require('express');
    const sqlite3 = require('sqlite3').verbose();

    const app = express();
    const port = 3001;

    app.use(express.json());

    let db = new sqlite3.Database(':memory:');

    db.serialize(() => {
      db.run("CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)");
    });

    app.get('/api/messages', (req, res) => {
      db.all('SELECT * FROM messages', [], (err, rows) => {
        if (err) {
          throw err;
        }
        res.json(rows);
      });
    });

    app.post('/api/messages', (req, res) => {
      const { message } = req.body;
      db.run("INSERT INTO messages (message) VALUES (?)", [message], function(err) {
        if (err) {
          return console.error(err.message);
        }
        res.json({ id: this.lastID, message });
      });
    });

    app.listen(port, () => {
      console.log(`Backend server running at http://localhost:${port}`);
    });
