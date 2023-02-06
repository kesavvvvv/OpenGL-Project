// DrawRectangle.js

var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_size;
    uniform mat4 u_model_matrix;
    uniform mat4 u_global_rotation_matrix;
    void main() {
        gl_Position = u_global_rotation_matrix * u_model_matrix * a_Position;
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

var g_globalX = 1.15;
var g_globalY = 0;

var g_prevX = 0;
var g_prevY = 0;

let canvas, gl, a_position, a_size, u_fragcolor

function rad(x) {
    return x * Math.PI / 180
}

Math.clamp = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function convertCoordinatesEventsToGL(ev) {

    return ([x, y]);
}

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
    g_globalX += x - g_prevX;
    g_globalY -= y - g_prevY;

    g_prevX = x;
    g_prevY = y;
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
    if(e.shiftKey) {
        if(is_shift_down) {
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

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
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

// Write logic for each button shape to select the shape

// tri_button.onclick = () => {
//     which_button = 0
// }

// sq_button.onclick = () => {
//     which_button = 1
// }

// cir_button.onclick = () => {
//     which_button = 2
// }

// Add function to draw the shape based on the shape button selected
// var g_start_time = performance.now() / 1000.0
// var g_seconds = performance.now() / 1000.0 - g_start_time

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
    // console.log("Called tick")
    var kesav_time_start = performance.now() / 1000.0
    var fps;
	
		if (!lastCalledTime) {
			lastCalledTime = new Date().getTime();
			fps = 0;
		}
    // console.log(g_start_time)
    if (should_i_animate) {
        render_scene()
    }
    else {
        no_animate()
    }


    // if(i==-0.2) {
    //     i = 0.45
    // }
    l += 1

    
    // console.log(10000/g_seconds)
    
    var delta = (new Date().getTime() - lastCalledTime) / 1000;
		lastCalledTime = new Date().getTime();
		fps = Math.ceil((1/delta));
	
		if (counter >= 60) {
			var sum = fpsArray.reduce(function(a,b) { return a + b });
			var average = Math.ceil(sum / fpsArray.length);
			// console.log(average);
			counter = 0;
		} else {
			if (fps !== Infinity) {
				fpsArray.push(fps);
                // console.log(fps)
                document.getElementById("fps").innerHTML = fps
			}
	
			counter++;
		}

        // console.log(fps)

    var kesav_time_end = (performance.now() / 1000.0);
    // console.log(kesav_time_end, kesav_time_start)
    // console.log(g_seconds * 1000.0)
    // console.log(g_start_time, g_seconds)
    // console.log(g_seconds)
    
    requestAnimationFrame(tick)
}

var change_camera_angle = 1

var camera_change_x = 1.15
var camera_change_y = 0
render_scene = () => {

    var kesav_time_start = performance.now() / 1000.0
    // var now = new Date().getTime();
    
    // console.log("hi", g_start_time, g_seconds)

    if (l % 10 == 0 && i > -0.21) {
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
        if (camera_change_x > -0.1) {
            var viewMat = new Matrix4()
            viewMat.rotate(-camera_change_y * 100, 1, 0, 0);
            viewMat.rotate(-camera_change_x * 50, 0, 1, 0);
            camera_change_x -= 0.2
            camera_change_y += 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            change_camera_angle = 0
        }
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
        if (camera_change_y < 1.15) {
            var viewMat = new Matrix4()
            viewMat.rotate(-camera_change_y * 100, 1, 0, 0);
            viewMat.rotate(-camera_change_x * 50, 0, 1, 0);
            camera_change_x += 0.2
            camera_change_y -= 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            change_camera_angle = 2
        }
        animate_pig_dead()
        // console.log(bomb_size)
        bomb_size += 0.5
    }

    if (bomb_size > 1.5 && bomb_size < 10.5) {
        if (camera_change_y < 1.15) {
            var viewMat = new Matrix4()
            viewMat.rotate(-camera_change_y * 100, 1, 0, 0);
            viewMat.rotate(-camera_change_x * 50, 0, 1, 0);
            camera_change_x += 0.2
            camera_change_y -= 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            change_camera_angle = 2
        }
        gl.clearColor(206 / 255, 123 / 255, 119 / 255, 1);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        bomb_size += 0.1
    }

    // console.log(bomb_size)
    if (l % 10 == 0 && bomb_size > 10.4) {
        if (change_camera_angle == 2) {
            var viewMat = new Matrix4()
            viewMat.rotate(-0 * 100, 1, 0, 0);
            viewMat.rotate(-1.15 * 50, 0, 1, 0);
            camera_change_x += 0.2
            camera_change_y -= 0.05
            // var zoomMat = new Matrix4();
            // zoomMat.scale(g_zoom, g_zoom, g_zoom);
            // console.log(g_globalX, g_globalY)
            gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);
            change_camera_angle = 3
        }
        gl.clearColor(0.5, 0.5, 0.5, 1);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // console.log(is_shift_down)
        if(is_shift_down) {
            animate_steve_pork_chop_no_jump()
        }
        else {
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




    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

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




    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

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




    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)

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

    var viewMat = new Matrix4()
    viewMat.rotate(-0 * 100, 1, 0, 0);
    viewMat.rotate(-1.16 * 50, 0, 1, 0);
    gl.uniformMatrix4fv(u_global_rotation_matrix, false, viewMat.elements);

    canvas.onmousedown = function (ev) { startView(ev) }
    canvas.onmousemove = function (ev) { if (ev.buttons == 1) { changeView(ev) } };


    requestAnimationFrame(tick)
}
