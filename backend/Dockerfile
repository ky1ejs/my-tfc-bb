
# Using node:20 because it has bash, alpine doesn't
FROM node:20 AS builder

WORKDIR /app
COPY package*.json .
COPY prisma ./prisma
RUN npm install
COPY . .
RUN ./scripts/install_buf.sh
RUN npm run build

###########################################

FROM node:20-alpine3.18 as deps

ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN npm install --prod

###########################################

FROM node:20-alpine3.18

ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

ENV PORT 3000
EXPOSE 3000
LABEL fly_launch_runtime="nodejs"

CMD ["npm", "run", "migrate:start"]
