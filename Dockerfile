# 1. Use the official Node.js image as a base
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy the package.json and package-lock.json files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the correct application port
EXPOSE ${PORT}

# 7. Set environment variables (optional)
ENV NODE_ENV=development

# 8. Define the default command to run your app
CMD ["npm", "start"]