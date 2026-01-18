FROM nginx:alpine

# Copy frontend files to nginx html directory
COPY custom_components/reterminal_dashboard/frontend/ /usr/share/nginx/html/

# Create index.html from editor.html (entry point)
RUN cp /usr/share/nginx/html/editor.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for environment variable injection
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
