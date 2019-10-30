/*
 * @Author: lzp
 * @Date: 2019-08-16 09:48:47
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-17 15:31:10
 * @Description: 运维记录
 */
import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Tooltip, Card, Tag } from 'antd';
import { connect } from 'dva';
import Center from '@/pages/account/center';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
import { router } from 'umi'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BdTestRecordContent from '@/pages/EmergencyTodoList/BdTestRecordContent'
import SDLTable from '@/components/SdlTable'
import { routerRedux } from 'dva/router';
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal'

const { Option } = Select;

@connect(({ operationform, loading }) => ({
  RecordTypeTree: operationform.RecordTypeTree,
  RecordTypeTreeLoading: loading.effects['operationform/getrecordtypebymn'],
  JZDatas: operationform.JZDatas,
  rangDate: operationform.rangDate,
  RecordType: operationform.RecordType,
  BeginTime: operationform.BeginTime,
  EndTime: operationform.EndTime,
  currentRecordType: operationform.currentRecordType,
  recordTypeList: operationform.recordTypeList,
  currentDate: operationform.currentDate,
}))
@Form.create()
class OperationRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeDate: [moment(new Date()).add(-3, 'month'), moment(new Date())],
      formats: 'YYYY-MM-DD',
      configName: "",
      columns: [
        {
          title: '运维人',
          dataIndex: 'CreateUserID',
          key: 'CreateUserID',
        },
        {
          title: '分析仪校准是否正常',
          dataIndex: 'Content',
          key: 'Content',
          render: (text, record) => {
            var item = record.Content.split('),')
            var itemlist = []
            item.map((m, index) =>
              itemlist.push(<Tag>{m + (index != item.length - 1 ? ')' : '')}</Tag>)
            )
            return itemlist
          }
        },
        {
          title: '记录时间',
          dataIndex: 'CreateTime',
          key: 'CreateTime',
        },
        {
          title: '操作',
          dataIndex: 'TaskID',
          key: 'TaskID',
          render: (text, record) => {
            return <Tooltip title="详情">
              <a onClick={() => {
                router.push('/operations/recordForm/' + record.TypeID + '/' + record.TaskID)
              }}><Icon type="profile" style={{ fontSize: 16 }} /></ a>
            </Tooltip>
          }
        },
      ]
    }
  }
  //表单类型改变事件
  onTreeChange = (value) => {
    this.props.dispatch({
      type: "operationform/updateState",
      payload: {
        RecordType: value
      }
    })
    this.props.dispatch({
      type: "operationform/updateState",
      payload: {
        currentRecordType: value
      }
    })
    setTimeout(() => {
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.getRecordType()
        }
      })
    }, 0)

    if (value == '8') {
      this.props.dispatch({
        type: 'operationform/getjzhistoryinfo',
        payload: {
          DGIMN: this.props.DGIMN,
          BeginTime: this.props.BeginTime,
          EndTime: this.props.EndTime
        }
      })
    }
  }
  // onTreeSearch = (val) => {
  // }
  componentDidMount() {
    this.getOperationrecordData(this.props)
  }

  // 获取数据
  getOperationrecordData = (props) => {
    this.props.dispatch({
      type: 'operationform/getOperationLogList',
      payload: {
        DGIMN: props.DGIMN,
        // RecordType: this.props.currentRecordType
      },
      callback: () => {
        // 获取table数据
        this.props.dispatch({
          type: 'autoForm/getPageConfig',
          payload: {
            configId: this.getRecordType()
          }
        })
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.PollutantType != nextProps.PollutantType) {
      this.getOperationrecordData(nextProps)
    }
    if (this.props.DGIMN !== nextProps.DGIMN && this.props.PollutantType === nextProps.PollutantType) {
      // 获取table数据
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.getRecordType(nextProps.DGIMN)
        }
      })
    }
  }

  //根据表单类型获取configid
  getRecordType = (DGIMN) => {
    var configid = ''
    var type = this.props.PollutantType
    // const defaultValue = currentRecordType ? currentRecordType : (recordTypeList[0] ? recordTypeList[0].TypeId : undefined);
    const currentRecordType = this.props.currentRecordType || 1;
    if (type == "2") {
      switch (currentRecordType) {
        case 1://维修记录表
          configid = 'FormMainInfoRepair'
          break;
        case 2://停机记录表
          configid = 'FormMainInfoStop'
          break;
        case 3://易耗品更换记录表
          configid = 'FormMainInfoCon'
          break;
        case 4://标准气体更换记录表
          configid = 'FormMainInfoGas'
          break;
        case 5://完全抽取法CEMS日常巡检记录表
          configid = 'FormMainInfoPatrol'
          break;
        case 6://稀释采样法CEMS日常巡检记录表
          configid = 'FormMainInfoPatrol'
          break;
        case 7://直接测量法CEMS日常巡检记录表
          configid = 'FormMainInfoPatrol'
          break;
        case 8://CEMS零点量程漂移与校准记录表
          configid = ''
          break;
        case 9://CEMS校验测试记录
          configid = 'FormMainInfoTestResult'
          break;
        case 10://CEMS设备数据异常记录表
          configid = 'FormMainInfoDeviceExce'
          break;
        case 27://保养项记录表
          configid = 'FormMainInfoMain'
          break;
        case 28://备品备件记录表
          configid = 'FormMainInfoSpare'
          break;
      }
    }
    else {
      configid = 'FormMainInfoPic'
    }
    this.setState({
      configName: configid,
      searchParams: [
        { "Key": "dbo__T_Bas_Task__DGIMN", "Value": DGIMN || this.props.DGIMN, "Where": "$=" },
        { "Key": "dbo__T_Bas_FormMainInfo__TypeID", "Value": currentRecordType, "Where": "$=" },
        { "Key": "dbo__T_Bas_FormMainInfo__CreateTime", "Value": this.props.currentDate[0], "Where": "$gte" },
        { "Key": "dbo__T_Bas_FormMainInfo__CreateTime", "Value": this.props.currentDate[1], "Where": "$lte" }]
    })
    return configid
  }

  /** 切换时间 */
  _handleDateChange = (date, dateString) => {
    this.setState({
      rangeDate: date,
    });
    this.props.dispatch({
      type: "operationform/updateState",
      payload: {
        rangDate: date,
        BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        currentDate: [date[0], date[1]]
      }
    })
    setTimeout(() => {
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.getRecordType()
        }
      })
    }, 0)
    if (this.props.currentRecordType == '8') {
      this.props.dispatch({
        type: 'operationform/getjzhistoryinfo',
        payload: {
          DGIMN: this.props.DGIMN,
          BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
          EndTime: date[1].format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
  };

  render() {
    const { RecordTypeTree, recordTypeList, currentRecordType } = this.props
    const { columns, searchParams } = this.state
    const defaultValue = currentRecordType ? currentRecordType : (recordTypeList[0] ? recordTypeList[0].TypeId : undefined);
    const currentType = currentRecordType || 1;
    const currentDate = this.props.currentDate;
    return (
      <div >
        <Card
          extra={
            <>
              <Select
                style={{ width: 220 }}
                onChange={this.onTreeChange}
                // onSearch={this.onTreeSearch}
                value={defaultValue}
                placeholder="请选择表单类型"
                loading={this.props.RecordTypeTreeLoading}
              >
                {
                  // recordTypeList.map(option => {
                  //   return RecordTypeTree.length ?
                  //     <Option key={option.key} value={option.key}>{option.value}</Option> :
                  //     ""
                  // })
                  recordTypeList.map(item => {
                    return <Option value={item.TypeId} key={item.TypeId}>{item.Abbreviation}</Option>
                  })
                }
              </Select>
              <RangePicker_
                style={{ width: 350, textAlign: 'left', marginRight: 10, }}
                dateValue={currentDate}
                allowClear={false}
                format={this.state.formats}
                onChange={this._handleDateChange}
              />
              <Radio.Group defaultValue="operationrecord" buttonStyle="solid" onChange={(e) => {
                if (e.target.value === "log") {
                  router.push(`/operations/log`)
                }
              }}>
                <Radio.Button value="log">运维日志</Radio.Button>
                <Radio.Button value="operationrecord">运维记录</Radio.Button>
              </Radio.Group>
            </>
          }
        >
          <Card.Grid style={{ width: '100%', height: 'calc(100vh - 270px)', overflow: "auto", ...this.props.style, }}>
            {this.props.currentRecordType == '8' ?
              <SDLTable
                dataSource={this.props.JZDatas}
                columns={columns}
              >
              </SDLTable>
              :
              ((this.state.configName && currentType) ? <AutoFormTable
                // (this.state.configName && this.props.RecordType ? <AutoFormTable
                configId={this.state.configName}
                searchParams={searchParams}
                appendHandleRows={row => {
                  return <Tooltip title="详情">
                    <a onClick={() => {
                      if (this.props.PollutantType == "2") {
                        router.push('/operations/recordForm/' + currentType + '/' + row['dbo.T_Bas_Task.ID'])
                      } else {
                        // 获取详情图片
                        this.props.dispatch({
                          type: "common/getOperationImageList",
                          payload: {
                            FormMainID: row['dbo.T_Bas_RecordFormPic.FormMainID']
                            // FormMainID:"c521b4a0-5b67-45a8-9ad1-d6ca67bdadda"
                          },
                          callback: (res) => {
                            this.setState({
                              visible: true
                            })
                          }
                        })
                      }
                    }}><Icon type="profile" style={{ fontSize: 16 }} /></ a>
                  </Tooltip>
                }}
                {...this.props}
              ></AutoFormTable> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />)}
            {this.state.visible && <ViewImagesModal />}
            {/* <BdTestRecordContent TaskID="1f22ede2-68a0-4594-a93b-a5f706fe6662" /> */}
          </Card.Grid>
        </Card>
      </div>
    );
  }
}

export default OperationRecord

