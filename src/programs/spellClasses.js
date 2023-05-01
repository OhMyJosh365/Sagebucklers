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
    effect = 50;

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
                objectArray[i].charge += (this.maxCharge * (this.effect / 100));
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
    effect = 25;

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
                objectArray[i].hp += (objectArray[i].maxHp * (this.effect/100));
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
    effect = 5;
    

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
                    otherObject.hp -= this.effect;
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
    effect = 5;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX - 20;
        this.positionY = positionY - 20;
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        if(this.effect-- <= 0){
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
    effect = 10;
    

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
                    otherObject.hp -= this.effect;
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
    effect = 2;
    

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
                            objectArray[i].hp -= this.effect;
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
    DmgedCounter = 0;
    effect = 6;
    

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



        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team != this.team){
                if(objectArray[i].positionX != this.destX && objectArray[i].positionY != this.destY){
                    targets.push(objectArray[i]);
                }
            }
        }

        if(targets.length == []){
            this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
            this.offset = -((this.slope * this.positionX) - this.positionY);
            return;
        }

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

    async onFrame(ctx, objectArray){
        if(this.DmgedCounter > 0) this.DmgedCounter = -1;

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
                        otherObject.hp -= this.effect;
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
    effect = 7;
    

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
                    otherObject.maxHp -= this.effect;
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
    effect = 10;
    

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
        if(this.firstFrameFlag){
            for(var i = 0; i < objectArray.length; i++){
                if(
                    this.team == objectArray[i].team &&
                    this.positionX == objectArray[i].positionX &&
                    this.positionY == objectArray[i].positionY &&
                    objectArray[i].className == "CannonObject"
                ){
                    objectArray[i].hp -= this.effect;
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
    effect = 4;

    
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
                    otherObject.hp -= (this.effect + this.energizeBonus);
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
    effect = 6;

    
    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team != team && objectArray.className == "CannonObject"){
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
                if(otherObject.hp && otherObject.team != this.team && otherObject.className == "CannonObject"){
                    this.active = false;
                    otherObject.hp -= (this.effect + this.energizeBonus);
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
    effect = 8;
    

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
        this.positionX = target.positionX;
        this.positionY = target.positionY;
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX + (this.sizeX/2), this.positionY - (this.sizeY/2), this.sizeX, this.sizeY);
        
        if(!this.DmgedFlag){
            for(var i = 0; i < objectArray.length && !this.DmgedFlag; i++){
                if(this.positionX == objectArray[i].positionX &&
                    this.positionY == objectArray[i].positionY && objectArray[i].hp){
                        objectArray[i].hp -= (this.effect + this.energizeBonus);
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
    effect = 10;
    

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
        if(this.slope != 0 && this.offset){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            
            this.effect--;
            if(this.effect <= 0){
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
    effect = 1;
    

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

                    objectArray[i].energizeBonus+=this.effect;
            }
        }
        this.active = false;
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){}
};


//Sea Magic
class TidalWaveObject{
    className = "TidalWaveObject";
    iconName = "tidalwave";
    school = "Sea";
    team = "left";
    active = true;
    maxCharge = 9;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 8;
    effect = 5;
    

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
                    otherObject.hp -= this.effect;
                }
            }
    }
};

class SplashObject{
    className = "SplashObject";
    iconName = "splash";
    school = "Sea";
    team = "left";
    active = true;
    maxCharge = 13;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 8;
    effect = 1;
    

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
                    otherObject.weight += this.effect;
                    this.active = false;
                }
            }
    }
};

class RiptideObject{
    className = "RiptideObject";
    iconName = "riptide";
    school = "Sea";
    team = "left";
    active = true;
    maxCharge = 24;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 2;
    effect = 5;
    

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
                    otherObject.weight += this.effect;
                    this.active = false;
                }
            }
    }
};

class RainstormObject{
    className = "RainstormObject";
    iconName = "rainstorm";
    school = "Sea";
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
    activeFrames = 20;
    effect = 2;
    

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
        if(this.slope != 0 && this.offset != 0){
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
                            objectArray[i].weight += this.effect;
                        }
                    }
                }
            }
    }
};

