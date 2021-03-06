const fs = require('fs');
const Twig = require('twig');

module.exports = (from, to, params = {}) => {
    let templateContent = fs.readFileSync(from);
    let template = Twig.twig({data: templateContent.toString()});
    let newContent = template.render(params);
    fs.writeFileSync(to, newContent);
};