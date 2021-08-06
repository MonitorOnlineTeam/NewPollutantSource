import { Card, WhiteSpace, DatePicker, Grid, Steps, WingBlank, Badge, Modal, List,Icon } from 'antd-mobile';
import React, { PureComponent } from 'react';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import moment, { months } from 'moment';
import styles from './ScanningCode.less';
import { connect } from 'dva';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Spin } from 'antd';
import { router } from 'umi'
const Item = List.Item;
const Step = Steps.Step;
//初始加载页面
let gridData = [{
    "text": <div>
        <div>工单</div>
        <div style={{ margin: 10, marginBottom: 0 }}>0</div>
    </div>,

},
{
    "text": <div>
        <div>完成</div>
        <div style={{ margin: 10, marginBottom: 0 }}>0</div>
    </div>,
},
{
    "text": <div>
        <div>关闭</div>
        <div style={{ margin: 10, marginBottom: 0 }}>0</div>
    </div>,
},
{
    "text": <div>
        <div>执行中</div>
        <div style={{ margin: 10, marginBottom: 0 }}>0</div>
    </div>,
},
{
    "text": <div>
        <div>待执行</div>
        <div style={{ margin: 10, marginBottom: 0 }}>0</div>
    </div>,
}]

@connect(({ task, loading }) => ({
    loading: loading.effects['task/GetOperationLogList'],
    operationLogList: task.operationLogList,
    operationRzWhere: task.operationRzWhere,
}))

