FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
COPY --from=frontend-build /app/frontend/dist ./public
EXPOSE ${PORT:-8080}
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
