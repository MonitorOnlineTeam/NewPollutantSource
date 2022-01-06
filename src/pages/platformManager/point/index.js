import React, { Component, Fragment } from 'react';
import { RollbackOutlined, ToolOutlined,HighlightOutlined,DownOutlined,EllipsisOutlined,FileTextOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Spin,
  Select,
  Modal,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tooltip,
  Tabs,
} from 'antd';
import { EditIcon, DetailIcon, DelIcon  } from '@/utils/icon'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { router } from 'umi'
import styles from './index.less';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage, handleFormData, getRowCuid } from '@/utils/utils';
import PollutantType from '@/pages/AutoFormManager/PollutantType';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems';
import config from '@/config';
import SelectPollutantType from '@/components/SelectPollutantType'
import AnalyzerManage from './AnalyzerManage';
import MonitoringStandard from '@/components/MonitoringStandard';
import DeviceManager from './components/deviceManager';
const { TabPane } = Tabs;
const { confirm } = Modal;
let pointConfigId = '';
let pointConfigIdEdit = '';

@connect(({ loading, autoForm, monitorTarget, common, point, global }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  otherloading: loading.effects['monitorTarget/getPollutantTypeList'],
  saveLoadingAdd: loading.effects['point/addPoint'],
  saveLoadingEdit: loading.effects['point/editPoint'],
  saveLoadingMN:loading.effects['point/updatePointDGIMN'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere: monitorTarget.pointDataWhere,
  isEdit: monitorTarget.isEdit,
  defaultPollutantCode: common.defaultPollutantCode,
  configInfo: global.configInfo,
  CorporationCode: point.CorporationCode
}))
@Form.create()
export default class MonitorPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollutantType: 0,
      visible: false,
      FormDatas: {},
      selectedPointCode: '',
      isView: false,
      Mvisible: false,
      PointCode: '',
      DGIMN: '',
      FormData: null,
      tabKey: "1",
      MNVisible:false,
      deviceManagerVisible:false
    };
  }

  componentDidMount() {
    // 1.监控目标ID
    // 2.污染物类型
    // 3.获取监测点数据
    const { dispatch, match } = this.props;
    console.log('match=', match);
    dispatch({
      type: 'point/getPointList',
      payload: {
        TargetId: match.params.targetId,
        callback: res => {
          this.getPageConfig(res);
        },
      },
    });
  }


  getPageConfig = type => {
    this.setState({
      pollutantType: type,
    });
    const { dispatch, match, configInfo } = this.props;
    // 1	废水
    // 2	废气
    // 3	噪声
    // 4	固体废物
    // 5	环境质量
    // 6	水质
    // 8	小型站
    // 9	恶臭
    // 10	voc
    // 11	工况
    // 12	扬尘
    // 18	颗粒物
    // 23	国控
    // 24	省控
    // 25	市控

    try {
      const { SystemPollutantTypeConfigId } = configInfo;
      const configIds = SystemPollutantTypeConfigId.split(',');
      let thisConfigId = null;
      if (configIds.length > 0) {
        thisConfigId = configIds.filter(m => m.split(':')[0] == type);
        if (thisConfigId.length > 0) {
          pointConfigIdEdit = thisConfigId[0].split(':')[1];
          pointConfigId = `${pointConfigIdEdit}New`;
        }
      }
    } catch (e) {
      // sdlMessage('AutoForm配置发生错误，请联系系统管理员', 'warning');
    }

    switch (type) {
      case 1:
        // 废水
        // pointConfigId = 'WaterOutputNew';
        // pointConfigIdEdit = 'WaterOutput';
        break;
      case 2:
        // 废气
        // pointConfigId = 'GasOutputNew';
        // pointConfigIdEdit = 'GasOutput';
        break;
      case 3:
        // 噪声
        break;
      case 4:
        break;
    }
    dispatch({
      type: 'monitorTarget/updateState',
      payload: {
        pollutantType: type,
        pointDataWhere: [
          {
            Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
            Value: match.params.targetId,
            Where: '$=',
          },
        ],
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: pointConfigId,
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: pointConfigIdEdit,
      },
    });
  };

  /** 设置运维周期 */
  showMaintenancereminder = DGIMN => {
    console.log(DGIMN);
    this.setState({
      Mvisible: true,
      DGIMN,
    })
  }

  handleMCancel = () => {
    this.setState({
      Mvisible: false,
    });
  }

  showModal = PointCode => {
    const { dispatch } = this.props;
    if (PointCode) {
      this.setState({
        visible: true,
        isEdit: true,
        selectedPointCode: PointCode,
        tabKey: "1"
      });
      dispatch({
        type: 'autoForm/getFormData',
        payload: {
          configId: pointConfigIdEdit,
          'dbo.T_Bas_CommonPoint.PointCode': PointCode,
        },
      });
    } else {
      this.setState({
        visible: true,
        isEdit: false,
        selectedPointCode: '',
        FormData:null,
        tabKey: "1"
      });
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      isEdit: false,
      selectedPointCode: '',
      isView: false,
    });
  };

  onSubmitForm() {
    const { dispatch, match, pointDataWhere, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const FormData = handleFormData(values);
        if (!Object.keys(FormData).length) {
          sdlMessage('数据为空', 'error');
          return false;
        }
        if (this.state.isEdit) {
          FormData.PointCode = this.state.selectedPointCode;
        }

        const payload = {
          BaseType: match.params.targetType,
          TargetId: match.params.targetId,
          Point: FormData,
        };

        // console.log("payload=", payload);

        dispatch({
          type: !this.state.isEdit ? 'point/addPoint' : 'point/editPoint',
          payload: {
            FormData: { ...payload },
            callback: result => {
              if (result.IsSuccess) {
                // this.setState({
                //   visible: false,
                // });
                dispatch({
                  type: 'autoForm/getAutoFormData',
                  payload: {
                    configId: pointConfigId,
                    searchParams: pointDataWhere,
                  },
                });
              }
            },
          },
        });
        this.setState({
          FormData: FormData
        })
      }
    });
  }

  delPoint(PointCode, DGIMN) {
    const { dispatch, match, pointDataWhere } = this.props;
    const { pollutantType } = this.state;
    dispatch({
      type: 'point/delPoint',
      payload: {
        configId: pointConfigIdEdit,
        targetId: match.params.targetId,
        targetType: match.params.targetType,
        pollutantType,
        DGIMN,
        PointCode,
        callback: result => {
          if (result.IsSuccess) {
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: pointConfigId,
                searchParams: pointDataWhere,
              },
            });
          }
        },
      },
    });
  }

  onPollutantChange = e => {
    console.log(e);
    this.getPageConfig(e.target.value);
  }


  showDeleteConfirm = (PointCode, DGIMN) => {
    console.log(PointCode);
    const that = this;
    const { dispatch } = this.props;
    // console.log("row=", row);
    confirm({
      title: '确定要删除该条数据吗？',
      content: '删除后不可恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.delPoint(PointCode, DGIMN);
      },
      onCancel() {
      },
    });
  }

  loadReportList = re => {
    console.log('res=', re)
  }

  modelClose=()=>{
    this.setState({
      visible: false,
      FormData:null,
      tabKey:"1"
    })
  }


  /***
   * 站点信息维护tabchange
   */
  onTabPaneChange = (key) => {
 
    const { selectedPointCode, FormData } = this.state;
    if (key == "2") {
   
       if(this.state.selectedPointCode || FormData)
       {
          // this.props.dispatch({
          //   type: 'autoForm/getPageConfig',
          //   payload: {
          //     configId: 'service_StandardLibrary',
          //   },
          //  });
       }else
       {
         message.error("请先保存站点信息！")
         return;
       }

    }
    this.setState({
      tabKey: key
    });
  }

  getTabInfo = () => {
 
    const { FormData } = this.state;
    console.log("FormData=",FormData)
    if (FormData)
      return <MonitoringStandard noload DGIMN={FormData["dbo.T_Cod_MonitorPointBase.DGIMN"] || FormData["DGIMN"]} 
      pollutantType={FormData["dbo.T_Bas_CommonPoint.PollutantType"] || FormData["PollutantType"]} />
  }

  editMN=(MN)=>{
    this.setState({ 
      MNVisible:true,
      MNEcho:MN
    })
  }
  deviceManager = (row) =>{
    this.setState({ 
      deviceManagerVisible:true
    }) 
  }
  onSubmitMN= e =>{
    const { dispatch,pointDataWhere } = this.props;
    
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.newMN) {
          dispatch({
            type: 'point/updatePointDGIMN',
            payload: {
              oldDGIMN:this.state.MNEcho,
              newDGIMN:values.newMN
            },
            callback:()=>{
              this.setState({ MNVisible:false })
              dispatch({
                type: 'autoForm/getAutoFormData',
                payload: {
                  configId: pointConfigId,
                  searchParams: pointDataWhere,
                },
              });
            }
          })

      }else{

        message.error('新设备编号(MN)不能为空！')
      }
    });

  }
  onMenuClick = ({ key }) => {
    const { row } = this.state;

    if(key==3){ //设置Cems参数
      this.showMaintenancereminder(row['dbo.T_Bas_CommonPoint.PointCode'])
    }
    if(key==4){ //修改mn号
      this.editMN(row['dbo.T_Bas_CommonPoint.DGIMN']);
    }
    if(key==5){ //设备管理
     this.deviceManager(row)
    }
  };
  render() {
    const {
      searchConfigItems,
      searchForm,
      tableInfo,
      match: {
        params: { targetName, configId, pollutantTypes },
      },
      dispatch,
      pointDataWhere,
      isEdit,
      saveLoadingAdd,
      saveLoadingEdit,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const searchConditions = searchConfigItems[pointConfigId] || [];
    const columns = tableInfo[pointConfigId] ? tableInfo[pointConfigId].columns : [];
    if (this.props.loading || this.props.otherloading) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    const menu = (
      <Menu onClick={this.onMenuClick} >
          <Menu.Item key="3"> <Tooltip title="设置Cems参数"> <a><ToolOutlined style={{fontSize:16}}/></a> </Tooltip></Menu.Item>
          <Menu.Item key="4"> <Tooltip title="修改设备编号(MN)">  <a><HighlightOutlined  style={{fontSize:16}}/></a></Tooltip></Menu.Item>
          <Menu.Item key="5"><Tooltip title="设备管理"> <a><FileTextOutlined  style={{fontSize:16}}/></a>  </Tooltip></Menu.Item>
    
      </Menu>
    );
    return (
      <BreadcrumbWrapper title="监测点维护">
        <div className={styles.cardTitle}>
          <Card
            title={
              <span>
                {targetName}
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                  type="link"
                  size="small"
                >
                  <RollbackOutlined />
                  返回上级
                </Button>
              </span>
            }
            // extra={<PollutantType handlePollutantTypeChange={this.getPageConfig} />}
            extra={<SelectPollutantType
              style={{ marginLeft: 50, float: 'left' }}
              showType="radio"
              onChange={this.onPollutantChange}
              defaultValue={this.state.pollutantType}
              filterPollutantType={pollutantTypes}
            />}
          >

            {
              pointConfigId && <SearchWrapper
                // onSubmitForm={form => this.loadReportList(form)}
                searchParams={pointDataWhere}
                configId={pointConfigIdEdit}
                resultConfigId={pointConfigId}
              ></SearchWrapper>
            }
            {


              pointConfigId && (<AutoFormTable
                style={{ marginTop: 10 }}
                // columns={columns}
                configId={pointConfigId}
                rowChange={(key, row) => {
                  this.setState({
                    key,
                    row,
                  });
                }}
                onAdd={() => {
                  this.showModal();
                  
                  // this.setState({
                  //   cuid: getRowCuid(columns, row)
                  // })
                }}
                searchParams={pointDataWhere}
                appendHandleRows={row => (
                  <Fragment>

                    
                    <Tooltip title="编辑">
                      <a
                        onClick={() => {
                          this.showModal(row['dbo.T_Bas_CommonPoint.PointCode']);
                          this.setState({
                            cuid: getRowCuid(row, 'dbo.T_Bas_CommonPoint.Photo'),
                            FormData: row
                          })
                        }}
                      >
                        <EditIcon />      
                      </a>
                    </Tooltip>
                    <Divider type="vertical" />
                   <Tooltip title="详情">
                      <a
                        onClick={() => {
                          this.setState({
                            visible: true,
                            isEdit: false,
                            isView: true,
                            selectedPointCode: row['dbo.T_Bas_CommonPoint.PointCode'],
                          });
                        }}
                      >
                        <DetailIcon />
                      </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="删除">
                      <a onClick={() => {
                        this.showDeleteConfirm(row['dbo.T_Bas_CommonPoint.PointCode'],
                          row['dbo.T_Bas_CommonPoint.DGIMN']);
                      }}><DelIcon />    </a>
                    </Tooltip>
                     {/* {
                      row['dbo.T_Bas_CommonPoint.PollutantType'] === '2' ? <><Divider type="vertical" />
                        <Tooltip title="设置Cems参数">
                          <a onClick={() => {
                            this.showMaintenancereminder(row['dbo.T_Bas_CommonPoint.PointCode']);
                          }}><ToolOutlined style={{fontSize:16}}/></a>
                        </Tooltip></> : ''
                    } */}
                   <> <Divider type="vertical" />
                 <Tooltip title="修改设备编号(MN)">
                          <a onClick={() => {
                            this.editMN(row['dbo.T_Bas_CommonPoint.DGIMN']);
                          }}><HighlightOutlined  style={{fontSize:16}}/></a>
                        </Tooltip></>
                        <Divider type="vertical" />
                        <Tooltip title="设备管理">
                          <a onClick={() => {
                            this.deviceManager(row);
                          }}><FileTextOutlined  style={{fontSize:16}}/></a>
                        </Tooltip>

                     {/* {row['dbo.T_Bas_CommonPoint.PollutantType']==2&&<>  <Divider type="vertical" />  <Dropdown trigger={['click']} placement='bottomCenter' overlay={ menu }>
                         <a className="ant-dropdown-link" onClick={e => {e.preventDefault();this.setState({row:row})}}>
                         <Tooltip title="更多">  <EllipsisOutlined /></Tooltip>
                        </a>
                        </Dropdown></>} */}
                  </Fragment>
                )}
              />
              )
            }
          </Card>
          <Modal
            //   title={this.state.isView ? '详情' : this.state.isEdit ? '编辑监测点' : '添加监测点'}
            title={this.state.isView ? '详情' : ''}
            visible={this.state.visible}
            onOk={this.onSubmitForm.bind(this)}
            onCancel={this.handleCancel}
            width="60%"
            destroyOnClose
            bodyStyle={{paddingBottom:0}}
            footer={[
              !this.state.isView ? (<Button key="back" onClick={this.handleCancel}>
                取消
            </Button>,
                <> <Button key="submit" type="primary" loading={!this.state.isEdit ? saveLoadingAdd : saveLoadingEdit} onClick={this.onSubmitForm.bind(this)}>
                  确定
            </Button><Button key="submit" onClick={this.modelClose}>
                  取消
            </Button></>) : '',
            ]}
          >{
            !this.state.isView?(
              <Tabs activeKey={this.state.tabKey} onChange={this.onTabPaneChange}>
              <TabPane tab={this.state.isView ? '详情' : this.state.isEdit ? '编辑监测点' : '添加监测点'} key="1">
                  <SdlForm
                    corporationCode={this.props.CorporationCode}
                    configId={pointConfigIdEdit}
                    onSubmitForm={this.onSubmitForm.bind(this)}
                    form={this.props.form}
                    noLoad
                    hideBtns
                    uid={this.state.cuid}
                    isEdit={this.state.isEdit}
                    keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
                    types='point'
                  />
              </TabPane>
              <TabPane tab="污染物信息" key="2">
                {this.getTabInfo()}
              </TabPane>
            </Tabs>
            ):(
              <AutoFormViewItems
                configId={pointConfigIdEdit}
                keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
              />
            )
          }
          
          </Modal>
          <Modal
            title="设置Cems参数"
            visible={this.state.Mvisible}
            onCancel={this.handleMCancel}
            width="90%"
            destroyOnClose
            footer={false}
          >
            <AnalyzerManage DGIMN={this.state.DGIMN} />
          </Modal>
          <Modal
            title="修改设备编号(MN)"
            visible={this.state.MNVisible}
            onCancel={()=>{this.setState({MNVisible:false})}}
            onOk={(e)=>{this.onSubmitMN(e)}}
            destroyOnClose
            confirmLoading={this.props.saveLoadingMN}
            className={styles.MNmodal}
          >
           <Form>
           <Form.Item label="旧设备编号(MN)">
             <Input value={this.state.MNEcho} disabled/>
           </Form.Item>
           <Form.Item label="新设备编号(MN)">
               {getFieldDecorator('newMN', {
                                rules: [{ required: this.state.MNVisible, message: '请输入新的设备编号(MN)' }], //设置成动态  以防影响autoform其他表单的提交
                            })( 
                                <Input  placeholder="请输入新的设备编号(MN)" />
                            )} 
           </Form.Item>
      </Form>
          </Modal>

          <Modal  //设备管理
            title="废气-常规CEMS"
            visible={this.state.deviceManagerVisible}
            onCancel={()=>{this.setState({deviceManagerVisible:false})}}
            width="90%"
            destroyOnClose
            footer={false}
            wrapClassName={styles.deviceManagerSty}
          >
            <DeviceManager />
          </Modal>
        </div>
        {/* </MonitorContent> */}
      </BreadcrumbWrapper>
    );
  }
}
