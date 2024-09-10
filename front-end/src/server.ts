import express, { Request, Response } from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// JSON formatını kabul etmek için body parser kullan
app.use(bodyParser.json());

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// JSON dosyasını okumak için GET isteği
app.get('/data', (req: Request, res: Response) => {
  fs.readFile('public/data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Veri okuma hatası');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// JSON dosyasına veri eklemek için POST isteği
app.post('/data', (req: Request, res: Response) => {
  const newUser: User = req.body;

  // Mevcut veriyi oku
  fs.readFile('public/data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Veri okuma hatası');
      return;
    }

    // Mevcut veriyi parse et ve yeni kullanıcıyı ekle
    const users: User[] = JSON.parse(data);
    users.push(newUser);

    // Güncellenmiş veriyi JSON dosyasına yaz
    fs.writeFile('public/data.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Veri yazma hatası');
        return;
      }
      res.status(201).send('Kullanıcı eklendi');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
