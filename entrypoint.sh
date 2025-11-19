#!/bin/sh

export CHOKIDAR_USEPOLLING=true
echo "CHOKIDAR_USEPOLLING ativado para hot-reload."

echo "Aplicando migrações do Prisma (migrate deploy)..."
npx prisma migrate dev --name init

npx prisma db seed

echo "Gerando Prisma Client..."
npx prisma generate

echo "Iniciando aplicação NestJS com hot-reload..."
exec npm run start:dev