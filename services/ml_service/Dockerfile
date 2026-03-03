FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install ML dependencies
RUN pip install --no-cache-dir scikit-learn pandas numpy matplotlib tensorflow

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "ml_service.wsgi:application"]
