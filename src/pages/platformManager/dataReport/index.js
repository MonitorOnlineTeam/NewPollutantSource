
/*
 * @desc: 数据上报
 * @Author: zhb
 * @Date: 2020年1月22日9：30
 */
import React, { Component, Fragment } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
    Tooltip,
    Select,
    Modal,
    Tag,
    Divider,
    Dropdown,
    Menu,
    Popconfirm,
    message,
    DatePicker,
    InputNumber,
} from 'antd';
import styles from './style.less';

import { PointIcon, DelIcon, EditIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
import moment from 'moment';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import SdlTable from '@/components/SdlTable';

const { confirm } = Modal;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ loading, autoForm, datareport,newDatareport }) => ({
    // loading: loading.effects['autoForm/getPageConfig'],
    loading:newDatareport.loading,
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    userandentInfo: datareport.userandentInfo,
    reportwhere: datareport.reportwhere,
    // selectmonth: datareport.selectmonth,
    beginTime: datareport.beginTime,
    endTime: datareport.endTime,
    selectmonth:newDatareport.selectmonth,
    tableDatas:newDatareport.tableDatas
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
            },
          }
          this.columns = [
            {
              title: <span>数据日期</span>,
              dataIndex: 'MonitorTime',
              key: 'MonitorTime',
              align: 'center',
            },
            {
              title: <span>污泥含水量(%)</span>,
              dataIndex: 'SludgeWater',
              key: 'SludgeWater',
              align: 'center',
            },
            {
              title: <span>处理污泥量(m³)</span>,
              dataIndex: 'DealSludge',
              key: 'DealSludge',
              align: 'center',
            },
            {
              title: <span>泥饼处理量(m³)</span>,
              dataIndex: 'DealMudCake',
              key: 'DealMudCake',
              align: 'center',
            },
            {
              title: <span>COD减排量(吨)</span>,
              dataIndex: 'CODEmissionReduction',
              key: 'CODEmissionReduction',
              align: 'center',
            },
            {
              title: <span>氨氮减排量(吨)</span>,
              dataIndex: 'NHEmissionReduction',
              key: 'NHEmissionReduction',
              align: 'center',
            },
            {
              title: <span>用电量(万度)</span>,
              dataIndex: 'Electricity',
              key: 'Electricity',
              align: 'center',
            },
            {
              title: <span>电耗(度/m³)</span>,
              dataIndex: 'PowerConsumption',
              key: 'PowerConsumption',
              align: 'center',
            },
            {
              title: <span>PAM用量(kg)</span>,
              dataIndex: 'PAMElectricity',
              key: 'PAMElectricity',
              align: 'center',
            },
            {
                title: <span>运行成本(元/m³)</span>,
                dataIndex: 'RunningCost',
                key: 'RunningCost',
                align: 'center',
              },  
              {
                title: <span>收取污水处理费(元/m³)</span>,
                dataIndex: 'DealSewageCost',
                key: 'DealSewageCost',
                align: 'center',
                width:150,
              },  
              {
                title: <span>上报人</span>,
                dataIndex: 'ReportPerson',
                key: 'ReportPerson',
                align: 'center',
              },  
              {
                title: <span>上报时间</span>,
                dataIndex: 'ReportDate',
                key: 'ReportDate',
                align: 'center',
              },            
            {
              title: <span>操作</span>,
              dataIndex: '',
              key: '',
              align: 'center',
              render:(text,row)=>{
               const { match: { params: { configId, monitortime, entcode } }, dispatch, selectmonth } = this.props;

                return (
                    <Fragment>
                              <Tooltip title="编辑">
                                     <a onClick={() => {
                                            // if (moment(row['MonitorTime']).format('YYYY-MM') == moment().format('YYYY-MM')) {
                                                dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReportingAdd/${configId}/${row['ID']}/${selectmonth}/${entcode}`));
                                            // } else {
                                            //     sdlMessage('只能修改本月的数据', 'error')
                                            // }
                                        }}>   <EditIcon /> </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="删除">
                        <a href="#" onClick={ this.showDeleteConfirm.bind(this,row, row['ID'])}><DeleteOutlined style={{ fontSize: 16 }} /></a>
                    </Tooltip>
                  </Fragment>
                );
              }
            },
      
          ];
    }


    componentDidMount() {
         const { match, dispatch } = this.props;
         this.getTableData();
        //  dispatch({
        //     type: 'autoForm/getPageConfig',
        //     payload: {
        //         configId: match.params.configId,
        //     },
        // })
        // if (match.params.monitortime != 1 && match.params.entcode != 1) {
        //     this.updateState(moment(match.params.monitortime), match.params.entcode)
        // }
    }

    componentWillReceiveProps(nextProps) {
            if (nextProps.location.pathname != this.props.location.pathname) {
                if (nextProps.match.params.configId !== this.props.routerConfig) { this.reloadPage(nextProps.match.params.configId); }
            }
    }

    getTableData=()=>{
      const { match, dispatch,form: { getFieldsValue }, } = this.props;
        dispatch({type: 'newDatareport/updateState',  payload: { selectmonth: moment(getFieldsValue().MonitorTime)  }})
        dispatch({
            type: 'newDatareport/getDataReportList',
            payload: {
                MonitorTime: moment(getFieldsValue().MonitorTime).format('YYYY-MM-01 00:00:00'),
            },
        })  
    }
    /**
     * 更新参数
     */
    // updateState=(monitotTime, beginTime, endTime, EntCode) => {
    //     const { dispatch, match } = this.props;
    //     const where = [{
    //         Key: 'dbo__T_Bas_DataReporting__MonitorTime',
    //         Value: beginTime,
    //         Where: '$gte',
    //      }, {
    //          Key: 'dbo__T_Bas_DataReporting__MonitorTime',
    //          Value: endTime,
    //          Where: '$lt',
    //       }];
    //       if (EntCode) {
    //         where.push({
    //             Key: 'dbo__T_Bas_DataReporting__EntCode',
    //             Value: EntCode,
    //             Where: '$=',
    //          })
    //       }
    //     dispatch({
    //         type: 'datareport/updateState',
    //         payload: {
    //             selectEntCode: EntCode,
    //             selectmonth: monitotTime,
    //             reportwhere: where,
    //         },
    //     })
    // }

   /**
    * 时间控件回调
    */
    onDateCallBack=(dates, beginTime, endTime) => {
        const { form: { setFieldsValue }, dispatch, StatisticsReportDataWhere } = this.props;
        setFieldsValue({ MonitorTime: dates });
        // dispatch({
        //     type: 'datareport/updateState',
        //     payload: {
        //         beginTime,
        //         endTime,
        //     },

        // }) 
    }


    Serach=() => {
        const { form, dispatch, match, selectEntCode, reportwhere, beginTime, endTime } = this.props;
        form.validateFields((err, values) => {
          if (!err) {
            // this.updateState(values.MonitorTime, beginTime, endTime, selectEntCode);
            // this.reloadPage();
            this.getTableData();
          }
        });
    }

    /** 重新加载 */
    // reloadPage=() => {
    //     const { dispatch, reportwhere, match } = this.props;
    //     dispatch({
    //         type: 'autoForm/getAutoFormData',
    //         payload: {
    //           configId: match.params.configId,
    //           searchParams: reportwhere,
    //         },
    //     });
    // }

    showDeleteConfirm = (row, id) => {
        const that = this;
        const { dispatch, match } = this.props;
        // if (moment(row['dbo.T_Bas_DataReporting.MonitorTime']).format('YYYY-MM') == moment().format('YYYY-MM')) {
        // if (moment(row['MonitorTime']).format('YYYY-MM') == moment().format('YYYY-MM')) {

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
                            ID: id,
                            callback: res => {
                                that.getTableData();
                                // that.reloadPage();
                            },
                        },
                    })
                },
                onCancel() {

                },
            });
        // } else {
        //     sdlMessage('只能删除本月的数据', 'error')
        // }
    }

    onRef1 = ref => {
        this.child = ref;
    };

    render() {
        const { form: { getFieldDecorator }, searchConfigItems, searchForm, tableInfo, match: { params: { configId, monitortime, entcode } }, dispatch, selectmonth, reportwhere } = this.props;
        console.log('entcode', entcode);
        const { formLayout } = this.SELF;
        // if (this.props.loading) {
        //     return (<Spin
        //         style={{
        //             width: '100%',
        //             height: 'calc(100vh/2)',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center',
        //         }}
        //         size="large"
        //     />);
        // }
        return (
            <BreadcrumbWrapper>
                <div className="contentContainer">
                    <Card className={styles.contentContainer}>
                    <Form layout="inline">
                    <FormItem  label="统计月份">
                    {getFieldDecorator('MonitorTime', {
                      initialValue: selectmonth,
                      rules: [
                        {
                          required: true,
                          message: '请填写统计月份',
                        },
                      ],
                    })(<DatePickerTool  callback={this.onDateCallBack} picker="month" allowClear={false} />)}
                  </FormItem>
                  <FormItem label="">
                    <Button
                      type="primary"
                      style={{ marginRight: '10px' }}
                      onClick={this.Serach}
                    >
                      查询
                    </Button>
                  </FormItem>
                  </Form>
                <Col>

                <Button style={{marginRight:5}} icon={<PlusOutlined />}  type="primary" onClick={() =>
               dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReportingAdd/${configId}/${null}/${selectmonth}/${entcode}`))}>添加</Button>
                
                {entcode != 1 ?
                <Button  onClick={() =>
                dispatch(routerRedux.push('/Intelligentanalysis/SewagePlant/dataReportList/statisticsReportDataList'))}>返回</Button> : ''}
                </Col>

                        {/* <AutoFormTable
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
                            onAdd={() => {
                                dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReportingAdd/${configId}/${null}/${selectmonth}/${entcode}`));
                            }}
                            appendHandleRows={row => <Fragment>
                                <Tooltip title="编辑">
                                    <a onClick={() => {
                                        if (moment(row['dbo.T_Bas_DataReporting.MonitorTime']).format('YYYY-MM') == moment().format('YYYY-MM')) {
                                            dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReportingAdd/${configId}/${row['dbo.T_Bas_DataReporting.ID']}/${selectmonth}/${entcode}`));
                                        } else {
                                            sdlMessage('只能修改本月的数据', 'error')
                                        }
                                    }}>   <EditIcon /> </a>
                                </Tooltip>
                                <Divider type="vertical" />
                                <Tooltip title="删除">
                                    <a onClick={() => {
                                        this.showDeleteConfirm(row, row['dbo.T_Bas_DataReporting.ID']);
                                    }}><DelIcon />    </a>
                                </Tooltip>
                            </Fragment>}
                            parentcode="platformconfig"
                            {...this.props}
                        > 
                        </AutoFormTable>*/}
                        <SdlTable
                                loading={this.props.loading}
                                style={{ marginTop: 10 }}
                                columns={this.columns}
                                dataSource={this.props.tableDatas}
                                // pagination={{
                                // showSizeChanger: true,
                                // showQuickJumper: true,
                                //defaultPageSize:20
                            //  }}
                             >
                        </SdlTable>

                        
                    </Card>
                </div>
            </BreadcrumbWrapper>
        );
    }
}
