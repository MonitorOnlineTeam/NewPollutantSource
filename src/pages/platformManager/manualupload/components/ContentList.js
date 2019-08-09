import React, { Component } from 'react';
import { Button, Table, Select, Card, Form, Row, Col, Icon, Upload, message, Modal, Divider, Tabs, Input } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import Add from './AddManualUpload';
import Update from './UpdateManualUpload';
import { routerRedux } from 'dva/router';
import styles from './ContentList.less';
import { downloadFile } from '@/utils/utils';
const confirm = Modal.confirm;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
@connect(({ manualupload, overview, loading }) => ({
    loading: loading.effects['manualupload/GetManualSupplementList'],
    requstresult: manualupload.requstresult,
    selectdata: manualupload.selectdata,
    uploaddatalist: manualupload.uploaddatalist,
    reason: manualupload.reason,
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
            footer: null
        };
        this.uuid = () => {
            var s = [];
            var hexDigits = '0123456789abcdef';
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = '4';
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = '-';
            var uuid = s.join('');
            return uuid;
        };
        _this.addimg = ({ file }) => {
            const { manualUploadParameters } = this.props;
            const isJPG = file.type === 'application/vnd.ms-excel';
            if (!isJPG) {
                message.error('只能导入模板文件！');
            }
            else {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    let base64 = reader.result; // base64就是图片的转换的结果
                    const attachId = _this.uuid();
                    _this.props.dispatch({
                        type: 'manualupload/uploadfiles',
                        payload: {
                            file: base64.split(',')[1],
                            fileName: file.name,
                            DGIMN: manualUploadParameters.DGIMN,
                            callback: (flag, data) => {
                                if (flag === '1') {
                                    _this.GetManualSupplementList();
                                    message.success(data)
                                }
                                else {
                                    _this.GetManualSupplementList();
                                    message.error(data);
                                }
                            }
                        }
                    });
                };
            }
        };
    }
    componentDidMount() {
       
        this.updateState({
            manualUploadParameters: {
                ...this.props.manualUploadParameters,
                ...{
                    DGIMN: this.props.DGIMN,
                }
            }
        });
        this.props.dispatch({
            type: 'manualupload/GetManualSupplementList',
            payload: {
            }
        });
    }

    /**
      * 更新model中的state
     */
    updateState = (payload) => {
        this.props.dispatch({
            type: 'manualupload/updateState',
            payload: payload,
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
      
        const {dispatch,PollutantType}=this.props;
        console.log(PollutantType);
        dispatch({
            type: 'manualupload/getUploadTemplate',
            payload: {
                PollutantType:PollutantType,
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
    //取消
    onCancel = () => {
        this.setState({
            visible: false
        });
    }
    onRef1 = (ref) => {
        this.child = ref;
    }
    //添加弹出层
    Add = () => {
        if (this.props.DGIMN !== "1" && this.props.DGIMN != null && this.props.DGIMN != undefined) {
            this.setState({
                visible: true,
                type: 'add',
                title: '添加数据' + '-' + this.props.pointName,
                width: 1000,
                footer: <div>
                    <Button key="back" onClick={this.onCancel}>取消</Button>
                    <Button key="submit" type="primary" onClick={this.AddData}>
                        确定
            </Button>
                </div>
            });
        }
        else {
            message.info("请先选择监测点！")
        }

    }
    // 添加数据
    AddData = () => {
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
    delete = (record) => {
        this.props.dispatch({
            type: 'manualupload/DeleteUploadFiles',
            payload: {
                DGIMN: record.DGIMN,
                pollutantCode: record.PollutantCode,
                monitorTime: (moment(record.MonitorTime)).format('YYYY-MM-DD HH:mm:ss'),
                callback: (reason) => {
                    message.success(reason)
                }
            },
        });
        this.GetManualSupplementList();

    }
    // 修改
    updateData = () => {
        this.child.handleSubmitupdate();
        this.GetManualSupplementList();
    }

    render() {
        const { manualUploadParameters,DGIMN } = this.props;
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
                                type: 'update',
                                title: '编辑信息',
                                width: 1000,
                                data: record,
                                footer: <div>
                                    <Button key="back" onClick={this.onCancel}>取消</Button>
                                    <Button key="submit" type="primary" onClick={this.updateData}>
                                        确定
                                    </Button>
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
                                <Button onClick={this.Template}>
                                    <Icon type="download" />模板下载
                                            </Button>
                            </Col>
                            <Col span={4} style={{ textAlign: 'center' }} >
                                <Upload
                                    action='.doc,.docx'
                                    customRequest={this.addimg}
                                    fileList={this.state.fileList}
                                    showUploadList={false}
                                >
                                    <Button type="primary">
                                        <Icon type="upload" />导入文件
                                                </Button>
                                </Upload>
                            </Col>
                            <Col span={2} style={{ textAlign: 'center' }} >
                                <Button
                                    onClick={this.Add}
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
                    dataSource={DGIMN==='0'?null:uploaddata}
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
                        this.state.type === 'add' ? <Add onCancels={this.onCancel} dgimn={this.props.DGIMN} onRef={this.onRef1} /> : this.state.type === 'update' ? <Update onCancels={this.onCancel} item={this.state.data} onRef={this.onRef1} /> : null
                    }
                </Modal>
            </Card>
        );
    }
}
