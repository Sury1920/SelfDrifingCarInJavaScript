class Sensor {
    constructor(car) {
        this.car=car;
        this.rayCount=5;
        this.rayLength=200;
        this.raySpread=Math.PI/2;

        this.rays=[];
        this.readings=[];
    }
    update(roadBorders) {
        this.#castRays();
        this.readings=[];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders)
            );            
        }
    }
    
    #getReading(ray, roadBorders){
        let touches = [];
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0], 
                ray[1], 
                roadBorders[i][0], 
                roadBorders[i][1]
            );
            if(touch) {
                touches.push(touch);
            }
        }
        if(touches.length==0){
            return null;
        } else {
            const offsets=touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castRays(){
        this.rays=[];
        for (let index = 0; index < this.rayCount; index++) {
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:index/(this.rayCount-1)
            )+this.car.angle;
            const start = {x:this.car.x, y:this.car.y};
            const end = {
                x:this.car.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        //draw the ray until intersection
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }

        //draw the inactive part of ray
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="grey";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}
