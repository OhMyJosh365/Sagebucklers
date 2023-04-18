const diceClasses = require(`../programs/diceClasses`);

class MateObject{
    
    name = "Apper";
    profiecences = ["Basic"];
    targeting = "Alphabetical";
    equippedDice = new diceClasses.DiceObject();

};

module.exports = {MateObject};