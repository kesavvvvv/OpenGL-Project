// DrawRectangle.js

var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    attribute float a_size;
    uniform mat4 u_model_matrix;
    uniform mat4 u_global_rotation_matrix;
    uniform mat4 u_view_matrix;
    uniform mat4 u_projection_matrix;
    void main() {
        gl_Position = u_projection_matrix * u_view_matrix * u_global_rotation_matrix * u_model_matrix * a_Position;
        gl_PointSize = a_size;
        v_UV = a_UV;
    }
`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform int u_which_texture;
    void main() {

        if (u_which_texture == -2) {
            gl_FragColor = u_FragColor;
        } 
        else if (u_which_texture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        } 
        else if (u_which_texture == 0) {
            vec4 color0 = texture2D(u_Sampler0, v_UV);
            gl_FragColor = color0;
        } 
        else if (u_which_texture == 1) {
            vec4 color1 = texture2D(u_Sampler1, v_UV);
            gl_FragColor = color1;
        } 
        else if (u_which_texture == 2) {
            vec4 color2 = texture2D(u_Sampler2, v_UV);
            gl_FragColor = color2;
        } 
        else if (u_which_texture == 3) {
            vec4 color3 = texture2D(u_Sampler3, v_UV);
            gl_FragColor = color3;
        } 
        else {
            gl_FragColor = vec4(1, 0.2, 0.2, 1);
        }

        
    }
`

var g_globalX = 1.15;
var g_globalY = 0;

var g_prevX = 0;
var g_prevY = 0;

let canvas, gl, a_position, a_size, u_fragcolor, a_UV, v_UV

function rad(x) {
    return x * Math.PI / 180
}

Math.clamp = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function initTextures(gl, n) {
    // Create a texture object
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    var texture2 = gl.createTexture();
    var texture3 = gl.createTexture();

    // Get the storage location of u_Sampler0 and u_Sampler1
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }

    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');

    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
    }

    var u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');

    if (!u_Sampler3) {
        console.log('Failed to get the storage location of u_Sampler3');
        return false;
    }

    // Create the image object
    var image0 = new Image();
    var image1 = new Image();
    var image2 = new Image();
    var image3 = new Image();
    
    // Register the event handler to be called when image loading is completed
    image0.onload = function () { loadTexture(gl, n, texture0, u_Sampler0, image0, 0); };
    image1.onload = function () { loadTexture(gl, n, texture1, u_Sampler1, image1, 1); };
    image2.onload = function () { loadTexture(gl, n, texture2, u_Sampler2, image2, 2); };
    image3.onload = function () { loadTexture(gl, n, texture3, u_Sampler3, image3, 3); };
    // Tell the browser to load an Image
    image0.src = 'resources/nether.png';
    image1.src = 'resources/lava.png';
    image2.src = 'resources/quartz.png';
    image3.src = 'resources/magma.png';
    

    return true;
}

// Specify whether the texture unit is ready to use
var g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
    // Make the texture unit active
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
    } 
    else if (texUnit == 1) {
        gl.activeTexture(gl.TEXTURE1);
    }
    else if (texUnit == 2) {
        gl.activeTexture(gl.TEXTURE2);
    }
    else if (texUnit == 3) {
        gl.activeTexture(gl.TEXTURE3);
    }
    
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, texUnit);   // Pass the texure unit to u_Sampler

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // if (g_texUnit0 && g_texUnit1) {
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);   // Draw the rectangle
    // }
}

function convertCoordinatesEventsToGL(ev) {

    return ([x, y]);
}



function setView() {
    var viewMat = new Matrix4()
    viewMat.rotate(-g_globalY * 100, 1, 0, 0);
    viewMat.rotate(-g_globalX * 50, 0, 1, 0);
    // var zoomMat = new Matrix4();
    // zoomMat.scale(g_zoom, g_zoom, g_zoom);
    // console.log(g_globalX, g_globalY)
    gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
    // gl.uniformMatrix4fv(u_ZoomMatrix, false, zoomMat.elements);
}

var is_mouse_down = 0
var is_shift_down = 0



document.onmousedown = (e) => {
    is_mouse_down = 1
    if (e.shiftKey) {
        if (is_shift_down) {
            is_shift_down = 0
        }
        else {
            is_shift_down = 1
        }
    }
}

document.onmouseup = () => {
    is_mouse_down = 0
}
document.onclick = () => {
    setView()
}

document.onmousemove = (e) => {
    if (is_mouse_down) {
        // console.log("working")
        changeView(e)
        setView()
    }
    // console.log(g_globalY)
    //     if(g_globalY < 0) {

    //     }
}



