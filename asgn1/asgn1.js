// DrawRectangle.js

var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_size;
    }
  `

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }
    `

let canvas, gl, a_position, a_size, u_fragcolor

setup_webgl = () => {

    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // gl = getWebGLContext(canvas)
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })

    if (!gl) {
        console.log("no webgl context")
        return;
    }

}

connect_var_to_GLSL = () => {

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_size = gl.getAttribLocation(gl.program, 'a_size');
    
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    
    if (a_size < 0) {
        console.log('Failed to get the storage location of a_size');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
}

// Initialize all points
const clear_button = document.getElementById('clear');
const tri_button = document.getElementById('triangle');
const sq_button = document.getElementById('square');
const cir_button = document.getElementById('circle');
const draw_button = document.getElementById('draw');

// Initialize all sliders
const red_slider = document.getElementById('red');
const green_slider = document.getElementById('green');
const blue_slider = document.getElementById('blue');
const size_slider = document.getElementById('size');
const segment_slider = document.getElementById('segment');


var x = 0, y = 0, which_button = 4, mouseDown = 0;

// class point {
//     constructor() {
//         this.position = 
//     }
// }

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];
var g_sizes = [];

function toRadians(deg) {
    return deg * Math.PI / 180
}

// Add logic to clear the canvas when clear button is pressed
clear_button.onclick = () => {
    g_points = [];
    g_colors = [];
    g_sizes = [];
    gl.clear(gl.COLOR_BUFFER_BIT);

}

// Add code to draw a triangle when vertices are passed

