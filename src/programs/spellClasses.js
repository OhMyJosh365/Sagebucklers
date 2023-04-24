const partClasses = require("../programs/partClasses");
const Canvas = require("canvas");

//Basic Magic
class WaitObject{
    className = "WaitObject";
    school = "Basic";
    maxCharge = 3;
    active = false;

    constructor(team, positionX, positionY, tpositionX, tpositionY){}
    onFrame(ctx, objectArray){}
    checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};

class PrepareObject{
    className = "PrepareObject";
    school = "Basic";
    maxCharge = 8;
    active = true;
    positionX = 0;
    positionY = 0;
    team = "left";

    constructor(team, positionX, positionY, tpositionX, tpositionY){
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    async onFrame(ctx, objectArray){

        for(var i = 0; i < objectArray.length; i++){
            if(
                this.team == objectArray[i].team &&
                this.positionX == objectArray[i].positionX &&
                this.positionY == objectArray[i].positionY &&
                objectArray[i].className == "CannonObject"
            ){
                objectArray[i].charge += (this.maxCharge/2);
                i = objectArray.length;
            }
        }
        this.active = false;
    }

    checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};

class RestObject{
    className = "RestObject";
    school = "Basic";
    maxCharge = 8;
    active = true;
    positionX = 0;
    positionY = 0;
    team = "left";

    constructor(team, positionX, positionY, tpositionX, tpositionY){
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    async onFrame(ctx, objectArray){

        for(var i = 0; i < objectArray.length; i++){
            if(
                this.team == objectArray[i].team &&
                this.positionX == objectArray[i].positionX &&
                this.positionY == objectArray[i].positionY &&
                objectArray[i].className == "CannonObject"
            ){
                objectArray[i].hp += (objectArray[i].maxHp*.25);
                if(objectArray[i].maxHp <= objectArray[i].hp) objectArray[i].hp = objectArray[i].maxHp;
                i = objectArray.length;
            }
        }
        this.active = false;
    }

    checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};

class SparkObject{
    className = "SparkObject";
    iconName = "spark";
    school = "Basic";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 5;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team != team){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if(Math.sqrt(Math.pow((positionX - targets[i].positionX), 2) + 
                Math.pow((positionY - targets[i].positionY), 2)) <
                Math.sqrt(Math.pow((positionX - target.positionX), 2) + 
                Math.pow((positionY - target.positionY), 2))){
                    target = targets[i];
            }
        }

        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = target.positionX;
        this.destY = target.positionY;

        this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
        this.offset = -((this.slope * this.positionX) - this.positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    otherObject.hp -= 6;
                }
            }
    }
};

class CounterObject{
    className = "CounterObject";
    iconName = "counter";
    school = "Basic";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    sizeX = 55;
    sizeY = 55;
    activeFrames = 5;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX-20;
        this.positionY = positionY-20;
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        if(this.activeFrames-- <= 0){
            this.active = false;
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.slope && otherObject.team != this.team){
                    otherObject.team = (otherObject.team == "left") ? "right" : "left";
                }
            }
    }
};


//Flame Magic
class FireballObject{
    className = "FireballObject";
    iconName = "fireball";
    school = "Flame";
    team = "left";
    active = true;
    maxCharge = 15;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 8;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team != team){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if(Math.sqrt(Math.pow((positionX - targets[i].positionX), 2) + 
                Math.pow((positionY - targets[i].positionY), 2)) <
                Math.sqrt(Math.pow((positionX - target.positionX), 2) + 
                Math.pow((positionY - target.positionY), 2))){
                    target = targets[i];
            }
        }

        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = target.positionX;
        this.destY = target.positionY;

        this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
        this.offset = -((this.slope * this.positionX) - this.positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    otherObject.hp -= 10;
                }
            }
    }
};

class BurnObject{
    className = "BurnObject";
    iconName = "burn";
    school = "Flame";
    team = "left";
    active = true;
    maxCharge = 25;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 8;
    activeFrames = 20;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        if(this.slope != 0 && this.offset){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            this.activeFrames--;
            if(this.activeFrames <= 0){
                this.active = false;
            }
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.slope = 0;
                    this.offset = 0;
                }
                if(otherObject.slope && this.slope == 0 && otherObject.team == this.team && thisArrayIndex != otherArrayIndex){
                    for(var i = 0; i < objectArray.length; i++){
                        if(
                            this.positionX < objectArray[i].positionX + objectArray[i].sizeX &&
                            this.positionX + this.sizeX > objectArray[i].positionX &&
                            this.positionY < objectArray[i].positionY + objectArray[i].sizeY &&
                            this.positionY + this.sizeY > objectArray[i].positionY &&
                            objectArray[i].className == "CannonObject"
                        ){
                            objectArray[i].hp -= 2;
                        }
                    }
                }
            }
    }
};

