/*
 * @Author: lzp
 * @Date: 2019-08-16 09:48:47
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-17 15:31:10
 * @Description: 运维记录
 */
import React, { Component } from 'react';
import { ProfileOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Select,
  Input,
  Button,
  Drawer,
  Radio,
  Collapse,
  Table,
  Badge,
  Divider,
  Row,
  Tree,
  Empty,
  Col,
  Tooltip,
  Card,
  Tag,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import { router } from 'umi';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BdTestRecordContent from '@/pages/EmergencyTodoList/BdTestRecordContent';
import SDLTable from '@/components/SdlTable';
import { routerRedux } from 'dva/router';
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';
import styles from '@/pages/AutoFormManager/index.less';
import LogPage from '@/pages/operations/LogPage'; //运维日志页面
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
  exportReportLoading: loading.effects['operationform/exportReport'],
}))
@Form.create()
class OperationRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeDate: [moment(new Date()).add(-3, 'month'), moment(new Date())],
      formats: 'YYYY-MM-DD',
      configName: '',
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
            var item = record.Content.split('),');
            var itemlist = [];
            item.map((m, index) =>
              itemlist.push(<Tag>{m + (index != item.length - 1 ? ')' : '')}</Tag>),
            );
            return itemlist;
          },
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
            return (
              <Tooltip title="详情">
                <a
                  onClick={() => {
                    router.push('/operations/recordForm/' + record.TypeID + '/' + record.TaskID);
                  }}
                >
                  <ProfileOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
            );
          },
        },
      ],
      maintenanceFlag: 'log',
      maintenanceSelectValue: null,
    };
  }
  //表单类型改变事件
  onTreeChange = value => {
    const { maintenanceFlag, log } = this.state;
    if (maintenanceFlag === 'operationrecord') {
      this.props.dispatch({
        type: 'operationform/updateState',
        payload: {
          RecordType: value,
        },
      });

      this.props.dispatch({
        type: 'operationform/updateState',
        payload: {
          currentRecordType: value,
        },
      });
    }
    if (maintenanceFlag === 'log') {
      this.setState({ maintenanceSelectValue: value });
    }

    // if (value == '8') {
    //   this.props.dispatch({
    //     type: 'operationform/getjzhistoryinfo',
    //     payload: {
    //       DGIMN: this.props.DGIMN,
    //       BeginTime: this.props.BeginTime,
    //       EndTime: this.props.EndTime
    //     }
    //   })
    // } else {
    setTimeout(() => {
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.getRecordType(this.props.DGIMN),
        },
      });
    }, 0);
    // }
  };
  // onTreeSearch = (val) => {
  // }
  componentDidMount() {
    this.getOperationrecordData(this.props);

    // const { recordTypeList, currentRecordType } = this.props
    // const defaultValue = currentRecordType ? currentRecordType : (recordTypeList[0] ? recordTypeList[0].TypeId : undefined);
    // this.setState({ maintenanceSelectValue: defaultValue })
  }

  // 获取数据
  getOperationrecordData = props => {
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
            configId: this.getRecordType(),
          },
        });
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.PollutantType != nextProps.PollutantType) {
      this.getOperationrecordData(nextProps);
    }
    if (
      this.props.DGIMN !== nextProps.DGIMN &&
      this.props.PollutantType === nextProps.PollutantType
    ) {
      // 获取table数据
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.getRecordType(nextProps.DGIMN),
        },
      });
    }
  }

  //根据表单类型获取configid
  getRecordType = DGIMN => {
    var configid = '';
    var type = this.props.PollutantType;
    const defaultValue = this.props.currentRecordType
      ? this.props.currentRecordType
      : this.props.recordTypeList[0]
      ? this.props.recordTypeList[0].TypeId
      : undefined;
    let currentRecordType = this.props.currentRecordType || defaultValue || 1;
    configid = 'FormMainInfoPic';
    // if (type == "2") {
    //   switch (currentRecordType) {
    //     case 1://维修记录表
    //       configid = 'FormMainInfoRepair'
    //       break;
    //     case 2://停机记录表
    //       configid = 'FormMainInfoStop'
    //       break;
    //     case 3://易耗品更换记录表
    //       configid = 'FormMainInfoCon'
    //       break;
    //     case 4://标准气体更换记录表
    //       configid = 'FormMainInfoGas'
    //       break;
    //     case 5://完全抽取法CEMS日常巡检记录表
    //       configid = 'FormMainInfoPatrol'
    //       break;
    //     case 6://稀释采样法CEMS日常巡检记录表
    //       configid = 'FormMainInfoPatrol'
    //       break;
    //     case 7://直接测量法CEMS日常巡检记录表
    //       configid = 'FormMainInfoPatrol'
    //       break;
    //     case 8://CEMS零点量程漂移与校准记录表
    //       configid = ''
    //       break;
    //     case 9://CEMS校验测试记录
    //       configid = 'FormMainInfoTestResult'
    //       break;
    //     case 10://CEMS设备数据异常记录表
    //       configid = 'FormMainInfoDeviceExce'
    //       break;
    //     case 27://保养项记录表
    //       configid = 'FormMainInfoMain'
    //       break;
    //     case 28://备品备件记录表
    //       configid = 'FormMainInfoSpare'
    //       break;
    //   }
    // }
    // else {
    //   configid = 'FormMainInfoPic'
    // }
    this.setState({
      configName: configid,
      searchParams: [
        { Key: 'dbo__T_Bas_Task__DGIMN', Value: DGIMN || this.props.DGIMN, Where: '$=' },
        { Key: 'dbo__T_Bas_FormMainInfo__TypeID', Value: currentRecordType, Where: '$=' },
        {
          Key: 'dbo__T_Bas_FormMainInfo__CreateTime',
          Value: this.props.currentDate[0].format('YYYY-MM-DD HH:mm:ss'),
          Where: '$gte',
        },
        {
          Key: 'dbo__T_Bas_FormMainInfo__CreateTime',
          Value: this.props.currentDate[1].format('YYYY-MM-DD HH:mm:ss'),
          Where: '$lte',
        },
      ],
    });
    return configid;
  };

  /** 切换时间 */
  _handleDateChange = (date, dateString) => {
    const { maintenanceFlag, log } = this.state;

    this.props.dispatch({
      //更新日期
      type: 'operationform/updateState',
      payload: {
        rangDate: date,
        BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        currentDate: [date[0], date[1]],
      },
    });

    if (maintenanceFlag === 'operationrecord') {
      this.setState({
        rangeDate: date,
      });

      if (this.props.currentRecordType == '8') {
        this.props.dispatch({
          type: 'operationform/getjzhistoryinfo',
          payload: {
            DGIMN: this.props.DGIMN,
            BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
            EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
          },
        });
      } else {
        setTimeout(() => {
          this.props.dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
              configId: this.getRecordType(),
            },
          });
        }, 0);
      }
    }
    if (maintenanceFlag === 'log') {
      //   this.props.dispatch({
      //     type: "operationform/mainSelectDates",// 这里就会触发models层里面effects中mainSelectDates方法（也可以直接触发reducer中方法，看具体情况） ,operationform就是models里的命名空间名字
      //     payload: {
      //       mainSelectDate : date,
      //     }
      //  })
    }
  };
  // 零点量程漂移与校准 - 导出报表
  export = () => {
    this.props.dispatch({
      type: 'operationform/exportReport',
      payload: {
        DGIMN: this.props.DGIMN,
        BeginTime: this.props.BeginTime,
        EndTime: this.props.EndTime,
      },
    });
  };
  maintenanceOperation = e => {
    //运维按钮组操作事件

    this.setState({ maintenanceFlag: e.target.value });

    if (e.target.value === 'log') {
      //运维日志
      this.props.dispatch({
        type: 'operationform/updateState',
        payload: {
          breadTitle: '运维日志',
        },
      });
    }
    if (e.target.value === 'operationrecord') {
      //运维记录
      this.props.dispatch({
        type: 'operationform/updateState',
        payload: {
          breadTitle: '运维记录',
          currentRecordType: 1,
        },
      });
    }
  };
  render() {
    const {
      RecordTypeTree,
      recordTypeList,
      currentRecordType,
      exportReportLoading,
      DGIMN,
      PollutantType,
    } = this.props;
    const { columns, searchParams, maintenanceFlag, maintenanceSelectValue } = this.state;
    // const defaultValue = currentRecordType ? currentRecordType : (recordTypeList[0] ? recordTypeList[0].TypeId : undefined);
    const currentType = currentRecordType || 1;
    const currentDate = this.props.currentDate;

    const defaultValue = (() => {
      if (currentRecordType) {
        return currentRecordType;
      } else if (recordTypeList[0] && maintenanceFlag === 'operationrecord') {
        return recordTypeList[0].TypeId;
      } else if (recordTypeList[0] && maintenanceFlag === 'log') {
        return null;
      } else {
        return undefined;
      }
    })();
    return (
      <div>
        <Card
          extra={
            <>
              <Select
                style={{ width: 220, marginRight: 10 }}
                onChange={this.onTreeChange}
                // onSearch={this.onTreeSearch}
                value={defaultValue}
                placeholder="请选择表单类型"
                loading={this.props.RecordTypeTreeLoading}
              >
                {maintenanceFlag == 'log' ? (
                  <Option value={null} key="null">
                    全部
                  </Option>
                ) : null}
                {// recordTypeList.map(option => {
                //   return RecordTypeTree.length ?
                //     <Option key={option.key} value={option.key}>{option.value}</Option> :
                //     ""
                // }
                recordTypeList.map(item => {
                  return (
                    <Option value={item.TypeId} key={item.TypeId}>
                      {item.Abbreviation}
                    </Option>
                  );
                })}
              </Select>
              <RangePicker_
                style={{ width: 350, textAlign: 'left', marginRight: 10 }}
                dateValue={currentDate}
                allowClear={false}
                // format={this.state.formats}
                callback={this._handleDateChange}
              />
              <Radio.Group
                defaultValue="log"
                buttonStyle="solid"
                onChange={e => {
                  // if (e.target.value === "log") {
                  //   router.push(`/operations/log`)
                  // }
                  this.maintenanceOperation(e);
                }}
              >
                <Radio.Button value="log">运维日志</Radio.Button>
                <Radio.Button value="operationrecord">运维记录</Radio.Button>
              </Radio.Group>
            </>
          }
        >
          <Card.Grid
            style={{
              width: '100%',
              height: 'calc(100vh - 270px)',
              overflow: 'auto',
              ...this.props.style,
            }}
          >
            {// this.props.currentRecordType == '8' ?
            //   <>
            //     <Row className={styles.buttonWrapper}>
            //       <Button
            //         style={{ marginRight: 8 }}
            //         icon="export"
            //         type="primary"
            //         loading={exportReportLoading}
            //         onClick={() => {
            //           this.export();
            //         }}
            //       >导出
            //              </Button>
            //     </Row>
            //     <SDLTable
            //       dataSource={this.props.JZDatas}
            //       columns={columns}
            //     >
            //     </SDLTable>
            //   </>
            //   :
            maintenanceFlag == 'operationrecord' ? (
              this.state.configName && currentType ? (
                <AutoFormTable
                  // (this.state.configName && this.props.RecordType ? <AutoFormTable
                  configId={this.state.configName || 'FormMainInfoPic'}
                  searchParams={searchParams}
                  appendHandleRows={row => {
                    return (
                      <Tooltip title="详情">
                        <a
                          onClick={() => {
                            // if (this.props.PollutantType == "2") {
                            //   router.push('/operations/recordForm/' + currentType + '/' + row['dbo.T_Bas_Task.ID'])
                            // } else {
                            // 获取详情图片
                            this.props.dispatch({
                              type: 'common/getOperationImageList',
                              payload: {
                                FormMainID: row['dbo.T_Bas_RecordFormPic.FormMainID'],
                                // FormMainID:"c521b4a0-5b67-45a8-9ad1-d6ca67bdadda"
                              },
                              callback: res => {
                                this.setState({
                                  visible: true,
                                });
                              },
                            });
                            // }
                          }}
                        >
                          <ProfileOutlined style={{ fontSize: 16 }} />
                        </a>
                      </Tooltip>
                    );
                  }}
                  {...this.props}
                ></AutoFormTable>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
              )
            ) : (
              <LogPage dgimn={DGIMN} maintenanceSelectValue={maintenanceSelectValue} />
            )}
            {this.state.visible && <ViewImagesModal />}
            {/* <BdTestRecordContent TaskID="1f22ede2-68a0-4594-a93b-a5f706fe6662" /> */}
          </Card.Grid>
        </Card>
      </div>
    );
  }
}

export default OperationRecord;