draw_traingle = (vertices) => {
    var n = 3; 

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0) {
    //     console.log('Failed to get the storage location of a_Position');
    //     return -1;
    // }
    // Assign the buffer object to a_Position variable
    
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

// Write logic for each button shape to select the shape

tri_button.onclick = () => {
    which_button = 0
}

sq_button.onclick = () => {
    which_button = 1
}

cir_button.onclick = () => {
    which_button = 2
}

// Add code to draw the image of snorlax

draw_button.onclick = () => {

    gl.uniform4f(u_FragColor, 55 / 255, 97 / 255, 99 / 255, 1.0);

    var vertices = new Float32Array([
        -0.565, 0.16,
        -0.805, 0.4,
        -0.76, 0.47
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        -0.565, 0.16,
        -0.55, 0.27,
        -0.76, 0.47
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        -0.565, 0.16,
        -0.465, 0.43,
        -0.76, 0.47
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        0.565, 0.16,
        0.805, 0.4,
        0.76, 0.47
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        0.565, 0.16,
        0.55, 0.27,
        0.76, 0.47
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        0.565, 0.16,
        0.465, 0.43,
        0.76, 0.47
        
    ]);

    draw_traingle(vertices);


    gl.uniform4f(u_FragColor, 35 / 255, 74 / 255, 70 / 255, 1.0);

    var no_of_segments = 10
    var step = 360 / no_of_segments
    console.log(step)
    var size = 1.6
    console.log(size)
    var x = 0, y = 0.13;
    console.log("hi")

    // gl.uniform4f(u_FragColor, 194 / 255, 178 / 255, 32 / 255, 1.0);

    for (var i = 0; i <= 360; i += step) {

        // var i = 0
        var vertices = new Float32Array([
            x, y,
            x + (Math.cos(toRadians(i))) / size, y + (Math.sin(toRadians(i))) / size,
            x + (Math.cos(toRadians(i) + toRadians(step))) / size, y + (Math.sin(toRadians(i) + toRadians(step))) / size
        ]);
        draw_traingle(vertices)
        // var vertices = new Float32Array([
        //     0, 0,  Math.cos(120),  Math.sin(120),  Math.cos(120 + step),  Math.sin(120 + step)
        // ]);
        // // draw_traingle(vertices)
        // console.log(vertices)
    }

    var no_of_segments = 30
    var step = 360 / no_of_segments
    console.log(step)
    var size = 1.88
    console.log(size)
    var x = 0, y = 0;
    console.log("hi")

    gl.uniform4f(u_FragColor, 0 / 255, 0 / 255, 0 / 255, 1.0);

    for (var i = 0; i <= 360; i += step) {

        // var i = 0
        var vertices = new Float32Array([
            x, y,
            x + (Math.cos(toRadians(i))) / size, y + (Math.sin(toRadians(i))) / size,
            x + (Math.cos(toRadians(i) + toRadians(step))) / size, y + (Math.sin(toRadians(i) + toRadians(step))) / size
        ]);
        draw_traingle(vertices)
        // var vertices = new Float32Array([
        //     0, 0,  Math.cos(120),  Math.sin(120),  Math.cos(120 + step),  Math.sin(120 + step)
        // ]);
        // // draw_traingle(vertices)
        // console.log(vertices)
    }

    var no_of_segments = 30
    var step = 360 / no_of_segments
    console.log(step)
    var size = 1.9
    console.log(size)
    var x = 0, y = 0;
    console.log("hi")

    gl.uniform4f(u_FragColor, 194 / 255, 178 / 255, 32 / 255, 1.0);

    for (var i = 0; i <= 360; i += step) {

        // var i = 0
        var vertices = new Float32Array([
            x, y,
            x + (Math.cos(toRadians(i))) / size, y + (Math.sin(toRadians(i))) / size,
            x + (Math.cos(toRadians(i) + toRadians(step))) / size, y + (Math.sin(toRadians(i) + toRadians(step))) / size
        ]);
        draw_traingle(vertices)
        // var vertices = new Float32Array([
        //     0, 0,  Math.cos(120),  Math.sin(120),  Math.cos(120 + step),  Math.sin(120 + step)
        // ]);
        // // draw_traingle(vertices)
        // console.log(vertices)
    }

    // Outer triangle for getting a black border

    gl.uniform4f(u_FragColor, 0 / 255, 0 / 255, 0 / 255, 1.0);

    var vertices = new Float32Array([
        -0.187, 0.5,
        0.187,0.5,
        0,0.28
        
    ]);

    draw_traingle(vertices);

    // Triangle to cut the forehead

    gl.uniform4f(u_FragColor, 35 / 255, 74 / 255, 70 / 255, 1.0);

    var vertices = new Float32Array([
        -0.295, 0.65,
        0.295,0.65,
        0,0.3
        
    ]);

    draw_traingle(vertices);

    // Bottom cutoff with grey triangles

    gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0);

    var vertices = new Float32Array([
        -0.625, 0.135,
        -0.045, -0.55,
        -0.63, -0.55,
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        0.625, 0.135,
        0.045, -0.55,
        0.63, -0.55,
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        0.545, -0.275,
        -0.545 ,-0.275,
        0.02, -0.63,
        
    ]);

    draw_traingle(vertices);


    // Left eye
    gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);

    var vertices = new Float32Array([
        -0.385, 0.15,
        -0.165, 0.225,
        -0.163, 0.212,
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        -0.385, 0.15,
        -0.163, 0.212,
        -0.382, 0.138
        
    ]);

    draw_traingle(vertices);

    // Right eye
    gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);

    var vertices = new Float32Array([
        0.385, 0.15,
        0.165, 0.225,
        0.163, 0.212,
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        0.385, 0.15,
        0.163, 0.212,
        0.382, 0.138
        
    ]);

    draw_traingle(vertices);

    // Mouth 
    gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);

    var vertices = new Float32Array([
        -0.2, -0.07,
        0.22, -0.05,
        0.22, -0.07
        
    ]);

    draw_traingle(vertices);

    var vertices = new Float32Array([
        -0.2, -0.07,
        0.22, -0.07,
        -0.2, -0.09
        
    ]);

    draw_traingle(vertices);


    // Teeth

    gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);

    var vertices = new Float32Array([
        -0.16, -0.076,
        -0.094, -0.06,
        -0.135, 0.0045,
        
    ]);

    draw_traingle(vertices);

    gl.uniform4f(u_FragColor, 1, 1, 1, 1.0);

    var vertices = new Float32Array([
        -0.15, -0.075,
        -0.095, -0.07,
        -0.14, 0.005,
        
    ]);

    draw_traingle(vertices);

    gl.uniform4f(u_FragColor, 0, 0, 0, 1.0);

    var vertices = new Float32Array([
        0.16, -0.05,
        0.094, -0.06,
        0.12, 0.0045,
        
    ]);

    draw_traingle(vertices);

    gl.uniform4f(u_FragColor, 1, 1, 1, 1.0);

    var vertices = new Float32Array([
        0.15, -0.06,
        0.095, -0.07,
        0.12, 0.005,
        
    ]);

    draw_traingle(vertices);


    

    


    var vertices = new Float32Array([
        -0.2, -0.07,
        0.24, -0.07,
        -0.2, -0.09
        
    ]);

    // draw_traingle(vertices);


    

}

// Add function to draw the shape based on the shape button selected

