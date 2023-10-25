FROM nginx:alpine as nginx

COPY dist /usr/share/nginx/html

