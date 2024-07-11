# Usa la imagen oficial de Node.js
FROM node:14

# Crea un directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
