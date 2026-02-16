
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
<img width="1920" height="984" alt="allure1" src="https://github.com/user-attachments/assets/29d9fd82-9b7f-4a07-88fb-bb8fd7ff04f0" />
<img width="1920" height="989" alt="allure3" src="https://github.com/user-attachments/assets/9207eef8-44dc-4ac2-a0b0-ec9f94ea21a9" />
<img width="1920" height="984" alt="allure2" src="https://github.com/user-attachments/assets/55342b36-e648-440b-babf-2ec0047513a0" />
