# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=abin
ENV POSTGRES_PASSWORD=Abin@123
ENV POSTGRES_DB=tweet

# Expose the PostgreSQL port
EXPOSE 5432
