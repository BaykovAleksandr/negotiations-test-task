
## Test Assignment: the-negotiation-experts

### 🎯 Target Page

Automated UI tests for the **Facilitators** page in **Settings** section.

Tech stack:
- Playwright / TypeScript
- Allure Report

---

### ⚙️ Installation
```
npm install
```

▶️ Run Tests
```
npm run test:allure
```


Script:

```
"test:allure": "npx playwright test --reporter=line,allure-playwright"
```

📊 Generate Allure Report
```
npm run allure:generate
```

Script:

```
"allure:generate": "allure generate ./allure-results --clean"

```
🌐 Open Allure Report

```
npm run allure:open
```

Script:

```
"allure:open": "allure open"
```

## 🐳 Run Tests in Docker (optional)

You can run the tests inside a Docker container without installing Node.js, Playwright, or Allure locally.

▶️ Build and run tests in Docker:

```
docker compose up --build
```

This will:
- Run Playwright tests  
- Generate Allure results  
- Generate Allure HTML report  

📂 After execution, reports will be available locally:
./allure-results
./allure-report

<img width="1920" height="980" alt="docker" src="https://github.com/user-attachments/assets/a0aa2a3f-83d7-45f0-877b-436b242d0644" />
<img width="1920" height="989" alt="allure3" src="https://github.com/user-attachments/assets/9207eef8-44dc-4ac2-a0b0-ec9f94ea21a9" />
<img width="1920" height="984" alt="allure2" src="https://github.com/user-attachments/assets/55342b36-e648-440b-babf-2ec0047513a0" />
