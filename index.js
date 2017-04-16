#!/usr/bin/env node
'use strict';

const util = require('util');
const fs = require('fs');
const asciiArt = require('ascii-art');
const Mustache = require('mustache');
const Path = require('path');
let ParserService = require('./src/parser_service');
let ConfigValidator = require('./src/validator/config_validator');

let parser = new ParserService();
let configValidator = new ConfigValidator();

let generator = function () {

    let data = [];
    let self = this;

    self.printHelloMsg = function (callback) {
        asciiArt.font('Generator', 'Doom', 'red', function (rendered) {
            console.log("--------------------------------------------------------");
            console.log(rendered);
            console.log("--------------------------------------------------------");
        });
        if (callback !== undefined) {
            callback();
        }
    };

    self.build = function (args) {
        log("Builder ...");

        const parsedValues = parser.parse(args);

        args.forEach((a) => {
            let parsedValue = parsedValues[a.code];
            let d = {};
            d.code = a.code;
            d.validate = a.validate ? a.validate : '';
            d.data = {};
            d.data.value = parsedValue !== undefined && parsedValue !== null ? parsedValue : a.value;
            d.generated = a.generated;
            data.push(d);
        });

        fs.writeFileSync("./src/config/config.json", util.inspect(data));

        debug(data   );

    };

    self.validate = function () {
        log("Validate...");
        configValidator.validate(data);
    };

    self.generateDataValues = function(){
        let dataGenerated = {};
        data.map((d) => {
            dataGenerated[d.code] = d.data;
            dataGenerated[d.code].generated = d.generated;
        });
        fs.writeFileSync("./src/config/configGenerated.json", util.inspect(dataGenerated));
        return dataGenerated;
    };

    self.generate = function (from, to, view) {
        log("Validate...");
        debug(`from : ${from} - to: ${to} - view ${view}`);
        let iter = [];
        if (!fs.lstatSync(from.value).isDirectory()) {
            iter.push(from.value);
        } else {
            iter = fs.readdirSync(from.value).map((d) => {
                return `${from.value}/${d}`;
            });
        }
        iter.forEach(function (path) {

            let extension = Path.extname(path).replace(".", "");
            log(to.generated);
            to.generated.filter((g) => {
                return g.extension === extension;
            })
            .slice(0,1)
            .map((g) => {
                fs.readFile(path, function (err, data) {
                    if (err) throw err;
                    let filepath = `${to.value}${g.value}`.replace("$1", view.value);
                    log(filepath);
                    fs.writeFile(filepath, Mustache.render(data.toString(), view), (err) => {
                        if (err) throw err;
                        log(`File saved ${filepath}`)
                    });
                })
            })
        });
    };

};

function log(msg) {
    console.log(`${new Date()} [generator-catalog] ${msg}`);
}

function debug(msg) {
    console.log(`${new Date()} [debug] ${util.inspect(msg)}`);
}

module.exports = generator;
