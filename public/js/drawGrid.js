class K_Grid {
    constructor(max_x, x_grid_len, max_y, y_grid_len, points, callback) {
        this.max_x = max_x
        this.x_grid_len = x_grid_len
        this.max_y = max_y
        this.y_grid_len = y_grid_len
        this.points = points

        //插值对应边界
        this.kriging_polygons = [[[0, x_grid_len * max_x, x_grid_len * max_x, 0], [0, 0, y_grid_len * max_y, y_grid_len * max_y]]];
        this.kriging_longitude = [];
        this.kriging_latitude = [];
        this.kriging_response = [];

        //x轴一格宽度 px
        this.temp_step_x = x_grid_len * max_x / 10 / (max_x * 2)
        //y轴一格高度 px
        this.temp_step_y = y_grid_len * max_y / 10 / (max_y * 2)

    }

    load_data() {

        let lng_max_map = 0, lng_min_map = 9999, lat_max_map = 0, lat_min_map = 9999

        for (let i = 0, l = this.kriging_polygons.length; i < l; i++) {
            let lng_max = this.kriging_polygons[i][0].max(), lng_min = this.kriging_polygons[i][0].min()
            let lat_max = this.kriging_polygons[i][1].max(), lat_min = this.kriging_polygons[i][1].min()

            if (lng_max_map < lng_max) {
                lng_max_map = lng_max
            }
            if (lng_min_map > lng_min) {
                lng_min_map = lng_min
            }
            if (lat_max_map < lat_max) {
                lat_max_map = lat_max
            }
            if (lat_min_map > lat_min) {
                lat_min_map = lat_min
            }
            for (let i = 0, l = this.points.length; i < l; i++) {
                this.kriging_longitude.push(this.points[i].x);
                this.kriging_latitude.push(this.points[i].y);
                this.kriging_response.push(this.points[i].value);
            }
        }

        let x = new kriging("canvas_chart", 1);

        x.krig(this.kriging_longitude, this.kriging_latitude, this.kriging_response, this.kriging_polygons);

        let longrange = [lng_min_map, lng_max_map];
        let latrange = [lat_min_map, lat_max_map];

        x.map(this.x_grid_len * this.max_x / 10, this.y_grid_len * this.max_y / 10, [longrange.mean(), latrange.mean()], 1);

        let img = this.convertCanvasToImage(document.getElementById("canvas_chart"))

    }

    convertCanvasToImage(canvas) {

        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        //console.log(image.src)

        //下载
        //let dlLink = document.createElement('a');
        //dlLink.download = "克里金插值";
        //dlLink.href = image.src;
        //document.body.appendChild(dlLink);
        //dlLink.click();
        //document.body.removeChild(dlLink);

        return image;
    }

    loadX() {
        let c = document.getElementById("canvas_x");
        c.width = this.x_grid_len * this.max_x / 10
        c.height = 50
        c.style = "position: absolute;top: " + (this.y_grid_len * this.max_y / 10 - 1) + "px;left: 0px;";

        let ctx = c.getContext("2d");

        ctx.moveTo(0, 1);
        ctx.lineTo(c.width, 1);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "14px Arial";
        ctx.fillStyle = "#666666";
        for (let i = 0; i <= this.max_x * 2; i++) {
            let temp_value = (i * this.x_grid_len / 20 / 100).toFixed(1)
            let temp_value_len = temp_value.toString().length;
            //尾位数值偏移
            if (i == this.max_x * 2) {
                ctx.fillText("|", i * this.temp_step_x - 3, 10);
                ctx.fillText(temp_value, i * this.temp_step_x - (temp_value_len - 1) * 10, 30);
            }
            else if (i == 0) {
                ctx.fillText("|", i * this.temp_step_x, 10);
                ctx.fillText(0, i * this.temp_step_x, 30);
            }
            //非尾位数值偏移
            else {
                ctx.fillText("|", i * this.temp_step_x, 10);
                ctx.fillText(temp_value, i * this.temp_step_x - (temp_value_len - 1) * 5, 30);
            }
        }
    }

    loadY() {
        let c = document.getElementById("canvas_y");
        c.width = 50
        c.height = this.y_grid_len * this.max_y / 10 + 1
        c.style = "position: absolute;top:0px;left: -50px;";

        let ctx = c.getContext("2d");

        ctx.moveTo(50, 0);
        ctx.lineTo(50, c.height);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "14px Arial";
        ctx.fillStyle = "#666666";
        for (let i = 0; i <= this.max_y * 2; i++) {
            let temp_value = ((this.max_y * 2 - i) * this.y_grid_len / 20 / 100).toFixed(1)

            //尾位数值偏移
            if (i == this.max_y * 2) {
                ctx.fillText("━", 40, i * this.temp_step_y + 6);
                ctx.fillText("   0", 15, i * this.temp_step_y);
            }
            else if (i == 0) {
                ctx.fillText("━", 40, i * this.temp_step_y + 7);
                ctx.fillText(temp_value, 15, i * this.temp_step_y + 13);
            }
            //非尾位数值偏移
            else {
                ctx.fillText("━", 40, i * this.temp_step_y + 6);
                ctx.fillText(temp_value, 15, i * this.temp_step_y + 6);
            }
        }
    }

    rotateContext(ctx, x, y, degree) {
        ctx.translate(x, y);
        ctx.rotate(degree * Math.PI / 180);
        ctx.translate(-x, -y);
    }

    loadLegend() {

        let c = document.getElementById("canvas_lengend");
        c.width = this.y_grid_len * this.max_y / 10
        c.height = 100
        //c.style = "position: absolute;inset: 0px;margin: auto;padding-top: " + this.y_grid_len * this.max_y / 10 + "px;";
        let temp_left = this.temp_step_x * (this.max_x * 2) + 60 - (this.y_grid_len * this.max_y / 10 / 2)
        c.style = "position: absolute;top: " + (this.y_grid_len * this.max_y / 20 - 50) + "px;left: " + temp_left + "px;";

        let ctx = c.getContext("2d");
        ctx.moveTo(0, 21);
        ctx.lineTo(c.width, 21);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "14px Arial";
        ctx.fillStyle = "#666666";

        //动态计算
        let temp_min = this.kriging_response.min()
        let temp_max = this.kriging_response.max()
        let temp_step = ((this.kriging_response.max() - this.kriging_response.min()) / 10).toFixed(1);

        ctx.font = "14px Arial";
        ctx.fillStyle = "#666666";

        for (let i = 0; i <= 10; i++) {
            if (i == 0) {
                ctx.fillText("|", i * (c.width / 10), 25);
            }
            else if (i == 10) {
                ctx.fillText("|", i * (c.width / 10) - 2, 25);
            } else {
                ctx.fillText("|", i * (c.width / 10), 25);
            }
        }

        for (let i = 0; i <= 10; i++) {
            ctx.save();

            if (i == 0) {
                this.rotateContext(ctx, 0, 40, 90);
                ctx.fillText(temp_min, -10, 40);
            }
            else if (i == 10) {
                this.rotateContext(ctx, i * (c.width / 10) - 25, 40, 90);
                ctx.fillText(temp_max, i * (c.width / 10) - 35, 30);
            } else {
                this.rotateContext(ctx, i * (c.width / 10) - 5, 40, 90);
                ctx.fillText((temp_min + i * temp_step).toFixed(1), i * (c.width / 10) - 15, 40);
            }
            ctx.restore();
        }
        // 创建渐变
        let grd = ctx.createLinearGradient(0, 0, this.y_grid_len * this.max_y / 10, 0);
        //颜色带需要与背景色一致
        let temp_color = ["#00A600", "#07A800", "#0EAB00", "#16AE00", "#1DB000", "#25B300", "#2DB600", "#36B800", "#3EBB00", "#47BE00", "#50C000", "#59C300", "#63C600", "#6CC800", "#76CB00", "#80CE00", "#8BD000", "#95D300", "#A0D600", "#ABD800", "#B6DB00", "#C2DE00", "#CEE000", "#D9E300", "#E6E600", "#E6DD09", "#E7D612", "#E7CF1C", "#E8C825", "#E8C32E", "#E9BE38", "#E9BA41", "#EAB74B", "#EAB454", "#EBB25E", "#EBB167", "#ECB171", "#ECB17B", "#EDB285", "#EDB48E", "#EEB798", "#EEBAA2", "#EFBFAC", "#EFC4B6", "#F0C9C0", "#F0D0CA", "#F1D7D4", "#F1DFDE", "#F2E8E8", "#F2F2F2"];
        for (let i = 0; i < 10; i++) {
            grd.addColorStop(i * 0.1, temp_color[i * 5]);
        }
        // 填充渐变
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, this.y_grid_len * this.max_y / 10, 20);

    }
    loadTxt() {
        let c_y = document.getElementById("canvas_y_title");
        c_y.style = "position: absolute; top: -30px; left: -45px; color: #666666";
        let c_l = document.getElementById("canvas_lengend_title");
        c_l.style = "position: absolute; top: -30px; left: " + (this.x_grid_len * this.max_x / 20 - 30) + "px; color: #666666";
        let c_x = document.getElementById("canvas_x_title");
        c_x.style = "position: absolute; top: " + (this.y_grid_len * this.max_y / 10 + 30) + "px; left: " + (this.x_grid_len * this.max_x / 10 - 20) + "px; color: #666666";
    }
    draw() {
        this.load_data()
        this.loadX()
        this.loadY()
        this.loadLegend()
        this.loadTxt()
        // callback && callback();
    }
}






