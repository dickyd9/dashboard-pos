FROM node:lts-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm config set legacy-peer-deps true
RUN npm install --prefix ./

COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
EXPOSE 3004
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]