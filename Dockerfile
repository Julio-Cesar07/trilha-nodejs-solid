FROM node

WORKDIR /usr/app

COPY package.json ./
COPY run_docker.sh ./

# RUN npm i

COPY . .

EXPOSE 3333

RUN ["chmod", "a+x", "./run_docker.sh"]

ENTRYPOINT ["sh", "./run_docker.sh"]