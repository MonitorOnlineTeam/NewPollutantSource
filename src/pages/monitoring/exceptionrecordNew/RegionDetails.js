import React, { PureComponent } from 'react';
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import { Card, Row, Button, Divider, Radio, Modal } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { router } from 'umi'
import EmergencyDetailInfo from '@/pages/EmergencyTodoList/EmergencyDetailInfo';

@connect(({ loading, autoForm, exceptionrecordNew }) => ({
  exceptionAlarmListForEntDataSource: exceptionrecordNew.exceptionAlarmListForEntDataSource,
  loading: loading.effects["exceptionrecordNew/getExceptionAlarmListForEnt"],
  exportLoading: loading.effects["exceptionrecordNew/exportExceptionAlarmListForEnt"],
}))
class RegionDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      queryCondition: JSON.parse(this.props.location.query.queryCondition),
      columns: [
        {
          title: '行政区',
          dataIndex: 'RegionName',
          key: 'RegionName',
        },
        {
          title: '企业名称',
          dataIndex: 'EntName',
          key: 'EntName',
        },
        {
          title: '监测点名称',
          dataIndex: 'PointName',
          key: 'PointName',
        },
        {
          title: '数据类型',
          dataIndex: 'DataType',
          key: 'DataType',
        },
        {
          title: '首次报警时间',
          dataIndex: 'FirstTime',
          key: 'FirstTime',
        },
        {
          title: '报警信息',
          dataIndex: 'AlarmMsg',
          key: 'AlarmMsg',
          width: 300
        },
        {
          title: '响应状态',
          dataIndex: 'ResponseStatusName',
          key: 'ResponseStatusName',
        },
        {
          title: '运维负责人',
          dataIndex: 'OperationName',
          key: 'OperationName',
        },
        {
          title: '响应时间',
          dataIndex: 'CompleteTime',
          key: 'CompleteTime',
          align: 'center',
          render: (text, record) => {
            return text ? text : "-"
          }
        },
        {
          title: '处理详情',
          align: 'center',
          render: (text, record) => {
            if (record.TaskId && record.DGIMN) {
              return <a onClick={() => {
                this.setState({ TaskID: record.TaskId, DGIMN: record.DGIMN, visible: true })
              }}>详情</a>
            }
            return "-"
          }
        },
      ],
    };
  }

  componentDidMount() {
    this.getExceptionAlarmListForEnt();
  }


  getExceptionAlarmListForEnt = () => {
    this.props.dispatch({
      type: "exceptionrecordNew/getExceptionAlarmListForEnt",
      payload: {
        ...this.state.queryCondition,
      }
    })
  }

  onExport = () => {
    this.props.dispatch({
      type: "exceptionrecordNew/exportExceptionAlarmListForEnt",
      payload: {
        ...this.state.queryCondition,
      }
    })
  }

  onChange = (e) => {
    this.setState({
      queryCondition: {
        ...this.state.queryCondition,
        ResponseStatus: e.target.value
      }
    }, () => {
      this.getExceptionAlarmListForEnt()
    })
  }

  render() {
    const { exceptionAlarmListForEntDataSource, loading, exportLoading } = this.props;
    const { columns, DGIMN, TaskID } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Row style={{ marginBottom: 10 }}>
            <Radio.Group onChange={this.onChange} defaultValue="" style={{ marginRight: 10 }}>
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value="1">已响应</Radio.Button>
              <Radio.Button value="0">待响应</Radio.Button>
            </Radio.Group>
            <Button type="primary" loading={exportLoading} onClick={this.onExport}>
              导出
            </Button>
            <Divider type="vertical" />
            <Button type="dashed" onClick={() => router.push("/dataquerymanager/exceptionrecord")}>
              返回
            </Button>
          </Row>
          <SdlTable loading={loading} dataSource={exceptionAlarmListForEntDataSource} columns={columns} />
          <Modal
            // title="Basic Modal"
            visible={this.state.visible}
            footer={false}
            width="100vw"
            height="100vh"
            bodyStyle={{ padding: 0 }}
            onCancel={() => this.setState({ visible: false })}
          >
            <EmergencyDetailInfo DGIMN={DGIMN} TaskID={TaskID} goback={"none"} />
          </Modal>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default RegionDetails;