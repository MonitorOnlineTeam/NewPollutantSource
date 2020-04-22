import React, { Component, Fragment } from 'react';
import { Button, Table, Select, Card, Form, Row, Col, Icon, Upload, message, Modal, Divider, Tabs, Input, Tag, Tooltip, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import UpdateManualUpload from './UpdateManualUpload';
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
            width: 1000,
            uploadLoading: false,
            dataType: "HourData",
        };
    }
    componentWillReceiveProps = nextProps => {
        const { DGIMN, dispatch } = this.props;
        const { dataType } = this.state;
        let nextPropsDGIMN = nextProps.DGIMN;
        if (nextPropsDGIMN) {
            if (nextPropsDGIMN !== DGIMN) {
                dispatch({
                    type: 'manualuploadauto/updateState',
                    payload: {
                        manualUploadautoParameters: {
                            ...this.props.manualUploadautoParameters,
                            ...{
                                DGIMNs: nextPropsDGIMN,
                                pageIndex: 1,
                                pageSize: 20,
                                BeginTime: moment().subtract(3, 'day').format('YYYY-MM-DD 00:00:00'),
                                EndTime: moment().format('YYYY-MM-DD 23:59:59'),
                                dataType,
                                flag: true,
                            }
                        }
                    }
                });
                dispatch({
                    type: 'manualuploadauto/GetManualSupplementList',
                    payload: {
                    }
                });
            }
        }
    }

    //日期改变事件
    _handleDateChange = (date, dateString) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualuploadauto/updateState',
            payload: {
                manualUploadautoParameters: {
                    ...this.props.manualUploadautoParameters,
                    ...{
                        BeginTime: date.length === 0 ? null : date[0].format('YYYY-MM-DD 00:00:00'),
                        EndTime: date.length === 0 ? null : date[1].format('YYYY-MM-DD 23:59:59'),
                    }
                }
            }
        });
        this.GetManualSupplementList()
    };
    //下拉污染物事件
    SelectHandleChange = (value) => {
        debugger
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
            this.GetManualSupplementList()
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
            this.GetManualSupplementList()
        }

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
        const { dispatch, addSelectPollutantData } = this.props;
        if (addSelectPollutantData) {
            dispatch({
                type: 'manualuploadauto/getUploadTemplate',
                payload: {
                    PollutantTypeCode: addSelectPollutantData[0].PollutantTypeCode,
                    DGIMN: this.props.DGIMN,
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
    //取消Model
    onCancel = () => {
        this.setState({
            visible: false
        });
    }
    //表单提交
    handleSubmit = (e) => {
        const { dispatch, form } = this.props;
        const { data } = this.state;
        let PollutantCode = '';
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                dispatch({
                    type: 'manualuploadauto/UpdateManualSupplementData',
                    payload: {
                        PollutantCode: data ? data.PollutantCode : values.PollutantCode.split('--')[0],
                        MonitorTime: values.MonitorTime.format('YYYY-MM-DD HH:mm:ss'),
                        AvgValue: values.AvgValue,
                        DGIMN: values.DGIMN,
                        Flag: data ? "update" : "add",
                        callback: () => {
                            this.GetManualSupplementList();
                        }
                    },
                });
                this.onCancel();
            }
        });
    }

    //添加弹出层
    updateModel = (record) => {
        if (this.props.DGIMN) {
            //修改
            if (record) {
                this.setState({
                    visible: true,
                    title: '编辑信息',
                    width: 1000,
                    data: record,
                });
            }
            else {
                this.setState({
                    visible: true,
                    title: '添加信息',
                    data: null,
                });
            }
        }
        else {
            message.info("请选择监测点！")
        }
    }
    // 编辑数据
    updateData = () => {
        this.child.handleSubmit();
        this.GetManualSupplementList();
    }
    //删除
    deletemanualuploadData = (record) => {
        confirm({
            title: '确定要删除吗?',
            okText: '是',
            okType: 'primary',
            cancelText: '否',
            onOk: () => this.delete(record),
            onCancel() {
            },
        });
    };
    //删除实现
    delete = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualuploadauto/DeleteUploadFiles',
            payload: {
                DGIMN: record.DGIMN,
                pollutantCode: record.PollutantCode,
                monitorTime: (moment(record.MonitorTime)).format('YYYY-MM-DD HH:mm:ss'),
                callback: (reason) => {
                    switch (reason) {
                        case 1:
                            return (message.success("删除成功！"))
                        default:
                            return (message.error("删除失败！"))
                    }
                }
            },
        });
        this.GetManualSupplementList();

    }
    //上传文件
    upload = () => {
        var that = this;
        const { uid, dataType } = this.state;
        const { DGIMN } = this.props;
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
                DGIMN,
                dataType,
                FileUuid: uid,
                FileActualType: "0",
                ssoToken: Cookie.get(config.cookieName)
            }
        };
        return (
            <Upload {...props} >
                <Button >
                    <Icon type="upload" /> 文件导入
                </Button>
            </Upload>

        )
    }
    //数据类型切换
    handleChange = (dataType) => {
        const { dispatch } = this.props;
        this.setState({
            dataType
        })
        dispatch({
            type: 'manualuploadauto/updateState',
            payload: {
                manualUploadautoParameters: {
                    ...this.props.manualUploadautoParameters,
                    ...{
                        dataType
                    }
                },
            }
        });
        dispatch({
            type: 'manualuploadauto/GetManualSupplementList',
            payload: {
            }
        });
    }
    render() {
        const { manualUploadautoParameters, DGIMN, columnsSelect, pageCount } = this.props;
        const { dataType } = this.state;
        let dateValues = [];
        if (manualUploadautoParameters.BeginTime && manualUploadautoParameters.EndTime) {
            dateValues = [moment(manualUploadautoParameters.BeginTime), moment(manualUploadautoParameters.EndTime)];
        }

        var uploaddata = [];
        if (!this.props.loading) {
            uploaddata = this.props.uploaddatalist ? this.props.uploaddatalist : null;
        }
        return (
            <Card
                extra={
                    <Button type="primary" onClick={() => this.Template()}>
                        <Icon type="download" />模板下载
                    </Button>
                }
                title={
                    <Form layout="inline">
                        <Form.Item>
                            <Select defaultValue={dataType} style={{ width: 120 }} onChange={this.handleChange}>
                                <Option value="HourData">小时数据</Option>
                                <Option value="DayData">日数据</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            监测时间:  <RangePicker_ onChange={this._handleDateChange} format={'YYYY-MM-DD'} dateValue={dateValues} />
                        </Form.Item>
                        <Form.Item>
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
                        </Form.Item>
                        <Form.Item>
                            {/* <Button style={{ marginRight: 5 }}
                                onClick={() => this.updateModel()}
                            >
                                添加
                            </Button> */}
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
                    </Form>
                }
                // style={{ height: 'calc(100vh - 200px)' }} 
                bordered={false}>

                <SdlTable
                    loading={this.props.loading}
                    columns={columnsSelect}
                    dataSource={!DGIMN ? null : uploaddata}
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
                <Modal
                    destroyOnClose="true"
                    visible={this.state.visible}
                    title={this.state.title}
                    width={this.state.width}
                    onCancel={this.onCancel}
                    onOk={this.handleSubmit}
                >
                    {
                        <UpdateManualUpload
                            onCancels={this.onCancel}
                            DGIMN={DGIMN}
                            item={this.state.data}
                            form={this.props.form}
                        />
                    }
                </Modal>
            </Card>
        );
    }
}
