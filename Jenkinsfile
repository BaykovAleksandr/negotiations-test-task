pipeline {
  agent any

stage('Run tests') {
  steps {
    sh 'mkdir -p allure-report allure-results'
    sh 'docker compose up --build --abort-on-container-exit'
  }
}

post {
  always {
    archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
    sh 'docker compose down -v'
  }
}
}
