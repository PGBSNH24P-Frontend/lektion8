import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'

// Läser in allt kodinnehåll från index.html till denna variabel, som en sträng
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

// Lagrar DOM objektet som skapas före varje test
let dom;
// Genväg till dom.window.document.body
let body;

// Tar bort alla imports och exports från en sträng med kod
// Denna funktion behöver inte förstås - kopiera den vid behov.
function removeImports(code) {
    if (typeof code !== 'string') {
        throw new TypeError('Input must be a string');
    }

    // Regular expressions for different import patterns
    const importPatterns = [
        // Standard imports
        /^\s*import\s+(?:[^\n;]+?\s+from\s+)?['"][^'"]+['"][;\n]/gm,

        // Named imports
        /^\s*import\s*{[^}]+}\s+from\s+['"][^'"]+['"][;\n]/gm,

        // Default and named imports
        /^\s*import\s+[^,]+,\s*{[^}]+}\s+from\s+['"][^'"]+['"][;\n]/gm,

        // Dynamic imports
        /^\s*import\s*\([^)]+\)[;\n]/gm,

        // Side effect imports
        /^\s*import\s+['"][^'"]+['"][;\n]/gm
    ];

    let cleanedCode = code;

    // Apply each pattern
    importPatterns.forEach(pattern => {
        cleanedCode = cleanedCode.replaceAll(pattern, '');
    });

    cleanedCode = cleanedCode.replaceAll("export ", "")

    return cleanedCode;
}

// Ladda in skript manuellt på grund av problem med Jest och jsdom.
function loadScripts(names) {
    for (let scriptName of names) {
        const scriptContent = fs.readFileSync(path.resolve(__dirname, scriptName), 'utf8');
        const script = dom.window.document.createElement('script');
        // Lägg in kodinnehållet men ta bort alla imports och exports
        // eftersom endast moduler kan ha dem.
        script.textContent = removeImports(scriptContent)
        dom.window.document.body.appendChild(script);
    }
}

// Gruppera tester
describe('index.html', () => {
    // Ladda in HTML för varje test
    beforeEach(async () => {
        dom = new JSDOM(html, {
            // Kör alla skript som finns i HTMLen
            runScripts: 'dangerously',
            resources: "usable",
            pretendToBeVisual: true,
            contentType: "text/html",
        });

        // Vänta på att innehållet i HTML filen har laddat in (alla element)
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });

        // Add any required browser APIs
        global.window = dom.window;
        global.document = dom.window.document;
        global.HTMLElement = dom.window.HTMLElement;

        body = dom.window.document.body;
    });

    // Definiera ett test med 'it'
    it('renders a heading element', () => {
        // Assert något, som att det finns en titel på sidan
        expect(body.querySelector('h1')).not.toBeNull()
    })

    it('renders a div element', () => {
        expect(body.querySelector('div')).not.toBeNull()
        expect(body.querySelector('div').textContent).toBe("Hej")
    })

    it('returns the correct result for positive numbers', () => {
        expect(dom.window.add(5, 6)).toBe(11)
    })

    it('renders two todos', () => {
        // Ladda in skript per test
        // VIKTIGT: ladda in i rätt ordning
        loadScripts([
            "./js/todo.js",
            "./js/main.js"
        ]);

        let divs = body.getElementsByTagName("div");
        expect(divs.length).toBe(3);
        expect(divs[1].textContent).toBe("Städa");
        expect(divs[2].textContent).toBe("Handla");
    })

    it('adds an h2 on todo click', () => {
        loadScripts([
            "./js/todo.js",
            "./js/main.js"
        ]);

        let todo = body.getElementsByTagName("div")[1];
        todo.click();
        expect(todo.querySelector("h2")).not.toBeNull();
        expect(todo.querySelector("h2").textContent).toBe("HEJ!");
    })
});

