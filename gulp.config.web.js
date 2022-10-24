const baseName = '';

module.exports = {
    app: { name: baseName },
    css: {
        sourcePaths: [
            `./src/scss/${baseName}/**/*.scss`
        ],
        exportPath: `./dist/${baseName}/assets/css/`
    },
    media: {
        sourcePaths: [
            `./src/img/${baseName}/**/*.{jpg,png,svg,json}`
        ],
        exportPath: `./dist/${baseName}/assets/img/`
    },
    js: {
        sourcePaths: [
            `./src/js/${baseName}/**/*.js`
        ],
        exportPath: `./dist/${baseName}/assets/js/`
    },
};