FROM node:6.3

# File Author / Maintainer
MAINTAINER Aksenchyk V. <aksenchyk.v@gmail.com>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install pm2
RUN npm install -g pm2 typings

# Copy app source
COPY . /usr/src/app

# Install dependencies and build client
RUN \ 
    npm install \ 
    && typings install \
    && npm run build

# Make server and client available
EXPOSE 3001
EXPOSE 5601

CMD [ "npm", "run", "pm2" ]