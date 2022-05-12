# stage 1 (Build image)

# pulling base image
FROM node:16 as node
# Setting the remote DIR to /app
WORKDIR /
# COPY the current folder
COPY . .
# run npm i (install all the dependencies)
RUN npm install
# this will generate dist
RUN npm run build --prod
