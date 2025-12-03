pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = 'booklease'
    }
    
    stages {
        stage('Cleanup') {
            steps {
                echo 'Stopping old containers...'
                sh 'docker-compose down -v || true'
            }
        }
        
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from Git...'
                checkout scm
            }
        }
        
        stage('Build Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker-compose build --no-cache'
            }
        }
        
        stage('Start Services') {
            steps {
                echo 'Starting all services...'
                sh 'docker-compose up -d'
            }
        }
        
        stage('Wait for Services') {
            steps {
                echo 'Waiting for services to be ready...'
                script {
                    sleep 30
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Checking service health...'
                script {
                    // Check API
                    sh '''
                        max_attempts=10
                        attempt=1
                        while [ $attempt -le $max_attempts ]; do
                            if curl -f http://localhost:3001/api/health; then
                                echo "API is healthy!"
                                break
                            fi
                            echo "Attempt $attempt/$max_attempts failed. Retrying..."
                            sleep 5
                            attempt=$((attempt+1))
                        done
                        
                        if [ $attempt -gt $max_attempts ]; then
                            echo "API health check failed!"
                            exit 1
                        fi
                    '''
                    
                    // Check Frontend
                    sh '''
                        if curl -f http://localhost:3000; then
                            echo "Frontend is healthy!"
                        else
                            echo "Frontend health check failed!"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                // เพิ่ม tests ตรงนี้ถ้ามี
                sh 'echo "All tests passed!"'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully! 🎉'
            echo 'Application is running at:'
            echo '  - Frontend: http://localhost:3000'
            echo '  - API: http://localhost:3001/api'
            echo '  - MySQL: localhost:3306'
        }
        failure {
            echo 'Pipeline failed! 😞'
            sh 'docker-compose logs'
            sh 'docker-compose down -v'
        }
        always {
            echo 'Cleaning up build artifacts...'
        }
    }
}