class ExplosionObject{
    className = "ExplosionObject";
    iconName = "explosion";
    school = "Flame";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 5;
    sizeY = 5;
    pixelSpeed = 12;
    activeFrames = 3;
    firstFrameFlag = true;
    DmgedCounter = 0;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;
    }

    async onFrame(ctx, objectArray){
        if(this.DmgedCounter > 0) this.DmgedCounter = -1;

        if(this.firstFrameFlag){
            //Get a target to hit both
            var targets = [];
            for(var i = 0; i < objectArray.length; i++){
                if(objectArray[i].hp && objectArray[i].team != this.team){
                    if(objectArray[i].positionX != this.destX && objectArray[i].positionY != this.destY){
                        targets.push(objectArray[i]);
                    }
                }
            }
            if(targets.length != []){
                var target = targets[0];
                for(var i = 1; i < targets.length; i++){

                    if(Math.sqrt(Math.pow((this.destX - targets[i].positionX), 2) + 
                    Math.pow((this.destY - targets[i].positionY), 2)) <
                    Math.sqrt(Math.pow((this.destX - target.positionX), 2) + 
                    Math.pow((this.destY - target.positionY), 2))){
                        target = targets[i];
                    }

                }
                
                //Displace destination
                var tempSlope = (target.positionY - this.destY) / (target.positionX - this.destX);
                var tempOffSet = -((tempSlope * this.destX) - this.destY);

                var distance = Math.sqrt((target.positionX - this.destX) ** 2 + (target.positionY - this.destY) ** 2);
                var angle = Math.atan(tempSlope);
                var newDistance = distance - 25;
                this.destX = target.positionX - newDistance * Math.cos(angle);
                this.destY = target.positionY - newDistance * Math.sin(angle);

                //Calc slope
                this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
                this.offset = -((this.slope * this.positionX) - this.positionY);
            }
            this.firstFrameFlag = false;
        }

        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        if(this.slope != 0 && this.offset != 0){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;

            if(
                (this.team == "left" && this.positionX > this.destX) ||
                (this.team == "right" && this.positionY > this.destY)
            ){
                this.positionX -= 30;
                this.positionY -= 30;
                this.sizeX = 75;
                this.sizeY = 75;
                this.slope = 0;
                this.offset = 0;
            }
        }
        else{
            this.activeFrames--;
            if(this.activeFrames <= 0){
                this.active = false;
            }
        }
        
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if(this.slope == 0 && this.offset == 0 && this.DmgedCounter >= 0){
            if (this.positionX < otherObject.positionX + otherObject.sizeX &&
                this.positionX + this.sizeX > otherObject.positionX &&
                this.positionY < otherObject.positionY + otherObject.sizeY &&
                this.positionY + this.sizeY > otherObject.positionY) {
                    if(otherObject.hp && otherObject.team != this.team){
                        this.DmgedCounter++;
                        otherObject.hp -= 6;
                    }
                }
        }
    }
};

class ScorchObject{
    className = "ScorchObject";
    iconName = "scorch";
    school = "Flame";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 20;
    sizeY = 10;
    pixelSpeed = 20;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    otherObject.maxHp -= 7;
                    if(otherObject.maxHp < otherObject.hp){
                        otherObject.hp = otherObject.maxHp;
                    }
                }
            }
    }
};

class HearthObject{
    className = "HearthObject";
    iconName = "hearth";
    school = "Flame";
    team = "left";
    active = true;
    maxCharge = 25;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 8;
    firstFrameFlag = true;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){
        if(this.firstFrameFlag){
            for(var i = 0; i < objectArray.length; i++){
                if(
                    this.team == objectArray[i].team &&
                    this.positionX == objectArray[i].positionX &&
                    this.positionY == objectArray[i].positionY &&
                    objectArray[i].className == "CannonObject"
                ){
                    objectArray[i].hp -= 10;
                    i = objectArray.length;
                }
            }
            this.firstFrameFlag = false;
        }
        
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    otherObject.hp -= 20;
                }
            }
    }
};


//Storm Magic
class ZapObject{
    className = "ZapObject";
    iconName = "zap";
    school = "Storm";
    team = "left";
    active = true;
    maxCharge = 6;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 10;
    sizeY = 10;
    pixelSpeed = 12;
    energizeBonus = 0;

    
    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    otherObject.hp -= (4 + this.energizeBonus);
                }
            }
    }
};

class BoltObject{
    className = "BoltObject";
    iconName = "bolt";
    school = "Storm";
    team = "left";
    active = true;
    maxCharge = 15;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 10;
    sizeY = 10;
    pixelSpeed = 7;
    energizeBonus = 0;

    
    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team && otherObject.className == "CannonObject"){
                    this.active = false;
                    otherObject.hp -= (6 + this.energizeBonus);
                }
            }
    }
};

