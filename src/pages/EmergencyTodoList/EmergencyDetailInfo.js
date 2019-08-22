import React, { Component } from 'react';
import { Card, Divider, Button, Input, Table, Icon, Spin, Modal, Upload, Form, Col, Row, message, Carousel, Steps, Tooltip, Popover } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { CALL_HISTORY_METHOD } from 'react-router-redux';
import { async } from 'q';
import moment from 'moment';
import Lightbox from "react-image-lightbox-rotate";
import styles from "./EmergencyDetailInfo.less";
import DescriptionList from '../../components/DescriptionList';
import AlarmDetails from '../../components/EmergencyDetailInfo/AlarmDetails';
import { EnumRequstResult, EnumPatrolTaskType, EnumPsOperationForm, EnumOperationTaskStatus } from '../../utils/enum';
import { imgaddress } from '../../config.js';
import MonitorContent from '../../components/MonitorContent/index';
import { get } from '../../dvapack/request';
import "react-image-lightbox/style.css";

const { Description } = DescriptionList;
const { TextArea } = Input;
const FormItem = Form.Item;
const Step = Steps.Step;
let SCREEN_HEIGHT = document.querySelector('body').offsetHeight - 250;

@Form.create()
@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetTaskRecord'],
    taskInfo: task.TaskRecord,
    alarmList: []
}))
class EmergencyDetailInfo extends Component {
    constructor(props) {
        super(props);
        const { DGIMN, TaskID } = this.props;

        this.state = {
            previewVisible: false,
            previewImage: '',
            cdvisible: false,
            // uid: null,
            photoIndex: 0,
            //参数改变让页面刷新
            DGIMN: DGIMN,
            TaskID: TaskID,
            moreAlarmList: null,
            visible: false,
            alarmType: null
        };
    }

    componentDidMount = () => {
        this.reloaddata();
    }

    componentWillReceiveProps(nextProps) {
        const { DGIMN, TaskID } = this.props;
        //如果传入参数有变化，则重新加载数据
        if (nextProps.DGIMN !== DGIMN || nextProps.TaskID !== TaskID) {
            this.setState({
                //参数改变让页面刷新
                DGIMN: nextProps.DGIMN,
                TaskID: nextProps.TaskID
            });
            this.reloaddata();
        }
    }

    handlePreview = (file, fileList) => {
        let ImageList = 0;
        fileList.map((item, index) => {
            if (item.uid === file.uid) {
                ImageList = index;
            }
        });
        this.setState({
            previewVisible: true,
            photoIndex: ImageList
        });
    }

    handleCancels = () => {
        this.setState({
            previewVisible: false
        });
    }

    reloaddata = () => {
        this.props.dispatch({
            type: 'task/GetTaskRecord',
            payload: {
                TaskID: this.props.TaskID,
                DGIMN: this.props.DGIMN
            }
        });
    }