class WhirlpoolObject{
    className = "WhirlpoolObject";
    iconName = "whirlpool";
    school = "Sea";
    team = "left";
    active = true;
    maxCharge = 15;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 5;
    sizeY = 5;
    pixelSpeed = 12;
    activeFrames = 20;
    effect = 2;
    

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
        if(this.slope != 0 && this.offset != 0){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;

            if(
                (this.team == "left" && this.positionX >= 125) ||
                (this.team == "right" && this.positionX <= 125)
            ){
                this.positionX -= 10;
                this.positionY -= 10;
                this.sizeX = 35;
                this.sizeY = 35;
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
        if(this.slope == 0 && this.offset == 0){
            if (this.positionX < otherObject.positionX + otherObject.sizeX &&
                this.positionX + this.sizeX > otherObject.positionX &&
                this.positionY < otherObject.positionY + otherObject.sizeY &&
                this.positionY + this.sizeY > otherObject.positionY) {
                    if(otherObject.pixelSpeed && otherObject.team != this.team){
                        otherObject.pixelSpeed -= this.effect;
                        if(otherObject.pixelSpeed <= 0){
                            otherObject.pixelSpeed = 1;
                        }
                        this.active = false;
                    }
                }
        }
    }
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
                    otherObject.charge -= 5;
                    if(otherObject.charge < 0){
                        otherObject.charge = 0;
                    }
                }
            }
    }
};

class FrostbiteObject{
    className = "FrostbiteObject";
    iconName = "frostbite";
    school = "Frost";
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
    effect = 20;
    heldHp = 0;
    pixelSpeedBonus = 0;
    effectBonus = 0;
    energizeBonus = 0;

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
        if(this.slope != 0 && this.offset){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            this.effect--;
            if(this.effect <= 0){
                this.active = false;
            }
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(this.slope != 0 && this.offset != 0 && otherObject.hp && otherObject.team != this.team){
                    this.slope = 0;
                    this.offset = 0;
                    this.heldHp = otherObject.hp;
                    this.pixelSpeedBonus = otherObject.pixelSpeedBonus;
                    this.effectBonus = otherObject.effectBonus;
                    this.energizeBonus = otherObject.energizeBonus;
                }
                else if(this.slope == 0 && this.offset == 0 && otherObject.className == "CannonObject"){
                    if(otherObject.hp > this.heldHp) otherObject.hp = this.heldHp;
                    if(otherObject.hp < this.heldHp) this.heldHp = otherObject.hp;

                    if(otherObject.pixelSpeedBonus > this.pixelSpeedBonus) otherObject.pixelSpeedBonus = this.pixelSpeedBonus;
                    if(otherObject.pixelSpeedBonus < this.pixelSpeedBonus) this.pixelSpeedBonus = otherObject.pixelSpeedBonus;

                    if(otherObject.effectBonus > this.effectBonus) otherObject.effectBonus = this.effectBonus;
                    if(otherObject.effectBonus < this.effectBonus) this.effectBonus = otherObject.effectBonus;

                    if(otherObject.energizeBonus > this.energizeBonus) otherObject.energizeBonus = this.energizeBonus;
                    if(otherObject.energizeBonus < this.energizeBonus) this.energizeBonus = otherObject.energizeBonus;
                }
            }
    }
};