var should_i_animate = 1
document.getElementById("animate").onclick = () => {
    if (should_i_animate)
        should_i_animate = 0
    else
        should_i_animate = 1
}

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

    gl.enable(gl.DEPTH_TEST)
    // gl.depthMask(gl.FALSE)

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

    a_UV = gl.getAttribLocation(gl.program, 'a_UV')
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }


    if (a_size < 0) {
        console.log('Failed to get the storage location of a_size');
        return;
    }

    u_model_matrix = gl.getUniformLocation(gl.program, 'u_model_matrix')

    if (!u_model_matrix) {
        console.log('Failed to get the storage location of u_model_matrix');
        return;

    }

    u_view_matrix = gl.getUniformLocation(gl.program, 'u_view_matrix')

    if (!u_view_matrix) {
        console.log('Failed to get the storage location of u_view_matrix');
        return;

    }

    u_projection_matrix = gl.getUniformLocation(gl.program, 'u_projection_matrix')

    if (!u_projection_matrix) {
        console.log('Failed to get the storage location of u_projection_matrix');
        return;

    }

    var identity = new Matrix4()

    gl.uniformMatrix4fv(u_model_matrix, false, identity.elements)

    u_global_rotation_matrix = gl.getUniformLocation(gl.program, 'u_global_rotation_matrix')

    if (!u_global_rotation_matrix) {
        console.log('Failed to get the storage location of u_global_rotation_matrix');
        return;

    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_which_texture = gl.getUniformLocation(gl.program, 'u_which_texture');

    if (!u_which_texture) {
        console.log('Failed to get the storage location of u_which_texture');
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
const camera_angle_slider = document.getElementById('camera_angle');



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
// clear_button.onclick = () => {
//     g_points = [];
//     g_colors = [];
//     g_sizes = [];
//     gl.clear(gl.COLOR_BUFFER_BIT);

// }


// Add code to draw a triangle when vertices are passed

var g_start_time
var g_seconds

draw_traingle_3d_uv = (vertices, uv) => {
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0) {
    //     console.log('Failed to get the storage location of a_Position');
    //     return -1;
    // }
    // Assign the buffer object to a_Position variable

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Create a buffer object
    var uvBuffer = gl.createBuffer();

    if (!uvBuffer) {
        console.log('Failed to create the uv buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0) {
    //     console.log('Failed to get the storage location of a_Position');
    //     return -1;
    // }
    // Assign the buffer object to a_Position variable

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);


    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

draw_traingle_3d = (vertices) => {
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0) {
    //     console.log('Failed to get the storage location of a_Position');
    //     return -1;
    // }
    // Assign the buffer object to a_Position variable

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

var i = 0.75, l = 0, leg_angle = 0, sword_angle_kill = 60, reverse = 0
var kill_time = 0
var max_kill_time = Math.floor(Math.random() * (50 - 20 + 1) + 20)
var bomb_size = 0
var jump_distance = 0.6
var reverse_jump = 0
var sword_base_kill = 90
var sword_angle_kill_1 = 60
var lastCalledTime;
var counter = 0;
var fpsArray = [];

tick = () => {

    var kesav_time_start = performance.now() / 1000.0
    var fps;

    if (!lastCalledTime) {
        lastCalledTime = new Date().getTime();
        fps = 0;
    }

    if (should_i_animate) {
        render_scene()
    }
    else {
        no_animate()
    }

    l += 1

    var delta = (new Date().getTime() - lastCalledTime) / 1000;
    lastCalledTime = new Date().getTime();
    fps = Math.ceil((1 / delta));

    if (counter >= 60) {
        var sum = fpsArray.reduce(function (a, b) { return a + b });
        var average = Math.ceil(sum / fpsArray.length);
        counter = 0;
    } else {
        if (fps !== Infinity) {
            fpsArray.push(fps);
            // console.log(fps)
            document.getElementById("fps").innerHTML = fps
        }

        counter++;
    }


    var kesav_time_end = (performance.now() / 1000.0);
    requestAnimationFrame(tick)
}

var change_camera_angle = 1

var camera_change_x = 1.15
var camera_change_y = 0

var camera_eye = new Vector3(0, 0, 100);
camera_eye.elements[0] = 0
camera_eye.elements[1] = 0.5
camera_eye.elements[2] = 3
var camera_at = new Vector3(0, 0, -10)
camera_at.elements[0] = 0
camera_at.elements[1] = 0
camera_at.elements[2] = -100
var camera_up = new Vector3(0, 1, 0)
camera_up.elements[0] = 0
camera_up.elements[1] = 1
camera_up.elements[2] = 0

var d = new Vector3()

function startView(ev) {
    let v = convertCoordinatesEventsToGL(ev)
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_prevX = x;
    g_prevY = y;
}

function changeView(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    
    if(x<g_prevX) {
        var pl = new Vector3;
        pl.set(camera_at);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(1, camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);
    }
    if(x>g_prevX) {
        var pl = new Vector3;
        pl.set(camera_at);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(-1, camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);
    }
    if(y>g_prevY) {
        var pl = new Vector3;
        var nv = new Vector3([0,1,0]);
        pl.set(camera_at);
        pl.add(nv);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);
    }
    if(y<g_prevY) {
        var pl = new Vector3;
        var nv = new Vector3([0,1,0]);
        pl.set(camera_at);
        pl.sub(nv);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);
    }

    g_prevX = x;
    g_prevY = y;
}

document.onkeydown = (e) => {

    if (e.key == 'w') {
        d.elements[0] = camera_at.elements[0]
        d.elements[1] = camera_at.elements[1]
        d.elements[2] = camera_at.elements[2]
        d.sub(camera_eye)
        d.normalize()

        camera_eye.add(d)
        if(camera_eye.elements[1] < 0.5) {
            camera_eye.elements[1] = 0.5
        }
        camera_at.add(d)
    }
    if (e.key == 's') {
        d.elements[0] = camera_at.elements[0]
        d.elements[1] = camera_at.elements[1]
        d.elements[2] = camera_at.elements[2]
        d.sub(camera_eye)
        d.normalize()

        camera_eye.sub(d)
        if(camera_eye.elements[1] < 0.5) {
            camera_eye.elements[1] = 0.5
        }
        camera_at.sub(d)
    }
    if (e.key == 'd') {
        d.elements[0] = camera_at.elements[0]
        d.elements[1] = camera_at.elements[1]
        d.elements[2] = camera_at.elements[2]
        d.sub(camera_eye)
        d.normalize()

        // camera_eye.add(d)
        // camera_at.add(d)

        var left = new Vector3() 
        left = Vector3.cross(d, camera_up)

        camera_eye.add(left)
        camera_at.add(left)
    }
    if (e.key == 'a') {
        d.elements[0] = camera_at.elements[0]
        d.elements[1] = camera_at.elements[1]
        d.elements[2] = camera_at.elements[2]
        d.sub(camera_eye)
        d.normalize()

        var right = new Vector3() 
        right = Vector3.cross(d, camera_up)

        camera_eye.sub(right)
        camera_at.sub(right)
    }
    if (e.key == 'ArrowLeft') {
        var pl = new Vector3;
        pl.set(camera_at);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(1, camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);

    }
    if (e.key == 'ArrowRight') {
        var pl = new Vector3;
        pl.set(camera_at);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(-1, camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);

		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);

    }
    if (e.key == 'q') {
        var pl = new Vector3;
        pl.set(camera_at);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(1, camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);

    }
    if (e.key == 'e') {
        var pl = new Vector3;
        pl.set(camera_at);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(-1, camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);

    }

    if(e.key == 'ArrowUp') {
        var pl = new Vector3;
        var nv = new Vector3([0,1,0]);
        pl.set(camera_at);
        pl.add(nv);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);
    }

    if(e.key == 'ArrowDown') {
        var pl = new Vector3;
        var nv = new Vector3([0,1,0]);
        pl.set(camera_at);
        pl.sub(nv);
        pl.sub(camera_eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		let d = rotationMatrix.multiplyVector3(pl);
		camera_at = d.add(camera_eye);
    }
}

map = [
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

draw_map = () => {
    for(x=0;x<32;x++) {
        for(y=0;y<32;y++) {
            if(map[x][y]) {
                var block = new Cubes()
                block.color = [1,1,1,1]
                block.texture_num = 3;
                block.matrix.scale(0.5,0.5,0.5)
                block.matrix.translate(x-16, -1.75, y-16)
                block.render()
            }
        }
    }
}

render_scene = () => {

    var kesav_time_start = performance.now() / 1000.0

    var proj_matrix = new Matrix4();
    proj_matrix.setPerspective(50, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_projection_matrix, false, proj_matrix.elements);
    // Pass the view matrix
    var view_matrix = new Matrix4();
    // console.log(camera_eye.elements[2])
    view_matrix.setLookAt(camera_eye.elements[0], camera_eye.elements[1], camera_eye.elements[2], camera_at.elements[0], camera_at.elements[1], camera_at.elements[2], camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
    // view_matrix.setLookAt(camera_eye[0], camera_eye[1], camera_eye[2], camera_at[0], camera_at[1], camera_at[2], camera_up[0], camera_up[1], camera_up[2]);
    gl.uniformMatrix4fv(u_view_matrix, false, view_matrix.elements);

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)
    
    

    if (l % 10 == 0 && i > -0.21) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT)
        
        var floor = new Cubes()
        floor.color = [1,0,0,1]
        floor.texture_num = 0;
        floor.matrix.translate(0, -0.8, 0.0)
        floor.matrix.scale(50, 0, 50)
        floor.matrix.translate(-0.5, 0, -0.5)
        floor.render()

        var sky = new Cubes()
        sky.color = [1,0,0,1]
        sky.texture_num = 1;
        sky.matrix.scale(50, 50, 50)
        sky.matrix.translate(-0.5, -0.5, -0.5)
        sky.render()

        draw_map()

        animate()
        // animate_pig()
        i -= 0.05
        leg_angle += 15
        if (leg_angle == 60) {
            leg_angle = 0
        }

        // console.log(i)
    }
    if (l % 10 == 0 && i < -0.21 && kill_time < max_kill_time) {
        // if (camera_change_x > -0.1) {
            // var viewMat = new Matrix4()
            // viewMat.rotate(-camera_change_y * 100, 1, 0, 0);
            // viewMat.rotate(-camera_change_x * 50, 0, 1, 0);
            // camera_change_x -= 0.2
            // camera_change_y += 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            // gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            // change_camera_angle = 0
        // }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT)

        var floor = new Cubes()
        floor.color = [1,0,0,1]
        floor.texture_num = 0;
        floor.matrix.translate(0, -0.8, 0.0)
        floor.matrix.scale(50, 0, 50)
        floor.matrix.translate(-0.5, 0, -0.5)
        floor.render()
        
        var sky = new Cubes()
        sky.color = [1,0,0,1]
        sky.texture_num = 1;
        sky.matrix.scale(50, 50, 50)
        sky.matrix.translate(-0.5, -0.5, -0.5)
        sky.render()

        draw_map()

        animate_killing()
        if (reverse == 0) {
            sword_angle_kill -= 20

        }
        else {
            sword_angle_kill += 20

        }

        if (sword_angle_kill == 0) {
            reverse = 1
        }
        if (sword_angle_kill == 60) {
            reverse = 0
        }
        kill_time += 1

        // console.log(max_kill_time)



    }
    if (l % 10 == 0 && kill_time == max_kill_time && bomb_size < 2) {
        // if (camera_change_y < 1.15) {
            // var viewMat = new Matrix4()
            // viewMat.rotate(-camera_change_y * 100, 1, 0, 0);
            // viewMat.rotate(-camera_change_x * 50, 0, 1, 0);
            // camera_change_x += 0.2
            // camera_change_y -= 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            // gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            // change_camera_angle = 2
        // }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT)
        var floor = new Cubes()
    floor.color = [1,0,0,1]
    floor.texture_num = 0;
    floor.matrix.translate(0, -0.8, 0.0)
    floor.matrix.scale(50, 0, 50)
    floor.matrix.translate(-0.5, 0, -0.5)
    floor.render()

    var sky = new Cubes()
        sky.color = [1,0,0,1]
        sky.texture_num = 1;
        sky.matrix.scale(50, 50, 50)
        sky.matrix.translate(-0.5, -0.5, -0.5)
        sky.render()

        draw_map()

        animate_pig_dead()
        // console.log(bomb_size)
        bomb_size += 0.5
    }

    if (bomb_size > 1.5 && bomb_size < 10.5) {
        // if (camera_change_y < 1.15) {
            // var viewMat = new Matrix4()
            // viewMat.rotate(-camera_change_y * 100, 1, 0, 0);
            // viewMat.rotate(-camera_change_x * 50, 0, 1, 0);
            // camera_change_x += 0.2
            // camera_change_y -= 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            // gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            // change_camera_angle = 2
        // }
        gl.clearColor(206 / 255, 123 / 255, 119 / 255, 1);

        // Clear <canvas>
        // gl.clear(gl.COLOR_BUFFER_BIT);

        bomb_size += 0.1
    }

    // console.log(bomb_size)
    if (l % 10 == 0 && bomb_size > 10.4) {
        // if (change_camera_angle == 2) {
            // var viewMat = new Matrix4()
            // viewMat.rotate(-0 * 100, 1, 0, 0);
            // viewMat.rotate(-1.15 * 50, 0, 1, 0);
            // camera_change_x += 0.2
            // camera_change_y -= 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            // gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            // change_camera_angle = 3
        // }
        gl.clearColor(0.5, 0.5, 0.5, 1);

        // Clear <canvas>
        // gl.clear(gl.COLOR_BUFFER_BIT);

        // console.log(is_shift_down)
        if (is_shift_down) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT)
        var floor = new Cubes()
    floor.color = [1,0,0,1]
    floor.texture_num = 0;
    floor.matrix.translate(0, -0.8, 0.0)
    floor.matrix.scale(50, 0, 50)
    floor.matrix.translate(-0.5, 0, -0.5)
    floor.render()

    var sky = new Cubes()
        sky.color = [1,0,0,1]
        sky.texture_num = 1;
        sky.matrix.scale(50, 50, 50)
        sky.matrix.translate(-0.5, -0.5, -0.5)
        sky.render()

        draw_map()

            animate_steve_pork_chop_no_jump()
        }
        else {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT)
        var floor = new Cubes()
    floor.color = [1,0,0,1]
    floor.texture_num = 0;
    floor.matrix.translate(0, -0.8, 0.0)
    floor.matrix.scale(50, 0, 50)
    floor.matrix.translate(-0.5, 0, -0.5)
    floor.render()

    var sky = new Cubes()
        sky.color = [1,0,0,1]
        sky.texture_num = 1;
        sky.matrix.scale(50, 50, 50)
        sky.matrix.translate(-0.5, -0.5, -0.5)
        sky.render()

        draw_map()

            animate_steve_pork_chop()
        }



        if (reverse_jump == 0) {
            jump_distance -= 0.03
            sword_angle_kill_1 -= 20
            sword_base_kill += 10
        }
        else {
            jump_distance += 0.03
            sword_base_kill -= 10
            sword_angle_kill_1 += 20
        }

        if (jump_distance < 0.5) {
            reverse_jump = 1
        }
        if (jump_distance > 0.6) {
            reverse_jump = 0
        }

        // console.log("jump distance" + reverse_jump)
        // kill_time += 1
    }


    var kesav_time_end = (performance.now() / 1000.0);
    // var lastTime = new Date().getTime();
    // console.log(lastTime, now)
    // console.log(kesav_time_start - kesav_time_end)
    // document.getElementById("fps").innerHTML = Math.floor(1.0 / (kesav_time_end-kesav_time_start))


}

