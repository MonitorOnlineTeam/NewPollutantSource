import React, { Component } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  Empty,
  message,
  Spin,
  Divider,
} from 'antd';
import moment from 'moment'
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import DataTagTable from "./components/DataTagTable"

const { RangePicker } = DatePicker;

@connect(({ loading, dataquery }) => ({
  pollutantList: dataquery.pollutantList,
  loading: loading.effects['dataquery/getAllTypeDataForWryFlag'],
  exportLoading: loading.effects['dataquery/exportDataFlagReport'],
  dataFlagDataSource: dataquery.dataFlagDataSource,
  tagTableTotal: dataquery.tagTableTotal,
}))
class DataTagPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment(new Date()).subtract(1, 'hours'), moment()],
      dataType: "mins",
      format: "YYYY-MM-DD HH:mm",
      DGIMN: "",
      isShowFlag: true,
      defalutPollutantType: props.location.query.pollutantCode ? '2' : "1,2",
      pageSize: 10,
      pageIndex: 1,
    };
  }

  componentDidMount() {
  }

  getPollutantList = () => {
    this.props.dispatch({
      type: 'dataquery/getPollutantList',
      payload: {
        DGIMNs: this.state.DGIMN,
      },
    });
  }

  getPageData = (queryType, payload) => {
    const format = this.state.dataType === "hour" ? "YYYY-MM-DD HH:00:00" : "YYYY-MM-DD HH:mm:00";
    const actionType = queryType === "export" ? "dataquery/exportDataFlagReport" : "dataquery/getAllTypeDataForWryFlag";
    const { time, pollutantValue, pollutantNames, isShowFlag, pageSize, pageIndex } = this.state;
    this.props.dispatch({
      type: actionType,
      payload: {
        datatype: this.state.dataType,
        DGIMNs: this.state.DGIMN,
        // DGIMNs: "62020131jhdp02",
        pageIndex: pageIndex,
        pageSize: pageSize,
        beginTime: moment(time[0]).format(format),
        endTime: moment(time[1]).format(format),
        pollutantCodes: pollutantValue.toString(),
        pollutantNames: pollutantNames.toString(),
        unit: "μg/m3",
        isAsc: true,
        DGIMN: this.state.DGIMN,
        // DGIMN: "62020131jhdp02",
        IsShowFlag: isShowFlag,
        ...payload
      }
    })
    console.log("this.table=", this.table)

  }

  // 分页
  onTableChange = (pageIndex, pageSize) => {
    this.setState({ pageSize, pageIndex }, () => {
      this.getPageData("", {
        pageIndex: this.state.pageIndex
      });
    })
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pollutantList !== nextProps.pollutantList) {
      this.props.dispatch({
        type: 'dataquery/updateState',
        payload: {
          pollutantList: nextProps.pollutantList
        }
      })
      const pollutantValue = nextProps.pollutantList.map(item => item.PollutantCode);
      const pollutantNames = nextProps.pollutantList.map(item => item.PollutantName);
      this.setState({
        pollutantValue: pollutantValue,
        pollutantNames: pollutantNames,
        pageIndex: 1,
      }, () => {
        this.getPageData()
      })
    }
  }

  getCardTitle = () => {
    const { pollutantList, exportLoading } = this.props;
    const { pollutantValue, time, dataType, format, isShowFlag, pageSize, pageIndex } = this.state;
    return (
      <Row gutter={16}>
        <Col span={7}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            value={pollutantValue}
            placeholder="请选择污染物"
            maxTagCount={2}
            maxTagPlaceholder="..."
            onChange={(value, option) => {
              console.log('option=', option)
              this.setState({
                pollutantValue: value,
                pollutantNames: option.map(item => item.props.pollutantName)
              })
            }}
          >
            {
              pollutantList.map((item, index) => {
                return <Option key={item.PollutantCode} pollutantName={item.PollutantName}>{item.PollutantName}</Option>
              })
            }
          </Select>
        </Col>
        <Col span={7}>
          <RangePicker style={{ width: '100%' }} value={time} showTime format={format} onChange={(dates) => {
            this.setState({
              time: dates
            })
          }} />
        </Col>
        <Col span={8}>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
            this.setState({
              pageIndex: 1
            }, () => {
              this.getPageData();
            })
            this.myTable.resetCheckedRowList()
          }}>查询</Button>
          <Button onClick={() => { this.getPageData("export") }} loading={exportLoading} style={{ marginLeft: 10 }}><ExportOutlined />导出</Button>
        </Col>
      </Row >
    );
  }

  render() {
    const { loading, dataFlagDataSource, pollutantList, tagTableTotal } = this.props;
    const { dataType, isShowFlag, defalutPollutantType, pageSize, pageIndex } = this.state;

    return (
      <>
        <NavigationTree
          // QCAUse="1"
          checkpPol={defalutPollutantType}
          polShow
          // choice
          domId="#dataFlag"
          onItemClick={value => {
            if (value.length && !value[0].IsEnt) {
              this.setState({
                DGIMN: value[0].key,
                pageIndex: 1,
              }, () => {
                this.myTable.resetCheckedRowList()
                this.getPollutantList()
              })
            }
          }}
        />
        <div id="dataFlag">
          <BreadcrumbWrapper>
            <Card
              className="contentContainer"
              title={this.getCardTitle()}
              extra={
                <>
                  <Radio.Group defaultValue={dataType} style={{ marginRight: 10 }} onChange={(e) => {
                    this.setState({
                      dataType: e.target.value,
                      format: e.target.value === "hour" ? "YYYY-MM-DD HH" : "YYYY-MM-DD HH:mm",
                      time: e.target.value === "mins" ? [moment(new Date()).subtract(1, 'hours'), moment()] : [moment().add(-23, "hour"), moment()]
                    }, () => {
                      this.getPageData()
                      this.myTable.resetCheckedRowList()
                    })
                  }}>
                    <Radio.Button value="mins">分钟</Radio.Button>
                    <Radio.Button value="hour">小时</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              <DataTagTable
                location={this.props.location}
                onRef={(ref) => { this.myTable = ref; }}
                dataType={dataType}
                // dataSource={dataFlagDataSource}
                columnsData={pollutantList}
                pagination={{ pageSize: 20 }}
                scroll={{ y: "calc(100vh - 500px)" }}
                loading={loading}
                className=" "
                updateData={() => {
                  this.getPageData("", {
                    pageIndex: this.state.pageIndex
                  })
                }}
                pagination={{
                  // showSizeChanger: true,
                  showQuickJumper: true,
                  pageSize: pageSize,
                  current: pageIndex,
                  onChange: this.onTableChange,
                  total: tagTableTotal,
                }}
              />
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default DataTagPage;
