# Use the official Debian image
FROM debian:bullseye

# Set the working directory in the container for Azure
WORKDIR /home/site/wwwroot

# Install required packages including Node.js, Google Chrome, Xvfb, and x11vnc
RUN apt-get update && \
    apt-get install -y \
    wget \
    curl \
    gnupg2 \
    unzip \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libvulkan1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    xvfb \
    libx11-xcb1 \
    libxss1 \
    libappindicator3-1 \
    libnss3-dev \
    libatk1.0-0 \
    libnspr4-dev \
    libdrm2 \
    libgbm1 \
    x11vnc && \
    rm -rf /var/lib/apt/lists/* && \
    # Install Node.js (version 16.x)
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    # Install Google Chrome
    wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y /tmp/google-chrome.deb && \
    rm /tmp/google-chrome.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the path for Chrome
ENV CHROME_PATH=/usr/bin/google-chrome

# Verify Chrome installation and version (for debugging)
RUN google-chrome --version

# Install n, which will allow us to manage Node versions
RUN npm install -g n

# Upgrade to Node.js v22 using 'n'
RUN n 22

# Install yarn globally
RUN npm install --global yarn

# Install Puppeteer
RUN npm install puppeteer

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable for Xvfb to use a display
ENV DISPLAY=:99

# Expose the necessary ports
EXPOSE 8080
EXPOSE 80
EXPOSE 5900  

# Command to start Xvfb, X11VNC, and run the app
CMD Xvfb :99 -screen 0 1280x1024x24 & \
    x11vnc -display :99 -forever -nopw -rfbport 5900 & \
    node index.js
