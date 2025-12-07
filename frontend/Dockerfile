# 1️⃣ Build etapa
FROM node:20-alpine AS builder
WORKDIR /app

# Skopíruj package.json a package-lock.json a nainštaluj závislosti
COPY package*.json ./
RUN npm install

# Skopíruj všetko ostatné
COPY . .

# Vytvor build
RUN npm run build

# 2️⃣ Run etapa
FROM node:20-alpine AS runner
WORKDIR /app

# Skopíruj build z buildera
COPY --from=builder /app ./

EXPOSE 3000

# Štart frontend servera
CMD ["npm", "start"]