animate_bomb = () => {

    var bomb = new Cubes()

    // bomb.color = [1.0, 0.5, 0.5, 1.0]

    // for(let bomb_angle = -90; bomb_angle < 90; bomb_angle += 1) {

    //     bomb = new Cubes()
    //     bomb.color = [206/255, 123/255, 119/255, 1]
    //     bomb.matrix.translate(-0.5, -0.6, 0.0)

    //     bomb.matrix.rotate(90, 0, 1, 0)
    //     bomb.matrix.rotate(90, 0, 0, 1)
    //     bomb.matrix.rotate(-bomb_angle, 0, 0, 1)
    //     // var bomb_matrix = new Matrix4(bomb.matrix)
    //     bomb.matrix.scale(.1, bomb_size, .1)

    //     bomb.render()
    // }

    for (let bomb_angle = 0; bomb_angle < 360; bomb_angle += 1) {

        bomb = new Cubes()
        bomb.color = [206 / 255, 123 / 255, 119 / 255, 1]
        bomb.matrix.translate(-1, -0.6, 0.0)

        bomb.matrix.rotate(90, 0, 1, 0)
        bomb.matrix.rotate(90, 0, 0, 1)
        bomb.matrix.rotate(-bomb_angle, 0, 0, 1)
        // var bomb_matrix = new Matrix4(bomb.matrix)
        bomb.matrix.scale(.1, bomb_size, .1)

        bomb.render()
    }




}

