# Estágio de Build (React)
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção (Nginx servindo a Build)
FROM nginx:alpine
# Copia os arquivos gerados no build para a pasta padrão do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# ─── COPIA A CONFIGURAÇÃO DO TRY_FILES PARA O FRONTEND ───
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
