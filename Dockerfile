# Set the base image to mongo
FROM    node:6.2.0

# File Author / Maintainer
MAINTAINER V.V. Aksenchyk <aksenchyk.v@gmail.com>

# Define working directory
WORKDIR /app

# Install curl, git, nodejs and npm
RUN apt-get update && apt-get install -y \
    git \
    curl
RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get update && apt-get install -y nodejs

# Clone loc200-gate from Github (the rest api)
RUN git clone https://github.com/byavv/200Loc-gate.git

# Navigate to the loc200-gate folder
WORKDIR 200Loc-gate

# Install NPM dependencies
RUN npm install

# Expose port 3000 for loc200-gate 
EXPOSE  3001

# Set environment 
ENV NODE_ENV production

# Start the application in nodejs
CMD npm start