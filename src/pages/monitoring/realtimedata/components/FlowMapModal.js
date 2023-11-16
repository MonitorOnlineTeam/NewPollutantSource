/*
 * @Author: JiaQi
 * @Date: 2023-02-08 11:34:48
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-10 11:00:59
 * @Description: 二氧化碳工艺流程图
 */

import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './ProcessFlowChart.less';
import { Card, Descriptions, Popover, Tabs, Modal, Spin, Table, Empty } from 'antd';
import { load_data } from '../_util';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';

const { TabPane } = Tabs;
// const columns = [
//   {
//     title: '孔位 1- m/s',
//     dataIndex: 'flow1',
//     key: 'flow1',
//     align: 'center'
//   },
//   {
//     title: '孔位 2- m/s',
//     dataIndex: 'flow2',
//     key: 'flow2',
//     align: 'center'
//   },
//   {
//     title: '孔位 3- m/s',
//     dataIndex: 'flow3',
//     key: 'flow3',
//     align: 'center'
//   },
//   {
//     title: '孔位 4- m/s',
//     dataIndex: 'flow4',
//     key: 'flow4',
//     align: 'center'
//   },
// ];

@connect(({ realtimeserver, loading }) => ({
  paramsInfo: realtimeserver.paramsInfo,
  CEMSOpen: realtimeserver.CEMSOpen,
  QCStatus: realtimeserver.QCStatus,
  CO2Rate: realtimeserver.CO2Rate,
  CO2SampleGasValue: realtimeserver.CO2SampleGasValue,
  O2SampleGasValue: realtimeserver.O2SampleGasValue,
  currentPointData: realtimeserver.currentPointData,
}))
class FlowMapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FlowMeterType: 1,
      modalLoading: true,
      scale: 1,
      translation: { x: 0, y: 0 },
    };
  }

  componentDidMount() {
    // const { FlowHor, FlowVer, ChimneyHeight, ChimneyWidth, FlowMeterType } = this.props.currentPointData;
    // this.setState({
    //   // modalLoading: false,
    //   yNum: FlowHor,
    //   xNum: FlowVer,
    //   height: ChimneyHeight,
    //   width: ChimneyWidth,
    //   FlowMeterType: FlowMeterType
    // }, () => {
    // })
    setTimeout(() => {
      this.renderCanvas();
    }, 50);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(this.props.paramsInfo) !== JSON.stringify(prevProps.paramsInfo) &&
      this.props.visible === true
    ) {
      this.renderCanvas(false);
    }
  }

  // 渲染canvas
  renderCanvas = () => {
    const {
      paramsInfo,
      currentPointData: { yNum, xNum, height, width, FlowMeterType },
    } = this.props;
    if (FlowMeterType == 2) {
      // this.setState({
      // }, () => {
      let flows = paramsInfo.filter(item => item.pollutantCode.indexOf('_') > -1);
      console.log('flows', flows);
      //生成数据
      let points = [];

      let max_x = xNum;
      let x_grid_len = ((width * 1000) / xNum).toFixed(1);
      let max_y = yNum;
      let y_grid_len = ((height * 1000) / yNum).toFixed(1);
      let count = 0;
      if (flows.length) {
        for (var i = 0; i < max_x; i++) {
          for (var j = 0; j < max_y; j++) {
            // console.log('i', i)
            // console.log('j', j)
            points.push({
              x: i * x_grid_len + x_grid_len / 2,
              y: j * y_grid_len + y_grid_len / 2,
              // "value": flows[i + 1 * 6 - j].value
              value: flows[i * 6 + j].value,
            });
          }
        }
        console.log('points', points);

        let dg = new K_Grid(max_x, x_grid_len, max_y, y_grid_len, points);
        dg.draw();
      }
      // setTimeout(() => {
      this.setState({
        modalLoading: false,
      });
      // }, 50)
    }
  };

  renderFlows = data => {
    const {
      paramstatusInfo,
      paramsInfo,
      currentPointData: { yNum, xNum, height, width, FlowMeterType },
    } = this.props;
    let dataSource = [],
      columns = [];
    let flows = paramsInfo.filter(item => item.pollutantCode.indexOf('_') > -1);
    if (xNum && yNum && flows.length) {
      dataSource = new Array(yNum);
      // 根据列数量生成表头
      for (let i = 0; i < xNum; i++) {
        columns[i] = {
          title: `孔位 ${i + 1}- m/s`,
          dataIndex: `flow${i + 1}`,
          key: `flow${i + 1}`,
          align: 'center',
        };
      }

      //流速
      let max_x = xNum;
      let max_y = yNum;
      for (let i = 0; i < yNum; i++) {
        dataSource[i] = {};
      }
      if (flows.length) {
        console.log('flows', flows);
        for (var i = 0; i < max_x; i++) {
          for (var j = 0; j < max_y; j++) {
            let value = flows.find(item => item.pollutantName === `流速${i + 1}-${j + 1}`).value;
            console.log('value', value);
            dataSource[j]['flow' + (i + 1)] = value;
          }
        }
      }
    }
    return <Table bordered pagination={false} dataSource={dataSource} columns={columns} />;
  };

  render() {
    const { translation, modalLoading, FlowMeterType } = this.state;
    const {
      visible,
      onCancel,
      paramsInfo,
      CEMSOpen,
      QCStatus,
      valveStatus,
      CO2Rate,
      CO2SampleGasValue,
      O2SampleGasValue,
      wrapperStyle,
      vertical,
      scale,
    } = this.props;

    let isFlowsData = paramsInfo.filter(item => item.pollutantCode.indexOf('_') > -1);
    return (
      <Modal
        title="查看烟道流场分布图及流速详情"
        width={'636px'}
        visible={true}
        bodyStyle={{ padding: '0 20px 10px', height: 784, width: 636, overflow: 'auto' }}
        footer={false}
        wrapClassName={styles.myModal}
        onCancel={onCancel}
        destroyOnClose
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="烟道流场分布图" key="1">
            <Spin spinning={modalLoading}>
              <div
                style={{
                  margin: '30px 60px',
                  position: 'relative',
                  width: 550,
                  height: 690,
                }}
              >
                {isFlowsData.length ? (
                  <>
                    <canvas id="canvas_chart"></canvas>
                    <canvas id="canvas_x"></canvas>
                    <canvas id="canvas_y"></canvas>
                    <canvas id="canvas_lengend" className={styles.canvas_lengend}></canvas>
                    <div id="canvas_y_title">z（m）</div>
                    <div id="canvas_x_title">x（m）</div>
                    <div id="canvas_lengend_title">流速（m/s）</div>
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </Spin>
          </TabPane>
          <TabPane tab="流速数据" key="2">
            {this.renderFlows()}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default FlowMapModal;
