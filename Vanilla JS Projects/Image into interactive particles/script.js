const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArray = [];

//mouse
let mouse = {
    x : null, y : null, radius : 100
}
window.addEventListener('mousemove',

    function(event)
    {
        mouse.x = event.x + canvas.clientLeft/2;
        mouse.y = event.y + canvas.clientTop/2;
    }
);
function drawImage()
{
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    class particle
    {
        constructor(x, y, color, size)
        {
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random() * 10) + 2;
        }
        draw()
        {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update()
        {
            ctx.fillStyle = this.color;
            //collision detection

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forcedirectionX = dx / distance;
            let forcedirectionY = dy / distance;

            //maximum distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if(force < 0)
            {
                force = 0;
            }
            let directionX = (forcedirectionX * force * this.density * 0.6);
            let directionY = (forcedirectionY * force * this.density * 0.6);

            if(distance < mouse.radius + this.size)
            {
                this.x -= directionX;
                this.y -= directionY;
            }
            else
            {
                if(this.x !== this.baseX)
                {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if(this.y !== this.baseY)
                {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
            this.draw();
        }
    }
    function init()
    {
        particleArray = [];
        for(let y = 0, y2 = data.height; y < y2 ; y++)
        {
            for(let x = 0, x2 = data.width; x < x2 ; x++)
            {
                if(data.data[(y * 4 * data.width) + (x * 4) + 3] > 128)
                {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgba(" + data.data[(y * 4 * data.width) + (x * 4)] + "," + data.data[(y * 4 * data.width) + (x * 4) + 1] + 
                    "," + data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new particle(positionX * 4, positionY * 4, color));
                }
            }
        }
    }
    function animate()
    {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for(let i = 0; i < particleArray.length; i++)
        {
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize',
        function()
        {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
    });
}
const png = new Image();
png.src = "data:image/png;base64,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";
//converting png image to base64 code

window.addEventListener('load', (event) => {
    console.log("page has loaded");
    ctx.drawImage(png, 0, 0);
    drawImage();
});









