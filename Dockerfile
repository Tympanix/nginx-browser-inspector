FROM nginx:latest
WORKDIR /etc/nginx
COPY browser-inspector.conf conf.d/browser-inspector.conf
