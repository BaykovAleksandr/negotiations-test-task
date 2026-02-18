#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Jenkins + Allure + Playwright Setup${NC}"
echo -e "${BLUE}========================================${NC}"

# Репозиторий с тестами
REPO_URL="https://github.com/BaykovAleksandr/negotiations-test-task.git"
PROJECT_DIR="negotiations-test-task"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker не установлен! Устанавливаем...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker установлен. Перезапустите терминал или выполните: newgrp docker${NC}"
    exit 1
fi

# Клонирование репозитория
echo -e "${BLUE}➜ Клонирование репозитория с тестами...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${BLUE}➜ Папка уже существует, обновляем...${NC}"
    cd $PROJECT_DIR && git pull && cd ..
else
    git clone $REPO_URL
fi

cd $PROJECT_DIR

# Параметры Jenkins
JENKINS_PORT=8080
JENKINS_CONTAINER="jenkins"
JENKINS_HOME="jenkins_home"

# Остановка и удаление старого контейнера
echo -e "${BLUE}➜ Очистка старых контейнеров...${NC}"
docker stop $JENKINS_CONTAINER 2>/dev/null && docker rm $JENKINS_CONTAINER 2>/dev/null

# Запуск Jenkins в Docker
echo -e "${BLUE}➜ Запуск Jenkins...${NC}"
docker run -d \
  --name $JENKINS_CONTAINER \
  -p ${JENKINS_PORT}:8080 \
  -p 50000:50000 \
  -v ${JENKINS_HOME}:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/workspace \
  --restart unless-stopped \
  jenkins/jenkins:lts

# Ожидание запуска
echo -e "${BLUE}➜ Ожидание запуска Jenkins (30 секунд)...${NC}"
sleep 30

# Получение пароля
echo -e "${GREEN}✅ Jenkins запущен!${NC}"
echo -e "${BLUE}➜ Пароль для первого входа:${NC}"
docker exec $JENKINS_CONTAINER cat /var/jenkins_home/secrets/initialAdminPassword

# Установка плагинов
echo -e "${BLUE}➜ Установка плагина Allure...${NC}"
docker exec $JENKINS_CONTAINER jenkins-plugin-cli --plugins allure-jenkins-plugin:2.32.2

# Перезапуск Jenkins
echo -e "${BLUE}➜ Перезапуск Jenkins...${NC}"
docker restart $JENKINS_CONTAINER
sleep 15

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Jenkins готов к работе!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📝 Инструкция по настройке задачи:${NC}"
echo "1. Откройте браузер: ${GREEN}http://localhost:${JENKINS_PORT}${NC}"
echo "2. Введите пароль (указан выше)"
echo "3. Установите предлагаемые плагины"
echo "4. Создайте администратора"
echo "5. Создайте Pipeline задачу:"
echo "   • New Item → Pipeline → OK"
echo "   • Pipeline → Pipeline script from SCM → Git"
echo "   • Repository URL: ${GREEN}$REPO_URL${NC}"
echo "   • Сохранить"
echo "6. Запустите сборку: ${GREEN}Собрать сейчас${NC}"
echo ""
echo -e "${BLUE}📁 Проект с тестами склонирован в: ${GREEN}$(pwd)${NC}"
echo ""
echo -e "${BLUE}🔧 Полезные команды:${NC}"
echo "  • Логи Jenkins: ${GREEN}docker logs -f $JENKINS_CONTAINER${NC}"
echo "  • Остановка: ${GREEN}docker stop $JENKINS_CONTAINER${NC}"
echo "  • Запуск: ${GREEN}docker start $JENKINS_CONTAINER${NC}"
echo "  • Удаление: ${GREEN}docker rm -f $JENKINS_CONTAINER${NC}"