FROM mcr.microsoft.com/playwright:focal
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY server.js server.js
EXPOSE 4000
CMD ["node", "server.js"]
