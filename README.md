
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
