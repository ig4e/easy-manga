FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package manifest and pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Enable Corepack and install pnpm, then install dependencies
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate && pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Build
RUN pnpm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
