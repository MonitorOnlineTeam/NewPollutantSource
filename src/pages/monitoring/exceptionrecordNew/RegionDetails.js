import React, { PureComponent } from 'react';
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
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
          title: '响应人',
          dataIndex: 'OperationName',
          key: 'OperationName',
          render: (text, record) => {
            if (record.CompleteTime === "0001-01-01 00:00:00") {
              return "-"
            }
            return text ? text : "-"
          }
        },
        {
          title: '响应时间',
          dataIndex: 'CompleteTime',
          key: 'CompleteTime',
          align: 'center',
          render: (text, record) => {
            if (record.CompleteTime === "0001-01-01 00:00:00") {
              return "-"
            }
            return text ? text : "-"
          }
        },
        {
          title: '处理详情',
          align: 'center',
          render: (text, record) => {
            if (record.TaskId && record.DGIMN) {
              return <a onClick={() => {
                this.setState({ TaskID: record.TaskId, DGIMN: record.DGIMN }, () => { this.setState({ visible: true }) })
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
      <BreadcrumbWrapper hideBreadcrumb={this.props.hideBreadcrumb} title="异常数据报警详情">
        <Card>
          <Row style={{ marginBottom: 10 }}>
            <Radio.Group onChange={this.onChange} defaultValue="" style={{ marginRight: 10 }}>
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value="1">已响应</Radio.Button>
              <Radio.Button value="0">待响应</Radio.Button>
            </Radio.Group>
            <Button style={{ margin: '0 5px' }} icon={<ExportOutlined />} loading={exportLoading} onClick={this.onExport}>
              导出
            </Button>
            <Button onClick={() => {
              this.props.onBack ? this.props.onBack() : router.push("/monitoring/missingData/exceptionrecord")
            }}>
              <RollbackOutlined />
              返回
            </Button>
          </Row>
          <SdlTable align="center" loading={loading} dataSource={exceptionAlarmListForEntDataSource} columns={columns} />
          <Modal
            // title="Basic Modal"
            visible={this.state.visible}
            footer={false}
            width="100vw"
            height="100vh"
            destroyOnClose
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