draw_things = (e) => {

    var rect = e.target.getBoundingClientRect();

    gl.uniform4f(u_FragColor, red_slider.value / 10, green_slider.value / 10, blue_slider.value / 10, 1.0);

    if (rect.width == 400 && rect.height == 400) {
        // console.log(x)
        // console.log(rect.left, rect.height, rect.width, rect.top)

        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

        if (which_button == 4) {
            console.log(x, y)
        }
        if (which_button == 0) {
            size = size_slider.value / 100
            var vertices = new Float32Array([
                x, y - size,
                x - size, y + size,
                x + size, y + size
            ]);

            draw_traingle(vertices);

        }

        else if (which_button == 1) {
            // g_points.push([x, y]);

            // g_colors.push([red_slider.value / 10, green_slider.value / 10, blue_slider.value / 10, 1.0])
            // g_sizes.push(size_slider.value)
            // // g_colors.push([[red_slider.value]]
            // // console.log(red_slider.value)
            // // // Store the coordinates to g_points array
            // // if (x >= 0.0 && y >= 0.0) {      // First quadrant
            // //     g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
            // // } else if (x < 0.0 && y < 0.0) { // Third quadrant
            // //     g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
            // // } else {                         // Others
            // //     g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
            // // }
            // // Clear <canvas>
            // gl.clear(gl.COLOR_BUFFER_BIT);

            // var len = g_points.length;
            // for (var i = 0; i < len; i++) {
            //     var xy = g_points[i];
            //     var rgba = g_colors[i];
            //     var size = g_sizes[i];

            //     // Pass the position of a point to a_Position variable
            //     gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
            //     gl.vertexAttrib1f(a_size, size);

            //     // Pass the color of a point to u_FragColor variable
            //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            //     // Draw
            //     gl.drawArrays(gl.POINTS, 0, 1);
            // }

            no_of_segments = 4
            step = 360 / no_of_segments
            console.log(step)
            size = 10 - size_slider.value / 10
            console.log(size)
            for (var i = 0; i <= 360; i += step) {

                // var i = 0
                var vertices = new Float32Array([
                    x, y,
                    x + (Math.cos(toRadians(i))) / size, y + (Math.sin(toRadians(i))) / size,
                    x + (Math.cos(toRadians(i) + toRadians(step))) / size, y + (Math.sin(toRadians(i) + toRadians(step))) / size
                ]);
                draw_traingle(vertices)
                // var vertices = new Float32Array([
                //     0, 0,  Math.cos(120),  Math.sin(120),  Math.cos(120 + step),  Math.sin(120 + step)
                // ]);
                // // draw_traingle(vertices)
                // console.log(vertices)
            }

            // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            // // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            // // if (a_Position < 0) {
            // //     console.log('Failed to get the storage location of a_Position');
            // //     return -1;
            // // }
            // // Assign the buffer object to a_Position variable
            // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

            // // Enable the assignment to a_Position variable
            // gl.enableVertexAttribArray(a_Position);

            // // gl.clear(gl.COLOR_BUFFER_BIT);
            // // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            // // Draw the rectangle
            // gl.drawArrays(gl.TRIANGLES, 0, n);
        }

        else if (which_button == 2) {
            no_of_segments = segment_slider.value
            if (no_of_segments == 1) {
                size = size_slider.value / 100
                var vertices = new Float32Array([
                    x, y - size, x - size, y + size, x + size, y + size
                ]);

                draw_traingle(vertices);
            }

            step = 360 / no_of_segments
            console.log(step)
            size = 10 - size_slider.value / 10
            for (var i = 0; i <= 360; i += step) {

                // var i = 0
                var vertices = new Float32Array([
                    x, y,
                    x + (Math.cos(toRadians(i))) / size, y + (Math.sin(toRadians(i))) / size,
                    x + (Math.cos(toRadians(i) + toRadians(step))) / size, y + (Math.sin(toRadians(i) + toRadians(step))) / size
                ]);
                draw_traingle(vertices)
                // var vertices = new Float32Array([
                //     0, 0,  Math.cos(120),  Math.sin(120),  Math.cos(120 + step),  Math.sin(120 + step)
                // ]);
                // // draw_traingle(vertices)
                // console.log(vertices)
            }

        }


    }
}

// Set mousedown var to 1 and call draw things when mouse is clicked

document.addEventListener('mousedown', (e) => {
    mouseDown = 1;
    // console.log(x)
    // if (x > 760 && x < 1160 && y < 405) {
    //     // console.log(y)
    //     // console.log(slider.value)

    // }

    draw_things(e)
});

// Check when mouse is released after clicking

document.addEventListener('mouseup', () => {
    mouseDown = 0;
});

// Add sleep timer to give gap between two different shapes when mouse is dragged
var sleep_timer = 0

// Check when mouse is moved and mouse is clicked to call draw things

document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if (mouseDown == 1 && sleep_timer % 40 == 0) {
        draw_things(e)
    }

    sleep_timer += 1;
    // draw_things(e)
    // console.log(getMouseX())
}, false)

getMouseX = () => {
    return x;
}

getMouseY = () => {
    return y;
}

// button.onclick = () => {

// }

function main() {

    setup_webgl()
    connect_var_to_GLSL()

    // Specify the color for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);


}
