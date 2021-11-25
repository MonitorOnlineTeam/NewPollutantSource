import React, { Component } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, LeftOutlined, RollbackOutlined } from '@ant-design/icons';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Card,
    Divider,
    Button,
    Input,
    Table,
    Spin,
    Modal,
    Upload,
    Col,
    Row,
    message,
    Carousel,
    Steps,
    Tooltip,
    Popover,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { CALL_HISTORY_METHOD } from 'react-router-redux';
import { async } from 'q';
import moment from 'moment';
import Lightbox from 'react-image-lightbox-rotate';
import { router } from 'umi'
import styles from './EmergencyDetailInfo.less';
import DescriptionList from '../../components/DescriptionList';
// import AlarmDetails from '../../components/EmergencyDetailInfo/AlarmDetails';
import { EnumRequstResult, EnumPatrolTaskType, EnumPsOperationForm, EnumOperationTaskStatus } from '../../utils/enum';
import { imgaddress } from '../../config.js';
import MonitorContent from '../../components/MonitorContent/index';
import { get, post, authorpost } from '@/utils/request';
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';
import ViewImagesListModal from '../../components/ImgView';
import 'react-image-lightbox/style.css';
import config from '@/config';
import { EnumPropellingAlarmSourceType, EnumDYParameterException, EnumDataException, EnumDataLogicErr, EnumDYStatusException } from '@/utils/enum';


