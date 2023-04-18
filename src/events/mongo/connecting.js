const chalk = require("chalk");

module.exports = {
    name: "connecting",
    execute() {
        console.log(chalk.green("[Database Status]: Connecting..."));
    }
}