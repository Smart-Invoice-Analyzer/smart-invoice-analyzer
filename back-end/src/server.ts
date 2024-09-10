import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

// CORS middleware'i ekleyin
app.use(cors());

// bodyParser kullanımı
app.use(bodyParser.json());

// POST /users
app.post('/users', (req, res) => {
  const newUser = req.body;
  const dataPath = path.join(__dirname, 'data.json');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Data dosyası okunamadı' });
    }

    const users = JSON.parse(data);
    users.push(newUser);

    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Data dosyasına yazılamadı' });
      }

      res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: newUser });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
