import React, { Component, Fragment } from 'react';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Table,
    Select,
    Card,
    Row,
    Col,
    Upload,
    message,
    Modal,
    Divider,
    Tabs,
    Input,
    Tag,
    Tooltip,
    Spin,
} from 'antd';
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

@connect(({ manualupload, loading }) => ({
    loading: loading.effects['manualupload/GetManualSupplementList'],
    selectdata: manualupload.selectdata,
    uploaddatalist: manualupload.uploaddatalist,
    total: manualupload.total,
    pointName: manualupload.pointName,
    manualUploadParameters: manualupload.manualUploadParameters,
    addSelectPollutantData: manualupload.addSelectPollutantData,
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
        };
    }
    componentWillReceiveProps = nextProps => {
        const { DGIMN, dispatch } = this.props;
        let nextPropsDGIMN = nextProps.DGIMN;
        if (nextPropsDGIMN) {
            if (nextPropsDGIMN !== DGIMN) {
                dispatch({
                    type: 'manualupload/updateState',
                    payload: {
                        manualUploadParameters: {
                            ...this.props.manualUploadParameters,
                            ...{
                                DGIMN: nextPropsDGIMN,
                                PageIndex: 1,
                                PageSize: 10,
                                BeginTime: moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'),
                                EndTime: moment().format('YYYY-MM-DD 23:59:59'),
                            }
                        }
                    }
                });
                dispatch({
                    type: 'manualupload/GetManualSupplementList',
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
            type: 'manualupload/updateState',
            payload: {
                manualUploadParameters: {
                    ...this.props.manualUploadParameters,
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
        const { dispatch } = this.props;
        var pName = '';
        if (value) {
            value.map((item) => {
                var code = item.split('--')[0];
                if (code) {
                    pName += code + ','
                }
            })
            pName = pName.substr(0, pName.length - 1);
            dispatch({
                type: 'manualupload/updateState',
                payload: {
                    manualUploadParameters: {
                        ...this.props.manualUploadParameters,
                        ...{
                            PollutantCode: pName
                        }
                    }
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
                type: 'manualupload/getUploadTemplate',
                payload: {
                    PollutantTypeCode: addSelectPollutantData[0].PollutantTypeCode,
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
            type: 'manualupload/updateState',
            payload: {
                manualUploadParameters: {
                    ...this.props.manualUploadParameters,
                    ...{
                        PageIndex: PageIndex,
                        PageSize: PageSize,
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
            type: 'manualupload/updateState',
            payload: {
                manualUploadParameters: {
                    ...this.props.manualUploadParameters,
                    ...{
                        PageIndex: PageIndex,
                        PageSize: PageSize,
                    }
                }
            }
        });
        this.GetManualSupplementList();
    }
    GetManualSupplementList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualupload/GetManualSupplementList',
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
                    type: 'manualupload/UpdateManualSupplementData',
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
            type: 'manualupload/DeleteUploadFiles',
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
        const { uid } = this.state;
        const { DGIMN } = this.props;
        const props = {
            action: config.templateUploadUrl,
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
                DGIMN: DGIMN,
                FileUuid: uid,
                FileActualType: "0",
                ssoToken: Cookie.get(config.cookieName)
            }
        };
        return (
            <Upload {...props} >
                <Button >
                    <UploadOutlined /> 文件导入
                </Button>
            </Upload>
        );
    }
    render() {
        const { manualUploadParameters, DGIMN } = this.props;
        let dateValues = [];
        if (manualUploadParameters.BeginTime && manualUploadParameters.EndTime) {
            dateValues = [moment(manualUploadParameters.BeginTime), moment(manualUploadParameters.EndTime)];
        }

        var uploaddata = [];
        if (!this.props.loading) {
            uploaddata = this.props.uploaddatalist ? this.props.uploaddatalist : null;
        }
        const columns = [
            {
                title: '监测时间',
                dataIndex: 'MonitorTime',
                align: 'left',
                width: 150,
                key: 'MonitorTime',
                sorter: (a, b) => Date.parse(a.MonitorTime) - Date.parse(b.MonitorTime),
            }, {
                title: '污染物名称',
                dataIndex: 'PollutantName',
                align: 'left',

                key: 'PollutantName'
            }, {
                title: '浓度',
                dataIndex: 'MonitorValue',
                align: 'right',

                key: 'MonitorValue'
            },
            {
                title: '标准限值',
                dataIndex: 'StandardLimits',
                align: 'right',
                key: 'StandardLimits',
                render: (text, record, index) => (
                    text ? text : <span>-</span>
                ),
            }, {
                title: '达标情况',
                dataIndex: 'StandardSituation',
                align: 'center',
                key: 'StandardSituation',
                filters: [
                    {
                        text: <span><LegendIcon style={{ color: "#34c066" }} />正常</span>,
                        value: 0,
                    },
                    {
                        text: <span><LegendIcon style={{ color: "#f04d4d" }} />超标</span>,
                        value: 1,
                    },
                ],
                onFilter: (value, record) => record.StandardSituation === value,
                render: (text, record, index) => (
                    <span>
                        {text === 0 ? <Tag color="green">达标</Tag> : <Tag color="red">超标</Tag>}
                    </span>
                ),
            }, {
                title: '超标倍数',
                dataIndex: 'OverTimes',
                align: 'right',
                key: 'OverTimes',
                render: (text, record, index) => (
                    text ? <Tag color="#FF3434">{text}</Tag> : <span>-</span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                align: 'center',
                render: (text, record, index) => (
                    <span>
                        <Fragment type='edit'>
                            <Tooltip title="编辑">
                                <a onClick={() => {
                                    this.updateModel(record)
                                }}><EditIcon /></a>
                            </Tooltip>
                            {<Divider type="vertical" />}
                        </Fragment>
                        <Fragment>
                            <Tooltip title="删除">
                                <a onClick={() => {
                                    this.deletemanualuploadData(record);
                                }}><DelIcon /> </a>
                            </Tooltip>
                        </Fragment>
                    </span>
                ),
            }
        ];
        return (
            <Card
                extra={
                    <Button type="primary" onClick={() => this.Template()}>
                        <DownloadOutlined />模板下载
                    </Button>
                }
                title={
                    <Form layout="inline">
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
                            <Button style={{ marginRight: 5 }}
                                onClick={() => this.updateModel()}
                            >
                                添加
                            </Button>
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
                } style={{ height: 'calc(100vh - 200px)' }} bordered={false}>

                <SdlTable
                    loading={this.props.loading}
                    columns={columns}
                    dataSource={!DGIMN ? null : uploaddata}
                  //  scroll={{ y: 'calc(100vh - 450px)' }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        'total': this.props.total,
                        'pageSize': manualUploadParameters.PageSize,
                        'current': manualUploadParameters.PageIndex,
                        onChange: this.onChange,
                        onShowSizeChange: this.onShowSizeChange,
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
