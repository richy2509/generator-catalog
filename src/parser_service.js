#!/usr/bin/env node
'use strict';

let ArgumentParser = require('argparse').ArgumentParser;

let ParserService = function(){

    let self = this;

    let parser = new ArgumentParser({
        version: '0.0.1',
        addHelp: true,
        description: 'Generator-catalog'
    });


    self.parse = function(args){
        args.forEach(function (a) {
            parser.addArgument(
                a.option,
                {
                    help: a.description,
                    required: a.required
                }
            );
        });
        return parser.parseArgs();
    }

};

module.exports = ParserService;