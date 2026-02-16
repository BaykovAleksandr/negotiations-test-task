#!/bin/sh

mkdir -p allure-results

echo "Run environment=$RUN_ENV" > allure-results/environment.properties
echo "Test suite=$TEST_SUITE" >> allure-results/environment.properties
echo "Browser=$BROWSER" >> allure-results/environment.properties
echo "Container=$HOSTNAME" >> allure-results/environment.properties
