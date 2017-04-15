#!/usr/bin/env node
'use strict';

const util = require('util');
const fs = require('fs');
const asciiArt = require('ascii-art');
const Mustache = require('mustache');

let ArgumentParser = require('./node_modules/argparse').ArgumentParser;

var generator = function () {

    let parser = new ArgumentParser({
        version: '0.0.1',
        addHelp: true,
        description: 'Generator-catalog'
    });
    let data = {};

    var self = this;

    self.printHelloMsg = function (callback) {
        asciiArt.font('Generator', 'Doom', 'red', function (rendered) {
            console.log("--------------------------------------------------------");
            console.log(rendered);
            console.log("--------------------------------------------------------");
            callback();
        });
    };

    self.build = function (args) {

        args.forEach(function (a) {
            parser.addArgument(
                a.option,
                {
                    help: a.description,
                    required: a.required
                }
            );
        });

        const parsedValues = parser.parseArgs();

        data = args.map((a) => {
            a.data = {};
            a.data.value = parsedValues[a.code];
            return a;
        });

    };

    self.validate = function () {

        data
            .filter((d) => {
                return d.validate;
            })
            .map((d) => {
                if ((d.type === "folder" || d.type === "file") && !fs.existsSync(d.data.value.toString())) {
                    throw new Error(`Invalid ${d.type} for ${d.data.value}`);
                }

            });

    };

    self.get = function (name, args) {
        return args[name];
    };

    self.launchAction = function (name, callback) {
        data.filter((d) => {
            return d.code === name;
        }).map((d) => {
            callback(
                data.filter((f) => {
                    return f.code === "from"
                }).map((f) => {
                    return f.data.value;
                }).toString(),
                d.data,
                data.filter((f) => {
                    return f.code === "output"
                }).map((f) => {
                    return f.data.value;
                }).toString()
            )
            ;
        })

    };

    self.replaceInFile = function (path, view, output) {
        log(`path : ${path}`);
        log(`view: ${util.inspect(view)}`);
        log(`output: ${output}`);
        var iter = [];
        if (!fs.lstatSync(path).isDirectory()) {
            iter.push(path);
        } else {
            iter = fs.readdirSync(path).map((d)=>{
                return `${path}/${d}`;
            });
        }
        iter.forEach(function (path) {
            fs.readFile(path, function (err, data) {
                if (err) throw err;
                let filepath = `${output}${new Date().getTime()}`;
                fs.writeFile(filepath, Mustache.render(data.toString(), view), (err) => {
                    if (err) throw err;
                    log(`File saved ${filepath}`)
                });
            })
        });
    };

    self.test = function () {
        log("test");
    }
};

function log(msg) {
    console.log(`${new Date()} [generator-catalog] ${util.inspect(msg)}`);
}

module.exports = generator;
