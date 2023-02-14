var max_x = 4
var x_grid_len = 1103
var max_y = 6
var y_grid_len = 1044

var kriging_polygons = [[[0, x_grid_len * max_x, x_grid_len * max_x, 0], [0, 0, y_grid_len * max_y, y_grid_len * max_y]]];

var kriging_longitude = [];

var kriging_latitude = [];

var kriging_response = [];

//x轴一格宽度 px
var temp_step_x = x_grid_len * max_x / 10 / (max_x * 2)
//y轴一格高度 px
var temp_step_y = y_grid_len * max_y / 10 / (max_y * 2)

function loadData(points) {
  //插值对应边界
  // var kriging_polygons = [[[0, 0, 20, 20], [0, 18, 18, 0]]];
  var canvasLayer;
  var lng_max_map = 0, lng_min_map = 9999, lat_max_map = 0, lat_min_map = 9999
  for (var i = 0, l = kriging_polygons.length; i < l; i++) {
    var lng_max = kriging_polygons[i][0].max(), lng_min = kriging_polygons[i][0].min()
    var lat_max = kriging_polygons[i][1].max(), lat_min = kriging_polygons[i][1].min()

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
    for (var i = 0, l = points.length; i < l; i++) {
      kriging_longitude.push(points[i].x);
      kriging_latitude.push(points[i].y);
      kriging_response.push(points[i].value);
    }
  }

  var x = new kriging("canvas_chart", 1);

  x.krig(kriging_longitude, kriging_latitude, kriging_response, kriging_polygons);

  var longrange = [lng_min_map, lng_max_map];
  var latrange = [lat_min_map, lat_max_map];

  x.map(x_grid_len * max_x / 10, y_grid_len * max_y / 10, [longrange.mean(), latrange.mean()], 1);

  // var img = convertCanvasToImage(document.getElementById("mycanvas"))

}

function loadX() {
  var c = document.getElementById("canvas_x");
  c.width = x_grid_len * max_x / 10
  c.height = 50

  // c.style = "position: relative;left:-" + (c.width + 5) + "px;top:43px";
  c.style = "position: relative;bottom: 585px;";

  var ctx = c.getContext("2d");

  ctx.moveTo(0, 5);
  ctx.lineTo(c.width, 5);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = "14px Arial";
  ctx.fillStyle = "#666666";
  for (var i = 0; i <= max_x * 2; i++) {
    let temp_value = (i * x_grid_len / 20 / 100).toFixed(1)
    let temp_value_len = temp_value.toString().length;
    //尾位数值偏移
    if (i == max_x * 2) {
      ctx.fillText("|", i * temp_step_x - 3, 15);
      ctx.fillText(temp_value, i * temp_step_x - (temp_value_len - 1) * 10, 35);
    }
    else if (i == 0) {
      ctx.fillText("|", i * temp_step_x, 15);
      ctx.fillText(0, i * temp_step_x, 35);
    }
    //非尾位数值偏移
    else {
      ctx.fillText("|", i * temp_step_x, 15);
      ctx.fillText(temp_value, i * temp_step_x - (temp_value_len - 1) * 5, 35);
    }
  }
}


function loadY() {
  var c = document.getElementById("canvas_y");
  c.width = 50
  c.height = y_grid_len * max_y / 10
  // c.style = "position: relative;left:-" + (x_grid_len * max_x / 5 + temp_step_x + 3) + "px;top:0px;";
  c.style = "position: relative;left: -495px;top: -630px;";

  var ctx = c.getContext("2d");

  ctx.moveTo(50, 0);
  ctx.lineTo(50, c.height);
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = "14px Arial";
  ctx.fillStyle = "#666666";
  for (var i = 0; i <= max_y * 2; i++) {
    let temp_value = ((max_y * 2 - i) * y_grid_len / 20 / 100).toFixed(1)

    //尾位数值偏移
    if (i == max_y * 2) {
      ctx.fillText("━", 40, i * temp_step_y + 5);
      ctx.fillText("   0", 15, i * temp_step_y);
    }
    else if (i == 0) {
      ctx.fillText("━", 40, i * temp_step_y + 8);
      ctx.fillText(temp_value, 15, i * temp_step_y + 15);
    }
    //非尾位数值偏移
    else {
      ctx.fillText("━", 40, i * temp_step_y + 8);
      ctx.fillText(temp_value, 15, i * temp_step_y + 8);
    }
  }
}


