import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Steps, Popover } from 'antd';

const { Step } = Steps;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
        };
    }

    
    // 步骤条
    TaskLogList = TaskLogList => {
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

    //图标
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

    render() {
        return (
            < div id = "CommandDispatchReport" >
                <Steps status="process" current={1}>
                    <Step title="创建任务" description="张三于2020-05-14 22:17:40创建了应急任务" />
                    <Step title="现场签到" description="张三于2020-05-14 22:17:40打卡签到" />
                    <Step title="完成任务" description="张三于2020-05-14 22:17:40完成了任务" />
                </Steps>
            </div>
        );
    }
}
export default Index;
