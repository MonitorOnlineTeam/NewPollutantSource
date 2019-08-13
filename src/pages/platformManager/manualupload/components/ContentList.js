import React, { Component } from 'react';
import { Button, Table, Select, Card, Form, Row, Col, Icon, Upload, message, Modal, Divider, Tabs, Input } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import UpdateManualUpload from './UpdateManualUpload';
import { routerRedux } from 'dva/router';
import styles from './ContentList.less';
import { downloadFile } from '@/utils/utils';
import config from '@/config'
import cuid from 'cuid';
const confirm = Modal.confirm;
const Option = Select.Option;

@connect(({ manualupload, overview, loading }) => ({
    loading: loading.effects['manualupload/GetManualSupplementList'],
    selectdata: manualupload.selectdata,
    uploaddatalist: manualupload.uploaddatalist,
    total: manualupload.total,
    pointName: manualupload.pointName,
    manualUploadParameters: manualupload.manualUploadParameters,//参数
}))
@Form.create()
export default class ContentList extends Component {
    constructor(props) {
        super(props);
        const _this = this;
        this.state = {
            fileList: [],
            visible: false,
            footer: null,
            uid: cuid(),
            width: 1000,
        };
    }
    componentWillMount() {
        debugger
        this.props.dispatch({
            type: 'manualupload/updateState',
            payload: {
                manualUploadParameters: {
                    ...this.props.manualUploadParameters,
                    ...{
                        DGIMN: this.props.DGIMN,
                    }
                }
            }
        });
        this.props.dispatch({
            type: 'manualupload/GetManualSupplementList',
            payload: {
            }
        });
    }

    _handleDateChange = (date, dateString) => {
        this.updateState({
            manualUploadParameters: {
                ...this.props.manualUploadParameters,
                ...{
                    BeginTime: date[0].format('YYYY-MM-DD 00:00:00'),
                    EndTime: date[1].format('YYYY-MM-DD 23:59:59'),
                }
            }
        });
        this.GetManualSupplementList()
    };
    //下拉污染物事件
    SelectHandleChange = (value) => {
        var pName = [];
        value.map((item) => {
            var code = item.split('--')[0];
            if (code !== undefined) {
                pName.push(code)
            }
        })
        this.updateState({
            manualUploadParameters: {
                ...this.props.manualUploadParameters,
                ...{
                    pollutantCode: pName
                }
            }
        });
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
        debugger;

        const { dispatch, PollutantType } = this.props;
        console.log(PollutantType);
        dispatch({
            type: 'manualupload/getUploadTemplate',
            payload: {
                PollutantType: PollutantType,
                callback: (data) => {
                    downloadFile(data);
                    //window.location.href = data
                }
            }
        });
    }

