pipeline { 
    agent any

    triggers { pollSCM('H/2 * * * *') }

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    parameters {
        booleanParam(name: 'CLEAN_VOLUMES', defaultValue: true, description: 'Remove volumes (clears database)')
        string(name: 'API_HOST', defaultValue: 'http://192.168.56.1:3001', description: 'API host URL for frontend to connect to.')
    }

    stages {

        stage('Checkout') {
            steps {
                script {
                    echo "Checking out code..."
                    checkout scm
                    GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    echo "Build: ${env.BUILD_NUMBER}, Commit: ${GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Validate') {
            steps { sh 'docker compose config' }
        }

        stage('Prepare Environment') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASS'),
                        string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASS')
                    ]) {
                        sh """#!/bin/bash
                        cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
MYSQL_DATABASE=booklease
MYSQL_USER=booklease_user
MYSQL_PASSWORD=${MYSQL_PASS}
MYSQL_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3001
DB_PORT=3306
FRONTEND_PORT=3000
NODE_ENV=production
API_HOST=${params.API_HOST}
EOF
                        """
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def downCommand = params.CLEAN_VOLUMES ? 'docker compose down -v' : 'docker compose down'
                    sh downCommand
                    sh 'docker compose build --no-cache && docker compose up -d'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "Waiting for services to start..."
                    sh 'sleep 15'
                    sh """
                        timeout 60 bash -c 'until curl -f ${params.API_HOST}/api/health; do sleep 2; done' || exit 1
                        curl -f ${params.API_HOST}/api/books || exit 1
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh """
                        docker compose ps
                        docker compose logs --tail=20
                        echo "Frontend: http://localhost:3000"
                        echo "API: ${params.API_HOST}"
                        echo "phpMyAdmin: http://localhost:8888"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
        }
        failure {
            echo "❌ Deployment failed! Logs:"
            sh 'docker compose logs --tail=50 || true'
        }
    }
}
