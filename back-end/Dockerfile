# Node.js için temel imaj kullanıyoruz
FROM node:18

# Uygulama dosyalarını container içine kopyalayacağımız bir çalışma dizini oluşturuyoruz
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyalıyoruz
COPY package*.json ./

# Gerekli bağımlılıkları kuruyoruz
RUN npm install

# Uygulamanın tüm dosyalarını container içine kopyalıyoruz
COPY . .

# Uygulamanın çalıştırılacağı portu tanımlıyoruz
EXPOSE 5000

# npm start
CMD ["npm", "start"]
