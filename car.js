

class Car {
    //Object constructor
    constructor(x,y,width,height, controlType, maxSpeed=5) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged=false;
        if(controlType!="DUMMY"){
            this.sensor = new Sensor(this);
        }
            this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged) {
            this.#move();   
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor)
            this.sensor.update(roadBorders, traffic);
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;            
        
    }

    #createPolygon() {
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2; // get rect's 'radius'
        const alpha=Math.atan2(this.width, this.height); // get angle between x axis and radius
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,    // top right x
            y:this.y-Math.cos(this.angle-alpha)*rad     // top right y
        });        
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,    // top right x
            y:this.y-Math.cos(this.angle+alpha)*rad     // top right y
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,    // top right x
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad     // top right y
        });        
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,    // top right x
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad     // top right y
        });
        return points;
    }

    #move() {
        // vertical controls
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        //max speed        
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }

        if(this.speed < -this.maxSpeed/2)
        {
            this.speed = -this.maxSpeed/2;
        }

        //friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction) {
            this.speed = 0;
        }

        //turning
        if (this.speed != 0){
            const flip = this.speed>0?1:-1;
        
            if (this.controls.left){
                this.angle+=0.03*flip;
            }
            if (this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx, color) {
        if (this.damaged) {
            ctx.fillStyle="gray";

        } else {
            ctx.fillStyle=color;
            var img = new Image();
            img.src = "pink_car.png";
            img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor)
            this.sensor.draw(ctx);
    }

}