    //分页等改变事件
    onChange = (pageIndex, pageSize) => {
        this.updateState({
            manualUploadParameters: {
                ...this.props.manualUploadParameters,
                ...{
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                }
            }
        });
        this.GetManualSupplementList();
    }
    //分页等改变事件
    onShowSizeChange = (pageIndex, pageSize) => {
        this.updateState({
            manualUploadParameters: {
                ...this.props.manualUploadParameters,
                ...{
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                }
            }
        });
        this.GetManualSupplementList();
    }
    GetManualSupplementList = () => {
        this.props.dispatch({
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
    //父子调用
    onRef1 = (ref) => {
        this.child = ref;
    }
    //添加弹出层
    addModel = (uploaddata) => {
        debugger
        let pointName = '';
        if (uploaddata && uploaddata.count > 0) {
            pointName = '-' + uploaddata[0].pointName
        }
        if (this.props.DGIMN) {
            this.setState({
                visible: true,
                title: '添加数据' + pointName,
                footer: <div>
                    <Button key="back" onClick={this.onCancel}>取消</Button>
                    <Button key="submit" type="primary" onClick={this.updateData}>确定</Button>
                </div>
            });
        }
        else {
            message.info("请选择监测点！")
        }
    }
    // 编辑数据
    updateData = () => {
        debugger
        this.child.handleSubmit();
        this.GetManualSupplementList();
    }
    //删除
    deleteVideoInfo = (record) => {
        confirm({
            title: '确定要删除吗?',
            okText: '是',
            okType: 'primary',
            cancelText: '否',
            onOk: () => this.delete(record),
            onCancel() {
                console.log('取消');
            },
        });
    };
    //删除实现
    delete = (record) => {
        this.props.dispatch({
            type: 'manualupload/DeleteUploadFiles',
            payload: {
                DGIMN: record.DGIMN,
                pollutantCode: record.PollutantCode,
                monitorTime: (moment(record.MonitorTime)).format('YYYY-MM-DD HH:mm:ss'),
                callback: () => {
                    message.success("删除成功！")
                }
            },
        });
        this.GetManualSupplementList();

    }
    // // 修改
    // updateData = () => {
    //     this.child.handleSubmitupdate();
    //     this.GetManualSupplementList();
    // }
    //上传文件
    upload = () => {
        const { uid } = this.state;
        const { DGIMN } = this.props;
        const props = {
            action: config.fileUploadUrl,
            // customRequest=this.addimg,
            onChange(info) {
                if (info.file.status === 'done') {
                } else if (info.file.status === 'error') {
                    message.error("上传文件失败！")
                }
            },
            multiple: true,
            accept: ".xls,.xlsx",
            data: {
                DGIMN: DGIMN,
                FileUuid: uid,
                FileActualType: "2"
            }
        };
        //defaultFileList={fileList}
        return (
            <Upload {...props} >
                <Button>
                    <Icon type="upload" /> 文件上传
        </Button>
            </Upload>
        )
    }
    render() {
        const { manualUploadParameters, DGIMN } = this.props;
        let dateValues = [moment(manualUploadParameters.BeginTime), moment(manualUploadParameters.EndTime)]
        var uploaddata = [];
        if (!this.props.loading) {
            uploaddata = this.props.uploaddatalist === null ? null : this.props.uploaddatalist;
        }
        const columns = [
            {
                title: '污染物种类',
                dataIndex: 'PollutantTypeName',
                align: 'left',
                width: '10%',
                key: 'PollutantTypeName',
            }, {
                title: '污染物名称',
                dataIndex: 'PollutantName',
                align: 'left',
                width: '10%',
                key: 'PollutantName'
            }, {
                title: '监测时间',
                dataIndex: 'MonitorTime',
                align: 'left',
                width: '20%',
                key: 'MonitorTime',
                sorter: (a, b) => Date.parse(a.MonitorTime) - Date.parse(b.MonitorTime),
            }, {
                title: '浓度',
                dataIndex: 'MonitorValue',
                align: 'left',
                width: '13%',
                key: 'MonitorValue'
            },
            {
                title: '标准限值',
                dataIndex: 'StandardLimits',
                align: 'left',
                width: '13%',
                key: 'StandardLimits'
            }, {
                title: '达标情况',
                dataIndex: 'StandardSituation',
                align: 'left',
                width: '10%',
                key: 'StandardSituation',
                render: (text, record, index) => (
                    <span>
                        {text === 0 ? "达标" : "超标"}
                    </span>
                ),
            }, {
                title: '超标倍数',
                dataIndex: 'OverTimes',
                align: 'left',
                width: '10%',
                key: 'OverTimes'
            },
            {
                title: '操作',
                key: 'action',
                width: '14%',
                render: (text, record, index) => (
                    <span>
                        <a onClick={() => {
                            this.setState({
                                visible: true,
                                title: '编辑信息',
                                width: 1000,
                                data: record,
                                footer: <div>
                                        <Button key="back" onClick={() => this.onCancel}>取消</Button>
                                        <Button key="submit" type="primary" onClick={() => this.updateData}>确定</Button>
                                        </div>
                            });
                        }}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            this.deleteVideoInfo(record);
                        }}>删除</a>
                    </span>
                ),
            }
        ];
        return (
            <Card style={{ top: 10, height: 'calc(100vh - 150px)' }} bordered={false}>
                <Card style={{ height: '120px' }}>
                    <Form style={{ marginTop: '17px' }} layout="inline">
                        <Row>
                            <Col span={8} >
                                <RangePicker_ style={{ width: '90%' }} onChange={this._handleDateChange} format={'YYYY-MM-DD'} dateValue={dateValues} />
                            </Col>
                            <Col span={6} >
                                <Select
                                    mode="multiple"
                                    style={{ width: '90%' }}
                                    placeholder="请选择污染物"
                                    filterOption={true}
                                    onChange={this.SelectHandleChange}
                                >
                                    {this.SelectOptions()}
                                </Select>
                            </Col>
                            <Col span={4} style={{ textAlign: 'center' }} >
                                <Button onClick={() => this.Template}>
                                    <Icon type="download" />模板下载
                                            </Button>
                            </Col>
                            <Col span={4} style={{ textAlign: 'center' }} >
                                {this.upload()}
                            </Col>
                            <Col span={2} style={{ textAlign: 'center' }} >
                                <Button
                                    onClick={() => this.addModel(uploaddata)}
                                >
                                    添加
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Table
                    rowKey={(record, index) => `complete${index}`}
                    loading={this.props.loading}
                    className={styles.tableCss}
                    columns={columns}
                    dataSource={DGIMN === '0' ? null : uploaddata}
                    size={'middle'}
                    scroll={{ x: '1000px', y: 'calc(100vh - 460px)' }}
                    rowClassName={
                        (record, index, indent) => {
                            if (index === 0) {
                                return;
                            }
                            if (index % 2 !== 0) {
                                return 'light';
                            }
                        }
                    }
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        'total': this.props.total,
                        'pageSize': manualUploadParameters.pageSize,
                        'current': manualUploadParameters.pageIndex,
                        onChange: this.onChange,
                        onShowSizeChange: this.onShowSizeChange,
                        pageSizeOptions: ['10', '20', '30', '40']
                    }}
                />
                <Modal
                    footer={this.state.footer}
                    destroyOnClose="true"
                    visible={this.state.visible}
                    title={this.state.title}
                    width={this.state.width}
                    onCancel={this.onCancel}>
                    {
                        <UpdateManualUpload onCancels={this.onCancel} DGIMN={DGIMN} item={this.state.data} onRef={this.onRef1} />
                    }
                </Modal>
            </Card>
        );
    }
}
