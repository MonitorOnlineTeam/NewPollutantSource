import React, { PureComponent } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Row, Select, Tabs, Button, message, DatePicker, Radio, Spin } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import IndustryTree from '@/components/IndustryTree';
import RegionList from '@/components/RegionList';
import SelectPollutantType from '@/components/SelectPollutantType';
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

const ImportantTypeList = [
  { text: '污染处理厂', value: '1' },
  { text: '水重点', value: '2' },
  { text: '气重点', value: '3' },
  { text: '垃圾焚烧', value: '4' },
];

@connect(({ loading, autoForm, emissionsStatistics, common }) => ({
  regionList: autoForm.regionList,
  industryTreeList: common.industryTreeList,
  pollutantCodeList: common.pollutantCode,
  attentionList: emissionsStatistics.attentionList,
  regionYearTableDataSource: emissionsStatistics.regionYearTableDataSource,
  entYearTableDataSource: emissionsStatistics.entYearTableDataSource,
  pointYearTableDataSource: emissionsStatistics.pointYearTableDataSource,
  regionYearExportLoading: emissionsStatistics.regionYearExportLoading,
  entYearExportLoading: emissionsStatistics.entYearExportLoading,
  pointYearExportLoading: emissionsStatistics.pointYearExportLoading,
  regionYearLoading: emissionsStatistics.regionYearLoading,
  entYearLoading: emissionsStatistics.entYearLoading,
  pointYearLoading: emissionsStatistics.pointYearLoading,
}))
@Form.create()
class Year extends PureComponent {
  state = {
    DataType: configInfo.IsSingleEnterprise ? 'ent' : 'region',
    regionFlag: true,
    entFlag: false,
    pointFlag: false,
    regionShowType: 'data',
    entShowType: 'data',
    pointShowType: 'data',
  };
  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
  };

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2' },
    });

    // this.getTableData("region");
    // this.getTableData("ent");
    // this.getTableData("point");
  }

  // 根据污染物类型获取污染物
  getAllPollutantCode = () => {
    let values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'common/getAllPollutantCode',
      payload: {
        pollutantTypes: values.PollutantType,
        dataType: 'dis',
      },
    });
  };

  // 获取table数据
  getTableData = DataType => {
    let values = this.props.form.getFieldsValue();
    // if (values.time2 && values.time1) {
    //   if (values.time2[0] <= values.time1[1]) {
    //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
    //     return;
    //   }
    // } else {
    //   message.error("请将时间填写完整");
    //   return;
    // }
    this.props.dispatch({
      type: 'emissionsStatistics/getEmissionsListForYear',
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode:
          values.TradeCode && values.TradeCode.length
            ? values.TradeCode[values.TradeCode.length - 1]
            : undefined,
        RegionCode: values.RegionCode,
        ImportantType: values.ImportantType,
        PollutantType: values.PollutantType,
        beginTime: moment(values.time1).format('YYYY-MM-01 00:00:00'),
        // ComparisonbeginTime: moment(values.time2[0]).format('YYYY-MM-DD HH:mm:ss'),
        // ComparisonendTime: moment(values.time2[1]).format('YYYY-MM-DD HH:mm:ss'),
        DataType: DataType,
      },
    });
  };

  // 导出
  onExport = () => {
    let values = this.props.form.getFieldsValue();
    // if (values.time2 && values.time1) {
    //   if (values.time2[0] <= values.time1[1]) {
    //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
    //     return;
    //   }
    // } else {
    //   message.error("请将时间填写完整");
    //   return;
    // }
    // let importantType;
    // switch (this.state.DataType) {
    //   case 'region':
    //     importantType = '1';
    //     break;
    //   case 'ent':
    //     importantType = '1';
    //     break;
    //   case 'point':
    //     importantType = '2';
    //     break;
    // }
    this.props.dispatch({
      type: 'emissionsStatistics/exportContrastTableDataByType',
      payload: {
        AttentionCode: values.AttentionCode,
        TradeCode:
          values.TradeCode && values.TradeCode.length
            ? values.TradeCode[values.TradeCode.length - 1]
            : undefined,
        RegionCode: values.RegionCode,
        ImportantType: values.ImportantType,
        PollutantType: values.PollutantType,
        beginTime: moment(values.time1).format('YYYY-MM-01 00:00:00'),
        DataType: this.state.DataType,
        ExportType: 1,
      },
    });
  };

  getToggleEle = (type, loading) => {
    const { regionYearLoading, entYearLoading, pointYearLoading } = this.props;
    const { regionShowType, entShowType, pointShowType } = this.state;
    let defaultValue =
      type === 'region' ? regionShowType : type === 'ent' ? entShowType : pointShowType;

    return (
      <div style={{ position: 'absolute', right: 0, top: -46 }}>
        <Spin spinning={!!loading} size="small">
          <Radio.Group
            defaultValue={defaultValue}
            optionType="button"
            buttonStyle="solid"
            size="small"
            // loading={regionYearLoading || entYearLoading || pointYearLoading}
            onChange={e => {
              this.setState({
                [`${type}ShowType`]: e.target.value,
              });
            }}
          >
            <Radio.Button value={'data'}>数据</Radio.Button>
            <Radio.Button value={'chart'}>图表</Radio.Button>
          </Radio.Group>
        </Spin>
      </div>
    );
  };

  getOption = (data, labelName) => {
    const { pollutantCodeList } = this.props;
    let title = [],
      grid = [],
      xAxis = [],
      yAxis = [],
      series = [];
    pollutantCodeList.map((pollutant, index) => {
      title.push({
        text: pollutant.name,
        left: 'center',
        top: index * 300,
      });
      grid.push({
        left: 80,
        right: 50,
        top: index * 300 + 40,
        height: 200,
      });

      yAxis.push(
        ...[
          {
            gridIndex: index,
            name: 'kg',
            type: 'value',
          },
          {
            gridIndex: index,
            name: '%',
            type: 'value',
            splitLine: {
              show: false,
            },
          },
        ],
      );

      let xAxisData = [],
        currentData2 = [],
        rate = [];

      const currentData = data.map(item => {
        let label =
          labelName === 'PointName' ? item.EntName + '-' + item.PointName : item[labelName];
        xAxisData.push(label);
        currentData2.push(item[pollutant.field + '-EmissionsValue2']);
        rate.push(item[pollutant.field + '-EmissionsValueYear'].replace('%', ''));
        return item[pollutant.field + '-EmissionsValue'];
      });

      xAxis.push({
        gridIndex: index,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: xAxisData,
        // position: 'top'
      });
      series.push(
        ...[
          {
            name: pollutant.name + '排放量',
            data: currentData,
            type: 'bar',
            xAxisIndex: index,
            yAxisIndex: index * 2,
            itemStyle: {
              color: '#5470c6',
            },
            // smooth: true,
          },
          {
            name: pollutant.name + '同期排放量',
            data: currentData2,
            type: 'bar',
            xAxisIndex: index,
            yAxisIndex: index * 2,
            itemStyle: {
              color: '#92cc75',
            },
            // smooth: true,
          },
          {
            name: pollutant.name + '同比',
            data: rate,
            type: 'line',
            xAxisIndex: index,
            yAxisIndex: index * 2 + 1,
            itemStyle: {
              color: '#fac858',
            },
            // smooth: true,
          },
        ],
      );
      // series.push({
      //   name: pollutant.name,
      //   data: currentData,
      //   type: 'line',
      //   xAxisIndex: index,
      //   yAxisIndex: index,
      //   smooth: true,
      //   // markArea: {
      //   //   itemStyle: {
      //   //     color: 'rgba(255, 173, 177, 0.4)',
      //   //   },
      //   //   label: {
      //   //     color: 'red',
      //   //   },
      //   //   data: markAreaData,
      //   // },
      // });
    });
    return {
      title: title,
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          animation: false,
        },
        formatter: function(params) {
          let str = '';
          console.log('params', params);
          params.forEach((m, index) => {
            let unit = '%';
            if (m.componentSubType === 'bar') {
              // unit = pollutantCodeList[m.axisIndex].unit;
              unit = 'kg';
            }
            str += `<div style="padding: 4px 0;">
                  <span class="chart-tooltip-color" style="display: inline-block; margin-right: 10px; background-color: ${
                    m.color
                  }; width: 10px; height: 10px; border-radius:100%; margin-right: 5px"></span>
                  ${m.seriesName}：${m.data !== undefined ? m.data : '-'} ${unit}<br/>
                </div>
                `;
          });
          return `<p style="margin-bottom: 6px; font-weight: 500;">${params[0].axisValue}</p>
          ${str}`;
        },
      },
      // legend: {},
      toolbox: {
        // feature: {
        //   dataZoom: {
        //     show: true,
        //     title: {
        //       zoom: '区域缩放',
        //       back: '区域缩放还原',
        //     },
        //   },
        //   restore: { show: true, title: '还原' },
        //   saveAsImage: { show: true, title: '保存为图片' },
        // },
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
      },
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     xAxisIndex: [0, 1],
      //   },
      // ],
      grid: grid,
      xAxis: xAxis,
      yAxis: yAxis,
      series: series,
    };
  };

  getLegend = () => {
    return (
      <ul className={styles.legendWrapper}>
        <li>
          <i className={styles.color1}></i>
          排放量
        </li>
        <li>
          <i className={styles.color2}></i>
          同期排放量
        </li>
        <li>
          <i className={styles.color3}></i>
          同比
        </li>
      </ul>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      pollutantCodeList,
      regionYearLoading,
      entYearLoading,
      pointYearLoading,
      regionYearExportLoading,
      entYearExportLoading,
      pointYearExportLoading,
      regionList,
      attentionList,
      regionYearTableDataSource,
      entYearTableDataSource,
      pointYearTableDataSource,
    } = this.props;
    const {
      DataType,
      regionFlag,
      entFlag,
      pointFlag,
      regionShowType,
      entShowType,
      pointShowType,
    } = this.state;
    let loading = regionYearLoading || entYearLoading || pointYearLoading;
    let exportLoading = regionYearExportLoading || entYearExportLoading || pointYearExportLoading;
    let _regionList = regionList.length ? regionList[0].children : [];
    const _style = {
      width: 60,
      textAlign: 'right',
      display: 'inline-block',
    };
    let PFL = pollutantCodeList.map(item => {
      return {
        title: item.name,
        children: [
          {
            title: '排放量(kg)',
            dataIndex: item.field + '-EmissionsValue',
            key: item.field + '-EmissionsValue',
            width: 180,
            align: 'center',
          },
          {
            title: '同期排放量(kg)',
            dataIndex: item.field + '-EmissionsValue2',
            key: item.field + '-EmissionsValue2',
            width: 180,
            align: 'center',
          },
          {
            title: '同比',
            dataIndex: item.field + '-EmissionsValueYear',
            key: item.field + '-EmissionsValueYear',
            width: 120,
            align: 'center',
          },
        ],
      };
    });

    let RegionColumns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 120,
      },
      {
        title: '企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        width: 100,
      },
      {
        title: '监测点数',
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        width: 100,
      },
      ...PFL,
      {
        title: '差额（kg）',
        dataIndex: 'Difference',
        key: 'Difference',
        width: 180,
        align: 'center',
      },
      {
        title: '百分比（%）',
        dataIndex: 'Percentage',
        key: 'Percentage',
        width: 120,
        align: 'center',
      },
    ];
    let EntColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 180,
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
      },
      {
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        width: 180,
        render: (text, record) => {
          return text ? text : '-';
        },
      },
      ...PFL,
      {
        title: '差额（kg）',
        dataIndex: 'Difference',
        key: 'Difference',
        width: 180,
        align: 'center',
      },
      {
        title: '百分比（%）',
        dataIndex: 'Percentage',
        key: 'Percentage',
        width: 120,
        align: 'center',
      },
    ];
    let PointColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 180,
        // width: 150,
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
      },
      {
        title: '行业',
        dataIndex: 'TradeName',
        key: 'TradeName',
        width: 180,
        render: (text, record) => {
          return text ? text : '-';
        },
        // width: 200,
      },
      {
        title: '监测点',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 180,
      },
      ...PFL,
      {
        title: '差额（kg）',
        dataIndex: 'Difference',
        key: 'Difference',
        width: 180,
        align: 'center',
      },
      {
        title: '百分比（%）',
        dataIndex: 'Percentage',
        key: 'Percentage',
        width: 180,
        align: 'center',
      },
    ];
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 10 }}>
            <Row>
              <FormItem label={<span style={{ ..._style }}>时间</span>}>
                {getFieldDecorator('time1', {
                  initialValue: moment(),
                })(<DatePicker picker="month" />)}
              </FormItem>
              <FormItem label={<span style={{ ..._style, width: 74 }}>污染物类型</span>}>
                {getFieldDecorator('PollutantType', {})(
                  <SelectPollutantType
                    style={{ width: 160 }}
                    showDefaultValue
                    placeholder="请选择污染物类型"
                    initCallback={value => {
                      this.props.form.setFieldsValue({ PollutantType: value });
                      this.getAllPollutantCode();
                      this.getTableData(DataType);
                      // this.getTableData("ent");
                      // this.getTableData("point");
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>行政区</span>}>
                {getFieldDecorator('RegionCode', {})(
                  <RegionList
                    style={{ width: 200 }}
                    RegionCode={this.props.form.getFieldValue('RegionCode')}
                  />,
                )}
              </FormItem>
              <FormItem label={<span style={{ ..._style }}>行业</span>}>
                {getFieldDecorator('TradeCode', {
                  initialValue: undefined,
                })(
                  <IndustryTree
                    style={{ width: 200 }}
                    textField={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                    valueField={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                    configId={'IndustryType'}
                  />,
                )}
              </FormItem>
              <div style={{ display: 'inline-block', lineHeight: '40px' }}>
                <Button
                  loading={loading}
                  type="primary"
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    // let values = this.props.form.getFieldsValue();
                    // if (values.time2.length && values.time1.length) {
                    //   if (values.time2[0] <= values.time1[1]) {
                    //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
                    //     return;
                    //   }
                    // } else {
                    //   message.error("请将时间填写完整");
                    //   return;
                    // }
                    this.getAllPollutantCode();
                    this.getTableData(DataType);
                    // this.getTableData("ent");
                    // this.getTableData("point");
                  }}
                >
                  查询
                </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={() => {
                    // let values = this.props.form.getFieldsValue();
                    // if (values.time2.length && values.time1.length) {
                    //   if (values.time2[0] <= values.time1[1]) {
                    //     message.error("时间段2开始时间需大于时间段1结束时间，请重新选择时间");
                    //     return;
                    //   }
                    // } else {
                    //   message.error("请将时间填写完整");
                    //   return;
                    // }
                    this.onExport();
                  }}
                >
                  导出
                </Button>
              </div>
            </Row>
          </Form>
          {/* <Divider /> */}
          <Tabs
            defaultActiveKey={DataType}
            onChange={key => {
              if (!regionFlag || !entFlag || !pointFlag) {
                this.getTableData(key);
              }
              this.setState({
                DataType: key,
                [key + 'Flag']: true,
                renderNum: Math.ceil(Math.random() * 10),
              });
            }}
          >
            {!configInfo.IsSingleEnterprise && (
              // {true && (
              <TabPane tab="辖区排放量" key="region">
                {this.getToggleEle('region', regionYearLoading)}
                {regionShowType === 'data' ? (
                  <SdlTable
                    scroll={{ y: 'calc(100vh - 350px)' }}
                    loading={regionYearLoading}
                    pagination={false}
                    align="center"
                    dataSource={regionYearTableDataSource}
                    columns={RegionColumns}
                  />
                ) : (
                  <>
                    {this.getLegend()}
                    <ReactEcharts
                      theme="light"
                      option={this.getOption(regionYearTableDataSource, 'RegionName')}
                      lazyUpdate
                      notMerge
                      id="rightLine"
                      showLoading={regionYearLoading}
                      style={{
                        // marginTop: 34,
                        width: '100%',
                        height: pollutantCodeList.length * 300,
                      }}
                    />
                  </>
                )}
              </TabPane>
            )}
            <TabPane tab="企业排放量" key="ent">
              {this.getToggleEle('ent', entYearLoading)}
              {entShowType === 'data' ? (
                <SdlTable
                  scroll={{ y: 'calc(100vh - 350px)' }}
                  loading={entYearLoading}
                  pagination={false}
                  align="center"
                  dataSource={entYearTableDataSource}
                  columns={EntColumns}
                />
              ) : (
                <>
                  {this.getLegend()}
                  <ReactEcharts
                    theme="light"
                    option={this.getOption(entYearTableDataSource, 'EntName')}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    showLoading={entYearLoading}
                    style={{
                      // marginTop: 34,
                      width: '100%',
                      height: pollutantCodeList.length * 300,
                    }}
                  />
                </>
              )}
            </TabPane>
            <TabPane tab="监测点排放量" key="point">
              {this.getToggleEle('point', pointYearLoading)}
              {pointShowType === 'data' ? (
                <SdlTable
                  scroll={{ y: 'calc(100vh - 350px)' }}
                  loading={pointYearLoading}
                  pagination={false}
                  align="center"
                  dataSource={pointYearTableDataSource}
                  columns={PointColumns}
                />
              ) : (
                <>
                  {this.getLegend()}
                  <ReactEcharts
                    theme="light"
                    option={this.getOption(pointYearTableDataSource, 'PointName')}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    showLoading={pointYearLoading}
                    style={{
                      // marginTop: 34,
                      width: '100%',
                      height: pollutantCodeList.length * 300,
                    }}
                  />
                </>
              )}
            </TabPane>
          </Tabs>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
export default Year;
