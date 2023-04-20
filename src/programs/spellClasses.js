const partClasses = require("../programs/partClasses");
const Canvas = require("canvas");

//Basic Magic
class WaitObject{
    className = "WaitObject";
    maxCharge = 3;
    active = false;

    constructor(team, positionX, positionY, tpositionX, tpositionY){}
    onFrame(ctx, objectArray){}
    checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};

class PrepareObject{
    className = "PrepareObject";
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
    

    constructor(team, positionX, positionY, destX, destY){
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
                    otherObject.hp -= 6;
                }
            }
    }
};

class CounterObject{
    className = "CounterObject";
    iconName = "counter";
    team = "left";
    active = true;
    maxCharge = 20;
    positionX = 0;
    positionY = 0;
    sizeX = 55;
    sizeY = 55;
    activeFrames = 5;
    

    constructor(team, positionX, positionY, destX, destY){
        this.active = true;
        this.team = team;
        this.positionX = positionX-20;
        this.positionY = positionY-20;
        this.destX = destX;
        this.destY = destY;
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
    

    constructor(team, positionX, positionY, destX, destY){
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
                    otherObject.hp -= 10;
                }
            }
    }
};

class BurnObject{
    className = "BurnObject";
    iconName = "burn";
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
    

    constructor(team, positionX, positionY, destX, destY){
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
    

    constructor(team, positionX, positionY, destX, destY){
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
    

    constructor(team, positionX, positionY, destX, destY){
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
    

    constructor(team, positionX, positionY, destX, destY){
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

    
    constructor(team, positionX, positionY, destX, destY){
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
                    otherObject.hp -= 4;
                }
            }
    }
};


//Frost Magic
class SnowballObject{
    className = "SnowballObject";
    iconName = "snowball";
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
    

    constructor(team, positionX, positionY, destX, destY){
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


module.exports = {
    WaitObject, PrepareObject, RestObject, SparkObject, CounterObject,
    FireballObject, BurnObject, ExplosionObject, ScorchObject, HearthObject,
    ZapObject,
    SnowballObject
};