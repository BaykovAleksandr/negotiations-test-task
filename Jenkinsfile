pipeline {
  agent any

  stages {
    stage('Run tests') {
      steps {
        sh 'docker compose up --build --abort-on-container-exit'
      }
    }
  }

  post {
    always {
      sh 'ls -la'
      sh 'ls -la allure-report || true'
      archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
      sh 'docker compose down -v || true'
    }
  }
}
