# Note: CLI args used for connecting containers
# docker run -d -p 5432:5432 --name postgres-db -e POSTGRES_PASSWORD=password --network=bridge postgres:12
# docker run -d -p 3001:3001 --network=bridge --name steam_reviews steam_reviews

FROM node:12
WORKDIR /usr/src/app

# Environment variables to pass to node server
ENV PORT=3001
ENV NODE_ENV=development
ENV PGDB_URI=postgresql://postgres:postgres@reviews_db:5432/steam_reviews

COPY package*.json ./
RUN npm install
# RUN npm ci --only=production
COPY . .
EXPOSE 3001
RUN npm run build
CMD npm start
