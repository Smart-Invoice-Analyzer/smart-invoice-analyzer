import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const corsOptions = {
  origin: 'http://localhost:3000', // Frontend'in çalıştığı adres
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

const app = express();
const PORT = 5000;

app.use(cors(corsOptions));
app.use(bodyParser.json());

// POST /users
app.post('/users', (req, res) => {
  console.log('Yeni kullanıcı oluşturma isteği:', req.body);
  const { email, username } = req.body;
  const dataPath = path.join(__dirname, '../../front-end/public/usersdata.json');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Dosya okuma hatası:', err);
      return res.status(500).json({ message: 'Data dosyası okunamadı' });
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      return res.status(500).json({ message: 'JSON parse hatası' });
    }


    
    // E-posta veya kullanıcı adı kontrolü
    const userExists = users.some((user: { email: any; username: any; }) => user.email === email || user.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'E-posta veya kullanıcı adı zaten kullanılıyor' });
    }

    // Yeni kullanıcıyı ekleme
    const newUser = { ...req.body, userId: Math.floor(Math.random() * 1000000) };
    users.push(newUser);

    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Dosya yazma hatası:', err);
        return res.status(500).json({ message: 'Data dosyasına yazılamadı' });
      }

      res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: newUser });
    });
  });
});

app.post('/users/update', (req, res) => {
  const { email, name, surname, password } = req.body;
  const dataPath = path.join(__dirname, '../../front-end/public/usersdata.json');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Dosya okuma hatası:', err);
      return res.status(500).json({ message: 'Data dosyası okunamadı' });
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      return res.status(500).json({ message: 'JSON parse hatası' });
    }

    // Eposta ile kullanıcı bul
    const userIndex = users.findIndex((user: { email: any; }) => user.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Kullanıcının ismini ve soyismini güncelle
    users[userIndex].name = name;
    users[userIndex].surname = surname;
    users[userIndex].password = password;

    // Güncellenmiş kullanıcı listesini JSON dosyasına yaz
    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Dosya yazma hatası:', err);
        return res.status(500).json({ message: 'Data dosyasına yazılamadı' });
      }

      res.status(200).json({ message: 'Profil başarıyla güncellendi' });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
