import React, { PureComponent } from 'react'
import { Map, Marker, Markers, Circle } from 'react-amap';
import { connect } from 'dva'
import styles from '../index.less'
import { Drawer, Button, Select, Form, DatePicker, Radio, Spin, Divider, Collapse, Table, Tooltip, Input, Popconfirm, InputNumber } from 'antd';
import moment from 'moment'
import TableText from '@/components/TableText'
import config from "@/config";
import $script from 'scriptjs';
import { EntIcon, DelIcon } from '@/utils/icon';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import CustomIcon from '@/components/CustomIcon';
import Cookie from 'js-cookie';

let thisMap;
let mapMarkers;
let ruler;
const { Option } = Select;
const { Panel } = Collapse;
const { amapKey } = config;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dividerStyle = { margin: '3px 0' }
const initialValues = {
  beginTime: moment().startOf('year'),
  endTime: moment(),
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
    dataIndex: 'Abbreviation',
    key: 'Abbreviation',
    width: 206,
    render: (text, record) => {
      return <TableText content={`${record.EntName}`} />
    }
  },
  {
    title: '排放量（t）',
    dataIndex: 'Discharge',
    key: 'Discharge',
    width: 110,
  },
];

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
  dutyOneData: emergency.dutyOneData,
  saveEntList: emergency.saveEntList,
  saveMinganList: emergency.saveMinganList,
  initInfoSaveLoading: loading.effects['emergency/saveIdentifyInfo'],
  getDutyOneLoading: loading.effects['emergency/getDutyOne'],
}))
class Identify extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      visible: true,
      sheShiEntList: [],
      minganPointList: [],
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
      entSelectedRowKeys: [],
      markersList: [],
      markerPosition: {},
      minganMarkersList: [],
      lngLatFromMap: false,  // 是否从地图上获取经纬度
      style: {
        strokeColor: "#ff3838",  //线颜色
        strokeOpacity: 0.7,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#e25247",  //填充颜色
        fillOpacity: 0.35 //填充透明度
      },
    };
    this._SELF_ = {
      AlarmInfoCode: this.props.history.location.query.code,
      entColumns: [
        {
          title: '行业类别',
          dataIndex: 'IndustryType',
          key: 'IndustryType',
          width: 140,
          ellipsis: true,
        },
        {
          title: '企业',
          dataIndex: 'Abbreviation',
          key: 'Abbreviation',
          width: 206,
          ellipsis: true,
        }
      ],
      entResultsColumns: [
        {
          title: '行业类别',
          dataIndex: 'IndustryType',
          key: 'IndustryType',
          width: 140,
          ellipsis: true,
        },
        {
          title: '企业',
          dataIndex: 'Abbreviation',
          key: 'Abbreviation',
          width: 206,
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'handle',
          width: 100,
          render: (text, record) => {
            return <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确认是否删除?"
                onConfirm={() => {
                  this.delSensitiveOrEnt(record.RelationCode, 2, record.EntCode)
                }}
                okText="是"
                cancelText="否">
                <a href="#"><DelIcon /></a>
              </Popconfirm>
            </Tooltip>
          }
        },
      ],
      minganColumns: [
        {
          title: '类型',
          dataIndex: 'SensitiveTypeName',
          key: 'SensitiveTypeName',
          width: 120,
          ellipsis: true,
        },
        {
          title: '敏感点名称',
          dataIndex: 'SensitiveName',
          key: 'SensitiveName',
          width: 230,
          ellipsis: true,
        },
      ],
      minganResultsColumns: [
        {
          title: '类型',
          dataIndex: 'SensitiveTypeName',
          key: 'SensitiveTypeName',
          width: 120,
          ellipsis: true,
        },
        {
          title: '敏感点名称',
          dataIndex: 'SensitiveName',
          key: 'SensitiveName',
          width: 230,
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'handle',
          width: 100,
          render: (text, record) => {
            return <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确认是否删除?"
                onConfirm={() => {
                  this.delSensitiveOrEnt(record.RelationCode, 1, record.EntCode)
                }}
                okText="是"
                cancelText="否">
                <a href="#"><DelIcon /></a>
              </Popconfirm>
            </Tooltip>
          }
        },
      ],
    }
    // 地图
    this.amapEvents = {
      created: (mapInstance) => {
        thisMap = mapInstance;
        thisMap.setLayers([new window.AMap.TileLayer.Satellite(), new window.AMap.TileLayer.RoadNet()])
        window.AMap.plugin(["AMap.RangingTool"], function () {
          ruler = new window.AMap.RangingTool(mapInstance);
        });
      },
      click: e => {
        if (this.state.lngLatFromMap) {
          let position = {
            longitude: e.lnglat.lng,
            latitude: e.lnglat.lat,
          }
          this.formRef.current.setFieldsValue({ 'Longitude': position.longitude, 'Latitude': position.latitude })
          this.setState({
            markerPosition: position
          })
        }
      }
    };

    // 圆形覆盖物
    this.circleEvents = {
      created: (ins) => {
        window.circle = ins
        // let values = this.formRef.current.getFieldsValue();
        // this.getFeaturesPolList(values)
      },
    }
  }

  componentDidMount() {
    this.getDictionaryList();
    this.getDutyOne();
    this.getNarrationEntList(true);
    this.getSensitiveList(true);
    this.getSaveList(2);
    this.getSaveList(1);
  }

  _dispatch = (actionType, payload, callback) => {
    this.props.dispatch({
      type: actionType,
      payload: payload,
      callback: (res) => {
        callback && callback(res)
      }
    })
  }

  // 获取数据
  getDutyOne = () => {
    this._dispatch('emergency/getDutyOne', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode
    }, (res) => {
      console.log('res=', res)
      this.setState({
        markerPosition: {
          longitude: res.Longitude,
          latitude: res.Latitude,
        }
      })
    })
  }

  // 获取涉事企业
  getNarrationEntList = (init) => {
    this._dispatch('emergency/getNarrationEntList', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 2
    }, (res) => {
      let markersList = [];
      let sheShiEntList = [];
      let entSelectedRowKeys = [];
      if (init) {
        // 只加载地图上的点
        res.map(item => {
          markersList.push({
            ...item,
            position: {
              longitude: item.Longitude,
              latitude: item.Latitude
            },
            title: item.EntName,
          })
        })
      } else {
        // 筛选范围内的企业
        res.map(item => {
          let lnglat = new window.AMap.LngLat(item.Longitude, item.Latitude)
          if (window.circle.contains(lnglat)) {
            markersList.push({
              ...item,
              position: {
                longitude: item.Longitude,
                latitude: item.Latitude
              },
              title: item.EntName,
            })
            sheShiEntList.push(item)
          }
          if (item.IsChecked === 1) {
            entSelectedRowKeys.push(item.EntCode)
          }
        })
      }
      this.setState({ markersList, sheShiEntList }, () => {
        setTimeout(() => {
          this.setState({ entSelectedRowKeys })
          thisMap.setFitView()
        }, 1000)
      })
    })
  }

  // 获取敏感目标
  getSensitiveList = (init) => {
    this._dispatch('emergency/getSensitiveList', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 1
    }, (res) => {
      let minganMarkersList = [];
      let minganPointList = [];
      if (init) {
        // 只加载地图上的点
        res.map(item => {
          minganMarkersList.push({
            ...item,
            position: {
              longitude: item.Longitude,
              latitude: item.Latitude
            },
            title: item.SensitiveName,
          })
        })
      } else {
        // 筛选范围内的企业
        res.map(item => {
          let lnglat = new window.AMap.LngLat(item.Longitude, item.Latitude)
          if (window.circle.contains(lnglat)) {
            minganMarkersList.push({
              ...item,
              position: {
                longitude: item.Longitude,
                latitude: item.Latitude
              },
              title: item.SensitiveName,
            })
            minganPointList.push(item)
          }
        })
      }
      this.setState({ minganMarkersList, minganPointList }, () => {
        setTimeout(() => {
          thisMap.setFitView()
        }, 1000)
      })
    })
  }

  // 获取下拉列表数据
  getDictionaryList = () => {
    this._dispatch('emergency/getDictionaryList')
  }

  // 保存甄别基本信息
  onSubmit = () => {
    let values = this.formRef.current.getFieldsValue();
    let postData = {
      ...values,
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      ScreenBeginTime: values.time[0].format("YYYY-MM-DD 00:00:00"),
      ScreenEndTime: values.time[1].format("YYYY-MM-DD 23:59:59"),
    }
    this._dispatch('emergency/saveIdentifyInfo', postData)
  }


  // 分析涉事企业
  onFilterEntList = () => {
    if (window.circle) {
      this.getNarrationEntList();
    }
  }

  // 分析敏感点
  onFilterSensitiveList = () => {
    this.setState({ radius: this._SELF_._radius })
    if (window.circle) {
      this.getSensitiveList();
    }
  }

  renderMarkers = (extData) => {
    return <div>
      <Tooltip overlayClassName={styles.tooltip} color={"#fff"}
        title={
          <span style={{ color: "#000" }}>{extData.title}<br /></span>
        }
      >
        <EntIcon />
      </Tooltip>
    </div>
  }

  renderMinganMarkers = (extData) => {
    return <div style={{ border: "2px solid #fff", borderRadius: '50%', }}>
      <Tooltip overlayClassName={styles.tooltip} color={"#fff"}
        title={
          <span style={{ color: "#000" }}>{extData.title}<br /></span>
        }
      >
        <div style={{ backgroundColor: "#fff", width: 16, height: 16, borderRadius: '50%', border: '4px solid red' }}></div>
      </Tooltip>
    </div>
  }

  onEntSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys=', selectedRowKeys)
    this.setState({ entSelectedRowKeys: selectedRowKeys });
  }

  onMinganSelectChange = (selectedRowKeys) => {
    this.setState({ minganSelectedRowKeys: selectedRowKeys });
  }

  // 保存涉事企业或敏感点
  onSave = (type, selected) => {
    this._dispatch('emergency/saveEntAndMingan', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: type,
      ChildrenCode: selected
    }, (res) => {
      if (type === 2) {
        this.getNarrationEntList();
      } else {
        this.getSensitiveList();
      }
    })
  }

  // 获取保存后的涉事企业或敏感点
  getSaveList = (type) => {
    this._dispatch('emergency/getSaveEntAndMingan', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: type,
    }, (res) => {
      let selectedRowKeys = [];
      if (type === 1) {
        selectedRowKeys = res.map(item => item.SensitiveCode);
        this.setState({
          minganSelectedRowKeys: selectedRowKeys,
        })
      } else {
        selectedRowKeys = res.map(item => item.EntCode);
        this.setState({
          entSelectedRowKeys: selectedRowKeys,
        })
      }
    })
  }

  // 删除涉事企业及敏感点
  delSensitiveOrEnt = (code, type, EntCode) => {
    this._dispatch('emergency/delSensitiveOrEnt', {
      RelationCode: code,
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: type,
    }, (res) => {
      this.getSaveList(type);

      // let selectedRowKeys = [...this.state.entSelectedRowKeys];
      // if (type === 1) {
      //   selectedRowKeys = [...this.state.minganSelectedRowKeys];
      // }
      // let index = selectedRowKeys.indexOf(EntCode);
      // if (index > -1) {//大于0 代表存在，
      //   selectedRowKeys.splice(index, 1);//存在就删除
      //   _selectedRowKeys.splice(index, 1);//存在就删除
      // }
      // if (type === 1) {
      //   this.setState({
      //     minganSelectedRowKeys: selectedRowKeys
      //   })
      // } else {
      //   this.setState({
      //     entSelectedRowKeys: selectedRowKeys,
      //   })
      // }
    })
  }


  // 配置抽屉及动画效果左右区分
  changeState = (domId) => {
    this.setState({
      visible: !this.state.visible,
    }, () => {
      const dom = document.querySelector(domId)
      if (dom) {
        const left = this.state.visible ? '432px' : '0';
        dom.style.width = this.state.visible ? 'calc(100vw - 432px)' : '100vw'
        dom.style.marginRight = left
        // floats === "topmenu" ? dom.style.marginLeft = left : dom.style.marginRight = left
        dom.style.transition = 'all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1)';
      }
    });
  };

  render() {
    const { dictionaryList, dutyOneData, saveEntList, initInfoSaveLoading, getDutyOneLoading, saveMinganList } = this.props;
    console.log('this.props=', this.props)
    console.log('this.state=', this.state)
    const { sheShiEntList, radius, entSelectedRowKeys, visible, pointList, markersList, minganSelectedRowKeys, minganMarkersList, minganPointList, markerPosition, lngLatFromMap } = this.state;
    const { entColumns, entResultsColumns, minganColumns, minganResultsColumns } = this._SELF_;

    const entRowSelection = {
      selectedRowKeys: entSelectedRowKeys,
      getCheckboxProps: (record) => ({
        disabled: entSelectedRowKeys.includes(record.EntCode) && record.IsChecked,
        name: record.EntName,
      }),
      onChange: this.onEntSelectChange,
    };

    const minganRowSelection = {
      selectedRowKeys: minganSelectedRowKeys,
      getCheckboxProps: (record) => ({
        // disabled: record.IsChecked == 1,
        disabled: minganSelectedRowKeys.includes(record.SensitiveCode),
      }),
      onChange: this.onMinganSelectChange,
    };
    // if (!window.AMap) {
    //   return <Spin></Spin>
    // }
    return (
      <>
        <div
          className={styles.pageWrapper}
          ref={(div) => { this.div = div }}
          id="characteristicPollutant"
        >
          <Map
            amapkey={amapKey}
            events={this.amapEvents}
            // layers={window.AMap ? [new window.AMap.TileLayer.Satellite(), new window.AMap.TileLayer.RoadNet()] : []}
            zoom={5}
          >
            {/* 涉事企业 */}
            <Markers
              markers={markersList}
              // className={this.state.special}
              render={this.renderMarkers}
            />
            {/* 敏感点 */}
            <Markers
              markers={minganMarkersList}
              // className={this.state.special}
              render={this.renderMinganMarkers}
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
        </div>
        <Drawer
          title="特征污染物分析"
          width={432}
          closable={false}
          // onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80, padding: "10px", height: "calc(100vh - 80px)" }}
          // getContainer={() => this.div}
          mask={false}
          className={styles.toggleDrawer}
          style={{ marginTop: 64 }}
        >
          <div
            className={styles.toggleIconContainer}
            style={{
              right: visible ? '432px' : 0,
              borderRadius: '4px 0px 0px 4px',
            }} onClick={() => this.changeState('#characteristicPollutant')}>
            <a href="#">
              {
                visible ? <CaretRightOutlined className={styles.toggleIcon} />
                  : <CaretLeftOutlined className={styles.toggleIcon} />
              }
            </a>
          </div>
          <Collapse defaultActiveKey={['1', '2', '3']} bordered={false} >
            <Panel header="甄别基本信息" key="1">
              {
                getDutyOneLoading ? <Spin></Spin> :
                  <Form
                    {...layout}
                    // hideRequiredMark
                    ref={this.formRef}
                    onFinish={this.onSubmit}
                    initialValues={{
                      ...dutyOneData,
                      // Comment: dutyOneData.Comment,
                      IsEmergency: dutyOneData.IsEmergency !== null ? dutyOneData.IsEmergency : 1,
                      ScreenPerson: dutyOneData.ScreenPerson || JSON.parse(Cookie.get('currentUser')).UserName,
                      time: dutyOneData.ScreenBeginTime ? [moment(dutyOneData.ScreenBeginTime), moment(dutyOneData.ScreenEndTime)] : [],
                      // InfoType: dutyOneData.InfoType,
                      // InfoLevel: dutyOneData.InfoLevel,
                      // Address: dutyOneData.Address,
                      // Pollutant: dutyOneData.Pollutant,
                      // ScreeInfo: dutyOneData.ScreeInfo,
                    }}
                  >
                    <Form.Item
                      name="Comment"
                      label="事件名称"
                      rules={[{ required: true, message: '请填写事件名称' }]}
                    >
                      <Input style={{ width: 200 }} placeholder="请填写事件名称" />
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item
                      name="IsEmergency"
                      label="是否应急事故"
                      rules={[{ required: true, message: '请选择是否应急事故' }]}
                    >
                      <Radio.Group onChange={(e) => {

                      }}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item
                      name="ScreenPerson"
                      label="甄别人"
                      rules={[{ required: true, message: '请填写甄别人' }]}
                    >
                      <Input style={{ width: 200 }} placeholder="请填写甄别人" />
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item
                      name="time"
                      label="甄别时间"
                      rules={[{ required: true, message: '请选择时间' }]}
                    >
                      <RangePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />

                    <Form.Item
                      name="InfoType"
                      label="事件类型"
                      rules={[{ required: true, message: '请选择事件类型' }]}
                    >
                      <Select>
                        {
                          dictionaryList.InfoType.map(item => {
                            return <Option value={item.InfoTypeCode} key={item.InfoTypeCode}>{item.InfoTypeName}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="InfoLevel"
                      label="事故级别"
                      rules={[{ required: true, message: '请选择事故级别' }]}
                    >
                      <Select>
                        <Option value={1}>一般</Option>
                        <Option value={2}>较大</Option>
                        <Option value={3}>重大</Option>
                        <Option value={4}>特大</Option>
                      </Select>
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item
                      label="详细地址"
                      name="Address"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item
                      label="主要污染物"
                      name="Pollutant"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item
                      label="甄别分析"
                      name="ScreenInfo"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                    <Divider dashed style={dividerStyle} />
                    <Form.Item label={<span>&nbsp;&nbsp;&nbsp;&nbsp;经纬度</span>}>
                      <Form.Item
                        name="Longitude"
                        rules={[{ required: true, message: '请输入经度' }]}
                        style={{ display: 'inline-block', width: 100 }}
                      >
                        <Input placeholder="经度" />
                      </Form.Item>
                      <Form.Item
                        name="Latitude"
                        rules={[{ required: true, message: '请输入纬度' }]}
                        style={{ display: 'inline-block', width: 100, margin: '0 6px' }}
                      >
                        <Input placeholder="纬度" />
                      </Form.Item>
                      <Button size="small" type={lngLatFromMap ? 'primary' : 'dashed'} style={{ marginTop: 4 }} onClick={() => {
                        this.setState({
                          lngLatFromMap: !lngLatFromMap,
                        })
                      }}>地图获取</Button>
                    </Form.Item>
                    <Divider orientation="right">
                      <Button type="primary" htmlType="submit" style={{ width: 100 }} loading={initInfoSaveLoading}>保存</Button>
                    </Divider>
                  </Form>
              }
            </Panel>
            <Panel header="涉事企业" key="2">
              <div style={{ marginLeft: 20 }}>
                <label for="Comment" class="ant-form-item-required" title="勘测范围">勘测范围：</label>
                <InputNumber
                  style={{ width: '160px' }}
                  min={0.01}
                  placeholder="请输入勘测范围（半径）"
                  onChange={(val) => { this._SELF_._radius = val }}
                />
                <span className="ant-form-text"> 千米</span>
                <Button type="primary" style={{ float: 'right' }} onClick={() => {
                  this._SELF_.radiusType = 2;
                  this.setState({ radius: this._SELF_._radius }, () => {
                    this.getNarrationEntList();
                  })
                }}>分析</Button>
              </div>
              <Divider dashed style={{ margin: '10px 0' }} />
              <div>
                <p className={styles.title}>分析结果</p>
                <Table rowKey={(record) => record.EntCode} rowSelection={entRowSelection} border={true} dataSource={sheShiEntList} columns={entColumns} size={'small'} pagination={false} />
                <Divider orientation="right" style={{ margin: 0 }}>
                  <Button type="primary" style={{ width: 100 }} onClick={() => this.onSave(2, this.state.entSelectedRowKeys)}>保存</Button>
                </Divider>
              </div>
              <div>
                <p className={styles.title}>涉事企业</p>
                <Table rowKey={(record) => record.EntCode} border={true} dataSource={saveEntList} columns={entResultsColumns} size={'small'} pagination={false} />
              </div>
            </Panel>
            <Panel header="敏感点" key="3">
              <div style={{ marginLeft: 20 }}>
                <label for="Comment" class="ant-form-item-required" title="勘测范围">勘测范围：</label>
                <InputNumber
                  style={{ width: '160px' }}
                  min={0.01}
                  placeholder="请输入勘测范围（半径）"
                  onChange={(val) => { this._SELF_._radius = val }}
                />
                <span className="ant-form-text"> 千米</span>
                <Button type="primary" style={{ float: 'right' }} onClick={() => {
                  this.setState({ radius: this._SELF_._radius }, () => {
                    this.getSensitiveList();
                  })
                }}>分析</Button>
              </div>
              <Divider dashed style={{ margin: '10px 0' }} />
              <div>
                <p className={styles.title}>分析结果</p>
                <Table rowKey={(record) => record.SensitiveCode} rowSelection={minganRowSelection} border={true} dataSource={minganPointList} columns={minganColumns} size={'small'} pagination={false} />
                <Divider orientation="right" style={{ margin: 0 }}>
                  <Button type="primary" style={{ width: 100 }} onClick={() => this.onSave(1, this.state.minganSelectedRowKeys)}>保存</Button>
                </Divider>
              </div>
              <div>
                <p className={styles.title}>事故影响的敏感目标</p>
                <Table border={true} dataSource={saveMinganList} columns={minganResultsColumns} size={'small'} pagination={false} />
              </div>
            </Panel>
          </Collapse>
        </Drawer>
      </>
    );
  }
}

export default Identify;