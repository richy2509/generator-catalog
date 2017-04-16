#!/usr/bin/env node
'use strict';

const fs = require('fs');

let ConfigValidator = function () {

    let self = this;

    self.validate = function (data) {

        data
            .filter((d) => {
                return d.validate;
            })
            .map((d) => {
                if ((d.validate === "folder" || d.validate === "file") && !fs.existsSync(d.data.value.toString())) {
                    throw new Error(`Invalid ${d.validate} for ${d.data.value}`);
                }
            });
    }

};

module.exports = ConfigValidator;