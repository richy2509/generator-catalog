var exports = module.exports = {};

const strictNbArgs = 3;

exports.printMsg = function () {
    console.log("This is a message from the demo package");
};

exports.build = function (args, data) {

    clean(args);

    if (args === undefined || args.length !== strictNbArgs) {
        logInvalidArgs(args);
        return;
    }

    log("Configuration accepted");


};

var clean = function(args){
    args.filter(function(a){
        return a !== "node" && a !== "*.js"
    })
}

logUndefined = function (entity) {
    console.log(entity, " is undefined")
};

logInvalidArgs = function (args) {
    console.error("[IllegalArgsException] Expected", strictNbArgs, "instead of", args.length, "\nargs", args);
};

log = function (entity) {
    console.log(entity)
};