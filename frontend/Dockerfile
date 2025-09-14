FROM node:20-alpine AS build

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY --from=build /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
