FROM node:alpine AS development

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

# COPY .env ./

RUN yarn --only=development

COPY . .

RUN yarn build


FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/


RUN yarn --only=production

COPY . .

COPY --from=development /app/dist ./dist

CMD ["yarn", "start:prod"]

# Heroku deploy docker image:
#  0. heroku container:login -> login to Heroku Container Registry 
#  1. heroku container:push web -> build image
#  2. heroku contianer:release web -> deploy image


# FROM node:14.17-alpine As build

# WORKDIR /app

# COPY package.json yarn.lock ./

# RUN yarn --only=development

# COPY . .

# RUN yarn build

# FROM node:14.17-alpine As production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app

# COPY package.json yarn.lock ./

# RUN yarn --only=production

# COPY . .

# COPY --from=development /app/dist ./dist

# # COPY .env.docker /app/.env

# CMD ["yarn", "start:prod"]