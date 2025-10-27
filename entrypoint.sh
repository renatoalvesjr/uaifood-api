#!/bin/sh

export CHOKIDAR_USEPOLLING=true
echo "CHOKIDAR_USEPOLLING ativado para hot-reload."

# 1. Gera o Prisma Client com base no schema.prisma
echo "Gerando Prisma Client..."
npx prisma generate

# 2. Aplica as migrações pendentes.
echo "Aplicando migrações do Prisma (migrate deploy)..."
npx prisma migrate dev

# 3. Inicia a aplicação NestJS em modo de desenvolvimento (com watch/hot reload)
echo "Iniciando aplicação NestJS com hot-reload..."
exec npm run start:dev