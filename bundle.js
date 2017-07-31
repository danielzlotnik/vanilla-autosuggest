const fs = require('fs');
const { join } = require('path');
const { minify } = require("uglify-js");
const cleanCSS = require('clean-css');

const distPath = join(__dirname, 'dist') + '/';
const stylesPath = join(__dirname, 'src', 'assets', 'styles') + '/';
const jsPath = join(__dirname, 'src', 'js') + '/';

const output = 'vanilla-autosuggest';

const readFile = (path) => {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, 'utf8');
    }
    return '';
};

const writeFile = (fileName, extension, content) => {
    const file = distPath + fileName + extension;
    fs.writeFileSync(file, content);
    console.log(file + ' written');
};

const bundleCss = () => {
    const fileName = 'style.css';
    const result = readFile(stylesPath + fileName);
    writeFile(output, '.css', result);
    const { styles } = new cleanCSS({}).minify(result);
    writeFile(output, '.min.css', styles)
};

const bundleJs = () => {
    const fileName = 'script.js';
    const result = readFile(jsPath + fileName);
    writeFile(output, '.js', result);
    writeFile(output, '.min.js', minify(result).code);
};

console.log('bundling JS');
bundleJs();
console.log('bundling CSS');
bundleCss();
process.exit(0);