class IcewallObject{
    className = "IcewallObject";
    iconName = "icewall";
    school = "Frost";
    team = "left";
    active = true;
    maxCharge = 25;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 5;
    sizeY = 5;
    pixelSpeed = 12;
    activeFrames = 20;
    effect = 2;
    

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
        if(this.slope != 0 && this.offset != 0){
            this.positionX += (this.team == "left") ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;

            if(
                (this.team == "left" && this.positionX >= 90) ||
                (this.team == "right" && this.positionX <= 140)
            ){
                this.positionX = (this.team == "left" ? 90 : 140);
                this.positionY -= 10;
                this.sizeX = 20;
                this.sizeY = 35;
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
        if(this.slope == 0 && this.offset == 0){
            if (this.positionX < otherObject.positionX + otherObject.sizeX &&
                this.positionX + this.sizeX > otherObject.positionX &&
                this.positionY < otherObject.positionY + otherObject.sizeY &&
                this.positionY + this.sizeY > otherObject.positionY) {
                    if(otherObject.pixelSpeed && otherObject.team != this.team){
                        otherObject.active = false;
                        this.activeFrames -= 5;
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
    effect = 2;
    

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
                if(otherObject.hp && otherObject.team != this.team && otherObject.className == "CannonObject"){
                    this.active = false;
                    var curSpell = otherObject.currentSpell;
                    var spells = [];
                    for(var i = 0; i < this.effect; i++) spells.push(curSpell);
                    otherObject.mateManning.equippedDice.possibleRolls = spells;
                }
            }
    }
};

class HailObject{
    className = "HailObject";
    iconName = "hail";
    school = "Frost";
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
    DmgedCounter = 0;
    effect = 6;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].charge && objectArray[i].team != team){
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



        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team != this.team){
                if(objectArray[i].positionX != this.destX && objectArray[i].positionY != this.destY){
                    targets.push(objectArray[i]);
                }
            }
        }

        if(targets.length == []){
            this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
            this.offset = -((this.slope * this.positionX) - this.positionY);
            return;
        }

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

    async onFrame(ctx, objectArray){
        if(this.DmgedCounter > 0) this.DmgedCounter = -1;

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
                        otherObject.charge -= this.effect;
                        if(otherObject.charge > 0){
                            otherObject.charge = 0;
                        }
                    }
                }
        }
    }
};


//Conjure Magic
class HealObject{
    className = "HealObject";
    iconName = "heal";
    school = "Conjure";
    team = "left";
    active = true;
    maxCharge = 10;
    spawnX = 0;
    spawnY = 0;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 3;
    effect = 8;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team == team &&
                !(objectArray[i].positionX == positionX && objectArray[i].positionY == positionY)){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if((targets[i].hp / targets[i].maxHp) < (target.hp / target.maxHp)){
                target = targets[i];
            }
        }

        this.active = true;
        this.team = team;
        this.positionX = this.spawnX = positionX;
        this.positionY = this.spawnY = positionY;
        this.destX = target.positionX;
        this.destY = target.positionY;

        this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
        this.offset = -((this.slope * this.positionX) - this.positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);

        if(this.destX != this.positionX){
            this.positionX += (this.destX > this.positionX) ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            this.positionY += (this.destY > this.positionY) ? this.pixelSpeed : -this.pixelSpeed;
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team == this.team &&
                    !(otherObject.positionX == this.spawnX && otherObject.positionY == this.spawnY)){
                    
                    this.active = false;
                    otherObject.hp += this.effect;
                    if(otherObject.hp > otherObject.maxHp){
                        otherObject.hp = otherObject.maxHp;
                    }
                }
            }
    }
};

class BarrierObject{
    className = "BarrierObject";
    iconName = "barrier";
    school = "Conjure";
    team = "left";
    active = true;
    maxCharge = 40;
    spawnX = 0;
    spawnY = 0;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 5;
    sizeY = 5;
    pixelSpeed = 3;
    hp = 20;
    effect = 2;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team == team &&
                !(objectArray[i].positionX == positionX && objectArray[i].positionY == positionY)){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if((targets[i].hp / targets[i].maxHp) < (target.hp / target.maxHp)){
                target = targets[i];
            }
        }

        this.active = true;
        this.team = team;
        this.positionX = this.spawnX = positionX;
        this.positionY = this.spawnY = positionY;
        this.destX = target.positionX;
        this.destY = target.positionY;

        this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
        this.offset = -((this.slope * this.positionX) - this.positionY);
    }

    async onFrame(ctx, objectArray){

        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);

        if(this.slope != 0 && this.offset != 0){
            if(this.destX != this.positionX){
                this.positionX += (this.destX > this.positionX) ? this.pixelSpeed : -this.pixelSpeed;
                this.positionY = (this.slope * this.positionX) + this.offset;
            }
            else{
                this.positionY += (this.destY > this.positionY) ? this.pixelSpeed : -this.pixelSpeed;
            }
        }

        if(this.hp <= 0){
            this.active = false;
        }
        
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team == this.team){
                    if(this.destX == otherObject.positionX && this.destY == otherObject.positionY){
                        this.slope = 0;
                        this.offset = 0;
                        this.positionX = otherObject.positionX - 15;
                        this.positionY = otherObject.positionY - 15;
                        this.sizeX = otherObject.sizeX + 30;
                        this.sizeY = otherObject.sizeY + 30;
                    }
                }
                if(otherObject.slope && this.slope == 0 && otherObject.team != this.team && thisArrayIndex != otherArrayIndex){
                    otherObject.active = false;
                }
            }
    }
};


