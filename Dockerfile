FROM nginx

# Install only what is needed
RUN apt-get update && apt-get install -y --no-install-recommends curl \  
      && rm -rf /var/lib/apt/lists/*

# Remove default nginx
RUN rm /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

COPY dist /dist
COPY nginx/config /etc/nginx/conf.d
COPY dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

# Convenicne just in case we want to add more configuration later
COPY docker-entrypoint.sh /  
RUN chmod +x /docker-entrypoint.sh  
ENTRYPOINT ["/docker-entrypoint.sh"]

# Daemon Off otherwise, Docker will drop when the main process is done making child ones
CMD ["nginx", "-g", "daemon off;"]  

