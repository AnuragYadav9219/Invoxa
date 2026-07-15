# ==========================
# BUILD STAGE
# ==========================
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# ==========================
# RUNTIME STAGE
# ==========================
FROM mcr.microsoft.com/playwright/java:v1.44.0-jammy

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]