animate_pig = () => {

    // gl.clear(gl.COLOR_BUFFER_BIT)


    var pig_body = new Cubes()

    // pig_body.color = [1.0, 0.5, 0.5, 1.0]
    pig_body.color = [206 / 255, 123 / 255, 119 / 255, 1]



    pig_body.matrix.translate(-0.7, -0.6, 0.0)

    pig_body.matrix.rotate(90, 0, 1, 0)
    pig_body.matrix.rotate(90, 0, 0, 1)
    var pig_body_matrix = new Matrix4(pig_body.matrix)
    pig_body.matrix.scale(.15, .3, .15)

    pig_body.render()


    var pig_head = new Cubes()

    pig_head.color = [206 / 255, 123 / 255, 119 / 255, 1.0]
    pig_head.matrix = new Matrix4(pig_body_matrix)
    pig_head.matrix.translate(0.04, 0.3, 0.0)
    pig_head_matrix = new Matrix4(pig_head.matrix)
    pig_head.matrix.scale(.2, .12, .15)

    pig_head.render()

    var pig_l_arm = new Cubes()

    pig_l_arm.color = [206 / 255, 123 / 255, 119 / 255, 1.0]

    // // pig_l_arm.matrix.rotate(180, 0, 1, 0)

    // pig_l_arm.matrix.rotate(-blue_slider.value, 0, 0, 1)
    pig_l_arm.matrix = new Matrix4(pig_body_matrix)
    pig_l_arm.matrix.translate(0, 0.3, 0.05)
    pig_l_arm.matrix.rotate(90, 1, 0, 0)
    pig_l_arm.matrix.rotate(-90, 0, 0, 1)
    pig_l_arm.matrix.rotate(180, 1, 0, 0)
    pig_l_arm.matrix.rotate(90, 0, 1, 0)
    pig_l_arm.matrix.scale(.05, .2, .05)

    pig_l_arm.render()

    var pig_r_arm = new Cubes()

    pig_r_arm.color = [206 / 255, 123 / 255, 119 / 255, 1.0]

    pig_r_arm.matrix = new Matrix4(pig_body_matrix)
    pig_r_arm.matrix.translate(0, 0.3, 0.15)
    pig_r_arm.matrix.rotate(90, 1, 0, 0)
    pig_r_arm.matrix.rotate(-90, 0, 0, 1)
    pig_r_arm.matrix.rotate(180, 1, 0, 0)
    pig_r_arm.matrix.rotate(90, 0, 1, 0)
    pig_r_arm.matrix.scale(.05, .2, .05)

    pig_r_arm.render()

    var pig_l_leg = new Cubes()

    pig_l_leg.color = [206 / 255, 123 / 255, 119 / 255, 1.0]

    pig_l_leg.matrix = new Matrix4(pig_body_matrix)
    pig_l_leg.matrix.translate(0, 0.05, 0.05)
    pig_l_leg.matrix.rotate(90, 1, 0, 0)
    pig_l_leg.matrix.rotate(-90, 0, 0, 1)
    pig_l_leg.matrix.rotate(180, 1, 0, 0)
    pig_l_leg.matrix.rotate(90, 0, 1, 0)
    pig_l_leg.matrix.scale(.05, .2, .05)

    pig_l_leg.render()

    var pig_r_leg = new Cubes()

    pig_r_leg.color = [206 / 255, 123 / 255, 119 / 255, 1.0]

    pig_r_leg.matrix = new Matrix4(pig_body_matrix)

    pig_r_leg.matrix.translate(0, 0.05, 0.15)

    pig_r_leg.matrix.rotate(90, 1, 0, 0)
    pig_r_leg.matrix.rotate(-90, 0, 0, 1)
    pig_r_leg.matrix.rotate(180, 1, 0, 0)
    pig_r_leg.matrix.rotate(90, 0, 1, 0)
    pig_r_leg.matrix.scale(.05, .2, .05)

    pig_r_leg.render()

    // var r_leg = new Cubes()

    // r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    // r_leg.matrix = new Matrix4(body_matrix)
    // r_leg.matrix.translate(0.1, 0, 0)
    // // r_leg.matrix.rotate(180, 0, 1, 0)

    // // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    // r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    // r_leg.matrix.rotate(180, 1, 0, 0)
    // r_leg.matrix.rotate(90, 0, 1, 0)
    // r_leg.matrix.scale(.05, .2, .05)

    // r_leg.render()

    // var pig_r_leg = new Cubes()

    // pig_r_leg.color = [206/255, 123/255, 119/255, 1.0]

    // pig_r_leg.matrix = new Matrix4(body_matrix)
    // pig_r_leg.matrix.translate(0.1, 0, 0)
    // // pig_r_leg.matrix.rotate(180, 0, 1, 0)

    // // pig_r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    // pig_r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    // pig_r_leg.matrix.rotate(180, 1, 0, 0)
    // pig_r_leg.matrix.rotate(90, 0, 1, 0)
    // pig_r_leg.matrix.scale(.15, .2, .05)

    // pig_r_leg.render()

    // var pig_l_leg = new Cubes()

    // pig_l_leg.color = [206/255, 123/255, 119/255, 1.0]

    // pig_l_leg.matrix = new Matrix4(body_matrix)
    // pig_l_leg.matrix.translate(0, 0, 0)
    // // // pig_l_leg.matrix.rotate(180, 0, 1, 0)
    // // pig_l_leg.matrix.rotate(120, 0, 0, 1)
    // // pig_l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    // pig_l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    // pig_l_leg.matrix.rotate(180, 1, 0, 0)
    // pig_l_leg.matrix.rotate(90, 0, 1, 0)

    // pig_l_leg.matrix.scale(.15, .2, .05)

    // pig_l_leg.render()

}
animate_killing = () => {
    // var rect = e.target.getBoundingClientRect();

    // gl.uniform4f(u_FragColor, red_slider.value / 10, green_slider.value / 10, blue_slider.value / 10, 1.0);






    // if (rect.width == 400 && rect.height == 400) {
    // // console.log(x)
    // // console.log(rect.left, rect.height, rect.width, rect.top)

    // x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    // y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);


    // 
    var k = 0

    // while(i>0) {
    // console.log(k)
    // if(k % 10 == 0) {
    // console.log(g_seconds)
    // for (let j = 0; j < 100; i++) {
    //     k = j
    //   }
    // gl.clear(gl.COLOR_BUFFER_BIT)




    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    animate_pig()



    var body = new Cubes()

    // body.color = [1.0, 0.5, 0.5, 1.0]
    body.color = [99 / 255, 191 / 255, 191 / 255, 1]



    body.matrix.translate(-0.2, -0.6, 0.0)

    body.matrix.rotate(90, 0, 1, 0)
    var body_matrix = new Matrix4(body.matrix)
    body.matrix.scale(.15, .3, .05)

    body.render()

    var head = new Cubes()

    head.color = [239 / 255, 198 / 255, 157 / 255, 1.0]
    head.matrix = new Matrix4(body_matrix)
    head.matrix.translate(0.02, 0.3, 0.0)
    head_matrix = new Matrix4(head.matrix)
    head.matrix.scale(.12, .12, .05)

    head.render()


    var l_eye = new Cubes()

    l_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    l_eye.matrix = new Matrix4(head_matrix)
    l_eye.matrix.translate(0.04, 0.08, -0.013)
    l_eye.matrix.scale(.01, .01, .01)

    l_eye.render()

    var r_eye = new Cubes()

    r_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    r_eye.matrix = new Matrix4(head_matrix)
    r_eye.matrix.translate(0.1, 0.08, -0.013)
    r_eye.matrix.scale(.01, .01, .01)

    r_eye.render()

    var mouth = new Cubes()

    mouth.color = [56 / 255, 44 / 255, 19 / 255, 1.0]
    mouth.matrix = new Matrix4(head_matrix)
    mouth.matrix.translate(0.05, 0.02, -0.013)
    mouth.matrix.scale(.05, .02, .01)

    mouth.render()

    var hair = new Cubes()


    hair.color = [59 / 255, 46 / 255, 20 / 255, 1.0]
    hair.matrix = new Matrix4(head_matrix)
    hair.matrix.translate(-0.005, 0.1, -0.015)
    hair.matrix.scale(.13, .05, .08)

    hair.render()


    var l_arm = new Cubes()

    l_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    // // l_arm.matrix.rotate(180, 0, 1, 0)

    // l_arm.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_arm.matrix = new Matrix4(body_matrix)
    l_arm.matrix.translate(0, 0.3, 0)
    l_arm.matrix.rotate(sword_angle_kill, 1, 0, 0)
    l_arm.matrix.rotate(150, 0, 0, 1)
    var l_arm_matrix = new Matrix4(l_arm.matrix)
    l_arm.matrix.scale(.05, .2, .05)

    l_arm.render()


    var l_sword_base = new Cubes()

    l_sword_base.color = [127 / 255, 109 / 255, 14 / 255, 1.0]

    // // l_sword_base.matrix.rotate(180, 0, 1, 0)

    // l_sword_base.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_base.matrix = new Matrix4(l_arm_matrix)
    l_sword_base.matrix.translate(-0.05, 0.2, 0)
    l_sword_base.matrix.rotate(90, 0, 1, 0)
    l_sword_base_matrix = new Matrix4(l_sword_base.matrix)
    l_sword_base.matrix.scale(.05, .05, .05)

    l_sword_base.render()


    var l_sword_handle = new Cubes()

    l_sword_handle.color = [44 / 255, 86 / 255, 73 / 255, 1.0]

    // // l_sword_handle.matrix.rotate(180, 0, 1, 0)

    // l_sword_handle.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_handle.matrix = new Matrix4(l_sword_base_matrix)
    l_sword_handle.matrix.translate(0.05, -0.05, 0)
    // l_sword_handle.matrix.rotate(90, 0, 1, 0)
    l_sword_handle_matrix = new Matrix4(l_sword_handle.matrix)
    l_sword_handle.matrix.scale(.05, .15, .05)

    l_sword_handle.render()

    var l_sword_body = new Cubes()

    l_sword_body.color = [104 / 255, 201 / 255, 169 / 255, 1.0]

    // // l_sword_body.matrix.rotate(180, 0, 1, 0)

    // l_sword_body.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_body.matrix = new Matrix4(l_sword_handle_matrix)
    l_sword_body.matrix.translate(0.05, 0.05, 0)
    // l_sword_body.matrix.rotate(90, 0, 1, 0)

    l_sword_body.matrix.scale(.25, .05, .05)

    l_sword_body.render()

    var r_arm = new Cubes()

    r_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    r_arm.matrix = new Matrix4(body_matrix)
    r_arm.matrix.translate(0.2, 0.3, 0)

    r_arm.matrix.rotate(50, 1, 0, 0)
    r_arm.matrix.rotate(150, 0, 0, 1)
    // r_arm.matrix.rotate(-180, 0, 0, 1)
    // r_arm.matrix.rotate(180, 0, 1, 0)
    r_arm.matrix.scale(.05, .2, .05)

    r_arm.render()

    var r_leg = new Cubes()

    r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    r_leg.matrix = new Matrix4(body_matrix)
    r_leg.matrix.translate(0.1, 0, 0)
    // r_leg.matrix.rotate(180, 0, 1, 0)

    // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    r_leg.matrix.rotate(180, 1, 0, 0)
    r_leg.matrix.rotate(90, 0, 1, 0)
    r_leg.matrix.scale(.05, .2, .05)

    r_leg.render()

    var l_leg = new Cubes()

    l_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    l_leg.matrix = new Matrix4(body_matrix)
    l_leg.matrix.translate(0, 0, 0)
    // // l_leg.matrix.rotate(180, 0, 1, 0)
    // l_leg.matrix.rotate(120, 0, 0, 1)
    // l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    l_leg.matrix.rotate(180, 1, 0, 0)
    l_leg.matrix.rotate(90, 0, 1, 0)

    l_leg.matrix.scale(.05, .2, .05)

    l_leg.render()




}

