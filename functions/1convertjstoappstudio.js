const fs = require('fs');
const path = require('path');
const os = require('os');

function convert(fileNames) {
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
        console.error('Provide one or more filenames. Example: node 1convertjstoappstudio.js createQuery.js');
        return;
    }

    for (const name of fileNames) {
        try {
            const inputPath = path.isAbsolute(name) ? name : path.join(__dirname, name);
            if (!fs.existsSync(inputPath)) {
                console.error(`Not found: ${name}`);
                continue;
            }

            const src = fs.readFileSync(inputPath, 'utf8');
            const usesCRLF = /\r\n/.test(src);
            const EOL = usesCRLF ? '\r\n' : os.EOL;
            const lines = src.split(/\r?\n/);

            // Quote each line and add a trailing comma
            const transformed = lines.map(line => `"${line}",`).join(EOL);

            const parsed = path.parse(inputPath);
            const outPath = path.join(parsed.dir, `converted/${parsed.name}.txt`);
            fs.writeFileSync(outPath, transformed, 'utf8');
            console.log(`Wrote ${path.basename(outPath)} (${lines.length} lines)`);
        } catch (err) {
            console.error(`Failed to process ${name}: ${err.message}`);
        }
    }
}

convert(['groupMessages.js', 'findGroupWithMembers.js']);