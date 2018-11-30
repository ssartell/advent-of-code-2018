module.exports = function (plop) {
    plop.setGenerator('day', {
        description: 'creates new day',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'name of day (e.g. day01)'
        }],
        actions: [
            {
                type: 'add',
                path: '{{name}}/part1.js',
                templateFile: 'plop-templates/part.hbs'
            },
            {
                type: 'add',
                path: '{{name}}/part2.js',
                templateFile: 'plop-templates/part.hbs'
            },
            {
                type: 'add',
                path: '{{name}}/input.txt',
            },
            {
                type: 'add',
                path: '{{name}}/test.js',
                templateFile: 'plop-templates/test.hbs'
            }
        ]
    });
};