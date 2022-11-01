
import kriging from './kriging'
import polyline from './lineData'
import html2canvas from 'html2canvas'


let CanvasLayer = null;
export default function createThem(AMap, data, map, gif) {

  // 克里金插值所需要素
  var values = [], lngs = [], lats = [], colors = [];
  //创建要素
  for (var i = 0; i < data.length; i++) {

    // var aqi = data[i]['AQI'];
    var aqi = data[i]['AQI_Level'] * 1;
    var x = data[i].Longitude;
    var y = data[i].Latitude;
    let color = data[i]['AQI_Color'];
    colors.push(color);
    values.push(aqi);
    lngs.push(x);
    lats.push(y);
  }


  // 克里金插值参数
  var params = {
    krigingModel: 'exponential',//model还可选'exponential','gaussian','spherical'
    krigingSigma2: 0,
    krigingAlpha: 100,
    canvasAlpha: 0.6,//canvas图层透明度
    colors: colors,
    // 颜色渲染
    // colors: [
    //   "#00A600", "#01A600", "#03A700", "#04A700", "#05A800",
    //   "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00",
    //   "#0DAB00", "#0FAB00", "#10AC00", "#12AC00",
    //   "#13AD00", "#14AD00", "#16AE00", "#17AE00",
    //   "#19AF00", "#1AAF00", "#1CB000", "#1DB000",
    //   "#1FB100", "#20B100", "#22B200", "#23B200",
    //   "#25B300", "#26B300", "#28B400", "#29B400",
    //   "#2BB500", "#2CB500", "#2EB600", "#2FB600",
    //   "#31B700", "#33B700", "#34B800", "#36B800",
    //   "#37B900", "#39B900", "#3BBA00", "#3CBA00",
    //   "#3EBB00", "#3FBB00", "#41BC00", "#43BC00",
    //   "#44BD00", "#46BD00", "#48BE00", "#49BE00",
    //   "#4BBF00", "#4DBF00", "#4FC000", "#50C000",
    //   "#52C100", "#54C100", "#55C200", "#57C200",
    //   "#59C300", "#5BC300", "#5DC400", "#5EC400",
    //   "#60C500", "#62C500", "#64C600", "#66C600",
    //   "#67C700", "#69C700", "#6BC800", "#6DC800",
    //   "#6FC900", "#71C900", "#72CA00", "#74CA00",
    //   "#76CB00", "#78CB00", "#7ACC00", "#7CCC00",
    //   "#7ECD00", "#80CD00", "#82CE00", "#84CE00",
    //   "#86CF00", "#88CF00", "#8AD000", "#8BD000",
    //   "#8DD100", "#8FD100", "#91D200", "#93D200",
    //   "#95D300", "#97D300", "#9AD400", "#9CD400",
    //   "#9ED500", "#A0D500", "#A2D600", "#A4D600",
    //   "#A6D700", "#A8D700", "#AAD800", "#ACD800",
    //   "#AED900", "#B0D900", "#B2DA00", "#B5DA00",
    //   "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00",
    //   "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00",
    //   "#C8DF00", "#CADF00", "#CDE000", "#CFE000",
    //   "#D1E100", "#D3E100", "#D6E200", "#D8E200",
    //   "#DAE300", "#DCE300", "#DFE400", "#E1E400",
    //   "#E3E500", "#E6E600", "#E6E402", "#E6E204",
    //   "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B",
    //   "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612",
    //   "#E7D414", "#E7D316", "#E7D217", "#E7D019",
    //   "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21",
    //   "#E7CA22", "#E7C924", "#E8C826", "#E8C728",
    //   "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F",
    //   "#E8C231", "#E8C133", "#E8C035", "#E8BF36",
    //   "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E",
    //   "#E9BB40", "#E9BA42", "#E9B943", "#E9B945",
    //   "#E9B847", "#E9B749", "#EAB74B", "#EAB64D",
    //   "#EAB64F", "#EAB550", "#EAB552", "#EAB454",
    //   "#EAB456", "#EAB358", "#EAB35A", "#EAB35C",
    //   "#EBB25D", "#EBB25F", "#EBB261", "#EBB263",
    //   "#EBB165", "#EBB167", "#EBB169", "#EBB16B",
    //   "#EBB16C", "#EBB16E", "#ECB170", "#ECB172",
    //   "#ECB174", "#ECB176", "#ECB178", "#ECB17A",
    //   "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281",
    //   "#EDB283", "#EDB285", "#EDB387", "#EDB389",
    //   "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591",
    //   "#EDB593", "#EDB694", "#EEB696", "#EEB798",
    //   "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0",
    //   "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8",
    //   "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF",
    //   "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7",
    //   "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF",
    //   "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7",
    //   "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF",
    //   "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7",
    //   "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE",
    //   "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6",
    //   "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE",
    //   "#F2F0F0", "#F2F2F2"]
    // colors: [
    //   "#00e400",
    //   "#f3dd22",
    //   "#ff7e00",
    //   "#ff0000",
    //   "#99004c",
    //   "#7e0023",
    // ]

    // colors: [
    //   '#bcde19', '#a6df15', '#88e011', '#6be10d', '#48e207', '#2fe303', '#19e300',
    //   '#e5dd1f', '#f3dd21', '#f3dd21', '#f3dc21', '#f4d41e', '#f5c718', '#f8ba14',
    //   '#f5c618', '#f8b513', '#faa30c', '#fb9607', '#fd8902', '#ff7f00', '#ff7e00',
    //   '#ff6400', '#ff5600', '#ff4700', '#ff3600', '#ff2500', '#ff1400', '#ff0100',
    //   '#c90028', '#c0002e', '#b80034', '#ad003d', '#a60042', '#a20045', '#9d0049',
    //   '#8a0034', '#880031', '#85002e', '#83002b', '#820029', '#7f0025', '#7f0025',
    // ]
  };



  // 裁剪边界（克里金插值图区域边界数据）
  var line = polyline;
  var lineArr = line.split(';');
  var array = [];
  var array1 = [];
  var polygon = [];
  for (var i = 0; i < lineArr.length; i++) {
    var coor = lineArr[i];
    var coorArray = coor.split(',');
    array.push([parseFloat(coorArray), parseFloat(coorArray[1])]);
    array1.push([parseFloat(coorArray), parseFloat(coorArray[1])]);
  }
  // console.log('array=', array);
  polygon.push(array1);
  // let polygon = polyline;
  let polygon1 = new AMap.Polygon({
    path: [array],
    strokeWeight: 1,
    fillOpacity: 0,
    fillColor: '#80d8ff',
    strokeColor: '#0091ea'
  })
  let Bounds = polygon1.getBounds();
  let northEast = Bounds.northEast ? Bounds.northEast.toString().split(',') : Bounds.northeast.toString().split(',');
  let southWest = Bounds.southWest ? Bounds.southWest.toString().split(',') : Bounds.southwest.toString().split(',');

  // console.log("aaa2=", polygon1.getSize())
  map.add(polygon1);

  // 绘制kriging插值图

  var drawKriging = function () {
    let xlim = [southWest[0], northEast[0]];
    let ylim = [southWest[1], northEast[1]];


    //移除已有图层
    if (CanvasLayer !== null) {
      map.remove(CanvasLayer);
    }
    if (values.length >= 3) {
      var variogram = kriging.train(values, lngs, lats, params.krigingModel, params.krigingSigma2, params.krigingAlpha);
      //根据scope边界线的范围，计算范围变量
      var grid = kriging.grid([array1], variogram, (ylim[1] - ylim[0]) / 200);
      // 创建新图层
      var canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      canvas.style.display = 'block';
      //设置canvas透明度
      canvas.getContext('2d').globalAlpha = params.canvasAlpha;
      //使用分层设色渲染
      kriging.plot(canvas, grid, [xlim[0], xlim[1]], [ylim[0], ylim[1]], params.colors);
      CanvasLayer = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: new AMap.Bounds(
          [southWest[0], southWest[1], northEast[0], northEast[1]],
        ),
      })
      CanvasLayer.setMap(map);

      let ele = document.querySelectorAll(".amap-layers");
      // console.log('====================================');
      // console.log('ele='.ele);
      // console.log('====================================');
      html2canvas(ele, { allowTaint: true }).then(function (_canvas) {
        // debugger
        let a = _canvas.toDataURL(1);
        let image = new Image();
        image.src = a;
        // let gif = new window.GIF({
        //   workers: 2,
        //   quality: 10,
        //   // width: 1000,
        //   // height: 700,
        //   workerScript: '/gif/gif.worker.js',
        // })
        if (gif) {
          gif.addFrame(image)
          // gif.addFrame(_canvas, { delay: 1000 })
        }
        // gif.on('finished', function (blob) {
        //   //下载动作
        //   var el = document.createElement('a');
        //   el.href = URL.createObjectURL(blob);
        //   el.download = 'demo-name'; //设置下载文件名称
        //   document.body.appendChild(el);
        //   var evt = document.createEvent("MouseEvents");
        //   evt.initEvent("click", false, false);
        //   el.dispatchEvent(evt);
        //   document.body.removeChild(el);

        // });
        // gif.render();
      })

    }
  };

  drawKriging();
}
