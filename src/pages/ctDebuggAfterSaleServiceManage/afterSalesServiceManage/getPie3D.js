import { fomatFloat } from '@/utils/utils';

//获取3d丙图的最高扇区的高度
function getHeight3D(series, height) {
    series.sort((a, b) => {
        return (b.pieData.value - a.pieData.value);
    })
    return height * 25 / series[0].pieData.value;
}



// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
    // 计算
    let midRatio = (startRatio + endRatio) / 2;
    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;
    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
    }
    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    k = typeof k !== 'undefined' ? k : 1 / 3;
    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    let hoverRate = isHovered ? 1.05 : 1;
    // 返回曲面参数方程
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
        },
        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
        },
        x: function (u, v) {
            if (u < startRadian) {
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        y: function (u, v) {
            if (u < startRadian) {
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        z: function (u, v) {
            if (u < -Math.PI * 0.5) {
                return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
                return Math.sin(u) * h * .1;
            }
            return Math.sin(v) > 0 ? 1 * h * .1 : -1;
        }
    };
}



export function getPie3D(pieData, internalDiameterRatio,legend) {
     
    //internalDiameterRatio:透明的空心占比
    let series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    let legendData = [];
    let legendBfb = [];
    let k = 1 - internalDiameterRatio;
    pieData.sort((a, b) => {
        return (b.value - a.value);
    });
    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;
        let seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k: k
            },
            center: ['50%', '50%']
        };

        if (typeof pieData[i].itemStyle != 'undefined') {
            let itemStyle = {};
            typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
            typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
            // itemStyle.opacity = 0.5
            seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    legendData = [];
    legendBfb = [];
    for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
            false, false, k, series[i].pieData.value);
        startValue = endValue;
        let bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
        legendData.push({
            name: series[i].name,
            value: bfb
        });
        legendBfb.push({
            name: series[i].name,
            value: bfb
        });
    }
    let boxHeight = getHeight3D(series, 20);//通过传参设定3d饼/环的高度，20代表20px
    // 准备待返回的配置项，把准备好的 legendData、series 传入。
    let option = {
        legend: legend && {
            data: legendData,
            orient: 'vertical',
            right: 0,
            y: 'center',
            itemGap: 16,
            show: true,
            itemWidth: 14,  // 设置图例标记的宽度
            itemHeight: 14, // 设置图例标记的高度
            formatter: function (param) {
                
                let item = legendBfb.filter(item => item.name == param)[0];
                let bfs = fomatFloat(item.value * 100, 2);
                return `{a|${item.name}}{b|${bfs + '%'}}`
            },
            textStyle: {
                padding:[2,0,0,4],
                fontFamily: 'Microsoft YaHei',
                rich: {
                    a: {
                    width:120,
                    fontSize:14,
                    color: "#666",
                  },
                  b: {
                    padding: [0, 0, 0, 2],
                    fontWeight:'bold',
                    color: "#2189FC",
                    fontSize:14,
                  },
                },
              },
        },
        labelLine: {
            show: false,
            lineStyle: {
                color: '#7BC0CB'
            }
        },
        label: {
            show: false,
            position: 'outside',
            rich: {
                b: {
                    color: '#7BC0CB',
                    fontSize: 12,
                    lineHeight: 20
                },
                c: {
                    fontSize: 16,
                },
            },
            formatter: '{b|{b} \n}{c|{c}}{b| }',

        },
        tooltip: {
            formatter: params => {
                if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
                    let bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) *
                        100).toFixed(2);
                    return `${params.seriesName}<br/>` +
                        `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                        `${bfb}%`;
                }
            }
        },
        xAxis3D: {
            min: -1,
            max: 1
        },
        yAxis3D: {
            min: -1,
            max: 1
        },
        zAxis3D: {
            min: -1,
            max: 1
        },
        grid3D: {
            show: false,
            boxHeight: boxHeight, //圆环的高度
            width: '100%',
            left: 0,
            viewControl: { //3d效果可以放大、旋转等，请自己去查看官方配置
                alpha: 40, //角度
                distance: 265,//调整视角到主体的距离，类似调整zoom
                rotateSensitivity: 0, //设置为0无法旋转
                zoomSensitivity: 0, //设置为0无法缩放
                panSensitivity: 0, //设置为0无法平移
                autoRotate: true //自动旋转
            }
        },
        series: series
    };
    return option;

}

let selectedIndex = '';
let hoveredIndex = '';
export function chartClick(myChart,that, params) {
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    // 监听点击事件，实现选中效果（单选）
    // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
    let isSelected = !that.option.series[params.seriesIndex].pieStatus.selected;
    let isHovered = that.option.series[params.seriesIndex].pieStatus.hovered;
    let k = that.option.series[params.seriesIndex].pieStatus.k;
    let startRatio = that.option.series[params.seriesIndex].pieData.startRatio;
    let endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
    // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
    if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
        that.option.series[selectedIndex].parametricEquation = getParametricEquation(that.option.series[
            selectedIndex].pieData
            .startRatio, that.option.series[selectedIndex].pieData.endRatio, false, false, k, that.option.series[
                selectedIndex].pieData
            .value);
        that.option.series[selectedIndex].pieStatus.selected = false;
    }
    // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
    that.option.series[params.seriesIndex].parametricEquation = getParametricEquation(startRatio, endRatio,
        isSelected,
        isHovered, k, that.option.series[params.seriesIndex].pieData.value);
    that.option.series[params.seriesIndex].pieStatus.selected = isSelected;
    // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
    isSelected ? selectedIndex = params.seriesIndex : null;
    // 使用更新后的 option，渲染图表
    myChart.setOption(that.option);

}
export function chartMouseover(myChart,that, params) {
    // 准备重新渲染扇形所需的参数
    let isSelected;
    let isHovered;
    let startRatio;
    let endRatio;
    let k;
    // 如果触发 mouseover 的扇形当前已高亮，则不做操作
    if (hoveredIndex === params.seriesIndex) {
        return;
        // 否则进行高亮及必要的取消高亮操作
    } else {
        // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
        if (hoveredIndex !== '') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = that.option.series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio = that.option.series[hoveredIndex].pieData.startRatio;
            endRatio = that.option.series[hoveredIndex].pieData.endRatio;
            k = that.option.series[hoveredIndex].pieStatus.k;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            that.option.series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio,
                isSelected,
                isHovered, k, that.option.series[hoveredIndex].pieData.value);
            that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = '';
        }
        // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
        if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected = that.option.series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio = that.option.series[params.seriesIndex].pieData.startRatio;
            endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
            k = that.option.series[params.seriesIndex].pieStatus.k;
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            that.option.series[params.seriesIndex].parametricEquation = getParametricEquation(startRatio, endRatio,
                isSelected, isHovered, k, that.option.series[params.seriesIndex].pieData.value + 5);
            that.option.series[params.seriesIndex].pieStatus.hovered = isHovered;
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(that.option);
    }
}

export function chartMouseout(myChart,that, params) {  // 修正取消高亮失败的 bug
    // 准备重新渲染扇形所需的参数
    let isSelected;
    let isHovered;
    let startRatio;
    let endRatio;
    let k;
    if (hoveredIndex !== '') {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
        isSelected = that.option.series[hoveredIndex].pieStatus.selected;
        isHovered = false;
        k = that.option.series[hoveredIndex].pieStatus.k;
        startRatio = that.option.series[hoveredIndex].pieData.startRatio;
        endRatio = that.option.series[hoveredIndex].pieData.endRatio;
        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
        that.option.series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio,
            isSelected,
            isHovered, k, that.option.series[hoveredIndex].pieData.value);
        that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
        // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
        hoveredIndex = '';
    }
    // 使用更新后的 option，渲染图表
    myChart.setOption(that.option);
}