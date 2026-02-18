pipeline {
    agent any

    stages {
        stage('Prepare dirs') {
            steps {
                sh 'mkdir -p allure-results allure-report'
            }
        }

        stage('Run tests') {
            steps {
                sh 'docker compose up --build --abort-on-container-exit'
            }
        }
        
        
        stage('Check Allure results') {
            steps {
                sh 'echo "=== Contents of allure-results ==="'
                sh 'ls -la allure-results/ || true'
                sh 'echo "=== Contents of allure-report ==="'
                sh 'ls -la allure-report/ || true'
            }
        }
    }

    post {
        always {
            script {
                
                sh '''
                    if [ -d "allure-results" ] && [ "$(ls -A allure-results)" ]; then
                        echo "Generating Allure report..."
                        allure generate allure-results --clean -o allure-report
                    else
                        echo "allure-results is empty or does not exist"
                    fi
                '''
                
                
                allure includeProperties: false,
                      results: [[path: 'allure-results']]
            }
            
            
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            
            
            sh 'docker compose down -v'
        }
    }
}