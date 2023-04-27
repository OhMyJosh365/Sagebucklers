const spellClasses = require("../programs/spellClasses");
const Canvas = require("canvas");

leftShipPartPlacements = [
    [40, 40],
    [15, 90],
    [60, 90],
    [15, 135],
    [60, 135],
    [15, 210],
    [60, 210]
];
rightShipPartPlacements = [
    [200, 40],
    [220, 90],
    [175, 90],
    [220, 135],
    [175, 135],
    [220, 210],
    [175, 210]
];

class CannonObject{
    className = "CannonObject";
    emoji = '🔫';
    hp = 100;
    maxHp = 100;
    iconName = "cannon";
    team = "left";
    mateManning = null;
    active = true;
    positionX = 0;
    positionY = 0;
    sizeX = 15;
    sizeY = 15;
    charge = 0;
    maxCharge = -1;
    chargeRate = 1;
    energizeBonus = 0;
    pixelSpeedBonus = 0;
    weight = 0;
    currentSpell = null;
    

    async onFrame(ctx, objectArray){
        if(this.hp > 0){
            await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
            ctx.beginPath();
            ctx.rect(this.positionX, this.positionY + this.sizeY + 1, this.sizeX, 5);
            ctx.fillStyle = "#000000";
            ctx.fill();
            
            ctx.beginPath();
            ctx.rect(this.positionX, this.positionY + this.sizeY + 1, (this.hp/this.maxHp)*this.sizeX, 5);
            ctx.fillStyle = "#44D62C";
            ctx.fill();

            ctx.beginPath();
            ctx.rect(this.positionX, this.positionY + this.sizeY + 6, (this.charge/this.maxCharge)*this.sizeX, 5);
            ctx.fillStyle = "BLUE";
            ctx.fill();

            if(this.mateManning != null){
                
                if(this.currentSpell == null){
                    if(this.mateManning.equippedDice.possibleRolls.length == 0){
                        this.mateManning.equippedDice.possibleRolls = await this.mateManning.equippedDice.spellFaces.concat(this.mateManning.equippedDice.spellFaces);
                    }

                    let randomIndex = await Math.floor(Math.random() * this.mateManning.equippedDice.possibleRolls.length);
                    this.currentSpell = await this.mateManning.equippedDice.possibleRolls[randomIndex];
                    await this.mateManning.equippedDice.possibleRolls.splice(randomIndex, 1);

                    this.maxCharge = new spellClasses[`${this.currentSpell}Object`]().maxCharge;
                }

                this.charge += this.chargeRate;
                if(this.charge >= this.maxCharge){
                    this.launch(objectArray);
                    this.currentSpell = null;
                }
                
            }
            
        }
        else{
            this.active = false;
        }
        
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}

    async launch(objectArray){
        this.charge = 0;

        var spell = new spellClasses[`${this.currentSpell}Object`](this.team, this.positionX, this.positionY, objectArray);
        if(this.energizeBonus > 0 && spell.school == "Storm" && spell.className != "EnergizeObject"){
            spell.energizeBonus = this.energizeBonus;
        }

        spell.pixelSpeed += this.pixelSpeedBonus;
        this.pixelSpeedBonus = 0;
        
        await objectArray.push(spell);
    }
};

module.exports = {CannonObject, leftShipPartPlacements, rightShipPartPlacements};