/*
页面：扫码查运维页面
*/
class ScanningCode extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visitible: false,
            dateValue: new Date(Date.now()),
        };

    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'task/updateState',
            payload: {
                operationRzWhere: {
                    ...this.props.operationRzWhere,
                    ...{
                        DGIMN: this.props.match.params.DGIMN,
                    }
                },
            }
        });
        this.getData();
    }
    //获取数据
    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'task/GetOperationLogList',
            payload: {
            },
        });
    }
    //展示弹出工单介绍详细信息
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            visitible: true,
        });
    }
    //关闭弹出层
    onClose = key => () => {
        this.setState({
            visitible: false,
        });
    }
    //日期改变事件
    dateChange = (date) => {
        const { dispatch } = this.props;
        this.setState({
            dateValue: date
        })
        dispatch({
            type: 'task/updateState',
            payload: {
                operationRzWhere: {
                    ...this.props.operationRzWhere,
                    ...{
                        beginTime: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                    }
                },
            }
        });
        this.getData();
    }
    //跳转任务详情
    getDetails = (TaskID) => {
        if(TaskID)
        {
            router.push(`/appoperation/operationFormDetail/${this.props.match.params.DGIMN}/${TaskID}/`)
        }
      
    }
    render() {
        const { operationLogList, operationRzWhere } = this.props;
        const { dateValue } = this.state;
        console.log(this.props.loading);
        let gridList = [];
        if (operationLogList && operationLogList.operationStatesCount && operationLogList.operationStatesCount.length > 0) {

            gridData = operationLogList.operationStatesCount.map((item) => ({
                text:
                    <div>
                        <div>{item.Text}</div>
                        <div style={{ margin: 10, marginBottom: 0 }}>{item.Total}</div>
                    </div>,
            }));
        }
        if (operationLogList && operationLogList.FormList && operationLogList.FormList.length > 0) {
            operationLogList.FormList.map((item) => {
                // gridList.push(
                //     <WhiteSpace />
                // )

                gridList.push(
                    <Step
                        icon={
                            <div style={{ fontSize: 13, color: 'black', width: 60, textAlign: 'left', marginLeft: -6 }}>{item.CreateDate}</div>
                        }
                    />
                )
                item.Nodes.map((itemChild) => {
                    gridList.push(
                        <Step title={
                            <div style={{ fontSize: 14,marginTop:-2}}>
                                <span>{itemChild.RecordTypeName}</span>
                            </div>
                        }
                            icon={
                                <div>
                                    <div style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: '#1890FF',
                                        borderRadius: '50%',
                                        position: 'relative',
                                        margin: 'auto'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            width: 4,
                                            height: 4,
                                            backgroundColor: '#fff',
                                            borderRadius: '50%',
                                            top: 4,
                                            left: 4,
                                        }}></div> 
                                    </div>
                                </div>
                            }
                            description={
                                <div style={{ fontSize: 13 }}>
                                    <div style={{ float: 'left', width: '35%', minWidth: 82, marginBottom: 15, marginTop: 10 }}>运维人:{itemChild.User_Name.length > 3 ? itemChild.User_Name.substring(0, 3) + ".." : itemChild.User_Name}</div>
                                    <div style={{ float: 'left', width: '40%', minWidth: 91, marginBottom: 15, marginTop: 10, textAlign: 'center' }}>执行时间:{itemChild.CreateTime}</div>
                                    <div style={{ float: 'left', width: '20%', marginBottom: 15, textAlign: 'center', marginTop: 10 }}>
                                        <span onClick={()=>{this.getDetails(itemChild.ID)}}><Icon type="right" /></span>
                                     </div>
                                </div>
                            } />
                    )
                })
            })
        }
        return (
            <div style={{ height: '100vh' }} className={styles.scanningCode}>
                <Card full style={{ height: 150 }}>
                    <Card.Header
                        title={
                            <span>
                                <span style={{ fontSize: 15 }}>
                                    工单情况
                                </span>
                                <span style={{ marginLeft: 10 }}>
                                    <ExclamationCircleTwoTone style={{ fontSize: 13 }} onClick={this.showModal()} />
                                </span>
                            </span>
                        }
                        extra={
                            <DatePicker
                                value={dateValue}
                                locale={zh_CN}
                                mode="month"
                                title="请选择日期"
                                extra="Optional"
                                onChange={date => this.dateChange(date)}
                            >
                                <div style={{ height: 25, width: 90, marginTop: 4, float: 'right' }}>
                                    <div style={{
                                        float: 'right',
                                        display: 'block',
                                        width: 13,
                                        height: 13,
                                        marginLeft: 8,
                                        backgroundImage: 'url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMjYnIHZpZXdCb3g9JzAgMCAxNiAyNicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMiAwTDAgMmwxMS41IDExTDAgMjRsMiAyIDE0LTEzeicgZmlsbD0nI0M3QzdDQycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+)',
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: '50% 50%;',
                                        marginTop: 5
                                    }}></div>
                                    <div arrow="horizontal" style={{ fontSize: 15, float: 'right' }}>{moment(operationRzWhere.beginTime).format('YYYY-MM')}  </div>
                                </div>
                            </DatePicker>
                        }
                    />
                    <Card.Body>
                        <Grid columnNum={5} activeStyle={false} data={gridData} hasLine={false} />
                    </Card.Body>
                </Card>
                <WhiteSpace />
                <div full style={{ height: 'calc(100vh - 150px)', overflow: 'auto', borderWidth: 0, paddingLeft: 25,backgroundColor:'#fff' }}>
                    <WhiteSpace />
                    {
                        this.props.loading ?
                            <Spin
                                style={{
                                    width: '100%',
                                    height: 'calc(100vh/2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                size="large"
                            /> :
                            operationLogList ? operationLogList.FormList && operationLogList.FormList.length > 0 ?

                                <Steps size="small">
                                    {
                                        gridList
                                    }
                                </Steps>
                                : <div style={{ width: '100%', textAlign: 'center', paddingRight: 20 }}>暂无数据</div> : <div style={{ width: '100%', textAlign: 'center', paddingRight: 20 }}>暂无数据</div>
                    }
                </div>
                <Modal
                    className={styles.scanningCodeModal}
                    visible={this.state.visitible}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose()}
                    footer={[{ text: <span style={{ fontSize: 13 }}>知道了</span>, onPress: () => { this.onClose()(); } }]}
                >
                    <List full renderHeader={() => '工单状态说明'} className="my-list" >
                        <Item wrap><span style={{ fontSize: 13 }}>1.工单：运维人员去现场执行运维任务，派发的工作单；</span> </Item>
                        <Item wrap><span style={{ fontSize: 13 }}>2.完成：运维人员完成了的工单；</span></Item>
                        <Item wrap><span style={{ fontSize: 13 }}>3.关闭：运维人员已经关闭的工单；</span> </Item>
                        <Item wrap><span style={{ fontSize: 13 }}>4.执行中：运维人员正在处理的工单；</span> </Item>
                        <Item wrap><span style={{ fontSize: 13 }}>5.待执行：运维人员还未处理的工单。</span> </Item>
                    </List>
                </Modal>
            </div>
        );
    }
}

export default ScanningCode;
