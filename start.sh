docker run -d \
  --name portfolio-db \
  -e POSTGRES_USER=testusername \
  -e POSTGRES_PASSWORD=testpass \
  -e POSTGRES_DB=portfolio_db \
  -p 5432:5432 \
  postgres ;

cd srcs && npm i && export DATABASE_URL=postgresql://testusername:testpass@localhost:5432/portfolio_db && \
    npx prisma generate && npx prisma migrate deploy && \
    export PORT=80 && \
    export HOSTNAME=0.0.0.0 && sudo npm run build && \
    npm run start