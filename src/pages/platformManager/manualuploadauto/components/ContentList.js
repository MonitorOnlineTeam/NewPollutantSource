import React, { Component, Fragment } from 'react';
import { Button, Table, Select, Card, Form, Row, Col, Icon, Upload, message, Modal, Divider, Tabs, Input, Tag, Tooltip, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { routerRedux } from 'dva/router';
import styles from './ContentList.less';
import { downloadFile } from '@/utils/utils';
import SdlTable from '@/components/SdlTable'
import config from '@/config'
import cuid from 'cuid';
import { EditIcon, DelIcon } from '@/utils/icon';
import Cookie from 'js-cookie';
import { LegendIcon } from '@/utils/icon';
const confirm = Modal.confirm;
const Option = Select.Option;

@connect(({ manualuploadauto, loading }) => ({
    loading: loading.effects['manualuploadauto/GetManualSupplementList'],
    selectdata: manualuploadauto.selectdata,
    uploaddatalist: manualuploadauto.uploaddatalist,
    total: manualuploadauto.total,
    pointName: manualuploadauto.pointName,
    manualUploadautoParameters: manualuploadauto.manualUploadautoParameters,
    addSelectPollutantData: manualuploadauto.addSelectPollutantData,
    columnsSelect: manualuploadauto.columnsSelect,
    columns: manualuploadauto.columns,
    pageCount: manualuploadauto.pageCount,
}))
@Form.create()

/**
 * 功  能：手工数据上传子组件
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */

export default class ContentList extends Component {
    constructor(props) {
        super(props);
        const _this = this;
        this.state = {
            fileList: [],
            visible: false,
            uid: cuid(),
            uploadLoading: false,
            format: "YYYY-MM-DD HH",

        };
    }
    componentWillReceiveProps = nextProps => {
        const { DGIMN, dispatch } = this.props;
        let nextPropsDGIMN = nextProps.DGIMN;
        if (nextPropsDGIMN) {
            if (nextPropsDGIMN !== DGIMN) {
                dispatch({
                    type: 'manualuploadauto/updateState',
                    payload: {
                        manualUploadautoParameters: {
                            ...this.props.manualUploadautoParameters,
                            ...{
                                DGIMN: nextPropsDGIMN,
                                pageIndex: 1,
                                pageSize: 24,
                                flag: true,
                            }
                        }
                    }
                });
                this.GetManualSupplementList()
            }
        }
    }
    /**
  * 回调获取时间并重新请求数据
  */
    dateCallback = (dates, Type) => {
        let { dispatch, manualUploadautoParameters } = this.props;
        if (manualUploadautoParameters.DGIMN) {
            dispatch({
                type: 'manualuploadauto/updateState',
                payload: {
                    manualUploadautoParameters: {
                        ...this.props.manualUploadautoParameters,
                        ...{
                            BeginTime: dates[0].format('YYYY-MM-DD HH:00:00'),
                            EndTime: dates[1].format('YYYY-MM-DD HH:00:00'),
                        }
                    }
                }
            });
            this.GetManualSupplementList()
        }

    }

    //下拉污染物事件
    SelectHandleChange = (value) => {
        const { dispatch, columns } = this.props;
        var pName = '';
        let columnsNew = [];
        columnsNew = columnsNew.concat(columns[0]);
        if (value.length !== 0) {
            value.map((item) => {
                var code = item.split('--')[0];
                columnsNew = columnsNew.concat(columns.filter(item => item.dataIndex == code))
                if (code) {
                    pName += code + ','
                }
            })
            pName = pName.substr(0, pName.length - 1);
            dispatch({
                type: 'manualuploadauto/updateState',
                payload: {
                    manualUploadautoParameters: {
                        ...this.props.manualUploadautoParameters,
                        ...{
                            pollutantCodes: pName,
                            flag: false,
                        }
                    },
                    columnsSelect: columnsNew
                }
            });

        }
        else {
            dispatch({
                type: 'manualuploadauto/updateState',
                payload: {
                    manualUploadautoParameters: {
                        ...this.props.manualUploadautoParameters,
                        ...{
                            pollutantCodes: '',
                        }
                    },
                    columnsSelect: columns
                }
            });
        }
        this.GetManualSupplementList()
    }
    //获取下拉污染物数据
    SelectOptions = () => {
        const rtnVal = [];
        if (this.props.selectdata.length !== 0) {
            this.props.selectdata.map((item, key) => {
                rtnVal.push(<Option key={item.PollutantCode + '--' + item.PollutantName}>{item.PollutantName}</Option>);
            });
        }
        return rtnVal;
    }
    //创建并获取模板
    Template = () => {
        //获取模板地址
        const { dispatch, addSelectPollutantData, manualUploadautoParameters } = this.props;
        if (addSelectPollutantData) {
            dispatch({
                type: 'manualuploadauto/getUploadTemplate',
                payload: {
                    PollutantTypeCode: addSelectPollutantData[0].PollutantTypeCode,
                    DGIMN: manualUploadautoParameters.DGIMN,
                    BeginTime: manualUploadautoParameters.BeginTime,
                    EndTime: manualUploadautoParameters.EndTime,
                    Type: manualUploadautoParameters.Type,
                    callback: (data) => {
                        downloadFile(data);
                    }
                }
            });
        }
    }

    //分页等改变事件
    onChange = (PageIndex, PageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualuploadauto/updateState',
            payload: {
                manualUploadautoParameters: {
                    ...this.props.manualUploadautoParameters,
                    ...{
                        pageIndex: PageIndex,
                        pageSize: PageSize,
                    }
                }
            }
        });
        this.GetManualSupplementList();
    }
    //分页等改变事件
    onShowSizeChange = (PageIndex, PageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualuploadauto/updateState',
            payload: {
                manualUploadautoParameters: {
                    ...this.props.manualUploadautoParameters,
                    ...{
                        pageIndex: PageIndex,
                        pageSize: PageSize,
                    }
                }
            }
        });
        this.GetManualSupplementList();
    }
    GetManualSupplementList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualuploadauto/GetManualSupplementList',
            payload: {
            }
        });
    }

    //上传文件
    upload = () => {
        var that = this;
        const { uid } = this.state;
        const { manualUploadautoParameters } = this.props;
        const props = {
            action: config.templateUploadUrlAuto,
            onChange(info) {
                that.setState({
                    uploadLoading: true
                });
                if (info.file.status === 'done') {
                    message.success("导入成功！")
                    that.setState({
                        uploadLoading: false
                    })
                    that.GetManualSupplementList();
                } else if (info.file.status === 'error') {
                    message.error(info.file.response.Message)
                    that.setState({
                        uploadLoading: false
                    })
                }
            },
            multiple: true,
            accept: ".xls,.xlsx",
            showUploadList: false,
            data: {
                DGIMN: manualUploadautoParameters.DGIMN,
                dataType: manualUploadautoParameters.Type,
                BeginTime: manualUploadautoParameters.BeginTime,
                EndTime: manualUploadautoParameters.EndTime,
                FileUuid: uid,
                FileActualType: "0",
                ssoToken: Cookie.get(config.cookieName)
            }
        };
        return (
            <Upload {...props} >
                <Button type="primary" >
                    <Icon type="upload" /> 文件导入
                </Button>
            </Upload>

        )
    }

    //数据类型切换
    handleChange = (Type) => {
        const { dispatch, manualUploadautoParameters } = this.props;
        let format = '';
        let beginTime = "";
        let endTime = "";

        if (Type === 'daySelecthour') {
            format = "YYYY-MM-DD HH";
            beginTime = moment(manualUploadautoParameters.BeginTime).format("YYYY-MM-DD 01:00:00");
            endTime = moment(manualUploadautoParameters.EndTime).format("YYYY-MM-DD 00:00:00");
        }
        else {
            format = "YYYY-MM-DD";
            beginTime = moment(manualUploadautoParameters.BeginTime).format("YYYY-MM-DD 00:00:00");
            endTime = moment(manualUploadautoParameters.EndTime).format("YYYY-MM-DD 00:00:00");
        }
        this.setState({
            format,
        })
        dispatch({
            type: 'manualuploadauto/updateState',
            payload: {
                manualUploadautoParameters: {
                    ...this.props.manualUploadautoParameters,
                    ...{
                        Type,
                        BeginTime: beginTime,
                        EndTime: endTime,
                        pageIndex: 1,
                        pageSize: 24,
                    }
                },
            }
        });
        this.GetManualSupplementList();
    }
    //统计AQI按钮确认框
     confirm=()=> {
        const { dispatch ,manualUploadautoParameters} = this.props;
        var beginTime=manualUploadautoParameters.BeginTime;
        var endTime=manualUploadautoParameters.EndTime;
        if(manualUploadautoParameters.Type!='daySelecthour')
        {
            beginTime=moment(beginTime).format('YYYY-MM-DD');
            endTime=moment(endTime).format('YYYY-MM-DD');
        }
        Modal.confirm({
            title: '提示',
            content: '确认清除'+beginTime+'-'+endTime+'范围内的AQI并重新计算吗?',
            okText: '确认',
            cancelText: '取消',
            width:500,
            onOk:() => {
                this.StatisticsAQI()
            },
            onCancel:()=>{
                console.log('false')
            }
          });
      }

    //统计AQI
    StatisticsAQI = e => {
        const { dispatch ,manualUploadautoParameters} = this.props;
        let t1= moment(manualUploadautoParameters.BeginTime);
        let t2 = moment(manualUploadautoParameters.EndTime);
        var dayNum=t2.diff(t1,'day')+1;
        console.log(dayNum)  
        if(dayNum>15)
        {
            message.error("日期范围不能超过15天!");
        }else
        {
            dispatch({
            type: 'manualuploadauto/CalculationAQIData',
            payload: {
            }
            });
            // console.log('yes')
        }
        this.setState({
            visible: false,
        });
    };
    //关闭Modal
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { manualUploadautoParameters, columnsSelect, pageCount } = this.props;
        const { format } = this.state;
        let dateValue = [];
        if (manualUploadautoParameters.BeginTime && manualUploadautoParameters.EndTime) {
            dateValue = [moment(manualUploadautoParameters.BeginTime), moment(manualUploadautoParameters.EndTime)];
        }
        let Type = manualUploadautoParameters.Type;
        var uploaddata = [];
        if (!this.props.loading) {
            uploaddata = this.props.uploaddatalist ? this.props.uploaddatalist : null;
        }
        return (
            <Card
                extra={
                    <Button onClick={() => this.Template()}>
                        <Icon type="download" />模板下载
                    </Button>
                }
                title={
                    <Form layout="inline">
                        <Form.Item>
                            <Select defaultValue={Type} style={{ width: 120 }} onChange={this.handleChange}>
                                <Option value="daySelecthour">小时数据</Option>
                                <Option value="day">日数据</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <RangePicker_ style={{ width: 325, textAlign: 'left' }} dateValue={dateValue}
                                dataType={Type}
                                format={format}
                                isVerification={true}
                                callback={(dates, Type) => this.dateCallback(dates, Type)}
                                allowClear={false} showTime={format} />
                        </Form.Item>
                        {/* <Form.Item>
                            <Select
                                mode="multiple"
                                style={{ width: '280px' }}
                                placeholder="请选择污染物"
                                filterOption={true}
                                allowClear={true}
                                maxTagCount={2}
                                onChange={this.SelectHandleChange}
                            >
                                {this.SelectOptions()}
                            </Select>
                        </Form.Item> */}
                        <Form.Item>
                            {this.upload()}
                            <Spin
                                delay={500}
                                spinning={this.state.uploadLoading}
                                style={{
                                    marginLeft: 10,
                                    height: '100%',
                                    width: '30px',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.confirm}>
                                统计AQI
                            </Button>
                        </Form.Item>

                    </Form>
                }
                bordered={false}>
                <SdlTable
                    rowKey={(record, index) => index}
                    loading={this.props.loading}
                    columns={columnsSelect}
                    dataSource={!manualUploadautoParameters.DGIMN ? null : uploaddata}
                    // scroll={{ y: 'calc(100vh - 450px)' }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        'total': this.props.total,
                        'pageSize': manualUploadautoParameters.pageSize,
                        'current': manualUploadautoParameters.pageIndex,
                        onChange: this.onChange,
                        onShowSizeChange: this.onShowSizeChange,
                        pageSizeOptions: pageCount
                    }}
                />
             
            </Card>
        );
    }
}
