class Cubes {
    constructor() {
        this.matrix = new Matrix4()
        this.texture_num = -2;
    }

    render() {
         
        var rgba = this.color

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1i(u_which_texture, this.texture_num)
        // gl.uniform4f(u_FragColor, red_slider.value / 10, green_slider.value / 10, blue_slider.value / 10, 1.0);

        gl.uniformMatrix4fv(u_model_matrix, false, this.matrix.elements)
        //front
        draw_traingle_3d_uv([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0])

        // draw_traingle_3d([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0])
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

        draw_traingle_3d_uv([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], [0,1, 1,1, 1,0])
        draw_traingle_3d_uv([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0])

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        draw_traingle_3d_uv([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0], [0,1, 1,1, 0,1])
        draw_traingle_3d_uv([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,1, 0,0, 1,0])

    }
}