import * as echarts from 'echarts';
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - 8, shape.y - 8];
      const c2 = [xAxisPoint[0] - 8, xAxisPoint[1] - 0];
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
      const c3 = [xAxisPoint[0] + 16, xAxisPoint[1] - 0];
      const c4 = [shape.x + 16, shape.y - 8];
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
      const c2 = [shape.x + 16, shape.y - 8];
      const c3 = [shape.x + 8, shape.y - 16];
      const c4 = [shape.x - 8, shape.y - 8];
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

  
  export function bar3DrenderItem (params, api, type, e,color1,color2,color3) {
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