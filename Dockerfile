FROM n8nio/n8n:latest

# Switch to root user to install the custom node
USER root

# Create custom nodes directory
RUN mkdir -p /usr/local/lib/node_modules/n8n/.n8n/custom

# Copy the packaged custom node
COPY n8n-bannerbite-1.0.0.tgz /tmp/

# Install the custom node
RUN cd /tmp && \
    npm install n8n-bannerbite-1.0.0.tgz && \
    mkdir -p /usr/local/lib/node_modules/n8n/.n8n/custom/n8n-bannerbite && \
    cp -r /tmp/node_modules/n8n-bannerbite/* /usr/local/lib/node_modules/n8n/.n8n/custom/n8n-bannerbite/ && \
    chown -R node:node /usr/local/lib/node_modules/n8n/.n8n

# Switch back to node user
USER node

# Set the working directory to n8n
WORKDIR /usr/local/lib/node_modules/n8n

# Run n8n
ENTRYPOINT ["/usr/local/bin/n8n"]