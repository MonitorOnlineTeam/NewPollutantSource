import React, { PureComponent } from 'react'
import { Map, Marker, Markers, Circle } from 'react-amap';
import { connect } from 'dva'
import styles from '../index.less'
import { Drawer, Button, Select, Form, DatePicker, Checkbox, Row, Col, Spin, Divider, Collapse, Table, Tooltip, Input, Popconfirm, InputNumber } from 'antd';
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
}))
class Identify extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      dispatchType: 'MaterialType',
      visible: true,
      dataSource: [],
      resultDataSource: [],
      TYPE: 7,
      checkedValue: [1, 2, 3, 4, 5, 6, 7, 8],
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
      selectedRowKeys: [],
      _selectedRowKeys: [],
      markersList: [],
      markerPosition: {},
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
      fieldNames: {
        MaterialType: { value: 'MaterialTypeCode', name: 'MaterialTypeName', type: 7, KEY: 'MaterialCode' },
        EquipmentType: { value: 'EquipmentTypeCode', name: 'EquipmentTypeName', type: 8, KEY: 'EquipmentCode' },
        VehicleType: { value: 'VehicleTypeCode', name: 'VehicleTypeName', type: 9, KEY: 'VehicleCode' },
      },
      columns: {
        MaterialType: {
          columns: [
            {
              title: '存储单位',
              dataIndex: 'EntName',
              key: 'EntName',
              // width: 140,
              ellipsis: true,
            },
            {
              title: '物资类型',
              dataIndex: 'MaterialTypeName',
              key: 'MaterialTypeName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '物资名称',
              dataIndex: 'MaterialName',
              key: 'MaterialName',
              // width: 206,
              ellipsis: true,
            },
          ],
          resultsColumns: [
            {
              title: '存贮单位',
              dataIndex: 'EntName',
              key: 'EntName',
              // width: 140,
              ellipsis: true,
            },
            {
              title: '物资类型',
              dataIndex: 'MaterialTypeName',
              key: 'MaterialTypeName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '物资名称',
              dataIndex: 'MaterialName',
              key: 'MaterialName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '操作',
              key: 'handle',
              // width: 100,
              render: (text, record) => {
                return <Tooltip title="删除">
                  <Popconfirm
                    placement="left"
                    title="确认是否删除?"
                    onConfirm={() => {
                      this.delSensitiveOrEnt(record.RelationCode, record.MaterialCode)
                    }}
                    okText="是"
                    cancelText="否">
                    <a href="#"><DelIcon /></a>
                  </Popconfirm>
                </Tooltip>
              }
            },
          ],
        },
        EquipmentType: {
          columns: [
            {
              title: '存储单位',
              dataIndex: 'EntName',
              key: 'EntName',
              // width: 140,
              ellipsis: true,
            },
            {
              title: '装备类型',
              dataIndex: 'EquipmentTypeName',
              key: 'EquipmentTypeName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '装备名称',
              dataIndex: 'EquipmentName',
              key: 'EquipmentName',
              // width: 206,
              ellipsis: true,
            },
          ],
          resultsColumns: [
            {
              title: '存储单位',
              dataIndex: 'EntName',
              key: 'EntName',
              // width: 140,
              ellipsis: true,
            },
            {
              title: '装备类型',
              dataIndex: 'EquipmentTypeName',
              key: 'EquipmentTypeName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '装备名称',
              dataIndex: 'EquipmentName',
              key: 'EquipmentName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '操作',
              key: 'handle',
              // width: 100,
              render: (text, record) => {
                return <Tooltip title="删除">
                  <Popconfirm
                    placement="left"
                    title="确认是否删除?"
                    onConfirm={() => {
                      this.delSensitiveOrEnt(record.RelationCode)
                    }}
                    okText="是"
                    cancelText="否">
                    <a href="#"><DelIcon /></a>
                  </Popconfirm>
                </Tooltip>
              }
            },
          ],
        },
        VehicleType: {
          columns: [
            {
              title: '所在企业',
              dataIndex: 'EntName',
              key: 'EntName',
              // width: 140,
              ellipsis: true,
            },
            {
              title: '车辆类型',
              dataIndex: 'VehicleTypeName',
              key: 'VehicleTypeName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '车辆名称',
              dataIndex: 'VehicleName',
              key: 'VehicleName',
              // width: 206,
              ellipsis: true,
            },
          ],
          resultsColumns: [
            {
              title: '存储单位',
              dataIndex: 'EntName',
              key: 'EntName',
              // width: 140,
              ellipsis: true,
            },
            {
              title: '车辆类型',
              dataIndex: 'VehicleTypeName',
              key: 'VehicleTypeName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '车辆名称',
              dataIndex: 'VehicleName',
              key: 'VehicleName',
              // width: 206,
              ellipsis: true,
            },
            {
              title: '操作',
              key: 'handle',
              // width: 100,
              render: (text, record) => {
                return <Tooltip title="删除">
                  <Popconfirm
                    placement="left"
                    title="确认是否删除?"
                    onConfirm={() => {
                      this.delSensitiveOrEnt(record.RelationCode)
                    }}
                    okText="是"
                    cancelText="否">
                    <a href="#"><DelIcon /></a>
                  </Popconfirm>
                </Tooltip>
              }
            },
          ],
        },
      },

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
    this.getDutyOne();
    this.getDictionaryList();
    // this.getNarrationEntList(true);
    this.getSaveList(true);
  }

  // 获取数据
  getDutyOne = () => {
    this._dispatch('emergency/getDutyOne', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode
    }, (res) => {
      this.setState({
        markerPosition: {
          longitude: res.Longitude,
          latitude: res.Latitude,
        }
      })
    })
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

  // 获取分析结果
  getListTable = (init) => {
    this._dispatch('emergency/getListTable', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: this.state.TYPE,
      ParamType: this.state.checkedValue.toString(),
    }, (res) => {
      let markersList = [];
      let dataSource = [];
      let selectedRowKeys = [];
      // 筛选范围内的企业
      res.map(item => {
        let lnglat = new window.AMap.LngLat(item.Longitude, item.Latitude)
        if (window.circle && window.circle.contains && window.circle.contains(lnglat)) {
          markersList.push({
            ...item,
            position: {
              longitude: item.Longitude,
              latitude: item.Latitude
            },
            title: item.EntName + ' - ' + item.MaterialName,
          })
          dataSource.push(item)
        }
        // if (item.IsChecked === 1) {
        //   selectedRowKeys.push(item.MaterialCode)
        // }
      })
      this.setState({ markersList, dataSource }, () => {
        setTimeout(() => {
          // this.setState({ selectedRowKeys })
          thisMap.setFitView()
        }, 1000)
      })
    })
  }

  // 获取下拉列表数据
  getDictionaryList = () => {
    this._dispatch('emergency/getDictionaryList')
  }

  // 分析涉事企业
  onFilterEntList = () => {
    if (window.circle) {
      this.getNarrationEntList();
    }
  }

  renderMarkers = (extData) => {
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
    this.setState({ selectedRowKeys: selectedRowKeys });
  }

  // 保存
  onSave = (selected) => {
    this._dispatch('emergency/saveDispatch', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: this.state.TYPE,
      ChildrenCode: selected
    }, (res) => {
      this.getSaveList();
    })
  }

  // 获取保存后的数据
  getSaveList = (init) => {
    this._dispatch('emergency/getRelationTable', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: this.state.TYPE,
    }, (res) => {
      let markersList = [];
      let selectedRowKeys = [];
      res.map(item => {
        if (item.Longitude && item.Latitude) {
          markersList.push({
            ...item,
            position: {
              longitude: item.Longitude,
              latitude: item.Latitude
            },
            title: item.EntName + ' - ' + item.MaterialName,
          })
        }
        selectedRowKeys.push(item[this._SELF_.fieldNames[this.state.dispatchType].KEY])
      })
      this.setState({
        resultDataSource: res,
        _selectedRowKeys: selectedRowKeys,
        selectedRowKeys: selectedRowKeys,
      })
      if (init) {
        this.setState({
          markersList: markersList,
        }, () => {
          if (thisMap) {
            thisMap.setFitView()
          } else {
            setTimeout(() => {
              thisMap.setFitView()
            }, 1000)
          }
        })
      }

    })
  }

  // 删除
  delSensitiveOrEnt = (code) => {
    this._dispatch('emergency/deleteDispatch', {
      RelationCode: code,
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: this.state.TYPE,
    }, (res) => {
      this.getSaveList();
      // let selectedRowKeys = [...this.state.selectedRowKeys];
      // let index = selectedRowKeys.indexOf(key);
      // if (index > -1) {//大于0 代表存在，
      //   selectedRowKeys.splice(index, 1);//存在就删除
      // }
      // this.setState({
      //   selectedRowKeys: selectedRowKeys
      // })
    })
  }

  // 调度类型改变
  onDispatchTypeChange = (value) => {
    let checkedValue = [];
    this.props.dictionaryList[value].map(item => {
      checkedValue.push(item[this._SELF_.fieldNames[value].value])
    })

    this.setState({ dispatchType: value, checkedValue: checkedValue, dataSource: [], TYPE: this._SELF_.fieldNames[value].type }, () => {
      if (this._SELF_._radius) {
        this.getListTable();
        this.getSaveList();
      } else {
        this.getSaveList(true);
      }
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
    const { dictionaryList, dutyOneData, saveEntList, initInfoSaveLoading, saveMinganList } = this.props;
    console.log('this.props=', this.props)
    console.log('this.state=', this.state)
    const { radius, selectedRowKeys, _selectedRowKeys, visible, pointList, markersList, checkedValue, dataSource, resultDataSource, markerPosition, lngLatFromMap, dispatchType } = this.state;
    const { columns, fieldNames } = this._SELF_;

    const entRowSelection = {
      selectedRowKeys: selectedRowKeys,
      getCheckboxProps: (record) => ({
        disabled: _selectedRowKeys.includes(record[fieldNames[dispatchType].KEY]),
        // name: record.EntName,
      }),
      onChange: this.onEntSelectChange,
    };

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
          title="应急物资调度"
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
          <Collapse defaultActiveKey={['1', '2']} bordered={false} >
            <Panel header="调度类型" key="1">
              <label for="Comment" class="ant-form-item-required" title="勘测范围">调度类型：</label>
              <Select style={{ width: '200px' }} placeholder="请选择调度类型" value={dispatchType} onChange={(value) => { this.onDispatchTypeChange(value) }}>
                <Option value='MaterialType'>物资调度</Option>
                <Option value='EquipmentType'>应急装备</Option>
                <Option value='VehicleType'>车辆调度</Option>
              </Select>
            </Panel>
            <Panel header="应急物资" key="2">
              <div style={{ padding: '0px 0px 20px' }}>
                <Checkbox.Group value={checkedValue} onChange={(checkedValue) => { this.setState({ checkedValue }) }}>
                  <Row>
                    {
                      dictionaryList[dispatchType].map(item => {
                        return <Col span={8}>
                          <Checkbox defaultChecked value={item[fieldNames[dispatchType].value]}>{item[fieldNames[dispatchType].name]}</Checkbox>
                        </Col>
                      })
                    }
                  </Row>
                </Checkbox.Group>
              </div>
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
                    this.getListTable();
                  })
                }}>分析</Button>
              </div>
              <Divider dashed style={{ margin: '10px 0' }} />
              <div>
                <p className={styles.title}>分析结果</p>
                <Table rowKey={(record) => record[fieldNames[dispatchType].KEY]} rowSelection={entRowSelection} border={true} dataSource={dataSource} columns={columns[dispatchType].columns} size={'small'} pagination={false} />
                <Divider orientation="right" style={{ margin: '20px 0' }}>
                  <Button type="primary" style={{ width: 100 }} onClick={() => this.onSave(this.state.selectedRowKeys)}>保存</Button>
                </Divider>
              </div>
              <div>
                <p className={styles.title}>涉事企业</p>
                <Table rowKey={(record) => record[fieldNames[dispatchType].KEY]} border={true} dataSource={resultDataSource} columns={columns[dispatchType].resultsColumns} size={'small'} pagination={false} />
              </div>
            </Panel>
          </Collapse>
        </Drawer>
      </>
    );
  }
}

export default Identify;