import React, { PureComponent } from 'react'
import { Map, Marker, Markers, Circle } from 'react-amap';
import { connect } from 'dva'
import styles from './heatMap.less'
import { Drawer, Button, Form, DatePicker, Radio, Divider, Table, Tooltip, Input } from 'antd';
import moment from 'moment'
import TableText from '@/components/TableText'
import config from "@/config";
import $script from 'scriptjs';
import { EntIcon } from '@/utils/icon';
import PointDetailsModal from './component/PointDetailsModal'

let thisMap;
let mapMarkers;
const { amapKey } = config;
const dividerStyle = { margin: '3px 0' }
const initialValues = {
  beginTime: moment().startOf('year'),
  endTime: moment(),
  dataType: 'HourData',
  PollutantType: 2,
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
      return <TableText content={`${text}-${record.PointName}`} />
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
  pointDetailsModalVisible: map.pointDetailsModalVisible,
  loading: loading.effects['map/getFeaturesPolList'],
}))
class CharacteristicPollutant extends PureComponent {
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
      mode: '2D',
      pointList: [],
      markersList: [],
      markerPosition: {},
      dataType: 'HourData',
      lngLatFromMap: false,  // 是否从地图上获取经纬度
      style: {
        strokeColor: "#ff9800",  //线颜色
        strokeOpacity: 1,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#e2cfa3",  //填充颜色
        fillOpacity: 0.35 //填充透明度
      },
    };
    // 地图
    this.amapEvents = {
      created: (mapInstance) => {
        thisMap = mapInstance;
      },
      click: e => {
        if (this.state.lngLatFromMap) {
          let position = {
            longitude: e.lnglat.lng,
            latitude: e.lnglat.lat,
          }
          this.formRef.current.setFieldsValue({ 'longitude': position.longitude, 'latitude': position.latitude })
          this.setState({
            markerPosition: position
          })
        }
      }
    };

    // 圆形覆盖物
    this.circleEvents = {
      created: (ins) => {
        // console.log('ins=', ins)
        // console.log(window.circle = ins)
        window.circle = ins
        let values = this.formRef.current.getFieldsValue();
        this.getFeaturesPolList(values)
      },
    }
  }

  componentDidMount() {
  }

  onSubmit = () => {
    let values = this.formRef.current.getFieldsValue();
    console.log('values=', values)
    this.setState({
      markerPosition: {
        longitude: values.longitude,
        latitude: values.latitude,
      },
      lngLatFromMap: false,
      radius: values.radius,
    })
    if (window.circle) {
      this.getFeaturesPolList(values)
    }
  }


  getFeaturesPolList = (params) => {
    let dataType = this.state.dataType;
    let beginFormat = 'YYYY-MM-DD HH:00:00'
    let endFormat = 'YYYY-MM-DD HH:59:59'
    if (dataType === 'MinuteData') {
      beginFormat = 'YYYY-MM-DD HH:mm:00'
      endFormat = 'YYYY-MM-DD HH:mm:59'
    }
    this.props.dispatch({
      type: "map/getFeaturesPolList",
      payload: {
        ...params,
        beginTime: moment(params.beginTime).format(beginFormat),
        endTime: moment(params.endTime).format(endFormat),
      },
      callback: (res) => {
        let pointList = [];
        let markersList = [];
        res.map(item => {
          let lnglat = new window.AMap.LngLat(item.Longitude, item.Latitude)
          if (window.circle.contains(lnglat)) {
            pointList.push(item)
            markersList.push({
              ...item,
              position: {
                longitude: item.Longitude,
                latitude: item.Latitude
              },
              title: item.EntName + "-" + item.PointName,
              count: item.Discharge,
              level: this.getLevel(markersList.length ? markersList[0].count : item.Discharge, item.Discharge),
            })
          }
        })
        this.setState({
          pointList: pointList,
          markersList: markersList,
        })

        setTimeout(() => {
          thisMap.setFitView()
        }, 0)
      }
    })
  }

  getLevel = (max, dis) => {
    let level = 4;
    let max25 = max * 0.25;
    let max50 = max * 0.5;
    let max75 = max * 0.75;
    if (dis >= 0 && dis <= max25) {
      level = 4;
    }
    else if (dis > max25 && dis <= max50) {
      level = 3;
    }
    else if (dis > max50 && dis <= max75) {
      level = 2;
    }
    else if (dis > max75) {
      level = 1;
    }
    return level; 
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
        <div className={`${styles.point} ${styles['level' + extData.level]}`} onClick={() => this.onShowPointDetails(extData)} ></div>
      </Tooltip>
    </div>
  }

  getTime = () => {
    let dataType = this.state.dataType;
    let beginTime = moment().subtract(1, 'days');
    let endTime = moment();
    if (dataType === 'MinuteData') {
      beginTime = moment().subtract(1, 'hours');
      endTime = moment();
    }

    return [beginTime, endTime];
  }

  onShowPointDetails = (extData) => {
    this.setState({
      selectedPointInfo: {
        ...extData,
        type: this.formRef.current.getFieldValue('PollutantType'),
        Abbreviation: extData.EntName,
        title: extData.PointName
      }
    }, () => {
      this.props.dispatch({
        type: 'map/updateState',
        payload: {
          pointDetailsModalVisible: true
        }
      })
    })
  }

  render() {
    const { entEmissionsData, loading, pointDetailsModalVisible } = this.props;
    const { showType, radius, selectedPointInfo, pointList, markersList, showMarkers, mode, dataType, markerPosition, lngLatFromMap } = this.state;
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
            onFinish={this.onSubmit}
            initialValues={{
              beginTime: this.getTime()[0],
              endTime: this.getTime()[1],
              dataType: 'HourData',
              PollutantType: 2,
              pollutantCodes: '03'
            }}
          >
            <Form.Item
              name="beginTime"
              label="开始时间"
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <DatePicker style={{ width: 200 }} placeholder="请选择开始时间" showTime format={dataType === 'HourData' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD HH:mm'} />
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item
              name="endTime"
              label="结束时间"
              rules={[{ required: true, message: '请选择结束时间' }]}
            >
              <DatePicker
                format={dataType === 'HourData' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD HH:mm'}
                style={{ width: 200 }} showTime placeholder="请选择结束时间" disabledDate={(current) => {
                  return current && current < this.formRef.current.getFieldValue('beginTime')
                }} />
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item
              name="dataType"
              label="时间范围"
              rules={[{ required: true, message: '请选择监测类型' }]}
            >
              <Radio.Group onChange={(e) => {
                this.setState({ dataType: e.target.value }, () => {
                  let times = this.getTime();
                  this.formRef.current.setFieldsValue({ 'beginTime': times[0], 'endTime': times[1] })
                })
              }}>
                <Radio value={'HourData'}>小时</Radio>
                <Radio value={'MinuteData'}>分钟</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item
              name="PollutantType"
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
            <Divider dashed style={dividerStyle} />
            <Form.Item
              label="勘测范围"
              name="radius"
              rules={[{ required: true }]}
            // style={{ display: 'inline-block', width: 100 }}
            >
              <Input addonBefore="半径" addonAfter="千米" placeholder="请输入勘测范围（半径）" />
            </Form.Item>
            <Divider dashed style={dividerStyle} />
            <Form.Item label={<span>&nbsp;&nbsp;&nbsp;&nbsp;经纬度</span>}>
              <Form.Item
                name="longitude"
                rules={[{ required: true, message: '请输入经度' }]}
                style={{ display: 'inline-block', width: 100 }}
              >
                <Input placeholder="经度" />
              </Form.Item>
              <Form.Item
                name="latitude"
                rules={[{ required: true, message: '请输入纬度' }]}
                style={{ display: 'inline-block', width: 100, margin: '0 6px' }}
              >
                <Input placeholder="纬度" />
              </Form.Item>
              <Button size="small" type={lngLatFromMap ? 'primary' : 'dashed'} style={{ marginTop: 4 }} onClick={() => {
                this.setState({
                  lngLatFromMap: !lngLatFromMap,
                  radius: undefined
                })
              }}>地图获取</Button>
            </Form.Item>
            <Divider orientation="right">
              <Button type="primary" htmlType="submit" style={{ width: 100 }}>查询</Button>
            </Divider>
          </Form>
          <Table rowkey={record => record.EntCode} loading={loading} size="small" dataSource={pointList} columns={columns} pagination={false} scroll={{ y: 'calc(100vh - 550px)' }} />
        </Drawer>
        <Map
          amapkey={amapKey}
          events={this.amapEvents}
          zoom={5}
        >
          <Markers
            markers={markersList}
            // className={this.state.special}
            render={this.renderMarkers}
          />
          <Marker position={markerPosition} />
          {
            radius && <Circle
              center={markerPosition}
              radius={radius * 1000}
              events={this.circleEvents}
              visible={radius}
              style={this.state.style}
              zIndex={0}
            />
          }
        </Map>
        {pointDetailsModalVisible && <PointDetailsModal pointInfo={selectedPointInfo} />}
      </div>
    );
  }
}

export default CharacteristicPollutant;