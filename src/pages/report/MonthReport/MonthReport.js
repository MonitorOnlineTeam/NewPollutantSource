/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.19
 */
import React, { PureComponent, Fragment } from 'react';
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
  Tabs,
  Modal,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';

import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading';
import { routerRedux } from 'dva/router';
import { Right } from '@/utils/icon';
import style from '../tableClass.less';
import { getDataTruseMsg, getDataTruseItemMsg } from '@/utils/utils';

const { Option } = Select;
const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

const pageUrl = {
  GetAttentionDegreeList: 'enterpriseMonitoringModel/GetAttentionDegreeList',
  getRegions: 'autoForm/getRegions',
  GetEntByRegion: 'exceedDataAlarmModel/GetEntByRegion',
  GetEntByRegionAndAtt: 'wasteWaterReportModel/GetEntByRegionAndAtt',
  GetPointByEntCode: 'wasteWaterReportModel/GetPointByEntCode',
  GetAllTypeDataListWater: 'wasteWaterReportModel/GetAllTypeDataListWater',
  ExportAllTypeDataListWater: 'wasteWaterReportModel/ExportAllTypeDataListWater',
};
@connect(
  ({
    loading,
    autoForm,
    enterpriseMonitoringModel,
    exceedDataAlarmModel,
    wasteWaterReportModel,
  }) => ({
    loading: loading.effects['wasteWaterReportModel/GetAllTypeDataListWater'],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    total: enterpriseMonitoringModel.total,
    PageSize: enterpriseMonitoringModel.PageSize,
    PageIndex: enterpriseMonitoringModel.PageIndex,
    priseList: exceedDataAlarmModel.priseList,
    EntByRegionAndAttList: wasteWaterReportModel.EntByRegionAndAttList,
    PointByEntCodeList: wasteWaterReportModel.PointByEntCodeList,
    AllTypeDataListWaterList: wasteWaterReportModel.AllTypeDataListWaterList,
  }),
)
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.state = {
      time: moment(new Date(), 'YYYY-MM'),
      regionValue: '',
      attentionValue: '',
      outletValue: '',
      entValue: undefined,
      pointValue: undefined,
      columns: [],
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    //获取行政区列表
    this.props.dispatch({
      type: pageUrl.getRegions,
      payload: {
        PointMark: '2',
        RegionCode: '',
      },
    });
    //获取关注度列表
    this.props.dispatch({
      type: pageUrl.GetAttentionDegreeList,
      payload: {},
    });
    this.props.dispatch({
      //获取企业列表
      type: pageUrl.GetEntByRegionAndAtt,
      payload: { RegionCode: '', Attention: '', PollutantTypeCode: '1' },
    });
    this.props.dispatch({
      type: 'wasteWaterReportModel/updateState',
      payload: {
        AllTypeDataListWaterList: [],
      },
    });
  };

  // 导出
  exportReport = () => {
    const { time, pointValue } = this.state;
    console.log(time);
    if (pointValue == '' || pointValue == undefined) {
      return message.error('请选择监测点');
    }
    let begintime = moment(time).format('YYYY-MM-01 00:00:00');
    let endTime = moment(moment(time).format('YYYY-MM-01 00:00:00'))
      .add(1, 'month')
      .add(-1, 'second')
      .format('YYYY-MM-DD 23:59:59');
    this.props.dispatch({
      type: pageUrl.ExportAllTypeDataListWater,
      payload: {
        BeginTime: begintime,
        EndTime: endTime,
        DGIMN: pointValue,
        dataType: 'month',
        time: moment(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  //查询数据
  getChartAndTableData = () => {
    const { time, pointValue } = this.state;
    console.log(time);
    if (pointValue == '' || pointValue == undefined) {
      return message.error('请选择监测点');
    }
    let begintime = moment(time).format('YYYY-MM-01 00:00:00');
    let endTime = moment(moment(time).format('YYYY-MM-01 00:00:00'))
      .add(1, 'month')
      .add(-1, 'second')
      .format('YYYY-MM-DD 23:59:59');
    this.props.dispatch({
      type: pageUrl.GetAllTypeDataListWater,
      payload: {
        BeginTime: begintime,
        EndTime: endTime,
        DGIMN: pointValue,
        dataType: 'month',
        time: moment(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  // 获取表头
  getTableColumns = () => {
    this.props.dispatch({
      type: 'wasteWaterReportModel/getReportColumns',
      payload: {
        DGIMN: this.state.pointValue,
      },
      callback: res => {
        let columns = [];
        res.map(item => {
          if (item.ParenntColumnCode === 'Time') {
            columns.push({
              title: '时间',
              dataIndex: item.ParenntColumnCode,
              width: 240,
              align: 'center',
              render: (value, row, index) => {
                return (
                  <span>
                    {getDataTruseMsg(row)}
                    {value}
                  </span>
                );
              },
            });
            return;
          }
          if (item.ChildColumnHeaders) {
            let children = item.ChildColumnHeaders.map(itm => {
              return {
                title: itm.ChildColumnName,
                dataIndex: itm.ChildColumnCode,
                width: 140,
                align: 'center',
                render: (value, row, index) => {
                  return getDataTruseItemMsg(row, itm.ChildColumnCode, value);
                },
              };
            });
            columns.push({
              title: item.ParenntColumnName,
              children: children,
            });
          } else {
            columns.push({
              title: item.ParenntColumnName,
              dataIndex: item.ParenntColumnCode,
              // width: 200,
              align: 'center',
            });
          }
        });
        console.log('columns', columns);
        this.setState({
          columns: columns,
        });
      },
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
  };
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
          <Option key={item.DGIMN} value={item.DGIMN}>
            {item.PointName}
          </Option>,
        );
      });
      return selectList;
    }
  };
  DatePickerHandle = (date, dateString) => {
    this.setState({
      time: dateString,
    });
  };
  cardTitle = () => {
    const { time } = this.state;

    return (
      <>
        <label style={{ fontSize: 14 }}>行政区:</label>
        {/* <Select
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
                            RegionCode:value,
                            Attention:this.state.attentionValue,
                            PollutantTypeCode:'1'
                        },
                    });
                    this.setState({
                        regionValue: value,
                        entValue:undefined,
                        pointValue:undefined
                    })
                }}>
                {this.children()}
            </Select> */}
        <RegionList
          style={{ width: 200, marginLeft: 10, marginRight: 10 }}
          changeRegion={value => {
            //获取关注度列表
            this.props.dispatch({
              type: pageUrl.GetEntByRegionAndAtt,
              payload: {
                RegionCode: value,
                Attention: this.state.attentionValue,
                PollutantTypeCode: '1',
              },
            });
            this.setState({
              regionValue: value,
              entValue: undefined,
              pointValue: undefined,
            });
          }}
        />
        <label style={{ fontSize: 14 }}>关注程度:</label>
        <Select
          allowClear
          style={{ width: 200, marginLeft: 10, marginRight: 10 }}
          placeholder="关注度"
          maxTagCount={2}
          maxTagTextLength={5}
          maxTagPlaceholder="..."
          onChange={value => {
            //获取企业列表
            this.props.dispatch({
              type: pageUrl.GetEntByRegionAndAtt,
              payload: {
                RegionCode: this.state.regionValue,
                Attention: value,
                PollutantTypeCode: '1',
              },
            });
            this.setState({
              attentionValue: value,
              entValue: undefined,
              pointValue: undefined,
            });
          }}
        >
          {this.attention()}
        </Select>
        <label style={{ fontSize: 14 }}>企业列表:</label>
        <Select
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: 200, marginLeft: 10, marginRight: 10 }}
          placeholder="企业列表"
          maxTagCount={2}
          maxTagTextLength={5}
          value={this.state.entValue}
          maxTagPlaceholder="..."
          onChange={value => {
            //获取企业列表
            this.props.dispatch({
              type: pageUrl.GetPointByEntCode,
              payload: {
                EntCode: value,
                PollutantTypeCode: '1',
              },
            });
            this.setState({
              entValue: value,
              pointValue: undefined,
            });
          }}
        >
          {this.entList()}
        </Select>
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <label>监测点:</label>
          <Select
            allowClear
            style={{ width: 200, marginLeft: 10, marginRight: 10 }}
            placeholder="监测点列表"
            maxTagCount={2}
            maxTagTextLength={5}
            value={this.state.pointValue}
            maxTagPlaceholder="..."
            onChange={value => {
              this.setState(
                {
                  pointValue: value,
                },
                () => {
                  this.getTableColumns();
                },
              );
            }}
          >
            {this.pointList()}
          </Select>
          <label>监测时间:</label>
          <MonthPicker
            size="default"
            onChange={this.DatePickerHandle}
            defaultValue={time}
            style={{ marginLeft: 10, marginRight: 10 }}
          />

          <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>
            查询
          </Button>
          <Button style={{ marginRight: 10 }} onClick={this.exportReport}>
            <ExportOutlined />
            导出
          </Button>
          {/* <span style={{ fontSize: 14, color: 'red' }}>排放量为日均值*日流量</span> */}
          <span style={{ fontSize: 14, color: 'red' }}>排放量为日cou值或日均值*日流量</span>
        </div>
      </>
    );
  };

  onChange = (PageIndex, PageSize) => {};

  pageContent = () => {
    const { AllTypeDataListWaterList, loading } = this.props;
    const fixed = false;

    return (
      <>
        {loading ? (
          <PageLoading />
        ) : (
          <SdlTable
            columns={this.state.columns}
            dataSource={AllTypeDataListWaterList}
            // pagination={{
            //     showSizeChanger: true,
            //     showQuickJumper: true,
            //     pageSize: this.props.pageSize,
            //     current: this.props.PageIndex,
            //     onChange: this.onChange,
            //     pageSizeOptions: ['20', '30', '40', '100'],
            //     total: this.props.total,
            // }}
            pagination={false}
          />
        )}
      </>
    );
    //
  };
  render() {
    const { loading, priseList } = this.props;
    return (
      <>
        <div id="siteParamsPage" className={style.cardTitle}>
          <BreadcrumbWrapper>
            <Card extra={<>{this.cardTitle()}</>} className={style.dataTable}>
              {loading ? <PageLoading /> : this.pageContent()}
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;
