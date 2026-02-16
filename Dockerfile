FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

ENV RUN_ENV=docker

ENV TEST_SUITE=facilitators

ENV BROWSER=chromium

RUN apt-get update && apt-get install -y openjdk-17-jre && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN mkdir -p allure-results

CMD ["pnpm", "run", "test:allure"]
