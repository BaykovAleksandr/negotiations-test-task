pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Run tests in Docker') {
      steps {
        sh '''
          docker compose up --build --abort-on-container-exit
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
    }
  }
}
