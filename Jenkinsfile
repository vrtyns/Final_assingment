pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = 'booklease'
    }
    
    stages {
        stage('Cleanup') {
            steps {
                echo 'Stopping old containers...'
                sh '''
                    docker compose down -v || true
                    docker system prune -f || true
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from Git...'
                checkout scm
            }
        }
        
        stage('Verify Files') {
            steps {
                echo 'Checking required files...'
                sh '''
                    ls -la
                    echo "Checking init.sql..."
                    if [ ! -f "init.sql" ]; then
                        echo "ERROR: init.sql not found!"
                        exit 1
                    fi
                    echo "Checking Dockerfiles..."
                    ls -la api/Dockerfile
                    ls -la frontend/Dockerfile
                '''
            }
        }
        
        stage('Build Images') {
            steps {
                echo 'Building Docker images...'
                sh '''
                    docker compose build --no-cache mysql
                    docker compose build --no-cache api
                    docker compose build --no-cache frontend
                '''
            }
        }
        
        stage('Start Services') {
            steps {
                echo 'Starting services...'
                sh '''
                    docker compose up -d mysql
                    echo "Waiting for MySQL to be ready..."
                    sleep 30
                    
                    docker compose up -d api
                    echo "Waiting for API to be ready..."
                    sleep 20
                    
                    docker compose up -d frontend
                    echo "Waiting for Frontend to be ready..."
                    sleep 15
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Checking service health...'
                script {
                    // Check MySQL
                    sh '''
                        echo "Checking MySQL..."
                        docker exec booklease_mysql mysqladmin ping -h localhost -u root -proot123 || exit 1
                        echo "MySQL is healthy!"
                    '''
                    
                    // Check API
                    sh '''
                        echo "Checking API..."
                        max_attempts=15
                        attempt=1
                        while [ $attempt -le $max_attempts ]; do
                            if curl -f http://localhost:3001/api/health; then
                                echo "API is healthy!"
                                exit 0
                            fi
                            echo "Attempt $attempt/$max_attempts failed. Retrying in 5s..."
                            sleep 5
                            attempt=$((attempt+1))
                        done
                        
                        echo "API health check failed after $max_attempts attempts!"
                        docker compose logs api
                        exit 1
                    '''
                    
                    // Check Frontend
                    sh '''
                        echo "Checking Frontend..."
                        if curl -f http://localhost:3000; then
                            echo "Frontend is healthy!"
                        else
                            echo "Frontend health check failed!"
                            docker compose logs frontend
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Verify Database') {
            steps {
                echo 'Verifying database setup...'
                sh '''
                    docker exec booklease_mysql mysql -u bookleaseuser -pbookleasepass booklease -e "SHOW TABLES;" || exit 1
                    docker exec booklease_mysql mysql -u bookleaseuser -pbookleasepass booklease -e "SELECT COUNT(*) FROM books;" || exit 1
                    echo "Database verification passed!"
                '''
            }
        }
    }
    
    post {
        success {
            echo '========================================='
            echo 'Pipeline completed successfully! 🎉'
            echo '========================================='
            echo 'Application is running at:'
            echo '  - Frontend: http://localhost:3000'
            echo '  - API: http://localhost:3001/api'
            echo '  - MySQL: localhost:3306'
            echo '========================================='
            sh 'docker compose ps'
        }
        failure {
            echo '========================================='
            echo 'Pipeline failed! 😞'
            echo '========================================='
            echo 'Container logs:'
            sh 'docker compose logs --tail=50'
            echo '========================================='
            sh 'docker compose down -v'
        }
        always {
            echo 'Cleaning up...'
        }
    }
}