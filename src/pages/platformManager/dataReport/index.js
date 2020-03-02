
/*
 * @desc: 数据上报
 * @Author: zhb
 * @Date: 2020年1月22日9：30
 */
import React, { Component, Fragment } from 'react';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Tooltip,
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, DatePicker, InputNumber,
} from 'antd';
import styles from './style.less';

import { PointIcon, DelIcon,EditIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
import moment from 'moment';
const { confirm } = Modal;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ loading, autoForm, datareport }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    userandentInfo: datareport.userandentInfo,
    reportwhere: datareport.reportwhere,
    selectmonth:datareport.selectmonth
}))
@Form.create({
})
export default class MonitorTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.SELF = {
            formLayout: {
              labelCol: { span: 7 },
              wrapperCol: { span: 17 },
            }
          }
      
    }
  

    componentDidMount() {
        const { match, dispatch } = this.props;
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId:match.params.configId,
            },
        })
        if(match.params.monitortime!=1 && match.params.entcode!=1)
        {
            this.updateState(moment(match.params.monitortime),match.params.entcode)
        }
     //   this.updateState(moment().add(1,"month"),"0051264")
    }

    componentWillReceiveProps(nextProps) {
            if (nextProps.location.pathname != this.props.location.pathname) {
                if (nextProps.match.params.configId !== this.props.routerConfig) { this.reloadPage(nextProps.match.params.configId); }
            }
    }

    /**
     * 更新参数
     */
    updateState=(monitotTime,EntCode)=>{
        const{dispatch,match}=this.props;
        let where=[{
            Key: 'dbo__T_Bas_DataReporting__MonitorTime',
            Value: moment(monitotTime).format('YYYY-MM-01 00:00:00'),
            Where: '$gte',
         },{
             Key: 'dbo__T_Bas_DataReporting__MonitorTime',
             Value: moment(monitotTime).add(1,'month').format('YYYY-MM-01 00:00:00'),
             Where: '$lt',
          }];
          if(EntCode)
          {
            where.push({
                Key: 'dbo__T_Bas_DataReporting__EntCode',
                Value: EntCode,
                Where: '$=',
             })
          }
          debugger;
        dispatch({
            type: 'datareport/updateState',
            payload: {
                selectEntCode:EntCode,
                selectmonth:monitotTime,
                reportwhere:where
            },
        })
       const {reportwhere}=this.props;
     
    }

    Serach=()=>{
        const { form,dispatch,match,selectEntCode,reportwhere } = this.props;
        form.validateFields((err, values) => {
          if (!err) {
            this.updateState(values.MonitorTime,selectEntCode);
            this.reloadPage();
          }
        });
    }

    /**重新加载 */
    reloadPage=()=>{
        const {dispatch,reportwhere,match}=this.props;
        dispatch({
            type: 'autoForm/getAutoFormData',
            payload: {
              configId: match.params.configId,
              searchParams: reportwhere,
            },
        });
    }
    showDeleteConfirm = (row,id) => {
        const that = this;
        const { dispatch,match } = this.props;
        if(moment(row['dbo.T_Bas_DataReporting.MonitorTime']).format('YYYY-MM')==moment().format('YYYY-MM') ){
            confirm({
                title: '确定要删除该条数据吗？',
                content: '删除后不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    dispatch({
                        type: 'datareport/deleteDataReport',
                        payload: {
                            ID:id,
                            callback: res => {
                                that.reloadPage()
                            },
                        },
                    })
                },
                onCancel() {
    
                },
            });
        }
        else{
            sdlMessage('只能删除本月的数据', "error")
        }

      
    }

    onRef1 = ref => {
        this.child = ref;
    };

    render() {
        const { form: { getFieldDecorator },searchConfigItems, searchForm, tableInfo, match: { params: { configId,monitortime,entcode } }, dispatch,selectmonth,reportwhere } = this.props;
        const { formLayout } = this.SELF;
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        return (
            <PageHeaderWrapper>
                <div className="contentContainer">
                    <Card className={styles.contentContainer}>
                    <Row>
                    <Col xxl={5} xl={7} sm={24} lg={7}>
                    <FormItem {...formLayout} label="统计月份" style={{ width: '100%' }}>
                    {getFieldDecorator('MonitorTime', {
                      initialValue: selectmonth,
                      rules: [
                        {
                          required: true,
                          message: '请填写统计月份',
                        },
                      ],
                    })(<MonthPicker allowClear={false} style={{ width: '100%' }} />)}
                  </FormItem>
                  </Col>
                  <Col xxl={6} xl={6} lg={8}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      onClick={this.Serach}
                    >
                      查询
                    </Button>
                  </FormItem>
                </Col>
                <Col style={{position:"absolute",right:50}}>
               { entcode!=1?
                <Button onClick={()=>
                dispatch(routerRedux.push
                ('/Intelligentanalysis/SewagePlant/dataReportList/statisticsReportDataList'))}>返回</Button>:''}
                </Col>
                     </Row>
                       
                        <AutoFormTable
                         //   onRef={this.onRef1}
                            style={{ marginTop: 10 }}
                            searchParams={reportwhere}
                            // columns={columns}
                            scroll={{ y: 600 }}
                            configId={configId}
                            rowChange={(key, row) => {
                                console.log('key=', key);
                                this.setState({
                                    key, row,
                                })
                            }}
                            onAdd={()=>{
                                dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReportingAdd/${configId}/${null}/${selectmonth}${entcode}`));
                            }}
                            appendHandleRows={row => <Fragment>
                                <Tooltip title="编辑">
                                    <a onClick={() => {
                                        if(moment(row['dbo.T_Bas_DataReporting.MonitorTime']).format('YYYY-MM')==moment().format('YYYY-MM') ){
                                            dispatch(routerRedux.push
                                                (`/Intelligentanalysis/SewagePlant/DataReportingAdd/${configId}/${row['dbo.T_Bas_DataReporting.ID']}/${selectmonth}${entcode}`));
                                        }
                                        else{
                                            sdlMessage('只能修改本月的数据', "error")
                                        }
                                    }}>   <EditIcon /> </a>
                                </Tooltip>
                                <Divider type="vertical" />
                                <Tooltip title="删除">
                                    <a onClick={() => {
                                        this.showDeleteConfirm(row,row['dbo.T_Bas_DataReporting.ID']);
                                    }}><DelIcon />    </a>
                                </Tooltip>
                            </Fragment>}
                            parentcode="platformconfig"
                            {...this.props}
                        >
                        </AutoFormTable>
                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}
