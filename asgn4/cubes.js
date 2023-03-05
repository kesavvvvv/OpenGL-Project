class Cubes {
    constructor() {
        this.matrix = new Matrix4()
        this.texture_num = -2;
    }

    draw_cube_3d_uv = (rgba) => {

        //The code below draws the cube with draw triangle 3d uv
        //front
         ([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0])
        draw_traingle_3d_uv([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1])

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

        //top
        draw_traingle_3d_uv([1.0,1.0,1.0, 1.0,1.0,0.0, 0.0,1.0,0.0], [1,1, 1,0, 0,0])
        draw_traingle_3d_uv([0.0,1.0,1.0, 0.0,1.0,0.0, 1.0,1.0,1.0], [0,1,0,0,1,1])

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

        //right
        draw_traingle_3d_uv([1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [1,1,0,1,0,0])
        draw_traingle_3d_uv([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,0.0,0.0], [1,1,1,0,0,0])

        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        //left
        draw_traingle_3d_uv([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0], [1,0,0,0,0,1])
        draw_traingle_3d_uv([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0], [1,0, 1,1, 0,1])

        gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);

        //back
        draw_traingle_3d_uv([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], [0,1, 1,1, 1,0])
        draw_traingle_3d_uv([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0])

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        //bottom
        draw_traingle_3d_uv([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0], [0,1, 1,1, 0,1])
        draw_traingle_3d_uv([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0])

    }

    draw_cube_3d_uv_normal = (rgba) => {

        //The code below draws the cube with draw triangle 3d uv
        //front
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1])
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1])

        // gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

        //top
        draw_traingle_3d_uv_normal([1.0,1.0,1.0, 1.0,1.0,0.0, 0.0,1.0,0.0], [1,1, 1,0, 0,0], [0,1,0, 0,1,0, 0,1,0])
        draw_traingle_3d_uv_normal([0.0,1.0,1.0, 0.0,1.0,0.0, 1.0,1.0,1.0], [0,1, 0,0, 1,1], [0,1,0, 0,1,0, 0,1,0])

        // gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

        //right
        draw_traingle_3d_uv_normal([1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [1,1, 0,1, 0,0], [1,0,0, 1,0,0, 1,0,0])
        draw_traingle_3d_uv_normal([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,0.0,0.0], [1,1, 1,0, 0,0], [1,0,0, 1,0,0, 1,0,0])

        // gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        //left
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0], [1,0, 0,0, 0,1], [-1,0,0, -1,0,0, -1,0,0])
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0], [1,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0])

        // gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);

        //back
        draw_traingle_3d_uv_normal([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], [0,1, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1])
        draw_traingle_3d_uv_normal([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0], [0,0,1, 0,0,1, 0,0,1])

        // gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        //bottom
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0], [0,1, 1,1, 0,1], [0,-1,0, 0,-1,0, 0,-1,0])
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0], [0,-1,0, 0,-1,0, 0,-1,0])

       
    }

    draw_cube_3d_uv_normal_test(rgba) {
        //The code below draws the cube with draw triangle 3d uv
        //front
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1])
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1])

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

        //top
        draw_traingle_3d_uv_normal([1.0,1.0,1.0, 1.0,1.0,0.0, 0.0,1.0,0.0], [1,1, 1,0, 0,0], [0,1,0, 0,1,0, 0,1,0])
        draw_traingle_3d_uv_normal([0.0,1.0,1.0, 0.0,1.0,0.0, 1.0,1.0,1.0], [0,1, 0,0, 1,1], [0,1,0, 0,1,0, 0,1,0])

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

        //right
        draw_traingle_3d_uv_normal([1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [1,1, 0,1, 0,0], [1,0,0, 1,0,0, 1,0,0])
        draw_traingle_3d_uv_normal([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,0.0,0.0], [1,1, 1,0, 0,0], [1,0,0, 1,0,0, 1,0,0])

        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        //left
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0], [1,0, 0,0, 0,1], [-1,0,0, -1,0,0, -1,0,0])
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0], [1,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0])

        gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);

        //back
        draw_traingle_3d_uv_normal([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], [0,1, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1])
        draw_traingle_3d_uv_normal([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0], [0,0,1, 0,0,1, 0,0,1])

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        //bottom
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0], [0,1, 1,1, 0,1], [0,-1,0, 0,-1,0, 0,-1,0])
        draw_traingle_3d_uv_normal([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0], [0,-1,0, 0,-1,0, 0,-1,0])

    }

    

    render() {
         
        var rgba = this.color

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1i(u_which_texture, this.texture_num)

        gl.uniformMatrix4fv(u_model_matrix, false, this.matrix.elements)

        this.draw_cube_3d_uv_normal(rgba)

         
    }
}