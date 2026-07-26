#!/usr/bin/env bash
set -e

echo "Running manual Flyway migrations..."

cd backend
./mvnw flyway:migrate -Dflyway.url=jdbc:postgresql://localhost:5432/banking \
                      -Dflyway.user=postgres \
                      -Dflyway.password=postgrespassword

echo "Database migrations applied successfully!"
