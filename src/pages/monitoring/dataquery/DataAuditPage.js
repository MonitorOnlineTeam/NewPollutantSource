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
import moment from 'moment';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import DataAuditTable from './components/DataAuditTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const { RangePicker } = DatePicker;

@connect(({ loading, dataquery }) => ({
  pollutantList: dataquery.pollutantList,
  loading: loading.effects['dataquery/getAllTypeDataForFlag'],
  exportLoading: loading.effects['dataquery/exportDataAuditReport'],
  dataAuditDataSource: dataquery.dataAuditDataSource,
}))
class DataAuditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment().add(-23, 'hour'), moment()],
      dataType: 'hour',
      format: 'YYYY-MM-DD HH',
      DGIMN: '',
      isShowFlag: true,
      defalutPollutantType: props.match.params.type,
    };
  }

  componentDidMount() {}

  getPollutantList = () => {
    this.props.dispatch({
      type: 'dataquery/getPollutantList',
      payload: {
        DGIMNs: this.state.DGIMN,
      },
    });
  };

  getPageData = queryType => {
    const format = this.state.dataType === 'hour' ? 'YYYY-MM-DD HH:00:00' : 'YYYY-MM-DD 00:00:00';
    const actionType =
      queryType === 'export'
        ? 'dataquery/exportDataAuditReport'
        : 'dataquery/getAllTypeDataForFlag';
    this.props.dispatch({
      type: actionType,
      payload: {
        datatype: this.state.dataType,
        DGIMNs: this.state.DGIMN,
        pageIndex: null,
        pageSize: null,
        beginTime: moment(this.state.time[0]).format(format),
        endTime: moment(this.state.time[1]).format(format),
        pollutantCodes: this.state.pollutantValue.toString(),
        pollutantNames: this.state.pollutantNames.toString(),
        unit: 'μg/m3',
        isAsc: true,
        DGIMN: this.state.DGIMN,
        IsShowFlag: this.state.isShowFlag,
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pollutantList !== nextProps.pollutantList) {
      this.props.dispatch({
        type: 'dataquery/updateState',
        payload: {
          pollutantList: nextProps.pollutantList,
        },
      });
      const pollutantValue = nextProps.pollutantList.map(item => item.PollutantCode);
      const pollutantNames = nextProps.pollutantList.map(item => item.PollutantName);
      this.setState(
        {
          pollutantValue: pollutantValue,
          pollutantNames: pollutantNames,
        },
        () => {
          this.getPageData();
        },
      );
    }
  }
  onRef1 = ref => {
    this.children = ref;
  };
  getCardTitle = () => {
    const { pollutantList, exportLoading } = this.props;
    const { pollutantValue, time, dataType, format, isShowFlag } = this.state;
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
              console.log('option=', option);
              this.setState({
                pollutantValue: value,
                pollutantNames: option.map(item => item.props.pollutantName),
              });
            }}
          >
            {pollutantList.map((item, index) => {
              return (
                <Option key={item.PollutantCode} pollutantName={item.PollutantName}>
                  {item.PollutantName}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col span={7}>
          <RangePicker_
            style={{ width: '100%' }}
            dateValue={time}
            onRef={this.onRef1}
            dataType={dataType}
            callback={(dates, dataType) => {
              this.setState({
                time: dates,
                dataType: dataType,
              });
            }}
          />
        </Col>
        <Col span={8}>
          <Checkbox
            defaultChecked={true}
            onChange={e => {
              this.setState(
                {
                  isShowFlag: e.target.checked,
                },
                () => {
                  this.getPageData();
                },
              );
            }}
          >
            显示数据标识
          </Checkbox>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={this.getPageData}>
            查询
          </Button>
          <Button
            onClick={() => {
              this.getPageData('export');
            }}
            loading={exportLoading}
            style={{ marginLeft: 10 }}
          >
            <ExportOutlined />
            导出
          </Button>
          {/* <Divider type="vertical" /> */}
        </Col>
      </Row>
    );
  };

  render() {
    const { loading, dataAuditDataSource, pollutantList } = this.props;
    const { dataType, isShowFlag, defalutPollutantType } = this.state;
    return (
      <>
        <NavigationTree
          // QCAUse="1"
          checkpPol={defalutPollutantType}
          polShow
          // choice
          domId="#dataAudit"
          onItemClick={value => {
            if (value.length && !value[0].IsEnt) {
              this.setState(
                {
                  DGIMN: value[0].key,
                },
                () => {
                  this.getPollutantList();
                },
              );
            }
          }}
        />
        <div id="dataAudit">
          <BreadcrumbWrapper>
            <Card
              className="contentContainer"
              title={this.getCardTitle()}
              extra={
                <>
                  <Radio.Group
                    defaultValue={dataType}
                    style={{ marginRight: 10 }}
                    onChange={e => {
                      this.children.onDataTypeChange(e.target.value);
                      this.setState(
                        {
                          dataType: e.target.value,
                          format: e.target.value === 'hour' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD',
                          time:
                            e.target.value === 'day'
                              ? [moment(new Date()).subtract(1, 'months'), moment()]
                              : [moment().add(-23, 'hour'), moment()],
                        },
                        () => {
                          this.getPageData();
                        },
                      );
                    }}
                  >
                    <Radio.Button value="hour">小时</Radio.Button>
                    <Radio.Button value="day">日均</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              {/* <Spin spinning={loading}> */}
              <DataAuditTable
                dataType={dataType}
                dataSource={dataAuditDataSource}
                columnsData={pollutantList}
                pagination={{ pageSize: 20 }}
                // scroll={{ y: isShowFlag ? "calc(100vh - 500px)" : "calc(100vh - 400px)" }}
                isShowFlag={isShowFlag}
                loading={loading}
                className=" "
                updateData={() => {
                  this.getPageData();
                }}
              />
              {/* </Spin> */}
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default DataAuditPage;
