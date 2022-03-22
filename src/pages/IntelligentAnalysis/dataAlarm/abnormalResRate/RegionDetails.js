import React, { PureComponent } from 'react';
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { Card, Row, Button, Divider, Radio, Modal, Select } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { router } from 'umi'
import EmergencyDetailInfo from '@/pages/EmergencyTodoList/EmergencyDetailInfo';
import moment from 'moment'

const { Option } = Select;

@connect(({ loading, autoForm, abnormalResRate }) => ({
  secondTableDataSource: abnormalResRate.secondTableDataSource,
  entByRegionList: abnormalResRate.entByRegionList,
  loading: loading.effects["abnormalResRate/getSecondTableDataSource"],
  exportLoading: loading.effects["abnormalResRate/exportSecond"],
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
          align: 'left'
        },
        {
          title: '监测点名称',
          dataIndex: 'PointName',
          key: 'PointName',
          align: 'left'
        },
        {
          title: '零值报警',
          children: [
            {
              title: '报警次数',
              dataIndex: 'LingAlarmCount',
              key: 'LingAlarmCount',
              width: 120,
              align: 'center',
            },
            {
              title: '已响应报警次数',
              dataIndex: 'LingResponsedCount',
              key: 'LingResponsedCount',
              width: 120,
              align: 'center',
            },
            {
              title: '待响应报警次数',
              dataIndex: 'LingNoResponseCount',
              key: 'LingNoResponseCount',
              width: 120,
              align: 'center',
            },
            {
              title: '响应率',
              dataIndex: 'LingRate',
              key: 'LingRate',
              width: 120,
              align: 'center',
              render: (text, record) => {
                return record.LingAlarmCount === 0 ? '-' : text
              }
            },
          ]
        },
        {
          title: '超量程报警',
          children: [
            {
              title: '报警次数',
              dataIndex: 'ChaoAlarmCount',
              key: 'ChaoAlarmCount',
              width: 120,
              align: 'center',
            },
            {
              title: '已响应报警次数',
              dataIndex: 'ChaoResponsedCount',
              key: 'ChaoResponsedCount',
              width: 120,
              align: 'center',
            },
            {
              title: '待响应报警次数',
              dataIndex: 'ChaoNoResponseCount',
              key: 'ChaoNoResponseCount',
              width: 120,
              align: 'center',
            },
            {
              title: '响应率',
              dataIndex: 'ChaoRate',
              key: 'ChaoRate',
              width: 120,
              align: 'center',
              render: (text, record) => {
                return record.ChaoAlarmCount === 0 ? '-' : text
              }
            },
          ]
        },
        {
          title: '响应率',
          dataIndex: 'AllRate',
          key: 'AllRate',
          width: 120,
          sorter: (a, b) => a.AllRate.replace("%", "") - b.AllRate.replace("%", ""),
          render: (text, record) => {
            return (record.ChaoAlarmCount + record.LingAlarmCount === 0) ? '-' : text
          }
        },
      ],
    };
  }

  componentDidMount() {
    this.getSecondTableDataSource();
    this.getEntByRegion();
  }

  getEntByRegion = () => {
    this.props.dispatch({
      type: 'abnormalResRate/getEntByRegion', payload: { RegionCode: this.state.queryCondition.RegionCode }
    })
  }


  getSecondTableDataSource = () => {
    this.props.dispatch({
      type: "abnormalResRate/getSecondTableDataSource",
      payload: {
        ...this.state.queryCondition,
        EntCode: this.state.EntCode
      }
    })
  }

  onExport = () => {
    this.props.dispatch({
      type: "abnormalResRate/exportSecond",
      payload: {
        ...this.state.queryCondition,
        EntCode: this.state.EntCode
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
      this.getSecondTableDataSource()
    })
  }

  render() {
    const { secondTableDataSource, loading, exportLoading, entByRegionList } = this.props;
    const { columns, DGIMN, TaskID, queryCondition } = this.state;
    let beginTime = queryCondition.dataType === "HourData" ? moment(queryCondition.beginTime).format("YYYY-MM-DD HH时") : moment(queryCondition.beginTime).format("YYYY-MM-DD")
    let endTime = queryCondition.dataType === "HourData" ? moment(queryCondition.endTime).format("YYYY-MM-DD HH时") : moment(queryCondition.endTime).format("YYYY-MM-DD")
    return (
      <BreadcrumbWrapper hideBreadcrumb={this.props.hideBreadcrumb} title="数据异常报警响应率详情">
        <Card>
          <Row style={{ fontWeight: "bold", marginBottom: 20 }}>
            {`${queryCondition.RegionName}${beginTime}至${endTime}数据异常报警响应情况`}
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Select allowClear style={{ width: 240 }} placeholder="请选择企业" onChange={(value) => {
              this.setState({ EntCode: value })
            }}>
              {
                entByRegionList.map(item => {
                  return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                })
              }
            </Select>
            <Button style={{ margin: '0 5px' }} type="primary" loading={loading} onClick={this.getSecondTableDataSource}>
              查询
            </Button>
            <Button style={{ marginRight: '5px' }} icon={<ExportOutlined />} loading={exportLoading} onClick={this.onExport}>
              导出
            </Button>
            <Button onClick={() => {
              this.props.onBack ? this.props.onBack() :
                router.push("/Intelligentanalysis/dataAlarm/abnormal")
            }}
            >
              <RollbackOutlined />
              返回
            </Button>
          </Row>
          <SdlTable align="center" loading={loading} dataSource={secondTableDataSource} columns={columns} />
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