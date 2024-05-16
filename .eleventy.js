const cleanCss = require('clean-css');
const uglifyJS = require('uglify-js');
const htmlMin = require('html-minifier');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({'src/_includes/assets': '/assets'});

	eleventyConfig.ignores.add("./src/savedCode.html");

    eleventyConfig.addTransform('minifyHtml', (code, outputPath) => {
        if (outputPath.endsWith('.html')) {
            const minified = htmlMin.minify(code, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true
            });
            return minified;
        }
        return code;
    });
    eleventyConfig.addFilter('minifyCss', code => new cleanCss({}).minify(code).styles);
    eleventyConfig.addFilter('minifyJs', code => {
        let minified = uglifyJS.minify(code);
        if (minified.error) {
            console.log('Uglify ES error: ', minified.error);
            return code;
        }
        return minified.code;
    });
    eleventyConfig.addFilter('removeIndexHtml', url => url.replace(/index.html$/, ''));

    return {
        dir: {
            input: 'src',
            includes: '_includes',
            output: '_site',
            data: '_data'
        },
    };
};
