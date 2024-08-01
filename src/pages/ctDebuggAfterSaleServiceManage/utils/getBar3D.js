import * as echarts from 'echarts';



export function bar3DrenderItem(params, api, type, e, color1, color2, color3, otherPar) {
  
  let offsetX  = 16 , offsetY = 8 ;
  if(otherPar){
    offsetY = otherPar.offsetY || offsetY, offsetX  = otherPar.offsetX || offsetX;
  }
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - offsetY, shape.y - offsetY];
      const c2 = [xAxisPoint[0] - offsetY, xAxisPoint[1] - (otherPar?.bottomAngle? offsetY : 0)]; //bottomAngle 底部是否有斜角
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath();
    },
  });
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c1 = [shape.x, shape.y];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - (otherPar?.bottomAngle? offsetY : 0)];
      const c4 = [shape.x + offsetX, shape.y - offsetY];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const c1 = [shape.x, shape.y];
      const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
      const c3 = [shape.x + (otherPar?.topOffsetY || offsetY), shape.y - (otherPar?.topOffsetX || offsetX)];
      const c4 = [shape.x - offsetY, shape.y - offsetY];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });

  echarts.graphic.registerShape("CubeLeft", CubeLeft);
  echarts.graphic.registerShape("CubeRight", CubeRight);
  echarts.graphic.registerShape("CubeTop", CubeTop);
  const location = api.coord([api.value(0), api.value(1)]);
  return {
    type: "group",
    children: [
      {
        type: "CubeLeft",
        shape: {
          api,
          xValue: api.value(0),
          yValue: api.value(1),
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color1 }, { offset: 1, color: color2 }
          ]),
        },
      },
      {
        type: "CubeRight",
        shape: {
          api,
          xValue: api.value(0),
          yValue: api.value(1),
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color1 }, { offset: 1, color: color2 }
          ]),
        },
      },
      {
        type: "CubeTop",
        shape: {
          api,
          xValue: api.value(0),
          yValue: api.value(1),
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color3 }, { offset: 1, color: color3 }
          ]),
        },
      },
    ],
  };
}