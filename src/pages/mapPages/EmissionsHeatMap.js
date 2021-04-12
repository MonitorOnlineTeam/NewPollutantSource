import React, { PureComponent } from 'react'
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva'
import styles from './heatMap.less'
import { Drawer, Button, Form, DatePicker, Radio, Divider, Table, Tooltip } from 'antd';
import moment from 'moment'
import TableText from '@/components/TableText'
import config from "@/config";
import $script from 'scriptjs';
import { EntIcon } from '@/utils/icon';

let thisMap;
let heatmap;
let mapMarkers;
const { amapKey } = config;
const dividerStyle = { margin: '10px 0' }
const initialValues = {
  beginTime: moment().startOf('year'),
  endTime: moment(),
  type: 2,
  pollutantCodes: '03'
}
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    render: (text, record, index) => {
      return index + 1;
    }
  },
  {
    title: '企业',
    dataIndex: 'EntName',
    key: 'EntName',
    width: 206,
    render: (text, record) => {
      return <TableText content={text} />
    }
  },
  {
    title: '排放量',
    dataIndex: 'Discharge',
    key: 'Discharge',
    width: 110,
  },
];

@connect(({ loading, map }) => ({
  entEmissionsData: map.entEmissionsData,
  markersEntList: map.markersEntList,
  loading: loading.effects['map/getEntEmissionsData'],
}))
class EmissionsHeatMap extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      visible: true,
      showType: 2,
      plugins: [{
        name: 'ControlBar',
        options: {
          visible: true,
          position: {
            top: '50px',
            right: '10px'
          }
        }
      }],
      mode: '2D'
    };
    this.amapEvents = {
      created: (mapInstance) => {
        thisMap = mapInstance;
        let values = this.formRef.current.getFieldsValue() || initialValues;
        this.getEntEmissionsData(values)
      },
      zoomchange: () => {
        this.onMapZoomChange()
      }
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    heatmap = undefined;
  }

  onSubmit = () => {
    let values = this.formRef.current.getFieldsValue();
    this.getEntEmissionsData(values)
  }


  getEntEmissionsData = (params) => {
    this.props.dispatch({
      type: "map/getEntEmissionsData",
      payload: {
        ...params,
        beginTime: moment(params.beginTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(params.endTime).format('YYYY-MM-DD 23:59:59'),
      },
      callback: (res) => {
        let heatmapData = res.map(item => {
          return {
            lng: item.Longitude,
            lat: item.Latitude,
            count: item.Discharge
          }
        })
        this.setState({
          heatmapData: heatmapData
        })
        this.renderHeatMap(heatmapData)
      }
    })
  }

  renderHeatMap = (heatmapData) => {
    if (window.AMap) {
      let heatmapOpts = {
        // //3d 相关的参数
        '3d': {
          //热度转高度的曲线控制参数，可以利用左侧的控制面板获取
          heightBezier: [0, 0, 0.948, 0.965],
          //取样精度，值越小，曲面效果越精细，但同时性能消耗越大
          gridSize: 2,
          heightScale: 1
        }
        // radius: 25, //给定半径
        // opacity: [0, 0.8]
      };

      if (!heatmap) {

        //初始化heatmap对象
        window.AMap.plugin(['AMap.Heatmap'], () => {
          heatmap = new window.AMap.Heatmap(thisMap, heatmapOpts);
        })
        heatmap.setDataSet({
          data: heatmapData,
          max: 100
        });
      } else {
        heatmap.setDataSet({
          data: heatmapData,
          max: 100
        });
      }
      console.log('heatmap=', heatmap)
      if (heatmapData.length) {
        thisMap.setCenter([heatmapData[0].lng, heatmapData[1].lat]);
        thisMap.setFitView();
      }
    }
  }

  onMapZoomChange = () => {
    let zoom = thisMap.getZoom();
    console.log('zoom=', zoom)
    if (zoom >= 10) {
      this.setState({
        showMarkers: true,
      })
      // mapMarkers.setMarkers(this.props.markersEntList)
    } else {
      this.setState({
        showMarkers: false,
      })

      // mapMarkers.clearMarkers();
    }
  }


  renderMarkers = (extData) => {
    return <div>
      <Tooltip overlayClassName={styles.tooltip} color={"#fff"}
        title={
          <span style={{ color: "#000" }}>{extData.title}<br />
            <span style={{ color: "#666", fontSize: 12 }}>排放量：{extData.count}</span>
          </span>
        }
      >
        <EntIcon style={{ fontSize: 28 }} />
      </Tooltip>
    </div>
  }

  render() {
    const { entEmissionsData, markersEntList, loading } = this.props;
    const { showType, showMarkers, mode } = this.state;
    return (
      <div
        className={styles.pageWrapper}
        ref={(div) => { this.div = div }}
      >
        <Drawer
          title="排放量分析"
          width={432}
          closable={false}
          // onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          getContainer={() => this.div}
          mask={false}
          style={{ marginTop: 64 }}
        >
          <Form
            hideRequiredMark
            ref={this.formRef}
            initialValues={initialValues}
          >
            <Form.Item
              name="beginTime"
              label="开始时间"
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <DatePicker placeholder="请选择开始时间" />
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item
              name="endTime"
              label="结束时间"
              rules={[{ required: true, message: '请选择结束时间' }]}
            >
              <DatePicker placeholder="请选择结束时间" disabledDate={(current) => {
                return current && current < this.formRef.current.getFieldValue('beginTime')
              }} />
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item
              name="type"
              label="监测类型"
              rules={[{ required: true, message: '请选择监测类型' }]}
            >
              <Radio.Group onChange={(e) => {
                if (e.target.value === 1) {
                  this.formRef.current.setFieldsValue({ 'pollutantCodes': '011' })
                } else {
                  this.formRef.current.setFieldsValue({ 'pollutantCodes': '03' })
                }
                this.setState({
                  showType: e.target.value
                })

              }}>
                <Radio value={2}>废气</Radio>
                <Radio value={1}>废水</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item
              name="pollutantCodes"
              label="监测因子"
              rules={[{ required: true, message: '请选择监测因子' }]}
            >
              {
                showType === 2 ?
                  <Radio.Group>
                    <Radio value={'03'}>氮氧化物</Radio>
                    <Radio value={'02'}>二氧化硫</Radio>
                    <Radio value={'01'}>烟尘</Radio>
                  </Radio.Group> :
                  <Radio.Group>
                    <Radio value={'011'}>化学需氧量</Radio>
                    <Radio value={'060'}>氨氮</Radio>
                    <Radio value={'101'}>总磷</Radio>
                    <Radio value={'0065'}>总氮</Radio>
                  </Radio.Group>
              }
            </Form.Item>
            <Divider orientation="right">
              <Button type="primary" style={{ width: 100 }} onClick={this.onSubmit}>查询</Button>
            </Divider>
          </Form>
          <Table rowkey={record => record.EntCode} loading={loading} size="small" dataSource={entEmissionsData} columns={columns} pagination={false} scroll={{ y: 'calc(100vh - 460px)' }} />
        </Drawer>
        <Radio.Group className={styles.viewMode} defaultValue="2D" buttonStyle="solid" onChange={e => {
          heatmap = undefined;
          this.setState({ mode: e.target.value }, () => {
            // this.onSubmit()
          })
        }}>
          <Radio.Button value="2D">2D</Radio.Button>
          <Radio.Button value="3D">3D</Radio.Button>
        </Radio.Group>
        {/* <Button onClick={() => {
          console.log('heatmapData=', this.state.heatmapData)

        }}>2D</Button> */}
        {
          mode === '3D' && <Map
            amapkey={amapKey}
            events={this.amapEvents}
            viewMode='3D'
            zoom={5}
            pitchEnable={true}
            pitch={60}
            expandZoomRange={true}
            buildingAnimation={true}
            resizeEnable={true}
            plugins={this.state.plugins}
          >
            <Markers
              markers={showMarkers && markersEntList.length ? markersEntList : []}
              // className={this.state.special}
              render={this.renderMarkers}
            />
          </Map>
        }
        {
          mode === '2D' && <Map
            amapkey={amapKey}
            events={this.amapEvents}
            zoom={5}
          >
            <Markers
              markers={showMarkers && markersEntList.length ? markersEntList : []}
              // className={this.state.special}
              render={this.renderMarkers}
            />
          </Map>
        }
      </div>
    );
  }
}

export default EmissionsHeatMap;
