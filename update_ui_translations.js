const fs = require('fs');

// 1. Update src/types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf8');
if (!typesContent.includes('ui: any;')) {
    typesContent = typesContent.replace('achievements: {', 'ui: any;\n  achievements: {');
    fs.writeFileSync('src/types.ts', typesContent);
}

// 2. Extract UI_TRANSLATIONS from Portfolio.tsx
let portfolioContent = fs.readFileSync('src/components/Portfolio.tsx', 'utf8');
const uiTransStart = portfolioContent.indexOf('const UI_TRANSLATIONS = {');
const uiTransEnd = portfolioContent.indexOf('};', uiTransStart) + 2;

const uiTranslationsString = portfolioContent.substring(uiTransStart, uiTransEnd);

// Remove it from Portfolio.tsx
portfolioContent = portfolioContent.slice(0, uiTransStart) + portfolioContent.slice(uiTransEnd);

// Replace UI_TRANSLATIONS[language] with (content[language].ui)
// Or better: we define `const ui = content[language].ui;` inside the render, but we can also just replace `UI_TRANSLATIONS[language]` with `content[language].ui`.
portfolioContent = portfolioContent.replace(/UI_TRANSLATIONS\[language\]/g, 'content[language].ui');

fs.writeFileSync('src/components/Portfolio.tsx', portfolioContent);

// 3. Add to portfolioData.ts
// We need to parse the UI_TRANSLATIONS string to get the JS object.
// A safe way is to evaluate it:
const uiObjectCode = uiTranslationsString.replace('const UI_TRANSLATIONS = ', '');
const uiTranslations = eval('(' + uiObjectCode + ')');

let dataContent = fs.readFileSync('src/data/portfolioData.ts', 'utf8');

// Insert ui into en and zh
// We'll find 'en: {' and insert 'ui: { ... },'
const enUiString = "ui: " + JSON.stringify(uiTranslations.en, null, 6) + ",\n    ";
dataContent = dataContent.replace('en: {', 'en: {\n    ' + enUiString);

const zhUiString = "ui: " + JSON.stringify(uiTranslations.zh, null, 6) + ",\n    ";
dataContent = dataContent.replace('zh: {', 'zh: {\n    ' + zhUiString);

fs.writeFileSync('src/data/portfolioData.ts', dataContent);
console.log('Success');
