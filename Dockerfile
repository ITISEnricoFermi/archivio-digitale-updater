FROM node:10.15.2-jessie
ENV NODE_ENV=production

#Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

RUN mkdir -p /tmp/download && \
 curl -L https://get.docker.com/builds/Linux/x86_64/docker-1.13.1.tgz | tar -xz -C /tmp/download && \
 rm -rf /tmp/download/docker/dockerd && \
 mv /tmp/download/docker/docker* /usr/local/bin/ && \
 rm -rf /tmp/download && \
 groupadd -g 999 docker

WORKDIR /tmp
COPY package.json /tmp/package.json
RUN npm install && mkdir -p /app/node_modules && cp -a ./node_modules /app/

WORKDIR /app
COPY ./ ./
EXPOSE 3050
CMD [ "node", "." ]