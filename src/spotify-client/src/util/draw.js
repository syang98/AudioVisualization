// functions to help draw shapes for visualizations using the canvas API


export default function rectangle(height, width, canvas, ctx) {
    //ctx.fillStyle = 'black';
    ctx.fillRect(height, width, canvas.width, canvas.height);
}