    renderItem = (data, taskID) => {
        const rtnVal = [];
        data.map((item, key) => {
            if (item.FormMainID !== null) {
                switch (item.ID) {
                    case EnumPsOperationForm.Repair:
                        this.GoToForm(taskID, item.CnName, "RepairRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.StopMachine:
                        this.GoToForm(taskID, item.CnName, "StopCemsRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.YhpReplace:
                        this.GoToForm(taskID, item.CnName, "ConsumablesReplaceRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.StandardGasReplace:
                        this.GoToForm(taskID, item.CnName, "StandardGasRepalceRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.CqfPatrol:
                        this.GoToForm(taskID, item.CnName, "CompleteExtractionRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.CyfPatrol:
                        this.GoToForm(taskID, item.CnName, "DilutionSamplingRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.ClfPatrol:
                        this.GoToForm(taskID, item.CnName, "DirectMeasurementRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.CheckRecord:
                        this.GoToForm(taskID, item.CnName, "JzRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.TestRecord:
                        this.GoToForm(taskID, item.CnName, "BdTestRecord", rtnVal, key);
                        break;
                    case EnumPsOperationForm.DataException:
                        this.GoToForm(taskID, item.CnName, "DeviceExceptionRecord", rtnVal, key);
                        break;
                    default:
                        break;
                }
            }
        });
        return rtnVal;
    }

    GoToForm = (taskID, cnName, recordType, rtnVal, key) => {
        let taskfrom = this.props.taskfrom || '';
        if (taskfrom.indexOf("qcontrollist") > -1) {
            taskfrom = taskfrom.split('-')[0];
        }
        rtnVal.push(<p key={key} style={{ marginBottom: 0 }}><Button
            style={{ marginBottom: '5px' }}
            icon="check-circle-o"
            onClick={() => {
                this.props.dispatch(routerRedux.push(`/PatrolForm/${recordType}/${this.props.DGIMN}/${this.props.viewtype}/${taskfrom}/nop/${taskID}`));
            }}
        >{cnName}
                                                             </Button>
                    </p>);
    }

    //获取撤单按钮
    getCancelOrderButton = (createtime, TaskStatus) => {
        if (moment(createtime) > moment(new Date()).add(-7, 'day') && TaskStatus == 3) {
            return <Button onClick={this.cdShow}><Icon type="close-circle" />打回</Button>;
        }

        return <Button disabled={true}><Icon type="close-circle" />打回</Button>;

    }

    cdShow = () => {
        this.setState({
            cdvisible: true
        });
    }

    cdClose = () => {
        this.setState({
            cdvisible: false
        });
    }

    cdOk = (TaskID) => {
        this.props.dispatch({
            type: 'task/RevokeTask',
            payload: {
                taskID: TaskID,
                revokeReason: this.props.form.getFieldValue('reason'),
                reload: () => this.reloaddata(),
                close: () => this.cdClose()
            }
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    //步骤条
    TaskLogList = (TaskLogList) => {
        let returnStepList = [];
        TaskLogList.map((item) => {
            returnStepList.push(
                <Step
                    status="finish"
                    title={item.TaskStatusText}
                    description={this.description(item)}
                    icon={<Icon type={
                        this.showIcon(item.TaskStatusText)
                    }
                    />}
                />
            );
        });
        return returnStepList;
    }

    //图标
    showIcon = (TaskStatusText) => {
        switch (TaskStatusText) {
            case '待执行': return 'minus-circle';
            case '进行中': return 'clock-circle';
            case '已完成': return 'check-circle';
            case '待审核': return 'exclamation-circle';
            case "审核通过": return 'check-square';
            case "驳回": return 'close-circle';
            case "待调整": return 'warning';
            case "已调整": return 'check-square';
            default: return 'schedule';
        }
    }


    //步骤条描述
    description = (item) => {
        if (item.TaskRemark === "" || item.TaskRemark === null) {
            return (
                <div style={{ marginBottom: 40 }}>
                    <div style={{ marginTop: 5 }}>
                        {item.Remark}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {item.CreateUserName}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {item.CreateTime}
                    </div>

                </div>
            );
        }

        return (
            <Popover content={<span>{item.TaskRemark}</span>}>
                <div style={{ marginBottom: 40 }}>
                    <div style={{ marginTop: 5 }}>
                        {item.Remark}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {item.CreateUserName}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {item.CreateTime}
                    </div>

                </div>
            </Popover>
        );


    }

    stepsWidth = (item) => {
        let width = item.length * 350;
        return width;
    }

    getGoBack = () => {
        const { history, goback } = this.props;
        if (goback === "none") {
            SCREEN_HEIGHT = document.querySelector('body').offsetHeight - 500;
            return (<span />);
        }
        return (
            <Button
                style={{ float: "right", marginRight: 30 }}
                onClick={() => {
                    history.goBack(-1);
                }}
            ><Icon type="left" />退回
            </Button>
        );
    }

    GetAlarmInfo = (AlarmList, type) => {
        const alarmList = AlarmList.filter(item => item.MsgTypeText === type);
        this.setState({
            moreAlarmList: alarmList,
            typeName: type,
            visible: true
        });
    }

    render() {
        const { photoIndex } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 5 },
            },
            wrapperCol: {
                sm: { span: 16 },
            },
        };
        if (this.props.taskInfo === null) {
            return (
                <div />
            );
        }
        //是否存在任务信息
        const isExistTask = this.props.taskInfo.requstresult == EnumRequstResult.Success && this.props.taskInfo.data !== null && this.props.taskInfo.data.length > 0;
        let AlarmList = []; // 报警记录
        let Attachments = ''; // 附件
        let TaskLogList = []; // 任务日志列表
        let RecordTypeInfo = [];
        if (isExistTask) {
            Attachments = this.props.taskInfo.data[0].Attachments;
            TaskLogList = this.props.taskInfo.data[0].TaskLogList;
            RecordTypeInfo = this.props.taskInfo.data[0].TaskFormList;
            if (this.props.taskInfo.data[0].AlarmList.length > 0) {
                this.props.taskInfo.data[0].AlarmList[0].map((item) => {
                    if (item !== null) {
                        let AlarmType = "";
                        let AlarmCount = 0;
                        item.MsgTypeList.map((item) => {
                            AlarmType += `${item.MsgTypeText},`;
                            AlarmCount += item.AlarmCount;
                        });
                        AlarmList.push({
                            key: item.AlarmSourceType,
                            FirstAlarmTime: item.FirstAlarmTime,
                            LastAlarmTime: item.LastAlarmTime,
                            AlarmMsg: AlarmType !== "" ? AlarmType.substring(0, AlarmType.lastIndexOf(',')) : AlarmType,
                            AlarmCount: AlarmCount,
                            MsgTypeList: item.MsgTypeList,
                            AlarmType: item.AlarmSourceTypeText
                        });
                    }
                });
            }
        }
        const pics = Attachments !== '' ? Attachments.ThumbimgList : [];
        const fileList = [];
        let index = 0;
        pics.map((item, key) => {
            index++;
            if (item === 'no') {
                fileList.push({
                    uid: index,
                    name: item,
                    status: 'done',
                    url: `/NoPic.png`,
                });
            } else {
                fileList.push({
                    uid: index,
                    name: item.replace('_thumbnail', ''),
                    status: 'done',
                    url: `${imgaddress}${item}`,
                });
            }

        });
        //拼接图片地址数组
        let ImageList = [];
        fileList.map((item) => {
            ImageList.push(
                `${imgaddress}${item.name}`
            );
        });
        //报警列表列名
        const columns = [{
            title: '开始报警时间',
            width: '20%',
            dataIndex: 'FirstAlarmTime',
            key: 'FirstAlarmTime',
        }, {
            title: '最后一次报警时间',
            width: '20%',
            dataIndex: 'LastAlarmTime',
            key: 'LastAlarmTime',
        }, {
            title: '报警类型',
            width: '10%',
            dataIndex: 'AlarmType',
            key: 'AlarmType',
        }, {
            title: '异常类型',
            dataIndex: 'AlarmMsg',
            width: '35%',
            key: 'AlarmMsg',
            render: (text, row, index) => {
                if (text !== null && text !== "") {
                    let types = [];
                    text.split(',').map((item) => {
                        const dot = types.length + 1 < text.split(',').length ? "，" : "";
                        types.push(<span><a
                            href="javascript:;"
                            onClick={
                                () => {
                                    const alarmList = row.MsgTypeList.filter(i => i.MsgTypeText === item);
                                    this.setState({
                                        moreAlarmList: alarmList,
                                        alarmType: row.AlarmType,
                                        visible: true
                                    });
                                }
                            }
                        >{item}
                                         </a>{dot}
                                   </span>);
                    });
                    return {
                        children: types
                    };
                }
            },
        }, {
            title: '报警次数',
            dataIndex: 'AlarmCount',
            width: '15%',
            key: 'AlarmCount',
        }];
        const upload = {
            showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
            listType: 'picture-card',
            fileList: [...fileList]
        };
        const { isloading } = this.props;
        if (isloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                size="large"
            />);
        }

        return (
            <div>
                <Card
                    title={<span style={{ fontWeight: '900' }}>任务详情</span>}
                    extra={
                        <div>
                            <span style={{ marginRight: 20 }}>{this.getCancelOrderButton(isExistTask ? this.props.taskInfo.data[0].CreateTime : null, isExistTask ? this.props.taskInfo.data[0].TaskStatus : null)}</span>
                            {this.getGoBack()}
                        </div>}
                >

                    <div style={{ height: SCREEN_HEIGHT }} className={styles.ExceptionDetailDiv}>
                        <Card title={<span style={{ fontWeight: '600' }}>基本信息</span>}>
                            <DescriptionList className={styles.headerList} size="large" col="3">
                                <Description term="任务单号">{isExistTask ? this.props.taskInfo.data[0].TaskCode : null}</Description>
                                <Description term="排口">{isExistTask ? this.props.taskInfo.data[0].PointName : null}</Description>
                                <Description term="企业">{isExistTask ? this.props.taskInfo.data[0].EnterpriseName : null}</Description>
                            </DescriptionList>
                            <DescriptionList style={{ marginTop: 20 }} className={styles.headerList} size="large" col="3">
                                <Description term="任务来源">{isExistTask ? this.props.taskInfo.data[0].TaskFromText : null}</Description>
                                <Description term="紧急程度"><div style={{ color: 'red' }}>{isExistTask ? this.props.taskInfo.data[0].EmergencyStatusText : null}</div></Description>
                                <Description term="任务状态"> <div style={{ color: '#32CD32' }}>{isExistTask ? this.props.taskInfo.data[0].TaskStatusText : null}</div></Description>
                                <Description term="任务内容">{isExistTask ? this.props.taskInfo.data[0].TaskDescription : null}</Description>
                            </DescriptionList>
                            <DescriptionList style={{ marginTop: 20 }} className={styles.headerList} size="large" col="3">
                                <Description term="运维人">{isExistTask ? this.props.taskInfo.data[0].OperationsUserName : null}</Description>
                                <Description term="创建时间">{isExistTask ? this.props.taskInfo.data[0].CreateTime : null}</Description>
                            </DescriptionList>
                            {
                                (isExistTask ? this.props.taskInfo.data[0].TaskType : null) === EnumPatrolTaskType.PatrolTask ? null : AlarmList.length === 0 ? null : (<Divider style={{ marginBottom: 20 }} />)
                            }

                            {

                                (isExistTask ? this.props.taskInfo.data[0].TaskType : null) === EnumPatrolTaskType.PatrolTask ? null : AlarmList.length === 0 ? null :
                                <Table rowKey={(record, index) => `complete${index}`} style={{ backgroundColor: 'white' }} bordered={false} dataSource={AlarmList} pagination={false} columns={columns} />
                            }
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>处理说明</span>} style={{ marginTop: 20 }}>
                            <DescriptionList className={styles.headerList} size="large" col="1">
                                <Description>
                                    <TextArea rows={8} style={{ width: '600px' }} value={isExistTask ? this.props.taskInfo.data[0].Remark : null} />
                                </Description>
                            </DescriptionList>
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>处理记录</span>} style={{ marginTop: 20 }}>
                            <DescriptionList className={styles.headerList} size="large" col="1">
                                <Description>
                                    {
                                        this.renderItem(RecordTypeInfo, isExistTask ? this.props.taskInfo.data[0].TaskID : null)
                                    }
                                </Description>
                            </DescriptionList>
                            <DescriptionList style={{ marginTop: 20 }} className={styles.headerList} size="large" col="2">
                                <Description term="处理人">
                                    {isExistTask ? this.props.taskInfo.data[0].OperationsUserName : null}
                                </Description>
                                <Description term="处理时间">
                                    {isExistTask ? this.props.taskInfo.data[0].CompleteTime : null}
                                </Description>
                            </DescriptionList>
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>附件</span>}>
                            {
                                upload.fileList.length === 0 ? '没有上传附件' : (<Upload
                                    {...upload}
                                    onPreview={(file) => {
                                        this.handlePreview(file, fileList);
                                    }}
                                />)
                            }
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>日志表</span>} style={{ marginTop: 20 }}>
                            {
                                <Steps width={this.stepsWidth(TaskLogList)} style={{ overflowX: 'scroll' }}>
                                    {
                                        this.TaskLogList(TaskLogList)
                                    }
                                </Steps>
                            }
                        </Card>
                    </div>
                </Card>
                <Modal
                    visible={this.state.cdvisible}
                    onCancel={this.cdClose}
                    onOk={() => this.cdOk(this.props.TaskID)}
                    title="打回说明"
                >
                    <Form className="login-form">
                        <FormItem
                            {...formItemLayout}
                            label="说明"
                        >
                            {getFieldDecorator('reason', {
                                rules: [{ required: true, message: '请输入打回说明' }],
                            })(
                                <Input.TextArea rows="3" prefix={<Icon type="rollback" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>

                {this.state.previewVisible && (
                    <Lightbox
                        mainSrc={ImageList[photoIndex]}
                        nextSrc={ImageList[(photoIndex + 1) % ImageList.length]}
                        prevSrc={ImageList[(photoIndex + ImageList.length - 1) % ImageList.length]}
                        onCloseRequest={() => this.setState({ previewVisible: false })}
                        onPreMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + ImageList.length - 1) % ImageList.length
                            })
                        }
                        onPreMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % ImageList.length
                            })
                        }
                    />
                )}

                <Modal
                    footer={null}
                    title={this.state.alarmType}
                    width="70%"
                    height="70%"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >
                    <AlarmDetails data={isExistTask ? this.state.moreAlarmList : []} />
                </Modal>
            </div>
        );
    }
}
export default EmergencyDetailInfo;