animate_pig_dead = () => {
    // var rect = e.target.getBoundingClientRect();

    // gl.uniform4f(u_FragColor, red_slider.value / 10, green_slider.value / 10, blue_slider.value / 10, 1.0);






    // if (rect.width == 400 && rect.height == 400) {
    // // console.log(x)
    // // console.log(rect.left, rect.height, rect.width, rect.top)

    // x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    // y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);



    var k = 0

    // while(i>0) {
    // console.log(k)
    // if(k % 10 == 0) {
    // console.log(g_seconds)
    // for (let j = 0; j < 100; i++) {
    //     k = j
    //   }
    // gl.clear(gl.COLOR_BUFFER_BIT)




    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    // animate_pig()

    animate_bomb()

    var body = new Cubes()

    // body.color = [1.0, 0.5, 0.5, 1.0]
    body.color = [99 / 255, 191 / 255, 191 / 255, 1]



    body.matrix.translate(-0.21, -0.6, 0.0)

    body.matrix.rotate(90, 0, 1, 0)
    var body_matrix = new Matrix4(body.matrix)
    body.matrix.scale(.15, .3, .05)

    body.render()

    var head = new Cubes()

    head.color = [239 / 255, 198 / 255, 157 / 255, 1.0]
    head.matrix = new Matrix4(body_matrix)
    head.matrix.translate(0.02, 0.3, 0.0)
    head_matrix = new Matrix4(head.matrix)
    head.matrix.scale(.12, .12, .05)

    head.render()


    var l_eye = new Cubes()

    l_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    l_eye.matrix = new Matrix4(head_matrix)
    l_eye.matrix.translate(0.04, 0.08, -0.013)
    l_eye.matrix.scale(.01, .01, .01)

    l_eye.render()

    var r_eye = new Cubes()

    r_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    r_eye.matrix = new Matrix4(head_matrix)
    r_eye.matrix.translate(0.1, 0.08, -0.013)
    r_eye.matrix.scale(.01, .01, .01)

    r_eye.render()

    var mouth = new Cubes()

    mouth.color = [56 / 255, 44 / 255, 19 / 255, 1.0]
    mouth.matrix = new Matrix4(head_matrix)
    mouth.matrix.translate(0.05, 0.02, -0.013)
    mouth.matrix.scale(.05, .02, .01)

    mouth.render()

    var hair = new Cubes()


    hair.color = [59 / 255, 46 / 255, 20 / 255, 1.0]
    hair.matrix = new Matrix4(head_matrix)
    hair.matrix.translate(-0.005, 0.1, -0.015)
    hair.matrix.scale(.13, .05, .08)

    hair.render()


    var l_arm = new Cubes()

    l_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    // // l_arm.matrix.rotate(180, 0, 1, 0)

    // l_arm.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_arm.matrix = new Matrix4(body_matrix)
    l_arm.matrix.translate(0, 0.3, 0)
    l_arm.matrix.rotate(60, 1, 0, 0)
    l_arm.matrix.rotate(150, 0, 0, 1)
    var l_arm_matrix = new Matrix4(l_arm.matrix)
    l_arm.matrix.scale(.05, .2, .05)

    l_arm.render()


    var l_sword_base = new Cubes()

    l_sword_base.color = [127 / 255, 109 / 255, 14 / 255, 1.0]

    // // l_sword_base.matrix.rotate(180, 0, 1, 0)

    // l_sword_base.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_base.matrix = new Matrix4(l_arm_matrix)
    l_sword_base.matrix.translate(-0.05, 0.2, 0)
    l_sword_base.matrix.rotate(90, 0, 1, 0)
    l_sword_base_matrix = new Matrix4(l_sword_base.matrix)
    l_sword_base.matrix.scale(.05, .05, .05)

    l_sword_base.render()


    var l_sword_handle = new Cubes()

    l_sword_handle.color = [44 / 255, 86 / 255, 73 / 255, 1.0]

    // // l_sword_handle.matrix.rotate(180, 0, 1, 0)

    // l_sword_handle.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_handle.matrix = new Matrix4(l_sword_base_matrix)
    l_sword_handle.matrix.translate(0.05, -0.05, 0)
    // l_sword_handle.matrix.rotate(90, 0, 1, 0)
    l_sword_handle_matrix = new Matrix4(l_sword_handle.matrix)
    l_sword_handle.matrix.scale(.05, .15, .05)

    l_sword_handle.render()

    var l_sword_body = new Cubes()

    l_sword_body.color = [104 / 255, 201 / 255, 169 / 255, 1.0]

    // // l_sword_body.matrix.rotate(180, 0, 1, 0)

    // l_sword_body.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_body.matrix = new Matrix4(l_sword_handle_matrix)
    l_sword_body.matrix.translate(0.05, 0.05, 0)
    // l_sword_body.matrix.rotate(90, 0, 1, 0)

    l_sword_body.matrix.scale(.25, .05, .05)

    l_sword_body.render()

    var r_arm = new Cubes()

    r_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    r_arm.matrix = new Matrix4(body_matrix)
    r_arm.matrix.translate(0.2, 0.3, 0)

    r_arm.matrix.rotate(50, 1, 0, 0)
    r_arm.matrix.rotate(150, 0, 0, 1)
    // r_arm.matrix.rotate(-180, 0, 0, 1)
    // r_arm.matrix.rotate(180, 0, 1, 0)
    r_arm.matrix.scale(.05, .2, .05)

    r_arm.render()

    var r_leg = new Cubes()

    r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    r_leg.matrix = new Matrix4(body_matrix)
    r_leg.matrix.translate(0.1, 0, 0)
    // r_leg.matrix.rotate(180, 0, 1, 0)

    // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    r_leg.matrix.rotate(180, 1, 0, 0)
    r_leg.matrix.rotate(90, 0, 1, 0)
    r_leg.matrix.scale(.05, .2, .05)

    r_leg.render()

    var l_leg = new Cubes()

    l_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    l_leg.matrix = new Matrix4(body_matrix)
    l_leg.matrix.translate(0, 0, 0)
    // // l_leg.matrix.rotate(180, 0, 1, 0)
    // l_leg.matrix.rotate(120, 0, 0, 1)
    // l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    l_leg.matrix.rotate(180, 1, 0, 0)
    l_leg.matrix.rotate(90, 0, 1, 0)

    l_leg.matrix.scale(.05, .2, .05)

    l_leg.render()




}