class LightningObject{
    className = "LightningObject";
    iconName = "lightning";
    school = "Storm";
    team = "left";
    active = true;
    maxCharge = 25;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    sizeX = 10;
    sizeY = 15;
    activeFrames = 5;
    DmgedFlag = false;
    energizeBonus = 0;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = destX;
        this.positionY = destY;
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX + (this.sizeX/2), this.positionY - (this.sizeY/2), this.sizeX, this.sizeY);
        
        if(!this.DmgedFlag){
            for(var i = 0; i < objectArray.length && !this.DmgedFlag; i++){
                if(this.positionX == objectArray[i].positionX &&
                    this.positionY == objectArray[i].positionY && objectArray[i].hp){
                        objectArray[i].hp -= (8 + this.energizeBonus);
                        this.DmgedFlag = true;
                }
            }
        }
        
        this.activeFrames--;
        if(this.activeFrames <= 0){
            this.active = false;
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};

class ShockObject{
    className = "ShockObject";
    iconName = "shock";
    school = "Storm";
    team = "left";
    active = true;
    maxCharge = 25;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 20;
    sizeY = 20;
    pixelSpeed = 6;
    activeFrames = 10;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        if(this.slope != 0 && this.offset){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            
            this.activeFrames--;
            if(this.activeFrames <= 0){
                this.active = false;

                for(var i = 0; i < objectArray.length && !this.DmgedFlag; i++){
                    if(this.positionX < objectArray[i].positionX + objectArray[i].sizeX &&
                        this.positionX + this.sizeX > objectArray[i].positionX &&
                        this.positionY < objectArray[i].positionY + objectArray[i].sizeY &&
                        this.positionY + this.sizeY > objectArray[i].positionY &&
                        objectArray[i].chargeRate <= 0){

                            objectArray[i].chargeRate = 1;
                    }
                }
            }
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.slope = 0;
                    this.offset = 0;
                    otherObject.chargeRate = 0;
                }
            }
    }
};

class EnergizeObject{
    className = "EnergizeObject";
    school = "Storm";
    team = "left";
    active = true;
    maxCharge = 25;
    positionX = 0;
    positionY = 0;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    async onFrame(ctx, objectArray){
        for(var i = 0; i < objectArray.length; i++){
            if(this.positionX < objectArray[i].positionX + objectArray[i].sizeX &&
                this.positionX + this.sizeX > objectArray[i].positionX &&
                this.positionY < objectArray[i].positionY + objectArray[i].sizeY &&
                this.positionY + this.sizeY > objectArray[i].positionY){

                    objectArray[i].energizeBonus++;
            }
        }
        this.active = false;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};


//Frost Magic
class SnowballObject{
    className = "SnowballObject";
    iconName = "snowball";
    school = "Frost";
    team = "left";
    active = true;
    maxCharge = 8;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 10;
    sizeY = 10;
    pixelSpeed = 6;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    otherObject.charge -= 5;
                    if(otherObject.charge < 0){
                        otherObject.charge = 0;
                    }
                }
            }
    }
};

class FreezeObject{
    className = "FreezeObject";
    iconName = "freeze";
    school = "Frost";
    team = "left";
    active = true;
    maxCharge = 30;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 10;
    sizeY = 10;
    pixelSpeed = 5;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team && otherObject.className == "CannonObject"){
                    this.active = false;
                    var curSpell = otherObject.currentSpell;
                    otherObject.mateManning.equippedDice.possibleRolls = await [curSpell, curSpell, curSpell];
                }
            }
    }
};


//Pure Magic Magic
class MagicMissileObject{
    className = "MagicMissleObject";
    iconName = "magicmissle";
    school = "Pure";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 9;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    otherObject.hp -= 20;
                }
            }
    }
};

class ArmageddonObject{
    className = "ArmageddonObject";
    iconName = "armageddon";
    school = "Pure";
    team = "left";
    active = true;
    maxCharge = 100;
    positionX = 0;
    positionY = 0;
    sizeX = 15;
    sizeY = 15;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX -= 5;
        this.positionY -= 5;
        this.sizeX += 10;
        this.sizeY += 10;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.active && otherObject.team != this.team){
                    otherObject.active = false;
                }
            }
    }
};

class TrueSmiteObject{
    className = "TrueSmiteObject";
    iconName = "truesmite";
    school = "Pure";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 9;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
        this.destX = destX;
        this.destY = destY;

        this.slope = (destY - positionY) / (destX - positionX);
        this.offset = -((this.slope * positionX) - positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
        this.positionY = (this.slope * this.positionX) + this.offset;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team != this.team){
                    this.active = false;
                    if(otherObject.hp / otherObject.maxHp < .30){
                        otherObject.hp = 0;
                    }
                    else{
                        otherObject.hp -= 10;
                    }
                }
            }
    }
};


module.exports = {
    WaitObject, PrepareObject, RestObject, SparkObject, CounterObject,
    FireballObject, BurnObject, ExplosionObject, ScorchObject, HearthObject,
    ZapObject, BoltObject, LightningObject, ShockObject, EnergizeObject,
    SnowballObject, FreezeObject,
    MagicMissileObject, ArmageddonObject, TrueSmiteObject
};