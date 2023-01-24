# Base image
FROM node:18

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]