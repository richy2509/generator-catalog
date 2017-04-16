let Generator = require("../index");

let generator = new Generator();

//generator.printHelloMsg();

const config = [
        {
            code: "entity",
            option: ["-e", "--entity"],
            description: "Entities to construct java / js / ftl / less files",
            required: true
        },
        {
            code: "from",
            option: ["-f", "--from"],
            description: "Template folder",
            value: "./examples/templates",
            validate: "folder"
        },
        {
            code: "output",
            option: ["-o", "--output"],
            description: "output folder",
            value: "./examples/output",
            generated: [
                {
                    extension: "js",
                    value: "/$1.js"
                }, {
                    extension: "java",
                    value: "/$1.java"
                }, {
                    extension: "less",
                    value: "/$1.less"
                }, {
                    extension: "ts",
                    value: "/$1.ts"
                }
            ]
        }
    ]
;

Promise.resolve(config)
    .then((data) => {
        generator.build(data);
    })
    .then(() => {
        generator.validate();
    })
    .then(() => {
        const data = generator.generateDataValues();
        generator.generate(data.from, data.output, data.entity);
    });