const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 4 
const scGap : number = 0.02 / parts 
const sizeFactor : number = 8.9 
const strokeFactor : number = 90 
const colors : Array<string> = [
    "#F44336",
    "#3F51B5",
    "#4CAF50",
    "#2196F3",
    "#FFC107"
]
const delay : number = 20 
const backColor : string = "#BDBDBD"

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale : number) {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x1, y1)
        context.stroke()
    }

    static drawSlopeDownFill(context : CanvasRenderingContext2D, sf4 : number, x : number, y : number, offset : number) {
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(offset, y)
        context.lineTo(x, y)
        context.lineTo(w, 0)
        context.lineTo(w, h)
        context.lineTo(0, h)
        context.lineTo(0, 0)
        context.clip()
        context.fillRect(0, 0, w * sf4, h)
    }

    static drawSlopeDown(context : CanvasRenderingContext2D, scale : number) {
        const offset = Math.min(w, h) / sizeFactor
        const y : number = h - offset  
        const x : number = w - offset 
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, 0, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, 1, parts)
        const sf3 : number = ScaleUtil.divideScale(sf, 2, parts)
        const sf4 : number = ScaleUtil.divideScale(sf, 3, parts)
        DrawingUtil.drawLine(context, 0, 0, offset * sf1, y * sf1)
        DrawingUtil.drawLine(context, offset, y, offset + (x - offset) * sf2, y)
        DrawingUtil.drawLine(context, x, y, x + (w - x) * sf3, y - y * sf3)
    }

    static drawSDFNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawSlopeDown(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            
        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}