const { Description } = DescriptionList;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Step } = Steps;
// let SCREEN_HEIGHT = document.querySelector('body').offsetHeight - 250;
let SCREEN_HEIGHT = "calc(100vh - 250px)";
@Form.create()
@connect(({ task, loading }) => ({
    // isloading: loading.effects['task/GetTaskRecord'],
    isloading: task.TaskRecordLoading,
    taskInfo: task.TaskRecord,
    alarmList: [],
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
            // 参数改变让页面刷新
            DGIMN,
            TaskID,
            moreAlarmList: null,
            visible: false,
            alarmType: null,
            visibleImg: false,
            ImgListvisible: false,
            FileUuid: '',
        };
    }

    componentDidMount = () => {
        this.reloaddata();
    }

    componentWillReceiveProps(nextProps) {
        const { DGIMN, TaskID } = this.props;
        // 如果传入参数有变化，则重新加载数据
        if (nextProps.DGIMN !== DGIMN || nextProps.TaskID !== TaskID) {
            this.setState({
                // 参数改变让页面刷新
                DGIMN: nextProps.DGIMN,
                TaskID: nextProps.TaskID,
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
            // previewImage: file.url,
            photoIndex: ImageList,
        });
    }

    handleCancels = () => {
        this.setState({
            previewVisible: false,
        });
    }

    reloaddata = () => {
        this.props.dispatch({
            type: 'task/GetTaskRecord',
            payload: {
                TaskID: this.props.TaskID,
                DGIMN: this.props.DGIMN,
            },
        });
    }

    renderItem = (data, taskID, types) => {
        const rtnVal = [];
        console.log('data111=', data)
        data.map((item, key) => {
            if (item.FormMainID !== null) {
                console.log(item.ID)
                // 新疆兵团只要任务图片 故障小时数记录表不使用图片
                if ((types === '2' && !config.XinJiang) || item.ID === 58 || item.ID === 59 || item.ID === 60 
                     || item.ID === 15 ) {
                    switch (item.ID) {
                        case EnumPsOperationForm.Repair:
                            this.GoToForm(taskID, item.CnName, '1', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.StopMachine:
                            this.GoToForm(taskID, item.CnName, '2', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.YhpReplace:
                            this.GoToForm(taskID, item.CnName, '3', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.StandardGasReplace:
                            this.GoToForm(taskID, item.CnName, '4', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.CqfPatrol:
                            this.GoToForm(taskID, item.CnName, '5', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.CyfPatrol:
                            this.GoToForm(taskID, item.CnName, '6', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.ClfPatrol:
                            this.GoToForm(taskID, item.CnName, '7', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.CheckRecord:
                            this.GoToForm(taskID, item.CnName, '8', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.TestRecord:
                            this.GoToForm(taskID, item.CnName, '9', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.DataException:
                            this.GoToForm(taskID, item.CnName, '10', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.Maintain:
                            this.GoToForm(taskID, item.CnName, '27', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.SparePartReplace:
                            this.GoToForm(taskID, item.CnName, '28', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.Fault:
                            this.GoToForm(taskID, item.CnName, '58', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.FaultWater:
                            this.GoToForm(taskID, item.CnName, '59', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.FaultYan:
                            this.GoToForm(taskID, item.CnName, '60', rtnVal, key, item.FormMainID);
                            break;
                        case EnumPsOperationForm.ReagentReplace:
                            this.GoToForm(taskID, item.CnName, '15', rtnVal, key, item.FormMainID);
                            break;                             
                        default:
                            break;
                    }
                } else {
                    this.GoToForm(taskID, item.CnName, '-1', rtnVal, key, item.FormMainID);
                }
            }
        });
        return rtnVal;
    }

    GoToForm = (taskID, cnName, recordType, rtnVal, key, FormMainID) => {
        // let taskfrom = this.props.taskfrom || '';
        // if (taskfrom.indexOf("qcontrollist") > -1) {
        //     taskfrom = taskfrom.split('-')[0];
        // }
        rtnVal.push(<p key={key} style={{ marginBottom: 0 }}><Button
            style={{ marginBottom: '5px' }}
            icon={<CheckCircleOutlined />}
            onClick={() => {
                // if (recordType == '-1') {
                //     // 获取详情图片
                //     this.props.dispatch({
                //         type: 'common/getOperationImageList',
                //         payload: {
                //             FormMainID,
                //             // FormMainID:"c521b4a0-5b67-45a8-9ad1-d6ca67bdadda"
                //         },
                //         callback: res => {
                //             this.setState({
                //                 visibleImg: true,
                //             })
                //         },
                //     })
                // } else {
                //     router.push(`/operations/recordForm/${recordType}/${taskID}`)
                // }
                // this.props.dispatch(routerRedux.push(`/PatrolForm/${recordType}/${this.props.DGIMN}/${this.props.viewtype}/${taskfrom}/nop/${taskID}`));
                router.push(`/operations/recordForm/${recordType}/${taskID}`)
            }}
        >{cnName} 
        </Button>
        </p>);
    }

    // 获取撤单按钮
    getCancelOrderButton = (createtime, TaskStatus) => {
        if (moment(createtime) > moment(new Date()).add(-7, 'day') && TaskStatus == 3) {
            return <Button onClick={this.cdShow}><CloseCircleOutlined />打回</Button>;
        }

        return <Button disabled><CloseCircleOutlined />打回</Button>;
    }

    cdShow = () => {
        this.setState({
            cdvisible: true,
        });
    }

    cdClose = () => {
        this.setState({
            cdvisible: false,
        });
    }

    cdOk = TaskID => {
        this.props.dispatch({
            type: 'task/RevokeTask',
            payload: {
                taskID: TaskID,
                revokeReason: this.props.form.getFieldValue('reason'),
                reload: () => this.reloaddata(),
                close: () => this.cdClose(),
            },
        });
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    }

    // 步骤条
    TaskLogList = TaskLogList => {
        console.log('TaskLogList', TaskLogList);
        const returnStepList = [];
        TaskLogList.map(item => {
            returnStepList.push(
                <Step
                    status="finish"
                    title={item.TaskStatusText}
                    description={this.description(item)}
                    icon={<LegacyIcon type={
                        this.showIcon(item.TaskStatusText)
                    }
                    />}
                />,
            );
        });
        return returnStepList;
    }

    // 图标
    showIcon = TaskStatusText => {
        switch (TaskStatusText) {
            case '待执行': return 'minus-circle';
            case '进行中': return 'clock-circle';
            case '已完成': return 'check-circle';
            case '待审核': return 'exclamation-circle';
            case '审核通过': return 'check-square';
            case '驳回': return 'close-circle';
            case '待调整': return 'warning';
            case '已调整': return 'check-square';
            default: return 'schedule';
        }
    }


    // 步骤条描述
    description = item => {
        if (item.TaskRemark === '' || item.TaskRemark === null) {
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

    stepsWidth = item => {
        const width = item.length * 350;
        return width;
    }

    getGoBack = () => {
        const { history, goback } = this.props;
        if (goback === 'none') {
            SCREEN_HEIGHT = document.querySelector('body').offsetHeight - 500;
            return (<span />);
        }
        return (
            <Button
                style={{ float: 'right', marginRight: 30 }}
                onClick={() => {
                    history.goBack(-1);
                }}
            ><LeftOutlined />退回
            </Button>
        );
    }

    showImagList = id => {
        this.setState({
            ImgListvisible: true,
            FileUuid: id,
        })
    }

    modalHandleCancel = e => {
        this.setState({
            ImgListvisible: false,
        });
    };

    getUserIcon = data => {
        const iconList = []

        if (data) {
            for (let i = 0; i < data.length; i++) {
                const ID = data[i].AttachmentID;
                if (data[i].CertificateTypeID == 240)// 废气
                {
                    var gasUrl = '/废气.png'
                    if (data[i].IsExpire == false) {
                        gasUrl = '/废气灰.png'
                        iconList.push(<Tooltip title="证书已过期"><img onClick={() => {
                            this.showImagList(ID);
                        }} style={{ marginLeft: 5, width: 35 }} src={gasUrl}></img></Tooltip>)
                    } else {
                        iconList.push(<img onClick={() => {
                            this.showImagList(ID);
                        }} style={{ marginLeft: 5, width: 35 }} src={gasUrl}></img>)
                    }
                }
                if (data[i].CertificateTypeID == 241)// 水
                {
                    var gasUrl = '/水.png'
                    if (data[i].IsExpire == false) {
                        gasUrl = '/水灰.png'
                        iconList.push(<Tooltip title="证书已过期"><img onClick={() => {
                            this.showImagList(ID);
                        }} style={{ marginLeft: 5, width: 35 }} src={gasUrl}></img></Tooltip>)
                    } else {
                        iconList.push(<img onClick={() => {
                            this.showImagList(ID);
                        }} style={{ marginLeft: 5, width: 35 }} src={gasUrl}></img>)
                    }
                }
                if (data[i].CertificateTypeID == 242)// voc
                {
                    var gasUrl = '/voc.png'
                    if (data[i].IsExpire == false) {
                        gasUrl = '/voc灰.png'
                        iconList.push(<Tooltip title="证书已过期"><img onClick={() => {
                            this.showImagList(ID);
                        }} style={{ marginLeft: 5, width: 35 }} src={gasUrl}></img></Tooltip>)
                    } else {
                        iconList.push(<img onClick={() => {
                            this.showImagList(ID);
                        }} style={{ marginLeft: 5, width: 35 }} src={gasUrl}></img>)
                    }
                }
            }
        }
        return iconList
    }

    GetAlarmInfo = (AlarmList, type) => {
        const alarmList = AlarmList.filter(item => item.MsgTypeText === type);
        this.setState({
            moreAlarmList: alarmList,
            typeName: type,
            visible: true,
        });
    }

    GetHelpersPeople=data => {
        const PeopleArr = [];

        data.length > 0 && data.map(item => {
            PeopleArr.push(
                item.User_Name,
            );
        });
        return PeopleArr.join(',');
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
        const { isloading } = this.props;
        if (isloading) {
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
        if (this.props.taskInfo === null) {
            return (
                <div />
            );
        }
        // 是否存在任务信息
        const isExistTask = this.props.taskInfo.IsSuccess && this.props.taskInfo.Datas !== null && this.props.taskInfo.Datas.length > 0;
        const AlarmList = []; // 报警记录
        let Attachments = ''; // 附件
        let TaskLogList = []; // 任务日志列表
        let RecordTypeInfo = [];
        if (isExistTask) {
            Attachments = this.props.taskInfo.Datas[0].Attachments;
            TaskLogList = this.props.taskInfo.Datas[0].TaskLogList;
            RecordTypeInfo = this.props.taskInfo.Datas[0].TaskFormList;

            if (this.props.taskInfo.Datas[0].AlarmList.length > 0) {
                this.props.taskInfo.Datas[0].AlarmList.map(item => {
                    if (item !== null) {
                        let AlarmType = '';
                        let AlarmCount = 0;
                        if (item.MsgTypeList) {
                            item.MsgTypeList.map(item => {
                                AlarmType += `${item.MsgTypeText},`;
                                AlarmCount += item.AlarmCount;
                            });
                        }
                        let ExceptionName = '';
                        switch (parseInt(item.AlarmType)) {
                            // 参数异常
                            case EnumPropellingAlarmSourceType.DYPARAMETER:
                                switch (parseInt(item.MsgType)) {
                                    case EnumDYParameterException.O2Content:
                                        ExceptionName = '氧气含量异常';
                                        break;
                                    case EnumDYParameterException.FlueGasHumidity:
                                        ExceptionName = '烟气湿度';
                                        break;
                                    case EnumDYParameterException.DifferentialPressure:
                                        ExceptionName = '差压';
                                        break;
                                    case EnumDYParameterException.FlueGasTemperature:
                                        ExceptionName = '烟气温度';
                                        break;
                                    case EnumDYParameterException.FlueGasStaticPressure:
                                        ExceptionName = '烟气静压';
                                        break;
                                    case EnumDYParameterException.ProbeTemperature:
                                        ExceptionName = '探头温度';
                                        break;
                                    case EnumDYParameterException.PipelineTemperature:
                                        ExceptionName = '管线温度';
                                        break;
                                    case EnumDYParameterException.CoolerTemperature:
                                        ExceptionName = '制冷器温度';
                                        break;
                                }
                                break;
                            // 数据异常
                            case EnumPropellingAlarmSourceType.DataException:
                                switch (parseInt(item.MsgType)) {
                                    case EnumDataException.Zero:
                                        ExceptionName = '零值异常';
                                        break;
                                    case EnumDataException.OverRun:
                                        ExceptionName = '超量程异常';
                                        break;
                                    case EnumDataException.Series:
                                        ExceptionName = '连续值异常';
                                        break;
                                    case EnumDataException.DataLoss:
                                        ExceptionName = '数据异常';
                                        break;
                                }
                                break;
                            // 逻辑异常
                            case EnumPropellingAlarmSourceType.DataLogicErr:
                                switch (parseInt(item.MsgType)) {
                                    case EnumDataLogicErr.Unknown:
                                        ExceptionName = '未知异常';
                                        break;
                                }
                                break;
                            // 状态异常
                            case EnumPropellingAlarmSourceType.DYSTATEALARM:
                                switch (parseInt(item.MsgType)) {
                                    case EnumDYStatusException.PowerFailure:
                                        ExceptionName = '电源故障';
                                        break;
                                    case EnumDYStatusException.CoolerAlarm:
                                        ExceptionName = '制冷器报警';
                                        break;
                                    case EnumDYStatusException.SamplingPipeline:
                                        ExceptionName = '采样管线故障';
                                        break;
                                    case EnumDYStatusException.SamplingProbe:
                                        ExceptionName = '采样探头故障';
                                        break;
                                    case EnumDYStatusException.HumidityAlarm:
                                        ExceptionName = '湿度报警';
                                        break;
                                    case EnumDYStatusException.AnalyzerFailure:
                                        ExceptionName = '分析仪故障';
                                        break;
                                }
                                break;
                        }

                        AlarmList.push({
                            key: item.AlarmSourceType,
                            FirstAlarmTime: item.FirstTime,
                            LastAlarmTime: item.AlarmTime,
                            // AlarmMsg: AlarmType !== '' ? AlarmType.substring(0, AlarmType.lastIndexOf(',')) : AlarmType,
                            AlarmMsg: item.AlarmMsg,
                            AlarmCount: item.AlarmCount,
                            MsgTypeList: item.MsgTypeList,
                            AlarmType: item.AlarmType,
                            AlarmValue: item.AlarmValue,
                            StandardValue: item.StandardValue,
                            PollutantName: item.PollutantName,
                            MsgType: ExceptionName,
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
                    url: '/NoPic.png',
                });
            } else {
                fileList.push({
                    uid: index,
                    name: item.replace('_thumbnail', ''),
                    status: 'done',
                    url: `/uploadplantform/${item}`,
                });
            }
        });
        // 拼接图片地址数组
        const ImageList = [];
        fileList.map(item => {
            ImageList.push(
                `/uploadplantform/${item.name}`,
            );
        });
        // 报警列表列名
        let columns = [{
            title: '开始报警时间',
            width: 100,
            dataIndex: 'FirstAlarmTime',
            key: 'FirstAlarmTime',
        }, {
            title: '最后一次报警时间',
            width: 100,
            dataIndex: 'LastAlarmTime',
            key: 'LastAlarmTime',
        }, {
            title: '报警类型',
            width: 100,
            dataIndex: 'AlarmType',
            key: 'AlarmType',
            render: (text, row, index) => {
                switch (text) {
                    case '0':
                        return '数据异常'
                        break;
                    case '1':
                        return '参数异常'
                        break;
                    case '2':
                        return '数据超标'
                        break;
                    case '3':
                        return '状态异常'
                        break;
                    case '4':
                        return '逻辑异常'
                        break;
                    case '5':
                        return '超标预警'
                        break;
                    case '6':
                        return '过期时间报警'
                        break;
                    case '7':
                        return '余量不足报警'
                        break;
                    case '8':
                        return '工作状态异常'
                        break;
                    case '9':
                        return '压力异常报警'
                        break;
                }
            },
        }, {
            title: '报警次数',
            dataIndex: 'AlarmCount',
            width: 100,
            key: 'AlarmCount',
        }, {
            title: '异常描述',
            dataIndex: 'AlarmMsg',
            width: 200,
            key: 'AlarmMsg',
        }];
        if (this.props.taskInfo.Datas[0].AlarmList.length > 0) {
            // 超标列
            if (this.props.taskInfo.Datas[0].AlarmList[0].AlarmType === '2') {
                columns = columns.concat({
                    title: '污染物',
                    width: 100,
                    dataIndex: 'PollutantName',
                    key: 'PollutantName',
                });
                columns = columns.concat({
                    title: '超标值',
                    width: 100,
                    dataIndex: 'AlarmValue',
                    key: 'AlarmValue',
                });
                columns = columns.concat({
                    title: '标准值',
                    width: 100,
                    dataIndex: 'StandardValue',
                    key: 'StandardValue',
                });
            }
            // 异常列
            else {
                columns = columns.concat({
                    title: '污染物',
                    width: 100,
                    dataIndex: 'PollutantName',
                    key: 'PollutantName',
                });
                columns = columns.concat({
                    title: '异常类型',
                    width: 100,
                    dataIndex: 'MsgType',
                    key: 'MsgType',
                });
            }
        }
        const upload = {

            showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
            listType: 'picture-card',
            fileList: [...fileList],
        };


        return (
            <div>
                <Card
                    title={<span style={{ fontWeight: '900' }}>任务详情</span>}
                    extra={
                        <div>
                            <span style={{ marginRight: 20 }}>{this.getCancelOrderButton(isExistTask ? this.props.taskInfo.Datas[0].CreateTime : null, isExistTask ? this.props.taskInfo.Datas[0].TaskStatus : null)}</span>
                            {this.getGoBack()}
                        </div>}
                >

                    <div style={{ height: SCREEN_HEIGHT }} className={styles.ExceptionDetailDiv}>
                        <Card style={{ paddingBottom: '1.5%' }} title={<span style={{ fontWeight: '900' }}>基本信息</span>}>
                            <DescriptionList classNam={styles.headerList} size="large" col="3">
                                <Description term="任务单号">{isExistTask ? this.props.taskInfo.Datas[0].TaskCode : null}</Description>
                                <Description term="监控标">{isExistTask ? this.props.taskInfo.Datas[0].EnterpriseName : null}</Description>
                                <Description term="监测点名称">{isExistTask ? this.props.taskInfo.Datas[0].PointName : null}</Description>
                            </DescriptionList>
                            <DescriptionList style={{ marginTop: 20 }} className={styles.headerList} size="large" col="3">
                               <Description term="运维单位">{isExistTask ? this.props.taskInfo.Datas[0].OperationEnt : null}</Description>
                               
                                <Description term="任务来源">{isExistTask ? this.props.taskInfo.Datas[0].TaskFromText : null}</Description>
                                {/* <Description term="紧急程度"><div style={{ color: 'red' }}>{isExistTask ? this.props.taskInfo.Datas[0].EmergencyStatusText : null}</div></Description> */}
                                <Description term="任务状态"> <div style={{ color: '#32CD32' }}>{isExistTask ? this.props.taskInfo.Datas[0].TaskStatusText : null}</div></Description>
                            </DescriptionList>
                            <DescriptionList style={{ marginTop: 20 }} className={styles.headerList} size="large" col="3">
                                <Description term="任务类型">{isExistTask ? this.props.taskInfo.Datas[0].TaskTypeText : null}</Description>
                                <Description term="创建人">{isExistTask ? this.props.taskInfo.Datas[0].CreateUserName : null}{this.getUserIcon(this.props.taskInfo.Datas[0].PeopleCertificateInfos)}</Description>
                                <Description term="创建时间">{isExistTask ? this.props.taskInfo.Datas[0].CreateTime : null}</Description>
                            </DescriptionList>
                            {
                                (isExistTask ? this.props.taskInfo.Datas[0].TaskType : null) === EnumPatrolTaskType.PatrolTask ? null : AlarmList.length === 0 ? null : (<Divider style={{ marginBottom: 20 }} />)
                            }

                            {

                                (isExistTask ? this.props.taskInfo.Datas[0].TaskType : null) === EnumPatrolTaskType.PatrolTask ? null : AlarmList.length === 0 ? null :
                                    <Table rowKey={(record, index) => `complete${index}`} style={{ backgroundColor: 'white' }} bordered={false} dataSource={AlarmList} pagination={false} columns={columns} />
                            }
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>处理说明</span>} style={{ marginTop: 20, paddingBottom: '1.5%' }}>
                            <DescriptionList className={styles.headerList} size="large" col="1">
                                <Description>
                                    <TextArea rows={8} style={{ width: '600px' }} value={isExistTask ? this.props.taskInfo.Datas[0].TaskDescription : null} />
                                </Description>
                            </DescriptionList>
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>处理记录</span>} style={{ marginTop: 20, paddingBottom: '1.5%' }}>
                            <DescriptionList className={styles.headerList} size="large" col="1">
                                <Description>
                                    {
                                        this.renderItem(RecordTypeInfo, isExistTask ? this.props.taskInfo.Datas[0].TaskID : null, this.props.taskInfo.Datas[0].PollutantType)
                                    }
                                </Description>
                            </DescriptionList>
                            <DescriptionList style={{ marginTop: 20 }} className={styles.headerList} size="large" col="3">
                                <Description term="处理人">
                                    {isExistTask ? this.props.taskInfo.Datas[0].ExecuteUserName : null}
                                </Description>
                                <Description term="处理时间">
                                    {isExistTask ? this.props.taskInfo.Datas[0].CompleteTime : null}
                                </Description>
                                <Description term="协助人">
                                    {isExistTask ? this.GetHelpersPeople(this.props.taskInfo.Datas[0].TaskHelpersPeople) : null}
                                </Description>
                            </DescriptionList>
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>附件</span>} style={{ marginTop: 20, paddingBottom: '1.5%' }}>
                            {
                                upload.fileList.length === 0 ? '没有上传附件' : (<Upload
                                    {...upload}
                                    onPreview={file => {
                                        this.handlePreview(file, fileList);
                                    }}
                                />)
                            }
                        </Card>
                        <Card title={<span style={{ fontWeight: '900' }}>日志表</span>} style={{ marginTop: 20, paddingBottom: '1.5%' }}>
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
                                <Input.TextArea rows="3" prefix={<RollbackOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />,
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
                                photoIndex: (photoIndex + ImageList.length - 1) % ImageList.length,
                            })
                        }
                        onPreMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % ImageList.length,
                            })
                        }
                    />
                )}

                <Modal
                    footer={null}
                    title={this.state.alarmType}
                    width="70%"
                    // height="70%"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >
                    {/* <AlarmDetails data={isExistTask ? this.state.moreAlarmList : []} /> */}
                </Modal>
                {this.state.visibleImg && <ViewImagesModal />}
                <Modal
                    destroyOnClose="true"
                    title="证书详细"
                    visible={
                        this.state.ImgListvisible
                    }
                    footer=""
                    onCancel={
                        this.modalHandleCancel
                    } >
                    <ViewImagesListModal FileUuid={this.state.FileUuid} />
                </Modal>


                {/* <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancels}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal> */}
            </div>
        );
    }
}
export default EmergencyDetailInfo;