animate_steve_pork_chop = () => {


    var k = 0

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    var body = new Cubes()

    // body.color = [1.0, 0.5, 0.5, 1.0]
    body.color = [99 / 255, 191 / 255, 191 / 255, 1]



    body.matrix.translate(i, -jump_distance, 0.0)

    body.matrix.rotate(90, 0, 1, 0)
    var body_matrix = new Matrix4(body.matrix)
    body.matrix.scale(.15, .3, .05)

    body.render()

    var head = new Cubes()

    head.color = [239 / 255, 198 / 255, 157 / 255, 1.0]
    head.matrix = new Matrix4(body_matrix)
    head.matrix.translate(0.02, 0.3, 0.0)
    head_matrix = new Matrix4(head.matrix)
    head.matrix.scale(.12, .12, .05)

    head.render()


    var l_eye = new Cubes()

    l_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    l_eye.matrix = new Matrix4(head_matrix)
    l_eye.matrix.translate(0.04, 0.08, -0.013)
    l_eye.matrix.scale(.01, .01, .01)

    l_eye.render()

    var r_eye = new Cubes()

    r_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    r_eye.matrix = new Matrix4(head_matrix)
    r_eye.matrix.translate(0.1, 0.08, -0.013)
    r_eye.matrix.scale(.01, .01, .01)

    r_eye.render()

    var mouth = new Cubes()

    mouth.color = [56 / 255, 44 / 255, 19 / 255, 1.0]
    mouth.matrix = new Matrix4(head_matrix)
    mouth.matrix.translate(0.05, 0.02, -0.013)
    mouth.matrix.scale(.05, .02, .01)

    mouth.render()

    var hair = new Cubes()


    hair.color = [59 / 255, 46 / 255, 20 / 255, 1.0]
    hair.matrix = new Matrix4(head_matrix)
    hair.matrix.translate(-0.005, 0.1, -0.015)
    hair.matrix.scale(.13, .05, .08)

    hair.render()


    var l_arm = new Cubes()

    l_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    // // l_arm.matrix.rotate(180, 0, 1, 0)

    // l_arm.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_arm.matrix = new Matrix4(body_matrix)
    l_arm.matrix.translate(0, 0.3, 0)
    l_arm.matrix.rotate(sword_angle_kill_1, 1, 0, 0)
    l_arm.matrix.rotate(150, 0, 0, 1)
    var l_arm_matrix = new Matrix4(l_arm.matrix)
    l_arm.matrix.scale(.05, .2, .05)

    l_arm.render()


    var l_sword_base = new Cubes()

    l_sword_base.color = [127 / 255, 109 / 255, 14 / 255, 1.0]

    // // l_sword_base.matrix.rotate(180, 0, 1, 0)

    // l_sword_base.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_base.matrix = new Matrix4(l_arm_matrix)
    l_sword_base.matrix.translate(-0.05, 0.2, 0)
    l_sword_base.matrix.rotate(sword_base_kill, 0, 1, 0)
    l_sword_base_matrix = new Matrix4(l_sword_base.matrix)
    l_sword_base.matrix.scale(.05, .05, .05)

    l_sword_base.render()


    var l_sword_handle = new Cubes()

    l_sword_handle.color = [44 / 255, 86 / 255, 73 / 255, 1.0]

    // // l_sword_handle.matrix.rotate(180, 0, 1, 0)

    // l_sword_handle.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_handle.matrix = new Matrix4(l_sword_base_matrix)
    l_sword_handle.matrix.translate(0.05, -0.05, 0)
    // l_sword_handle.matrix.rotate(90, 0, 1, 0)
    l_sword_handle_matrix = new Matrix4(l_sword_handle.matrix)
    l_sword_handle.matrix.scale(.05, .15, .05)

    l_sword_handle.render()

    var l_sword_body = new Cubes()

    l_sword_body.color = [104 / 255, 201 / 255, 169 / 255, 1.0]

    // // l_sword_body.matrix.rotate(180, 0, 1, 0)

    // l_sword_body.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_body.matrix = new Matrix4(l_sword_handle_matrix)
    l_sword_body.matrix.translate(0.05, 0.05, 0)
    // l_sword_body.matrix.rotate(90, 0, 1, 0)

    l_sword_body.matrix.scale(.25, .05, .05)

    l_sword_body.render()

    var r_arm = new Cubes()

    r_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    r_arm.matrix = new Matrix4(body_matrix)
    r_arm.matrix.translate(0.2, 0.3, 0)
    r_arm.matrix.rotate(60, 1, 0, 0)
    r_arm.matrix.rotate(sword_angle_kill_1, 0, 0, 1)
    r_arm.matrix.rotate(150, 0, 0, 1)
    // r_arm.matrix.rotate(-180, 0, 0, 1)
    // r_arm.matrix.rotate(180, 0, 1, 0)
    var r_arm_matrix = new Matrix4(r_arm.matrix)
    r_arm.matrix.scale(.05, .2, .05)

    r_arm.render()

    var r_pork_chop = new Cubes()

    r_pork_chop.color = [219 / 255, 115 / 255, 113 / 255, 1.0]

    // // r_pork_chop.matrix.rotate(180, 0, 1, 0)

    // r_pork_chop.matrix.rotate(-blue_slider.value, 0, 0, 1)
    r_pork_chop.matrix = new Matrix4(r_arm_matrix)
    r_pork_chop.matrix.translate(-0.01, 0.2, 0.06)
    r_pork_chop.matrix.rotate(90, 0, 1, 0)
    r_pork_chop_matrix = new Matrix4(r_pork_chop.matrix)
    r_pork_chop.matrix.scale(.12, .06, .01)

    r_pork_chop.render()

    for (let pork = 180; pork < 360; pork += 10) {

        var pork_corner = new Cubes()
        pork_corner.color = [206 / 255, 123 / 255, 119 / 255, 1]
        pork_corner.matrix = new Matrix4(r_pork_chop_matrix)
        pork_corner.matrix.translate(0.01, 0.03, 0.0)

        // pork_corner.matrix.rotate(180, 0, 1, 0)
        pork_corner.matrix.rotate(90, 0, 0, 1)
        pork_corner.matrix.rotate(-pork, 0, 0, 1)
        // var pork_corner_matrix = new Matrix4(pork_corner.matrix)
        pork_corner.matrix.scale(.03, .02, .01)

        pork_corner.render()
    }

    for (let pork = 0; pork < 360; pork += 10) {

        pork_corner = new Cubes()
        pork_corner.color = [206 / 255, 123 / 255, 119 / 255, 1]
        pork_corner.matrix = new Matrix4(r_pork_chop_matrix)
        pork_corner.matrix.translate(0.1, 0.03, 0.0)

        // pork_corner.matrix.rotate(180, 0, 1, 0)
        pork_corner.matrix.rotate(90, 0, 0, 1)
        pork_corner.matrix.rotate(-pork, 0, 0, 1)
        // var pork_corner_matrix = new Matrix4(pork_corner.matrix)
        pork_corner.matrix.scale(.03, .02, .01)

        pork_corner.render()
    }

    var r_leg = new Cubes()

    r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    r_leg.matrix = new Matrix4(body_matrix)
    r_leg.matrix.translate(0.1, 0, 0)
    // r_leg.matrix.rotate(180, 0, 1, 0)

    // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    r_leg.matrix.rotate(180, 1, 0, 0)
    r_leg.matrix.rotate(90, 0, 1, 0)
    r_leg.matrix.scale(.05, .2, .05)

    r_leg.render()

    var l_leg = new Cubes()

    l_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    l_leg.matrix = new Matrix4(body_matrix)
    l_leg.matrix.translate(0, 0, 0)
    // // l_leg.matrix.rotate(180, 0, 1, 0)
    // l_leg.matrix.rotate(120, 0, 0, 1)
    // l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    l_leg.matrix.rotate(180, 1, 0, 0)
    l_leg.matrix.rotate(90, 0, 1, 0)

    l_leg.matrix.scale(.05, .2, .05)

    l_leg.render()




}

animate_steve_pork_chop_no_jump = () => {

    var k = 0

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    var body = new Cubes()

    // body.color = [1.0, 0.5, 0.5, 1.0]
    body.color = [99 / 255, 191 / 255, 191 / 255, 1]



    body.matrix.translate(-0.21, -0.6, 0.0)

    body.matrix.rotate(90, 0, 1, 0)
    var body_matrix = new Matrix4(body.matrix)
    body.matrix.scale(.15, .3, .05)

    body.render()

    var head = new Cubes()

    head.color = [239 / 255, 198 / 255, 157 / 255, 1.0]
    head.matrix = new Matrix4(body_matrix)
    head.matrix.translate(0.02, 0.3, 0.0)
    head_matrix = new Matrix4(head.matrix)
    head.matrix.scale(.12, .12, .05)

    head.render()


    var l_eye = new Cubes()

    l_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    l_eye.matrix = new Matrix4(head_matrix)
    l_eye.matrix.translate(0.04, 0.08, -0.013)
    l_eye.matrix.scale(.01, .01, .01)

    l_eye.render()

    var r_eye = new Cubes()

    r_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    r_eye.matrix = new Matrix4(head_matrix)
    r_eye.matrix.translate(0.1, 0.08, -0.013)
    r_eye.matrix.scale(.01, .01, .01)

    r_eye.render()

    var mouth = new Cubes()

    mouth.color = [56 / 255, 44 / 255, 19 / 255, 1.0]
    mouth.matrix = new Matrix4(head_matrix)
    mouth.matrix.translate(0.05, 0.02, -0.013)
    mouth.matrix.scale(.05, .02, .01)

    mouth.render()

    var hair = new Cubes()


    hair.color = [59 / 255, 46 / 255, 20 / 255, 1.0]
    hair.matrix = new Matrix4(head_matrix)
    hair.matrix.translate(-0.005, 0.1, -0.015)
    hair.matrix.scale(.13, .05, .08)

    hair.render()


    var l_arm = new Cubes()

    l_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    // // l_arm.matrix.rotate(180, 0, 1, 0)

    // l_arm.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_arm.matrix = new Matrix4(body_matrix)
    l_arm.matrix.translate(0, 0.3, 0)
    l_arm.matrix.rotate(sword_angle_kill_1, 1, 0, 0)
    l_arm.matrix.rotate(150, 0, 0, 1)
    var l_arm_matrix = new Matrix4(l_arm.matrix)
    l_arm.matrix.scale(.05, .2, .05)

    l_arm.render()


    var l_sword_base = new Cubes()

    l_sword_base.color = [127 / 255, 109 / 255, 14 / 255, 1.0]

    // // l_sword_base.matrix.rotate(180, 0, 1, 0)

    // l_sword_base.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_base.matrix = new Matrix4(l_arm_matrix)
    l_sword_base.matrix.translate(-0.05, 0.2, 0)
    l_sword_base.matrix.rotate(sword_base_kill, 0, 1, 0)
    l_sword_base_matrix = new Matrix4(l_sword_base.matrix)
    l_sword_base.matrix.scale(.05, .05, .05)

    l_sword_base.render()


    var l_sword_handle = new Cubes()

    l_sword_handle.color = [44 / 255, 86 / 255, 73 / 255, 1.0]

    // // l_sword_handle.matrix.rotate(180, 0, 1, 0)

    // l_sword_handle.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_handle.matrix = new Matrix4(l_sword_base_matrix)
    l_sword_handle.matrix.translate(0.05, -0.05, 0)
    // l_sword_handle.matrix.rotate(90, 0, 1, 0)
    l_sword_handle_matrix = new Matrix4(l_sword_handle.matrix)
    l_sword_handle.matrix.scale(.05, .15, .05)

    l_sword_handle.render()

    var l_sword_body = new Cubes()

    l_sword_body.color = [104 / 255, 201 / 255, 169 / 255, 1.0]

    // // l_sword_body.matrix.rotate(180, 0, 1, 0)

    // l_sword_body.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_body.matrix = new Matrix4(l_sword_handle_matrix)
    l_sword_body.matrix.translate(0.05, 0.05, 0)
    // l_sword_body.matrix.rotate(90, 0, 1, 0)

    l_sword_body.matrix.scale(.25, .05, .05)

    l_sword_body.render()

    var r_arm = new Cubes()

    r_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    r_arm.matrix = new Matrix4(body_matrix)
    r_arm.matrix.translate(0.2, 0.3, 0)
    r_arm.matrix.rotate(60, 1, 0, 0)
    r_arm.matrix.rotate(sword_angle_kill_1, 0, 0, 1)
    r_arm.matrix.rotate(150, 0, 0, 1)
    // r_arm.matrix.rotate(-180, 0, 0, 1)
    // r_arm.matrix.rotate(180, 0, 1, 0)
    var r_arm_matrix = new Matrix4(r_arm.matrix)
    r_arm.matrix.scale(.05, .2, .05)

    r_arm.render()

    var r_pork_chop = new Cubes()

    r_pork_chop.color = [219 / 255, 115 / 255, 113 / 255, 1.0]

    // // r_pork_chop.matrix.rotate(180, 0, 1, 0)

    // r_pork_chop.matrix.rotate(-blue_slider.value, 0, 0, 1)
    r_pork_chop.matrix = new Matrix4(r_arm_matrix)
    r_pork_chop.matrix.translate(-0.01, 0.2, 0.06)
    r_pork_chop.matrix.rotate(90, 0, 1, 0)
    r_pork_chop_matrix = new Matrix4(r_pork_chop.matrix)
    r_pork_chop.matrix.scale(.12, .06, .01)

    r_pork_chop.render()

    for (let pork = 180; pork < 360; pork += 10) {

        var pork_corner = new Cubes()
        pork_corner.color = [206 / 255, 123 / 255, 119 / 255, 1]
        pork_corner.matrix = new Matrix4(r_pork_chop_matrix)
        pork_corner.matrix.translate(0.01, 0.03, 0.0)

        // pork_corner.matrix.rotate(180, 0, 1, 0)
        pork_corner.matrix.rotate(90, 0, 0, 1)
        pork_corner.matrix.rotate(-pork, 0, 0, 1)
        // var pork_corner_matrix = new Matrix4(pork_corner.matrix)
        pork_corner.matrix.scale(.03, .02, .01)

        pork_corner.render()
    }

    for (let pork = 0; pork < 360; pork += 10) {

        pork_corner = new Cubes()
        pork_corner.color = [206 / 255, 123 / 255, 119 / 255, 1]
        pork_corner.matrix = new Matrix4(r_pork_chop_matrix)
        pork_corner.matrix.translate(0.1, 0.03, 0.0)

        // pork_corner.matrix.rotate(180, 0, 1, 0)
        pork_corner.matrix.rotate(90, 0, 0, 1)
        pork_corner.matrix.rotate(-pork, 0, 0, 1)
        // var pork_corner_matrix = new Matrix4(pork_corner.matrix)
        pork_corner.matrix.scale(.03, .02, .01)

        pork_corner.render()
    }

    var r_leg = new Cubes()

    r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    r_leg.matrix = new Matrix4(body_matrix)
    r_leg.matrix.translate(0.1, 0, 0)
    // r_leg.matrix.rotate(180, 0, 1, 0)

    // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    r_leg.matrix.rotate(180, 1, 0, 0)
    r_leg.matrix.rotate(90, 0, 1, 0)
    r_leg.matrix.scale(.05, .2, .05)

    r_leg.render()

    var l_leg = new Cubes()

    l_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    l_leg.matrix = new Matrix4(body_matrix)
    l_leg.matrix.translate(0, 0, 0)
    // // l_leg.matrix.rotate(180, 0, 1, 0)
    // l_leg.matrix.rotate(120, 0, 0, 1)
    // l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    l_leg.matrix.rotate(180, 1, 0, 0)
    l_leg.matrix.rotate(90, 0, 1, 0)

    l_leg.matrix.scale(.05, .2, .05)

    l_leg.render()

}

