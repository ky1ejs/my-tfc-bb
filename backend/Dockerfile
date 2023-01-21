FROM node:18
WORKDIR /usr/src/
COPY . .
RUN ./scripts/install_buf.sh
RUN npm install
RUN npm run proto:gen
EXPOSE 3000

CMD [ "npm", "start" ]
