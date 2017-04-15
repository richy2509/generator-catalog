let Generator = require("../index");

var generator = new Generator();

//Build option
generator.build(
    [
        {
            code: "entity",
            type: "string",
            option: ["-e", "--entity"],
            description: "Entities to construct java / js / ftl / less files",
            required: true
        },
        {
            code: "from",
            type: "folder",
            option: ["-f", "--from"],
            description: "Template folder",
            required: true,
            validate: true
        },
        {
            code: "output",
            type: "file",
            option: ["-o", "--output"],
            description: "output folder",
            required: true
        }
    ]
);

//Valid model
generator.validate();

//Get command
generator.launchAction("entity", generator.replaceInFile);