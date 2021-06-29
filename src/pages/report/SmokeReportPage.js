/*
 * @Author: Jiaqi
 * @Date: 2020-02-18 15:16:30
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-02-20 18:27:44
 * @desc
 */
import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Table,
  Row,
  Col,
  Input,
  Select,
  Card,
  Button,
  DatePicker,
  message,
  Spin,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less';
import SdlTable from '@/components/SdlTable';
import YearPicker from '@/components/YearPicker';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';


const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const pageUrl = {
  GetAttentionDegreeList: 'enterpriseMonitoringModel/GetAttentionDegreeList',
  getRegions: 'autoForm/getRegions',
  GetEntByRegionAndAtt: 'wasteWaterReportModel/GetEntByRegionAndAtt',
  GetPointByEntCode: 'wasteWaterReportModel/GetPointByEntCode',
}
@Form.create()
@connect(({ loading, report, enterpriseMonitoringModel, autoForm, wasteWaterReportModel }) => ({
  smokeReportFrom: report.smokeReportFrom,
  entAndPointList: report.entAndPointList,
  msg: report.msg,
  regionList: autoForm.regionList,
  attention: enterpriseMonitoringModel.attention,
  defaultEntAndPoint: report.defaultEntAndPoint,
  EntByRegionAndAttList: wasteWaterReportModel.EntByRegionAndAttList,
  PointByEntCodeList: wasteWaterReportModel.PointByEntCodeList,
  smokeReportData: report.smokeReportData,
  loading: loading.effects['report/getSmokeReportData'],
  exportLoading: loading.effects['report/exportSmokeReport'],
  pointName: report.pointName,
}))
class SmokeReportPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],

      columns: [
        {
          title: '时间',
          dataIndex: 'Time',
          width: 200,
          align: 'center',
        },
        {
          title: '烟尘',
          // width: 330,
          children: [
            {
              title: '浓度(mg/m³)',
              dataIndex: '01',
              width: 140,
              align: 'center',
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                // if (index === dataLength) {
                //   obj.props.colSpan = 2;
                //   obj.children = <div style={{ textAlign: 'center' }}>-</div>;
                //   // return "-";
                //   // }else{
                // }
                return obj;
              },
            },
            {
              title: '折算浓度(mg/m³)',
              dataIndex: 'zs01',
              width: 140,
              align: 'center',
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                // if (index === dataLength) {
                //   obj.props.colSpan = 0;
                // }
                return obj;
              },
            },
            {
              title: `排放量(Kg)`,
              dataIndex: '01sum',
              width: 140,
              align: 'center',
            },
          ],
        },
        {
          title: 'SO₂',
          // width: 330,
          children: [
            {
              title: '浓度(mg/m³)',
              dataIndex: '02',
              width: 140,
              align: 'center',
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                // if (index === dataLength) {
                //   obj.props.colSpan = 2;
                //   obj.children = <div style={{ textAlign: 'center' }}>-</div>;
                // }
                return obj;
              },
            },
            {
              title: '折算浓度(mg/m³)',
              dataIndex: 'zs02',
              width: 140,
              align: 'center',
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                // if (index === dataLength) {
                //   obj.props.colSpan = 0;
                // }
                return obj;
              },
            },
            {
              title: `排放量(Kg)`,
              dataIndex: '02sum',
              width: 140,
              align: 'center',
            },
          ],
        },
        {
          title: 'NOx',
          // width: 330,
          children: [
            {
              title: '浓度(mg/m³)',
              dataIndex: '03',
              width: 140,
              align: 'center',
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                // if (index === dataLength) {
                //   obj.props.colSpan = 2;
                //   obj.children = <div style={{ textAlign: 'center' }}>-</div>;
                // }
                return obj;
              },
            },
            {
              title: '折算浓度(mg/m³)',
              dataIndex: 'zs03',
              width: 140,
              align: 'center',
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                // if (index === dataLength) {
                //   obj.props.colSpan = 0;
                // }
                return obj;
              },
            },
            {
              title: `排放量(Kg)`,
              dataIndex: '03sum',
              width: 140,
              align: 'center',
            },
          ],
        },
        {
          title: `流量(m³)`,
          dataIndex: 'b02',
          width: 140,
          align: 'center',
        },
        {
          title: '氧含量(%)',
          dataIndex: 's01',
          width: 140,
          align: 'center',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            // if (index === dataLength) {
            //   obj.props.colSpan = 5;
            //   obj.children = <div style={{ textAlign: 'center' }}>-</div>;
            // }
            return obj;
          },
        },
        {
          title: '温度(°C)',
          dataIndex: 's03',
          width: 140,
          align: 'center',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            // if (index === dataLength) {
            //   obj.props.colSpan = 0;
            // }
            return obj;
          },
        },
        {
          title: '湿度(%)',
          dataIndex: 's05',
          width: 140,
          align: 'center',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            // if (index === dataLength) {
            //   obj.props.colSpan = 0;
            // }
            return obj;
          },
        },

      ],
      time: moment(new Date(), 'YYYY-MM-DD'),
      regionValue: '',
      attentionValue: '',
      outletValue: '',
      entValue: undefined,
      pointValue: undefined
    };
    this._SELF_ = {
      pollutantType: 2,
      reportType: props.match.params.reportType,
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
    };
    this.switchInfo(props.match.params.reportType)
  }

  componentDidMount() {
    this.initData();
  }

  switchInfo = (reportType, flag) => {
    let beginTime;
    let endTime;
    let strMsg;
    console.log('reportType=', reportType)
    switch (reportType) {
      case 'day':
        this.title = '小时平均日报表';
        this.format = 'YYYY-MM-DD';
        // this.timeEle = <DatePicker allowClear={false} style={{ width: '100%' }} />
        this.tableFooter = '';
        this.unit1 = 'kg/h';
        this.unit2 = 'm³/h';
        beginTime = moment().format('YYYY-MM-DD 01:00:00');
        endTime = moment().add(1, 'day').format('YYYY-MM-DD 00:00:00');
        reportType = 'dayanddate';
        strMsg = '排放量为小时均值*小时流量'
        break;
      case 'month':
        this.title = '日平均月报表';
        this.format = 'YYYY-MM'
        // this.timeEle = <MonthPicker allowClear={false} style={{ width: '100%' }} />
        this.tableFooter = '';
        this.unit1 = 't/d';
        this.unit2 = '×10⁴m³/h';
        beginTime = moment().format('YYYY-MM-01 00:00:00');
        endTime = moment(moment().format('YYYY-MM-01 00:00:00')).add(1, 'month').add(-1, 'second').format('YYYY-MM-DD 23:59:59');
        strMsg = '排放量为日均值*日流量'
        break;
      case 'quarter':
        this.title = '月平均季报表';
        this.format = 'YYYY-MM';
        // this.timeEle = <DatePicker allowClear={false} style={{ width: '100%' }} />
        this.tableFooter = '';
        const month = moment().format('MM');
        if (month >= 1 && month <= 3) {
          beginTime = moment().format('YYYY-01-01 00:00:00');
          endTime = moment().format('YYYY-03-31 23:59:59')
        } else if (month >= 4 && month <= 6) {
          beginTime = moment().format('YYYY-04-01 00:00:00');
          endTime = moment().format('YYYY-06-30 23:59:59')
        } else if (month >= 7 && month <= 9) {
          beginTime = moment().format('YYYY-07-01 00:00:00');
          endTime = moment().format('YYYY-09-30 23:59:59')
        } else if (month >= 10 && month <= 12) {
          beginTime = moment().format('YYYY-10-01 00:00:00');
          endTime = moment().format('YYYY-12-31 23:59:59')
        }
        strMsg = '排放量为日均值*日流量';
        break;
      case 'year':
        this.title = '月平均年报表';
        this.format = 'YYYY-MM'
        // this.timeEle = <YearPicker
        //   allowClear={false}
        //   style={{ width: '100%' }}
        //   _onPanelChange={v => {
        //     this.props.form.setFieldsValue({ time: v });
        //   }}
        // />
        beginTime = moment().format('YYYY-01-01 00:00:00');
        endTime = moment(moment().format('YYYY-01-01 00:00:00')).add(1, 'year').add(-1, 'second').format('YYYY-MM-DD 23:59:59');
        this.tableFooter = '';
        strMsg = '排放量为日均值*日流量';
        break;
    }
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        SmokeForm: {
          beginTime,
          endTime,
        },
        msg: strMsg
      },
    })
    this.props.form.setFieldsValue({ "time": moment() })
    this.timeEle = <DatePickerTool allowClear={false} picker={reportType} style={{ width: '100%' }} callback={this.dateOnchange} />
  }

  dateOnchange = (dates, beginTime, endTime) => {
    this.props.form.setFieldsValue({ time: dates });
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        SmokeForm: {
          beginTime,
          endTime,
        },
      },
    })
  }
  initData = () => {
    //获取行政区列表
    // this.props.dispatch({
    //   type: pageUrl.getRegions,
    //   payload: {
    //     PointMark: '2',
    //     RegionCode: ''
    //   },
    // });
    //获取关注度列表
    this.props.dispatch({
      type: pageUrl.GetAttentionDegreeList,
      payload: {},
    });
    this.props.dispatch({
      //获取企业列表
      type: pageUrl.GetEntByRegionAndAtt,
      payload: { RegionCode: '', Attention: '', PollutantTypeCode: '2' },
    });
  };

  //行政区
  children = () => {
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value} title={item.title}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  };
  //关注度
  attention = () => {
    const { attention } = this.props;
    const selectList = [];
    if (attention.length > 0) {
      attention.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode} title={item.AttentionName}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }
  //获取企业列表
  entList = () => {
    const { EntByRegionAndAttList } = this.props;
    const selectList = [];
    if (EntByRegionAndAttList.length > 0) {
      EntByRegionAndAttList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };
  //监测列表
  pointList = () => {
    const { PointByEntCodeList } = this.props;
    const selectList = [];
    if (PointByEntCodeList.length > 0) {
      PointByEntCodeList.map(item => {
        selectList.push(
          <Option key={item.DGIMN} value={item.DGIMN} >
            {item.PointName}
          </Option>,
        );
      });
      return selectList;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.switchInfo(nextProps.match.params.reportType);
      console.log("props=", this.props)
      this.props.dispatch({
        type: 'report/updateState',
        payload: {
          smokeReportData: [],
        },
      })
      // this.getSmokeReportData(nextProps.match.params.reportType);
    }
    if (this.props.smokeReportData !== nextProps.smokeReportData) {
      const dataLength = nextProps.smokeReportData.length - 1;
      this.setState({
        // columns: {
        //   day: dayColumns,
        //   quarter: dayColumns,
        // },
        pointName: nextProps.pointName,
      })
    }
  }


  // 导出报表
  exportReport = () => {
    const { time, pointValue } = this.state
    this.props.dispatch({
      type: 'report/exportSmokeReport',
      payload: {
        DGIMN: pointValue,
        time: moment(this.props.form.getFieldValue('time')).format('YYYY-MM-DD HH:mm:ss'),
        dataType: this.props.match.params.reportType,
        // pointName: this.props.pointName,
      },
    })
  }
  //查询数据
  getSmokeReportData = (dataType) => {
    const { time, pointValue } = this.state
    console.log("props-dataType=", dataType)
    if (pointValue == '' || pointValue == undefined) {
      return message.error('请选择监测点')
    }
    this.props.dispatch({
      type: 'report/getSmokeReportData',
      payload: {
        DGIMN: pointValue,
        dataType: dataType || this.props.match.params.reportType,
        time: moment(this.props.form.getFieldValue('time')).format('YYYY-MM-DD HH:mm:ss'),
        // ...payload,
      }
    })
  }
  // //
  // getSmokeReportData = (payload = {}) => {
  //   this.props.dispatch({
  //     type: 'report/getSmokeReportData',
  //     payload: {
  //       DGIMN: this.props.form.getFieldValue('DGIMN').slice(-1).toString(),
  //       time: moment(this.props.form.getFieldValue('time')).format('YYYY-MM-DD HH:mm:ss'),
  //       dataType: this.props.match.params.reportType,
  //       ...payload,
  //     },
  //   })
  // }

  // 搜索
  filter = (inputValue, path) => path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)

  render() {
    const { formLayout } = this._SELF_;
    const { form: { getFieldDecorator }, smokeReportFrom, entAndPointList, defaultEntAndPoint, smokeReportData, loading, exportLoading } = this.props;
    const { dataSource, columns } = this.state;
    const { reportType } = this.props.match.params
    // const _columns = (reportType === 'day' || reportType === 'month') ? columns.day : columns.quarter

    // console.log("columns-", _columns)
    return (
      <BreadcrumbWrapper title={this.title}>
        {/* <Spin spinning={loading} delay={500}> */}
        <Card className="contentContainer">
          <Form  style={{ marginBottom: 20 }}>
            <Row  align='middle'>
              <label>行政区:</label><Select
                allowClear
                showSearch
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="行政区"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (option && option.props && option.props.title) {
                    return option.props.title === input || option.props.title.indexOf(input) !== -1
                  } else {
                    return true
                  }
                }}
                onChange={(value) => {
                  //获取关注度列表
                  this.props.dispatch({
                    type: pageUrl.GetEntByRegionAndAtt,
                    payload: {
                      RegionCode: value,
                      Attention: this.state.attentionValue,
                      PollutantTypeCode: '2'
                    },
                  });
                  this.setState({
                    regionValue: value,
                    entValue: undefined,
                    pointValue: undefined
                  })
                }}>
                {this.children()}
              </Select>
              <label>关注程度:</label><Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="关注度"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                onChange={(value) => {
                  //获取企业列表
                  this.props.dispatch({
                    type: pageUrl.GetEntByRegionAndAtt,
                    payload: {
                      RegionCode: this.state.regionValue,
                      Attention: value,
                      PollutantTypeCode: '2'
                    },
                  });
                  this.setState({
                    attentionValue: value,
                    entValue: undefined,
                    pointValue: undefined
                  })
                }}>
                {this.attention()}
              </Select>
              <label>企业列表:</label><Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="企业列表"
                maxTagCount={2}
                maxTagTextLength={5}
                value={this.state.entValue}
                maxTagPlaceholder="..."
                onChange={(value) => {
                  //获取企业列表
                  this.props.dispatch({
                    type: pageUrl.GetPointByEntCode,
                    payload: {
                      EntCode: value,
                      PollutantTypeCode: '2'
                    },
                  });
                  this.setState({
                    entValue: value,
                    pointValue:undefined
                  })
                }}>
                {this.entList()}
              </Select>
              </Row>
              
              <Row align='middle' style={{ marginTop: 10 }}>
                <label>监测点:</label><Select
                  allowClear
                  style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                  placeholder="监测点列表"
                  maxTagCount={2}
                  maxTagTextLength={5}
                  value={this.state.pointValue}
                  maxTagPlaceholder="..."
                  onChange={(value) => {
                    this.setState({
                      pointValue: value,
                    })
                  }}>
                  {this.pointList()}
                </Select>
                <FormItem  {...formLayout} label="监测日期" style={{ width: 250,marginBottom:0}}>
                  {getFieldDecorator('time', {
                    initialValue: moment(),
                    rules: [
                      {
                        message: '请填写监测日期',
                      },
                    ],
                  })(
                    // <DatePicker />
                    this.timeEle,
                  )}
                </FormItem>
                <Button type="primary" style={{ marginRight: 10,marginLeft:10 }} onClick={() => { this.getSmokeReportData() }}>查询</Button>
                <Button style={{ marginRight: 10 }} onClick={this.exportReport}><ExportOutlined />导出</Button>
                <span style={{ fontSize: 14, color: 'red' }}>{this.props.msg}</span>
              </Row>
            
          </Form>
          <SdlTable
            rowKey={(record, index) => index}
            loading={loading}
            size="small"
            columns={columns}
            dataSource={smokeReportData}
            pagination={false}
            // rowClassName={""}
            // defaultWidth={80}
            scroll={{ x: '1800px' }}
            bordered
          // footer={() => this.tableFooter}
          />
        </Card>
        {/* </Spin> */}
      </BreadcrumbWrapper>
    );
  }
}

export default SmokeReportPage;