//Gust Magic
class BreezeObject{
    className = "BreezeObject";
    iconName = "breeze";
    school = "Gust";
    team = "left";
    active = true;
    maxCharge = 16;
    spawnX = 0;
    spawnY = 0;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 4;
    effect = 8;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team == team &&
                !(objectArray[i].positionX == positionX && objectArray[i].positionY == positionY)){
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
        this.positionX = this.spawnX = positionX;
        this.positionY = this.spawnY = positionY;
        this.destX = target.positionX;
        this.destY = target.positionY;

        this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
        this.offset = -((this.slope * this.positionX) - this.positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);

        if(this.destX != this.positionX){
            this.positionX += (this.destX > this.positionX) ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            this.positionY += (this.destY > this.positionY) ? this.pixelSpeed : -this.pixelSpeed;
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team == this.team &&
                    !(otherObject.positionX == this.spawnX && otherObject.positionY == this.spawnY)){
                    
                    this.active = false;
                    otherObject.charge += this.effect;
                }
            }
    }
};

class TailwindObject{
    className = "TailwindObject";
    iconName = "tailwind";
    school = "Gust";
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
    pixelSpeed = 3;
    effect = 3;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team == team &&
                !(objectArray[i].positionX == positionX && objectArray[i].positionY == positionY)){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if((targets[i].hp / targets[i].maxHp) < (target.hp / target.maxHp)){
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

        if(this.destX != this.positionX){
            this.positionX += (this.destX > this.positionX) ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            this.positionY += (this.destY > this.positionY) ? this.pixelSpeed : -this.pixelSpeed;
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team == this.team){
                    this.active = false;
                    otherObject.pixelSpeedBonus += this.effect;
                }
            }
    }
};

class TornadoObject{
    className = "TornadoObject";
    iconName = "tornado";
    school = "Gust";
    team = "left";
    active = true;
    maxCharge = 15;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 20;
    sizeY = 20;
    pixelSpeed = 5;
    totalDmg = 3;
    effect = 3;
    

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
                    otherObject.hp -= this.totalDmg;
                }
                else if(otherObject.pixelSpeed && otherObject.team != this.team){
                    this.totalDmg += this.effect;
                    otherObject.active = false;
                }
            }
    }
};

class WooshObject{
    className = "WooshObject";
    iconName = "woosh";
    school = "Gust";
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
    pixelSpeed = 2;
    effect = 2;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team == team &&
                !(objectArray[i].positionX == positionX && objectArray[i].positionY == positionY)){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if((targets[i].hp / targets[i].maxHp) < (target.hp / target.maxHp)){
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

        if(this.destX != this.positionX){
            this.positionX += (this.destX > this.positionX) ? this.pixelSpeed : -this.pixelSpeed;
            this.positionY = (this.slope * this.positionX) + this.offset;
        }
        else{
            this.positionY += (this.destY > this.positionY) ? this.pixelSpeed : -this.pixelSpeed;
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.hp && otherObject.team == this.team){
                    this.active = false;
                    otherObject.effectBonus += this.effect;
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
    effect = 20;
    

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
                    otherObject.hp -= this.effect;
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
    effect = 10;
    

    constructor(team, positionX, positionY, objectArray){
        this.active = true;
        this.team = team;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.positionX -= this.effect/2;
        this.positionY -= this.effect/2;
        this.sizeX += this.effect;
        this.sizeY += this.effect;
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
    effect = 10;
    

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
                    if(otherObject.hp / otherObject.maxHp < .30){
                        otherObject.hp = 0;
                    }
                    else{
                        otherObject.hp -= effect;
                    }
                }
            }
    }
};

