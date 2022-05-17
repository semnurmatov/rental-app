FROM node:14.17-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

RUN yarn prisma generate

CMD ["yarn", "start:prod"]



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