animate = () => {

    var k = 0

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    animate_pig()

    var body = new Cubes()

    body.color = [99 / 255, 191 / 255, 191 / 255, 1]



    body.matrix.translate(i, -0.6, 0.0)

    body.matrix.rotate(90, 0, 1, 0)
    var body_matrix = new Matrix4(body.matrix)
    body.matrix.scale(.15, .3, .05)

    body.render()

    var head = new Cubes()

    head.color = [239 / 255, 198 / 255, 157 / 255, 1.0]
    head.matrix = new Matrix4(body_matrix)
    head.matrix.translate(0.02, 0.3, 0.0)
    head_matrix = new Matrix4(head.matrix)
    head.matrix.scale(.12, .12, .05)

    head.render()


    var l_eye = new Cubes()

    l_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    l_eye.matrix = new Matrix4(head_matrix)
    l_eye.matrix.translate(0.04, 0.08, -0.013)
    l_eye.matrix.scale(.01, .01, .01)

    l_eye.render()

    var r_eye = new Cubes()

    r_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    r_eye.matrix = new Matrix4(head_matrix)
    r_eye.matrix.translate(0.1, 0.08, -0.013)
    r_eye.matrix.scale(.01, .01, .01)

    r_eye.render()

    var mouth = new Cubes()

    mouth.color = [56 / 255, 44 / 255, 19 / 255, 1.0]
    mouth.matrix = new Matrix4(head_matrix)
    mouth.matrix.translate(0.05, 0.02, -0.013)
    mouth.matrix.scale(.05, .02, .01)

    mouth.render()

    var hair = new Cubes()

    hair.color = [59 / 255, 46 / 255, 20 / 255, 1.0]
    hair.matrix = new Matrix4(head_matrix)
    hair.matrix.translate(-0.005, 0.1, -0.015)
    hair.matrix.scale(.13, .05, .08)

    hair.render()


    var l_arm = new Cubes()

    l_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    l_arm.matrix = new Matrix4(body_matrix)
    l_arm.matrix.translate(0, 0.3, 0)
    l_arm.matrix.rotate(60, 1, 0, 0)
    l_arm.matrix.rotate(150, 0, 0, 1)
    var l_arm_matrix = new Matrix4(l_arm.matrix)
    l_arm.matrix.scale(.05, .2, .05)

    l_arm.render()


    var l_sword_base = new Cubes()

    l_sword_base.color = [127 / 255, 109 / 255, 14 / 255, 1.0]
    l_sword_base.matrix = new Matrix4(l_arm_matrix)
    l_sword_base.matrix.translate(-0.05, 0.2, 0)
    l_sword_base.matrix.rotate(90, 0, 1, 0)
    l_sword_base_matrix = new Matrix4(l_sword_base.matrix)
    l_sword_base.matrix.scale(.05, .05, .05)

    l_sword_base.render()


    var l_sword_handle = new Cubes()

    l_sword_handle.color = [44 / 255, 86 / 255, 73 / 255, 1.0]
    l_sword_handle.matrix = new Matrix4(l_sword_base_matrix)
    l_sword_handle.matrix.translate(0.05, -0.05, 0)
    // l_sword_handle.matrix.rotate(90, 0, 1, 0)
    l_sword_handle_matrix = new Matrix4(l_sword_handle.matrix)
    l_sword_handle.matrix.scale(.05, .15, .05)

    l_sword_handle.render()

    var l_sword_body = new Cubes()

    l_sword_body.color = [104 / 255, 201 / 255, 169 / 255, 1.0]

    // // l_sword_body.matrix.rotate(180, 0, 1, 0)

    // l_sword_body.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_body.matrix = new Matrix4(l_sword_handle_matrix)
    l_sword_body.matrix.translate(0.05, 0.05, 0)
    // l_sword_body.matrix.rotate(90, 0, 1, 0)

    l_sword_body.matrix.scale(.25, .05, .05)

    l_sword_body.render()

    var r_arm = new Cubes()

    r_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    r_arm.matrix = new Matrix4(body_matrix)
    r_arm.matrix.translate(0.2, 0.3, 0)

    r_arm.matrix.rotate(50, 1, 0, 0)
    r_arm.matrix.rotate(150, 0, 0, 1)
    // r_arm.matrix.rotate(-180, 0, 0, 1)
    // r_arm.matrix.rotate(180, 0, 1, 0)
    r_arm.matrix.scale(.05, .2, .05)

    r_arm.render()

    var r_leg = new Cubes()

    r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    r_leg.matrix = new Matrix4(body_matrix)
    r_leg.matrix.translate(0.1, 0, 0)
    // r_leg.matrix.rotate(180, 0, 1, 0)

    // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    r_leg.matrix.rotate(180, 1, 0, 0)
    r_leg.matrix.rotate(90, 0, 1, 0)
    r_leg.matrix.scale(.05, .2, .05)

    r_leg.render()

    var l_leg = new Cubes()

    l_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    l_leg.matrix = new Matrix4(body_matrix)
    l_leg.matrix.translate(0, 0, 0)
    // // l_leg.matrix.rotate(180, 0, 1, 0)
    // l_leg.matrix.rotate(120, 0, 0, 1)
    // l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    l_leg.matrix.rotate(180, 1, 0, 0)
    l_leg.matrix.rotate(90, 0, 1, 0)

    l_leg.matrix.scale(.05, .2, .05)

    l_leg.render()




}