function rotateContext(ctx, x, y, degree) {
  ctx.translate(x, y);
  ctx.rotate(degree * Math.PI / 180);
  ctx.translate(-x, -y);
}

function loadLegend() {
  var c = document.getElementById("canvas_lengend");
  c.width = y_grid_len * max_y / 10
  c.height = 100
  // c.style = "position: relative;left:-750px;top:-265px;";
  c.style = "position: relative;right: -200px;top: -995px;";

  var ctx = c.getContext("2d");
  ctx.moveTo(0, 21);
  ctx.lineTo(c.width, 21);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = "14px Arial";
  ctx.fillStyle = "#666666";

  //动态计算
  let temp_min = kriging_response.min()
  let temp_max = kriging_response.max()
  let temp_step = ((kriging_response.max() - kriging_response.min()) / 10).toFixed(1);

  ctx.font = "14px Arial";
  ctx.fillStyle = "#666666";

  for (var i = 0; i <= 10; i++) {
    if (i == 0) {
      ctx.fillText("|", i * (c.width / 10), 25);
    }
    else if (i == 10) {
      ctx.fillText("|", i * (c.width / 10) - 2, 25);
    } else {
      ctx.fillText("|", i * (c.width / 10), 25);
    }
  }

  for (var i = 0; i <= 10; i++) {
    ctx.save();

    if (i == 0) {
      rotateContext(ctx, 0, 40, 90);
      ctx.fillText(temp_min, -10, 40);
    }
    else if (i == 10) {
      rotateContext(ctx, i * (c.width / 10) - 25, 40, 90);
      ctx.fillText(temp_max, i * (c.width / 10) - 35, 30);
    } else {
      rotateContext(ctx, i * (c.width / 10) - 5, 40, 90);
      ctx.fillText((temp_min + i * temp_step).toFixed(1), i * (c.width / 10) - 15, 40);
    }

    ctx.restore();
  }


  // 创建渐变
  var grd = ctx.createLinearGradient(0, 0, y_grid_len * max_y / 10, 0);
  //颜色带需要与背景色一致
  let temp_color = ["#00A600", "#07A800", "#0EAB00", "#16AE00", "#1DB000", "#25B300", "#2DB600", "#36B800", "#3EBB00", "#47BE00", "#50C000", "#59C300", "#63C600", "#6CC800", "#76CB00", "#80CE00", "#8BD000", "#95D300", "#A0D600", "#ABD800", "#B6DB00", "#C2DE00", "#CEE000", "#D9E300", "#E6E600", "#E6DD09", "#E7D612", "#E7CF1C", "#E8C825", "#E8C32E", "#E9BE38", "#E9BA41", "#EAB74B", "#EAB454", "#EBB25E", "#EBB167", "#ECB171", "#ECB17B", "#EDB285", "#EDB48E", "#EEB798", "#EEBAA2", "#EFBFAC", "#EFC4B6", "#F0C9C0", "#F0D0CA", "#F1D7D4", "#F1DFDE", "#F2E8E8", "#F2F2F2"];
  for (var i = 0; i < 10; i++) {
    grd.addColorStop(i * 0.1, temp_color[i * 5]);
  }
  // 填充渐变
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, y_grid_len * max_y / 10, 20);

}

export function load_data(points, callback) {
  max_x = 4
  x_grid_len = 1103
  max_y = 6
  y_grid_len = 1044

  kriging_polygons = [[[0, x_grid_len * max_x, x_grid_len * max_x, 0], [0, 0, y_grid_len * max_y, y_grid_len * max_y]]];

  kriging_longitude = [];

  kriging_latitude = [];

  kriging_response = [];

  //x轴一格宽度 px
  temp_step_x = x_grid_len * max_x / 10 / (max_x * 2)
  //y轴一格高度 px
  temp_step_y = y_grid_len * max_y / 10 / (max_y * 2)

  loadData(points)
  loadX()
  loadY()
  loadLegend()

  callback();
}