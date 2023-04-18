const chalk = require("chalk");

module.exports = {
    name: "error",
    execute(err) {
        console.log(chalk.red(`An error occured with the database connection:\n${err}`));
    }
}