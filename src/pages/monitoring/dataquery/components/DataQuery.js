import React, { Component } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {
  Card,
  Spin,
  message, Empty, Radio, Row, Col,
  Button, Form,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'
import PollutantSelect from '@/components/PollutantSelect'
import SdlTable from '@/components/SdlTable'
import SelectTime from "@/pages/monitoring/dataquery/components/SelectTime"

@Form.create()
/**
 * 数据查询组件
 * xpy 2019.07.26
 */
@connect(({ loading, dataquery }) => ({
  pollutantlist: dataquery.pollutantlist,
  dataloading: loading.effects['dataquery/queryhistorydatalist'],
  exportLoading: loading.effects['dataquery/exportHistoryReport'],
  option: dataquery.chartdata,
  selectpoint: dataquery.selectpoint,
  isloading: loading.effects['dataquery/querypollutantlist'],
  columns: dataquery.columns,
  datatable: dataquery.datatable,
  total: dataquery.total,
  tablewidth: dataquery.tablewidth,
  historyparams: dataquery.historyparams,
}))

class DataQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayType: 'data',
      displayName: '查看数据',
      rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
      format: 'YYYY-MM-DD HH:mm:ss',
      selectDisplay: false,
      dd: [],
      selectP: '',
      dgimn: '',
      dateValue: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
      dataType: "realtime"
    };
  }

  componentDidMount() {
    this.props.initLoadData && this.changeDgimn(this.props.DGIMN)
  }

  /** dgimn改變時候切換數據源 */
  componentWillReceiveProps = nextProps => {
    if (nextProps.DGIMN !== this.props.DGIMN) {
      this.changeDgimn(nextProps.DGIMN);
    }
    // if (this.props.pollutantlist !== nextProps.pollutantlist) {
    //   this.dispatch({
    //     type: 'dataquery/queryhistorydatalist',
    //     payload: {
    //     },
    //   });
    // }
  }

  /** 根据排口dgimn获取它下面的所有污染物 */
  getpointpollutants = dgimn => {
    this.props.dispatch({
      type: 'dataquery/querypollutantlist',
      payload: {
        dgimn,
        notLoad: true
      },
      callback: () => {
        // this.children.onDataTypeChange(this.state.dataType);
        this.reloaddatalist()
      }
    });
  }

  /** 数据类型切换 */
  _handleDateTypeChange = (e) => {
    const { historyparams } = this.props;
    const dataType = e.target.value;
    this.setState({ dataType });
    // this.children.onDataTypeChange(dataType)
  }


  /** 图表转换 */
  displayChange = checked => {
    if (checked !== 'chart') {
      this.setState({
        displayType: 'table',
        displayName: '查看图表',
      });
    } else {
      this.setState({
        displayType: 'chart',
        displayName: '查看数据',
      });
    }
  };

  /** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
  getpollutantSelect = () => {
    const {
      displayType,
      selectP,
    } = this.state;
    const { pollutantlist } = this.props;
    return (<PollutantSelect
      mode="multiple"
      optionDatas={pollutantlist}
      defaultValue={selectP === '' ? this.getpropspollutantcode() : selectP}
      onChange={this.handlePollutantChange}
      placeholder="请选择污染物"
      maxTagCount={1}
      maxTagTextLength={5}
      maxTagPlaceholder="..."
      style={{ width: 160 }}
    />);
  }

  /**切换污染物 */
  handlePollutantChange = (value, selectedOptions) => {
    const res = [];
    let { historyparams, dispatch } = this.props;
    if (selectedOptions.length > 0) {
      selectedOptions.map((item, key) => {
        res.push(item.props.children);
      })
    }
    historyparams = {
      ...historyparams,
      pollutantCodes: value.length > 0 ? value.toString() : '',
      pollutantNames: res.length > 0 ? res.toString() : '',

    }
    this.setState({
      selectP: value.length > 0 ? value : [],
    })

    dispatch({
      type: 'dataquery/updateState',
      payload: {
        historyparams,
      },
    })
    // this.reloaddatalist(historyparams);
  };

  /** 获取第一个污染物 */
  getpropspollutantcode = () => {
    if (this.props.pollutantlist[0]) {
      return this.props.pollutantlist.map((item) => item.PollutantCode);
    }
    return null;
  }

  /** 后台请求数据 */
  reloaddatalist = (historyparams, payload = {}) => {
    const {
      dispatch,
    } = this.props;
    historyparams && dispatch({
      type: 'dataquery/updateState',
      payload: {
        historyparams,
      },
    })
    dispatch({
      type: 'dataquery/queryhistorydatalist',
      payload: {
        ...payload,
        datatype: this.state.dataType
      },
    });
  }

  /** 切换排口 */
  changeDgimn = dgimn => {
    this.setState({
      selectDisplay: true,
      selectP: '',
      dgimn,
    })
    const {
      dispatch,
    } = this.props;
    this.getpointpollutants(dgimn);
  }


  /** 渲染数据展示 */

  loaddata = () => {
    const { dataloading, option, datatable, columns, chartHeight } = this.props;
    const { displayType } = this.state;
    if (dataloading) {
      return (<Spin
        style={{
          width: '100%',
          height: chartHeight ? chartHeight : 'calc(100vh - 400px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="large"
      />);
    }

    if (displayType === 'chart') {
      if (option) {
        return (
          // <Card.Grid style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}>
          <ReactEcharts
            theme="light"
            option={option}
            lazyUpdate
            notMerge
            id="rightLine"
            style={{ width: '100%', height: chartHeight ? chartHeight : 'calc(100vh - 300px)' }}
          />
          // /* </Card.Grid> */
        );
      }

      return (<div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>);
    }
    return (
      // <Card.Grid style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}>
      <SdlTable
        rowKey={(record, index) => `complete${index}`}
        dataSource={datatable}
        columns={columns}
        resizable
        defaultWidth={80}
        // scroll={{ y: this.props.tableHeight || 'calc(100vh - 550px)' }}
        pagination={{ pageSize: 20 }}

      />
      // </Card.Grid>

    );
  }

  exportReport = () => {
    this.props.dispatch({
      type: "dataquery/exportHistoryReport",
      payload: {
        DGIMNs: this.state.dgimn,
        datatype: this.state.dataType
      }
    })
  }
  /**
   * 回调获取时间并重新请求数据
   */
  // dateCallback = (dates, dataType) => {
  //   let { historyparams, dispatch } = this.props;
  //   this.setState({
  //     dateValue: dates
  //   })
  //   historyparams = {
  //     ...historyparams,
  //     beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
  //     endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
  //     datatype: dataType
  //   }
  //   dispatch({
  //     type: 'dataquery/updateState',
  //     payload: {
  //       historyparams,
  //     },
  //   })
  //   this.reloaddatalist(historyparams);
  // }

  // onRef1 = (ref) => {
  //   this.children = ref;
  // }

  render() {
    const { dataType, dateValue, displayType, dgimn } = this.state;
    const { pointName, entName } = this.props;
    return (
      <div>
        <Card
          // className={!this.props.style ? 'contentContainer' : null}
          title={
            <div>
              <div>
                {entName + "-" + pointName}
              </div>
              <Row style={{ marginTop: 10 }}>
                {!this.props.isloading && this.getpollutantSelect()}
                {/* <RangePicker_ style={{ width: 325, textAlign: 'left' }} dateValue={dateValue}
                                            dataType={dataType}
                                            format={this.state.format}
                                            onRef={this.onRef1}
                                            isVerification={true}
                                            // onChange={this._handleDateChange}
                                            callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                            allowClear={false} showTime={this.state.format} /> */}
                <SelectTime size={"default"} mode={dataType} dgimn={dgimn} style={{ margin: "0 10px" }} reload={(startTime, endTime) => {
                  let { historyparams } = this.props;
                  historyparams = {
                    ...historyparams,
                    beginTime: startTime,
                    endTime: endTime,
                  }
                  this.reloaddatalist(historyparams, {
                    startTime, endTime
                  });
                }} onChange={(startTime, endTime) => {
                  let { historyparams, dispatch } = this.props;
                  historyparams = {
                    ...historyparams,
                    beginTime: startTime,
                    endTime: endTime,
                  }
                  dispatch({
                    type: 'dataquery/updateState',
                    payload: {
                      historyparams,
                    },
                  })
                  // this.reloaddatalist(historyparams);
                }} />
                <Button type="primary" loading={false} onClick={() => { this.reloaddatalist() }} style={{ marginRight: 10 }}>查询</Button>
                <Button type="primary" loading={this.props.exportLoading} onClick={() => { this.exportReport(); }}>导出</Button>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <ButtonGroup_ style={{ marginRight: 10 }} checked="realtime" onChange={this._handleDateTypeChange} />
                <Radio.Group defaultValue={displayType} buttonStyle="solid" onChange={e => {
                  this.displayChange(e.target.value)
                }}>
                  <Radio.Button value="chart">图表</Radio.Button>
                  <Radio.Button value="data">数据</Radio.Button>
                </Radio.Group>
              </Row>
            </div>
          }
        >
          {this.loaddata()}


        </Card>
      </div >
    );
  }
}
export default DataQuery;