no_animate = () => {
    // var rect = e.target.getBoundingClientRect();

    // gl.uniform4f(u_FragColor, red_slider.value / 10, green_slider.value / 10, blue_slider.value / 10, 1.0);

    var slider_value = camera_angle_slider.value
    var viewMat = new Matrix4()
    viewMat.rotate(0 * 100, 1, 0, 0);
    viewMat.rotate(-slider_value, 0, 1, 0);
    gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);

    // var viewMat = new Matrix4()
    // viewMat.rotate(-0 * 100, 1, 0, 0);
    // viewMat.rotate(-1.16 * 50, 0, 1, 0);
    // // var zoomMat = new Matrix4();
    // // zoomMat.scale(g_zoom, g_zoom, g_zoom);
    // // console.log(g_globalX, g_globalY)
    // gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);




    // if (rect.width == 400 && rect.height == 400) {
    // // console.log(x)
    // // console.log(rect.left, rect.height, rect.width, rect.top)

    // x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    // y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);



    var k = 0

    // while(i>0) {
    // console.log(k)
    // if(k % 10 == 0) {
    // console.log(g_seconds)
    // for (let j = 0; j < 100; i++) {
    //     k = j
    //   }
    // gl.clear(gl.COLOR_BUFFER_BIT)




    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    // animate_pig()

    // animate_bomb()

    var body = new Cubes()

    // body.color = [1.0, 0.5, 0.5, 1.0]
    body.color = [99 / 255, 191 / 255, 191 / 255, 1]



    body.matrix.translate(-0.21, -0.6, 0.0)

    body.matrix.rotate(90, 0, 1, 0)
    var body_matrix = new Matrix4(body.matrix)
    body.matrix.scale(.15, .3, .05)

    body.render()

    var head = new Cubes()

    head.color = [239 / 255, 198 / 255, 157 / 255, 1.0]
    head.matrix = new Matrix4(body_matrix)
    head.matrix.translate(0.02, 0.3, 0.0)
    head_matrix = new Matrix4(head.matrix)
    head.matrix.scale(.12, .12, .05)

    head.render()


    var l_eye = new Cubes()

    l_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    l_eye.matrix = new Matrix4(head_matrix)
    l_eye.matrix.translate(0.04, 0.08, -0.013)
    l_eye.matrix.scale(.01, .01, .01)

    l_eye.render()

    var r_eye = new Cubes()

    r_eye.color = [49 / 255, 27 / 255, 84 / 255, 1.0]
    r_eye.matrix = new Matrix4(head_matrix)
    r_eye.matrix.translate(0.1, 0.08, -0.013)
    r_eye.matrix.scale(.01, .01, .01)

    r_eye.render()

    var mouth = new Cubes()

    mouth.color = [56 / 255, 44 / 255, 19 / 255, 1.0]
    mouth.matrix = new Matrix4(head_matrix)
    mouth.matrix.translate(0.05, 0.02, -0.013)
    mouth.matrix.scale(.05, .02, .01)

    mouth.render()

    var hair = new Cubes()

    hair.color = [59 / 255, 46 / 255, 20 / 255, 1.0]
    hair.matrix = new Matrix4(head_matrix)
    hair.matrix.translate(-0.005, 0.1, -0.015)
    hair.matrix.scale(.13, .05, .08)

    hair.render()


    var l_arm = new Cubes()

    l_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    // // l_arm.matrix.rotate(180, 0, 1, 0)

    // l_arm.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_arm.matrix = new Matrix4(body_matrix)
    l_arm.matrix.translate(0, 0.3, 0)
    l_arm.matrix.rotate(document.getElementById("hand").value, 1, 0, 0)
    l_arm.matrix.rotate(150, 0, 0, 1)
    var l_arm_matrix = new Matrix4(l_arm.matrix)
    l_arm.matrix.scale(.05, .2, .05)

    l_arm.render()


    var l_sword_base = new Cubes()

    l_sword_base.color = [127 / 255, 109 / 255, 14 / 255, 1.0]

    // // l_sword_base.matrix.rotate(180, 0, 1, 0)

    // l_sword_base.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_base.matrix = new Matrix4(l_arm_matrix)
    l_sword_base.matrix.translate(-0.05, 0.2, 0)
    l_sword_base.matrix.rotate(document.getElementById("sword").value, 0, 1, 0)
    l_sword_base_matrix = new Matrix4(l_sword_base.matrix)
    l_sword_base.matrix.scale(.05, .05, .05)

    l_sword_base.render()


    var l_sword_handle = new Cubes()

    l_sword_handle.color = [44 / 255, 86 / 255, 73 / 255, 1.0]

    // // l_sword_handle.matrix.rotate(180, 0, 1, 0)

    // l_sword_handle.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_handle.matrix = new Matrix4(l_sword_base_matrix)
    l_sword_handle.matrix.translate(0.05, -0.05, 0)
    // l_sword_handle.matrix.rotate(90, 0, 1, 0)
    l_sword_handle_matrix = new Matrix4(l_sword_handle.matrix)
    l_sword_handle.matrix.scale(.05, .15, .05)

    l_sword_handle.render()

    var l_sword_body = new Cubes()

    l_sword_body.color = [104 / 255, 201 / 255, 169 / 255, 1.0]

    // // l_sword_body.matrix.rotate(180, 0, 1, 0)

    // l_sword_body.matrix.rotate(-blue_slider.value, 0, 0, 1)
    l_sword_body.matrix = new Matrix4(l_sword_handle_matrix)
    l_sword_body.matrix.translate(0.05, 0.05, 0)
    // l_sword_body.matrix.rotate(90, 0, 1, 0)

    l_sword_body.matrix.scale(.25, .05, .05)

    l_sword_body.render()

    var r_arm = new Cubes()

    r_arm.color = [201 / 255, 167 / 255, 132 / 255, 1.0]

    r_arm.matrix = new Matrix4(body_matrix)
    r_arm.matrix.translate(0.2, 0.3, 0)

    r_arm.matrix.rotate(50, 1, 0, 0)
    r_arm.matrix.rotate(150, 0, 0, 1)
    // r_arm.matrix.rotate(-180, 0, 0, 1)
    // r_arm.matrix.rotate(180, 0, 1, 0)
    r_arm.matrix.scale(.05, .2, .05)

    r_arm.render()

    var r_leg = new Cubes()

    r_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    r_leg.matrix = new Matrix4(body_matrix)
    r_leg.matrix.translate(0.1, 0, 0)
    // r_leg.matrix.rotate(180, 0, 1, 0)

    // r_leg.matrix.rotate(red_slider.value, 1, 0, 0)
    r_leg.matrix.rotate(leg_angle, 1, 0, 0)
    r_leg.matrix.rotate(180, 1, 0, 0)
    r_leg.matrix.rotate(90, 0, 1, 0)
    r_leg.matrix.scale(.05, .2, .05)

    r_leg.render()

    var l_leg = new Cubes()

    l_leg.color = [131 / 255, 34 / 255, 235 / 255, 1.0]

    l_leg.matrix = new Matrix4(body_matrix)
    l_leg.matrix.translate(0, 0, 0)
    // // l_leg.matrix.rotate(180, 0, 1, 0)
    // l_leg.matrix.rotate(120, 0, 0, 1)
    // l_leg.matrix.rotate(-red_slider.value, 1, 0, 0)
    l_leg.matrix.rotate(-leg_angle, 1, 0, 0)
    l_leg.matrix.rotate(180, 1, 0, 0)
    l_leg.matrix.rotate(90, 0, 1, 0)

    l_leg.matrix.scale(.05, .2, .05)

    l_leg.render()




}

var sleep_timer = 0

function main() {

    setup_webgl()
    connect_var_to_GLSL()

    // Specify the color for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

    var viewMat = new Matrix4()
    viewMat.rotate(-0 * 100, 1, 0, 0);
    viewMat.rotate(-1.16 * 50, 0, 1, 0);
    gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);

    initTextures(gl, 0);

    canvas.onmousedown = function (ev) { startView(ev) }
    canvas.onmousemove = function (ev) { if (ev.buttons == 1) { changeView(ev) } };

    

    requestAnimationFrame(tick)
}
