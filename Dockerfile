# Use the official Debian image
FROM debian:bullseye

# Install required packages including Node.js and Google Chrome
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
    xdg-utils && \
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

# Set the working directory
WORKDIR /usr/src/app

# Install n, which will allow us to manage Node versions
RUN npm install -g n

# Upgrade to Node.js v22 using 'n'
RUN n 22

# Install yarn globally
RUN npm install --global yarn



# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm uninstall puppeteer

RUN npm install puppeteer@18

# Copy the rest of the application code
COPY . .

# Expose the port your server listens on (adjust as needed)
EXPOSE 8080

EXPOSE 80

# Command to run your server
CMD ["node", "index.js"]