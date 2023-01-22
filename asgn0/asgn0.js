// DrawRectangle.js

var canvas = document.getElementById('example');
const button = document.getElementById('draw');
const button2 = document.getElementById('draw2');
const select = document.getElementById('options')
var ctx = canvas.getContext('2d');
var v1 = new Vector3(2.25, 2.25, 0);
var v2 = new Vector3(2.25, 2.25, 0);
var v3 = new Vector3();

button.onclick = () => {
    ctx.fillStyle = 'rgb(128,128,128)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    v1.elements[0] = document.getElementById('xv1').value
    v1.elements[1] = document.getElementById('yv1').value
    v2.elements[0] = document.getElementById('xv2').value
    v2.elements[1] = document.getElementById('yv2').value

    drawVector(v1, "red");
    drawVector(v2, "blue");

    // v3 = v1

    v3.elements[0] = v1.elements[0]
    v3.elements[1] = v1.elements[1]


}

button2.onclick = () => {
    switch (select.value) {
        case "add":
            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            v3.add(v2)

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")
            break;

        case "sub":
            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            v3.sub(v2)

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")
            break;
        case "mul":
            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            console.log(document.getElementById("scalar").value)
            v3.mul(Number(document.getElementById("scalar").value));

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")
            v3.elements[0] = v2.elements[0]
            v3.elements[1] = v2.elements[1]
            console.log(document.getElementById("scalar").value)
            v3.mul(Number(document.getElementById("scalar").value));

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")
            break;
        case "div":
            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            console.log(document.getElementById("scalar").value)
            v3.div(Number(document.getElementById("scalar").value));

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")

            v3.elements[0] = v2.elements[0]
            v3.elements[1] = v2.elements[1]
            console.log(document.getElementById("scalar").value)
            v3.div(Number(document.getElementById("scalar").value));

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")
            break;

        case "mag":

            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            // console.log(document.getElementById("scalar").value)
            console.log(v3.magnitude())

            // console.log(v3)
            // console.log(v1)

            // drawVector(v3, "green")

            v3.elements[0] = v2.elements[0]
            v3.elements[1] = v2.elements[1]
            // console.log(document.getElementById("scalar").value)
            console.log(v3.magnitude())

            break;

        case "nor":
            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            // console.log(document.getElementById("scalar").value)
            v3.normalize();

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")

            v3.elements[0] = v2.elements[0]
            v3.elements[1] = v2.elements[1]
            console.log(document.getElementById("scalar").value)
            v3.normalize();

            console.log(v3)
            console.log(v1)

            drawVector(v3, "green")
            break;

        case "ang":
            v3.elements[0] = v1.elements[0]
            v3.elements[1] = v1.elements[1]
            // console.log(Math.acos(Vector3.dot(v1, v2)) * 180 / Math.PI)
            // console.log(document.getElementById("scalar").value)
            console.log(Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())) * 180 / Math.PI);
            break;
        case "area":
            console.log(Vector3.cross(v1, v2).magnitude() / 2)
            break;
        default:
            break;

    }
}

function main() {
    // Retrieve <canvas> element <- (1)



    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    ctx.fillStyle = 'rgb(128,128,128)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Get the rendering context for 2DCG <- (2)

    // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
    // ctx.beginPath();
    // ctx.moveTo(100, 10);


    // console.log(v1.elements[0], v1);
    // ctx.lineTo(10, 100);
    // ctx.closePath();
    // ctx.strokeStyle = 'rgba(0, 255, 255, 1)';
    // ctx.stroke();
    // drawVector(v1, "red");
    // ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color

    // drawVector(ctx, v1, "red");
}

function drawVector(v, color2) {
    ctx.beginPath();
    // const color2 = color1.toString()
    // console.log()
    ctx.moveTo(200, 200);
    ctx.lineTo(v.elements[0] * 20 + 200, Math.abs(v.elements[1] * 20 - 200));
    if (color2 === "red")
        ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    else if (color2 === "blue")
        ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
    else if (color2 === "green")
        ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
    ctx.closePath();
    ctx.stroke();
}

