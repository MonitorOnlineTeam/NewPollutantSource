import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, Icon, Divider } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import { router } from 'umi'
import moment from 'moment'

@connect(({ loading, autoForm, abnormalData }) => ({
  exceptionPointList: abnormalData.exceptionPointList,
  loading: loading.effects["abnormalData/getExceptionPointList"],
}))
class DetailsPage extends PureComponent {
  state = {}
  _SELF_ = {
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
        title: '数据类型',
        dataIndex: 'DataType',
        key: 'DataType',
      },
      {
        title: '开始时间',
        dataIndex: 'BTime',
        key: 'BTime',
      },
      {
        title: '结束时间',
        dataIndex: 'ETime',
        key: 'ETime',
      },
      {
        title: '监测因子',
        dataIndex: 'PollutantName',
        key: 'PollutantName',
      },
      {
        title: '监测值',
        dataIndex: 'MonitorValue',
        key: 'MonitorValue',
      },
      {
        title: '零值异常个数',
        dataIndex: 'ExceptionTypeLingZhi',
        key: 'ExceptionTypeLingZhi',
      },
    ],
    columns_Chao: [
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
        title: '数据类型',
        dataIndex: 'DataType',
        key: 'DataType',
      },
      {
        title: '监测时间',
        dataIndex: 'ExceptionTime',
        key: 'ExceptionTime',
      },
      {
        title: '监测因子',
        dataIndex: 'PollutantName',
        key: 'PollutantName',
      },
      {
        title: '监测值',
        dataIndex: 'MonitorValue',
        key: 'MonitorValue',
      },
      {
        title: '超量程异常个数',
        dataIndex: 'ExceptionTypeChao',
        key: 'ExceptionTypeChao',
      },
    ]
  }

  componentDidMount() {
    const queryCondition = this._SELF_.queryCondition;
    this.props.dispatch({
      type: "abnormalData/getExceptionPointList",
      payload: {
        ...queryCondition
      }
    })
  }

  onExport = () => {
    const queryCondition = this._SELF_.queryCondition;
    this.props.dispatch({
      type: "abnormalData/exportExceptionPointList",
      payload: {
        ...queryCondition
      }
    })
  }


  render() {
    const { exceptionPointList, loading, location } = this.props;
    const { columns, columns_Chao, queryCondition } = this._SELF_;
    let _columns = columns;
    let title = "零值异常"
    if (queryCondition.ExceptionType == 2) {
      _columns = columns_Chao;
      title = "超量程"
    }
    let beginTime = queryCondition.dataType === "HourData" ? moment(queryCondition.beginTime).format("YYYY-MM-DD HH时") : moment(queryCondition.beginTime).format("YYYY-MM-DD")
    let endTime = queryCondition.dataType === "HourData" ? moment(queryCondition.endTime).format("YYYY-MM-DD HH时") : moment(queryCondition.endTime).format("YYYY-MM-DD")
    return (
      <BreadcrumbWrapper title={title + "详情"}>
        <Card>
          <Row style={{ fontWeight: "bold", marginBottom: 20 }}>
            {`${queryCondition.RegionName}${beginTime}至${endTime}${title}情况`}
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Button type="primary" ghost icon="export" onClick={this.onExport}>
              导出
            </Button>
            <Divider type="vertical" />
            <Button type="dashed" onClick={() => router.push("/dataSearch/abnormalData")}>
              返回
            </Button>
          </Row>
          <SdlTable align="center" dataSource={exceptionPointList} columns={_columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default DetailsPage;