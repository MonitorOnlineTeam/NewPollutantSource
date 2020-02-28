import React, { PureComponent } from 'react';
import { Card, List, Tag, Icon, Button, Popconfirm } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './ExceptionAlarm.less';
import UrgentDispatch from './UrgentDispatch';
import PdButton from './PdButton';

@connect(({
    loading,
    workbenchmodel,
}) => ({
    loadingExceptionAlarm: loading.effects['workbenchmodel/getExceptionAlarmData'],
    exceptionAlarm: workbenchmodel.exceptionAlarm,
}))
class ExceptionAlarm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pdvisible: false,
            selectpoint: null,
        };
    }


    componentDidMount() {
        console.log('22222222222222');
        this.reload();
    }

    reload = () => {
        const { dispatch, DGIMN, Types, firsttime, lasttime } = this.props;
        debugger;
        let {
          exceptionAlarm,
        } = this.props;
        if (Types !== '1') {
             exceptionAlarm = {
               ...exceptionAlarm,
               beginTime: moment().format('YYYY-MM-DD 00:00:00'),
               endTime: moment().format('YYYY-MM-DD 23:59:59'),
             }
             dispatch({
               type: 'workbenchmodel/updateState',
               payload: {
                 exceptionAlarm,
               },
             })
        } else {
             exceptionAlarm = {
               ...exceptionAlarm,
               beginTime: firsttime,
                 endTime: lasttime,
             }
             dispatch({
               type: 'workbenchmodel/updateState',
               payload: {
                 exceptionAlarm,
               },
             })
        }
        dispatch({
            type: 'workbenchmodel/getExceptionAlarmData',
            payload: {
                DGIMN,
                Type: Types,
            },
        })
    }

    /**
 * 智能质控_渲染异常报警数据列表
 */
    renderExceptionAlarmList = () => {
        let listData = [];
        const { exceptionAlarm } = this.props;
        const colorArray = {
            数据超标: 'red',
            超标预警: 'blue',
            数据异常: 'gold',
            参数异常: 'yellow',
            逻辑异常: 'volcano',
            状态异常: 'orange',
        };
        listData = exceptionAlarm.tableDatas.map((item, key) => {
            console.log(item);
            // 判断报警是否超过4小时
            const seconds = moment().diff(moment(item.FirstAlarmTime), 'minutes');
            const hour = Math.floor(seconds / 60);
            const minutes = Math.floor(seconds % 60);
            const color = hour >= 4 ? 'red' : 'rgb(129,203,237)';
            const minutesLable = minutes > 0 ? `${minutes}分钟` : '';

            const labelDiv = <div style={{ color: `${color}` }}>已发生{hour}小时{minutesLable}</div>;
            // 未响应，按钮是派单;响应了超过4个小时是督办
            let btnDiv = '';

            if (hour >= 4 || item.State == '0') {
                btnDiv =
                    <div style={{ marginTop: 43 }}>
                        <PdButton DGIMN={item.DGIMNs} id={item.OperationUserTel}
                            pname={item.PointName} reloadData={() => this.reload()}
                            exist={item.State} pollutantTypeCode={item.PollutantTypeCode} name={item.OperationUserName} tel={item.OperationUserTel} viewType="workbench" />
                    </div>
            }

            return {
                // href: 'http://ant.design',
                key,
                title: `${item.PointName}`,
                avatar: (<Icon type="alert" theme="twoTone" />),
                description: (
                    <div>
                        <div>
                            {
                                item.ExceptionTypes.split(',').map((itemss, keyss) => (
                                    <Tag key={keyss} color={`${colorArray[itemss]}`}>{itemss}</Tag>
                                ))
                            }
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <div>{item.LastAlarmMsg}</div>
                        </div>
                    </div>
                ),
                content: '',
                extra: (
                    <div style={{ marginTop: 30, marginRight: 70, textAlign: 'center' }}>
                        {labelDiv}
                        {btnDiv}
                    </div>
                ),
            };
        });
        return (
            <List
                itemLayout="vertical"
                dataSource={listData}
                renderItem={(item, key) => (
                    <List.Item
                        key={key}
                        actions={[]}
                        extra={item.extra}
                    >
                        <List.Item.Meta
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />);
    }

    render() {
        const { selectpoint } = this.state;
        return (
            <div style={{ maxHeight: '70vh' }}>
                <Card
                    // title="异常报警"
                    style={{ marginBottom: 10, maxHeight: '70vh', overflowY: 'auto' }}
                    bordered={false}
                    // extra={<a href="#">更多>></a>}
                    className={styles.exceptionAlarm}
                    loading={this.props.loadingExceptionAlarm}
                >
                    {this.renderExceptionAlarmList()}
                </Card>
            </div>

        );
    }
}

export default ExceptionAlarm;