class CleanseObject{
    className = "CleanseObject";
    iconName = "cleanse";
    school = "Pure";
    team = "left";
    active = true;
    maxCharge = 20;
    spawnX = 0;
    spawnY = 0;
    positionX = 0;
    positionY = 0;
    destX = 0;
    destY = 0;
    slope = 0;
    offset = 0;
    sizeX = 15;
    sizeY = 15;
    pixelSpeed = 5;
    effect = 5;
    

    constructor(team, positionX, positionY, objectArray){
        if(team == null){
            this.active = false;
            return;
        }

        var targets = [];
        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].hp && objectArray[i].team == team &&
                !(objectArray[i].positionX == positionX && objectArray[i].positionY == positionY)){
                targets.push(objectArray[i]);
            }
        }

        if(targets.length == []){
            this.active = false;
            return;
        }

        var target = targets[0];
        for(var i = 1; i < targets.length; i++){
            if((targets[i].hp / targets[i].maxHp) < (target.hp / target.maxHp)){
                target = targets[i];
            }
        }

        this.active = true;
        this.team = team;
        this.positionX = this.spawnX = positionX;
        this.positionY = this.spawnY = positionY;
        this.destX = target.positionX;
        this.destY = target.positionY;

        this.slope = (this.destY - this.positionY) / (this.destX - this.positionX);
        this.offset = -((this.slope * this.positionX) - this.positionY);
    }

    async onFrame(ctx, objectArray){ 
        await ctx.drawImage(await Canvas.loadImage(`./src/Images/${this.iconName}.png`), this.positionX, this.positionY, this.sizeX, this.sizeY);

        if(this.slope != 0 && this.offset != 0){
            if(this.destX != this.positionX){
                this.positionX += (this.destX > this.positionX) ? this.pixelSpeed : -this.pixelSpeed;
                this.positionY = (this.slope * this.positionX) + this.offset;
            }
            else{
                this.positionY += (this.destY > this.positionY) ? this.pixelSpeed : -this.pixelSpeed;
            }

            if(this.positionX < this.destX + 15 &&
                this.positionX + this.sizeX > this.destX &&
                this.positionY < this.destY + 15 &&
                this.positionY + this.sizeY > this.destY){

                this.positionX = this.destX - 15;
                this.positionY = this.destY - 15;
                this.sizeX = 45;
                this.sizeY = 45;
                this.slope = 0;
                this.offset = 0;
            }
        }
        else{
            this.effect--;
            if(this.effect <= 0){
                this.active = false;
            }
        }
    }

    async checkCollision(otherObject, thisArrayIndex, otherArrayIndex, objectArray){
        if (this.positionX < otherObject.positionX + otherObject.sizeX &&
            this.positionX + this.sizeX > otherObject.positionX &&
            this.positionY < otherObject.positionY + otherObject.sizeY &&
            this.positionY + this.sizeY > otherObject.positionY) {
                if(otherObject.team != this.team){
                    otherObject.active = false;
                }
            }
    }
};


module.exports = {
    WaitObject, PrepareObject, RestObject, SparkObject, CounterObject,
    FireballObject, BurnObject, ExplosionObject, ScorchObject, HearthObject,
    ZapObject, BoltObject, LightningObject, ShockObject, EnergizeObject,
    TidalWaveObject, SplashObject, RiptideObject, RainstormObject, WhirlpoolObject,
    SnowballObject, FrostbiteObject, IcewallObject, FreezeObject, HailObject,
    HealObject, BarrierObject,
    BreezeObject, TailwindObject, TornadoObject, WooshObject,
    MagicMissileObject, ArmageddonObject, TrueSmiteObject, CleanseObject
};