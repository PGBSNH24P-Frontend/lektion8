import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'

// Läser in allt kodinnehåll från index.html till denna variabel, som en sträng
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom;
let body;

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

function loadScripts(names) {
    for (let scriptName of names) {
        const scriptContent = fs.readFileSync(path.resolve(__dirname, scriptName), 'utf8');
        const script = dom.window.document.createElement('script');
        script.textContent = removeImports(scriptContent)
        dom.window.document.body.appendChild(script);
    }
}

describe('index.html', () => {
    beforeEach(async () => {
        dom = new JSDOM(html, {
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

    it('renders a heading element', () => {
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

