# Node.js tabanlı bir imajla başlıyoruz
FROM node:18 as build

# Çalışma dizinini oluşturuyoruz
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyalıyoruz
COPY package*.json ./

# Bağımlılıkları kuruyoruz
RUN npm install

# Uygulama dosyalarını kopyalıyoruz
COPY . .

# Uygulamayı derliyoruz
RUN npm run build

# start
EXPOSE 3000
CMD ["npm", "start"]
