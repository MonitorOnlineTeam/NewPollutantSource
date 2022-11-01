import React, { Component, Fragment } from 'react';
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
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
const confirm = Modal.confirm;
const Option = Select.Option;

@connect(({ manualuploadauto, loading }) => ({
    loading: loading.effects['manualuploadauto/GetManualSupplementList'],
    templateLoading: loading.effects['manualuploadauto/getUploadTemplate'],
    selectdata: manualuploadauto.selectdata,
    uploaddatalist: manualuploadauto.uploaddatalist,
    total: manualuploadauto.total,
    pointName: manualuploadauto.pointName,
    manualUploadautoParameters: manualuploadauto.manualUploadautoParameters,
    columns: manualuploadauto.columns,
    pageCount: manualuploadauto.pageCount,
}))
@Form.create()

/**
 * 功  能：手工数据上传子组件
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */

export default class ContentList_carbon extends Component {
    constructor(props) {
        super(props);
        const _this = this;
        this.state = {
            fileList: [],
            visible: false,
            uid: cuid(),
            uploadLoading: false,
            format: "YYYY-MM-DD HH",
            columns: [
                {
                    title: '监测时间',
                    dataIndex: 'MonitorTime',
                    key: 'MonitorTime',
                    render: (text, record) => {
                        return text || '-'
                    }
                },
                {
                    title: '二氧化碳(mg/m³)',
                    dataIndex: '30',
                    key: '30',
                    render: (text, record) => {
                        return text !== undefined ? text : '-'
                    }
                },
                {
                    title: '流速(m/s)',
                    dataIndex: 's02',
                    key: 's02',
                    render: (text, record) => {
                        return text !== undefined ? text : '-'

                    }
                },
                {
                    title: '烟气温度(°C)',
                    dataIndex: 's03',
                    key: 's03',
                    render: (text, record) => {
                        return text !== undefined ? text : '-'

                    }
                },
                {
                    title: '烟气湿度(%)',
                    dataIndex: 's05',
                    key: 's05',
                    render: (text, record) => {
                        return text !== undefined ? text : '-'

                    }
                },
            ],
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
                            pageIndex: 1,
                            pageSize: 24,
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
        if (value.length !== 0) {
            value.map((item) => {
                var code = item.split('--')[0];
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
        const { dispatch, manualUploadautoParameters } = this.props;
        dispatch({
            type: 'manualuploadauto/getUploadTemplate',
            payload: {
                PollutantTypeCode: 2,
                DGIMN: manualUploadautoParameters.DGIMN,
                BeginTime: manualUploadautoParameters.BeginTime,
                EndTime: manualUploadautoParameters.EndTime,
                Type: manualUploadautoParameters.Type,
                carbon: true,
            },
            callback: (data) => {
                downloadFile(data);
            }
        });
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
        debugger
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
                carbon: true
            }
        });
    }

    //上传文件
    upload = () => {
        var that = this;
        const { uid, uploadLoading } = this.state;
        const { manualUploadautoParameters } = this.props;
        const props = {
            action: '/api/rest/PollutantSourceApi/ManualSupplementApi/UploadFilesAutoRefe',
            // action: config.templateUploadUrlAuto,
            onChange(info) {
                that.setState({
                    uploadLoading: true,
                });
                if (info.file.status === 'done') {
                    message.success("导入成功！")
                    that.setState({
                        uploadLoading: false
                    })
                    that.GetManualSupplementList();
                } else if (info.file.status === 'error') {

                    message.error(info.file.response.Message);

                    that.setState({
                        uploadLoading: false
                    })
                }
                that.setState({
                    visible: false,
                })
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
            <Upload {...props} style={{ marginLeft: 5 }} >
                <Button type="primary" loading={uploadLoading}  >
                    文件导入
                </Button>
            </Upload>
        )
    }
    //导入之前确认框
    uploadConfirm = () => {
        this.setState({
            visible: true,
        })
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

    //关闭Modal
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { manualUploadautoParameters, pageCount, templateLoading } = this.props;
        const { format, visible, uploadLoading, columns } = this.state;
        let dataType = manualUploadautoParameters.Type === "daySelecthour" ? "小时" : "日";
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
                    <Button loading={templateLoading} onClick={() => this.Template()}>
                        <DownloadOutlined />模板下载
                    </Button>
                }
                title={
                    <Form layout="inline">
                        {/* <Form.Item>
                            <Select defaultValue={Type} style={{ width: 120 }} onChange={this.handleChange}>
                                <Option value="daySelecthour">小时数据</Option>
                                <Option value="day">日数据</Option>
                            </Select>
                        </Form.Item> */}
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
                            <Button type="primary" onClick={this.uploadConfirm} >
                                <UploadOutlined loading={uploadLoading} /> 文件导入
                            </Button>
                            {/* // this.upload() */}
                        </Form.Item>
                    </Form>
                }
                bordered={false}>
                <SdlTable
                    rowKey={(record, index) => index}
                    loading={this.props.loading || uploadLoading}
                    columns={columns}
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
                <Modal
                    visible={visible}
                    onOk={() => this.setModal1Visible(false)}
                    onCancel={() => this.handleCancel()}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        this.upload()
                    ]}
                >
                    <div class="ant-modal-confirm-body">
                        <i style={{ color: "#faad14" }} aria-label="icon: question-circle" class="anticon anticon-question-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                            <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
                        </svg>
                        </i>
                        <span class="ant-modal-confirm-title">提示</span>
                        <div class="ant-modal-confirm-content"> 确认导入模板文件中的时间点是<span style={{ color: 'red' }}>{dataType}</span>数据吗?</div></div>

                </Modal>
            </Card>
        );
    }
}
