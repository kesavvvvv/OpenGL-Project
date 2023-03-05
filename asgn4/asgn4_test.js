
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_normal;
    varying vec2 v_UV;
    varying vec3 v_normal;
    attribute float a_size;
    uniform mat4 u_model_matrix;
    uniform mat4 u_global_rotation_matrix;
    uniform mat4 u_view_matrix;
    uniform mat4 u_projection_matrix;
    void main() {
        gl_Position = u_projection_matrix * u_view_matrix * u_global_rotation_matrix * u_model_matrix * a_Position;
        gl_PointSize = a_size;
        v_UV = a_UV;
        v_normal = a_normal;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    varying vec3 v_normal;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform int u_which_texture;
    void main() {

        // if (u_which_texture == -4) {
        //     gl_FragColor = v_normal
        // }
        if (u_which_texture == -3) {
            gl_FragColor = vec4((v_normal+1.0)/2.0, 1.0);
        }
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

        
    }`; 


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

    a_normal = gl.getAttribLocation(gl.program, 'a_normal')
    if (a_normal < 0) {
        console.log('Failed to get the storage location of a_normal')
        return
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



draw_traingle_3d_uv_normal = (vertices, uv, normal) => {
    var n = vertices.length / 3;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

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

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);

    // Create a buffer object
    var normalBuffer = gl.createBuffer();

    if (!normalBuffer) {
        console.log('Failed to create the normal buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_normal);


    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


tick = () => {


        // render_scene()
        render_for_asgn4()
    requestAnimationFrame(tick)
}
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


render_for_asgn4 = () => {
    var proj_matrix = new Matrix4();
    proj_matrix.setPerspective(50, canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_projection_matrix, false, proj_matrix.elements);
    // Pass the view matrix
    var view_matrix = new Matrix4();
    // console.log(camera_eye.elements[2])
    view_matrix.setLookAt(camera_eye.elements[0], camera_eye.elements[1], camera_eye.elements[2], camera_at.elements[0], camera_at.elements[1], camera_at.elements[2], camera_up.elements[0], camera_up.elements[1], camera_up.elements[2]);
    // view_matrix.setLookAt()
    // view_matrix.setLookAt(camera_eye[0], camera_eye[1], camera_eye[2], camera_at[0], camera_at[1], camera_at[2], camera_up[0], camera_up[1], camera_up[2]);
    gl.uniformMatrix4fv(u_view_matrix, false, view_matrix.elements);

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    var floor = new Cubes()
    floor.color = [1, 1, 1, 1]
    floor.texture_num = -1;
    floor.matrix.translate(0, -0.8, 0.0)
    floor.matrix.scale(50, 0, 50)
    floor.matrix.translate(-0.5, 0, -0.5)
    floor.render()

    var sky = new Cubes()
    sky.color = [1, 1, 1, 1]
    sky.texture_num = -3;
    sky.matrix.scale(50, 50, 50)
    sky.matrix.translate(-0.5, -0.5, -0.5)
    sky.render()

    var sphere = new Sphere()
    sphere.render()


}


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

    // canvas.onmousedown = function (ev) { startView(ev) }
    // canvas.onmousemove = function (ev) { if (ev.buttons == 1) { changeView(ev) } };



    requestAnimationFrame(tick)
}
