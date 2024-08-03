# Use the official image as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file from your host to your current location
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the service account file from your host to your image filesystem
COPY path/to/your/service-account-file.json /app/service-account-file.json

# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Inform Docker that the container is listening on the specified port at runtime
EXPOSE 3000

# Set environment variable for Google credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account-file.json

# Run the Flask app
CMD ["python", "app.py"]
