---
author: Lektion 8
date: MMMM dd, YYYY
paging: "%d / %d"
---

# Lektion 8

Hej och välkommen!

## Dagens agenda

1. Frågor och repetition
2. Introduktion testning
3. Gruppövning i testning
4. Fortsättning testning
5. Projektbygge med API & fetch
6. Quiz frågor
7. Övning med handledning

---

# Introduktion till testning

- Vad är testning?
- Filstruktur och ett exempel
- Begrepp och termer
- Introduktion till unit testing
- Mocking
- Introduktion till integration testing
- Test-driven utveckling med ett exempel

---

# Vad är testning?

- Skriv kod för att testa annan kod
- Hitta fel och buggar
- Säkerställ krav och specifikationer
- Automatiserar processen
- Typer av tester: unit, integration, performance, user m.m
- Ramverk:
  - C# - XUnit
  - Java - JUnit
  - JavaScript - Jest, Jasmine

---

# Varför testning?

- Manuell testning tar lång tid
- Manuell testning utsätts för misstag
  - Vi missar saker
  - Vi glömmer saker
- Kodtester är automatiserade
- Kodtester är specifika
- Kod blir ofta flexibel på grund av testning

---

# Pitfalls & blindspots

- Testning varken hittar eller löser alla buggar
- Testning är också del av utveckling - det tar tid
- Tester måste planeras
- Tester måste utvecklas
- Tester måste underhållas
- Tester måste dokumenteras

---

# Filstruktur och exempel

- src
  - models/
    - product.js
    - category.js
  - main.js
  - home.js
- tests
  - models/
    - product.js
    - category.js
  - main.js
  - home.js

```javascript
function add(a, b) {
  return a + b;
}

describe("add", () => {
  it("should return correct result for positive numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

---

# Begrepp och termer

## Test

En funktion som testar en specifik del kod, ofta en funktion eller klass.

Tester består ofta av "assertions" - funktioner som testar krav och förväntningar.

---

# Begrepp och termer

## Unit / Enhet

En testbar del kod, ofta en liten funktion och ibland en liten klass.

Det finns ingen definition på "unit" förutom: ju mindre och färre ansvar och beroenden en del kod är och har, ju mer av en enhet är den delen kod.

---

# Begrepp och termer

## Assertion

En funktion som säkerställer krav och förväntningar. Exempel:

- expectEquals
- expectNotNull
- expectTrue
- expectContains
- expectThrows

---

# Begrepp och termer

## Red

Ett test som inte har passerat. Det saknas krav eller så innehåller koden buggar.

Efter röda tester går man oftast tillbaka till koden och fixar den. Sedan testas koden igen.

## Green

Ett test som har passerat. Kraven är specificerade, koden innehåller inga buggar.

Efter gröna tester går man oftast tillbaka till koden och gör en "refactor".

---

# Begrepp och termer

## Refactor

(i test sammanhang)

En process av att gå tillbaka till sin kod och justera den för ytterligare prestanda och clean code.

Det är alltid nödvändigt att köra testet igen efter en refactor.

---

# Begrepp och termer

## Lifeycles

Funktioner som körs innan, under, mellan och efter tester. Exempel:

- runBeforeAllTests
- runBeforeEachTest
- runBetweenEachTest
- runAfterEachTest
- runAfterAllTests

---

# Begrepp och termer

## Given / When / Then (GWT)

Ett sätt att strukturera, organisera och installera tester.

- Given - Skapa alla nödvändiga variabler och hämta in data för testet
- When - Anropa de funktioner och klasser som skall testas (oftast bara en funktion)
- Then - Skriv assertions för att säkerställa krav och hitta buggar

## Arrange, Act, Assert (AAA)

Ett annat namn för Given, When, Then.

- Arrange = Given
- Act = When
- Assert = Then

---

# Begrepp och termer

## Mocking

En teknik som involverar "faking" av objekt som agerar som fungerande objekt men man innehålla testfunktionalitet och testdata. Används i unit tester.

Detta är användbart när en enhet har ett eller fler beroenden, som services med koppling till repositories exempelvis.

---

# Vad är unit testing?

- Testar mindre och individuella delar kod
- Hittar buggar tidigt
- Verifierar att komponenter fungerar i isolation
- Kan förbättra design och struktur av kod
- Kan enkelt säkerställa krav och specifikationer

---

# Enheter och beroenden

- Enheter ska ha så få beroenden som möjligt
- Om det finns beroenden måste de kunna kontrolleras
- Kontrollera beroenden genom mocking
- Exempel på beroenden:
  - Service - Repository
  - Repository - Databas
  - Funktioner som refererar till globala variabler

---

# Vad är integration testing?

- Testar större delar kod
- Testar hela system och integration mellan enheter
- Realistisk och fullständig testning
- Effektiv testning
- Strategier: top-down, bottom-up, hybrid, big-bang

---

# Test-driven utveckling

- Skriv tester innan programkod
- Designa kod utifrån tester och tester utifrån krav
- Planera test -> skriv test -> kör test -> implementera kod -> kör test -> refactor -> repetera

---

# Gruppövning

Använd koden från vår eshop som vi har byggt tillsammans. Lista upp alla delar kod kan och bör testas:

- Blanda gärna unit- och integrationtesting
- Motivera varför de bör testas
- Motivera hur de kan testas
- Skriv ned krav för varje test

---

# Jest och jsdom

1. Installera NodeJS och NPM (NPM kommer med NodeJS)
2. Skapa en mapp och kör `npm init` innanför den
3. `npm install --save-dev jest jsdom babel-jest @babel/core @babel/preset-env jest-fixed-jsdom jest-environment-jsdom`
4. `npm init jest@latest`
   - Välj `jsdom` istället för `node` när den frågor om test environment
   - Välj `babel` när den frågar om code coverage
   - Välj default på allt annat
5. Gå in i `jest.config.js` och byt `testEnvironment` till `jest-fixed-jsdom`
6. Skapa `babel.config.js` och kopiera in följande:

```js
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
```

7. Börja skriva tester med `<>.test.js` filer
8. Kör tester med `npm run test`

---

# Quiz frågor

- Vad innebär testning?
- Vad är ett unit test?
- Beskriv vad en enhet är inom unit testing
- Vad integration testing?
- Vad är Jest?
- Vad använder vi jsdom till?
- Vad är en assertion?
- Vad står NPM för och vad används det till?
