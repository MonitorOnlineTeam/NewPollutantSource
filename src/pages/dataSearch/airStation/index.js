/**
 * 功  能：空气站查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.13
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
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { routerRedux } from 'dva/router';
import style from '@/pages/dataSearch/tableClass.less'
const { Option } = Select;
const { TabPane } = Tabs;


const pageUrl = {
  getRegions:'autoForm/getRegions',
  GetPointSummary:'airStationModel/GetPointSummary',
  ExportPointSummary:'airStationModel/ExportPointSummary',
}
@connect(({ loading,autoForm ,airStationModel}) => ({
  loading: loading.effects["airStationModel/GetPointSummary"],
  regionList: autoForm.regionList,
  airStationList: airStationModel.airStationList,
  total: airStationModel.total,
  PageSize: airStationModel.PageSize,
  PageIndex: airStationModel.PageIndex
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defalutPollutantType: props.match.params.type,
      regionValue: '',
      operationpersonnel:'',
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
          PointMark :'2',
          RegionCode:''
      },
  });
    this.props.dispatch({
      type: pageUrl.GetPointSummary,
      payload: {
        RegionCode: '',
        PageSize: 20,
        PageIndex: 1,
        EntType: 2
      },
    });
  };


  // 导出
  exportReport = () => {
    //获取行政区列表
    this.props.dispatch({
      type: pageUrl.ExportPointSummary,
      payload: {
        RegionCode: this.state.regionValue == undefined?'': this.state.regionValue,
        EntType: 2,
        operationpersonnel:this.state.operationpersonnel,
      },
    });
  }

  // 获取图表及表格数据
  getChartAndTableData = () => {
    debugger
    //获取行政区列表
    this.props.dispatch({
      type: pageUrl.GetPointSummary,
      payload: {
        RegionCode: this.state.regionValue == undefined?'': this.state.regionValue,
        PageSize: 20,
        PageIndex: 1,
        EntType: 2,
        operationpersonnel:this.state.operationpersonnel,
      },
    });
  }
  onChange =(PageIndex, PageSize)=>{
    debugger
    this.props.dispatch({
        
        type: pageUrl.GetPointSummary,
        payload: {
            RegionCode: this.state.regionValue == undefined?'': this.state.regionValue,
            PageSize:PageSize,
            PageIndex:PageIndex,
            EntType:2,
            operationpersonnel:this.state.operationpersonnel,
        }
    })
}
onChangeHandle=(PageIndex, PageSize)=>{
  debugger
  this.props.dispatch({
      
      type: pageUrl.GetPointSummary,
      payload: {
          RegionCode: this.state.regionValue == undefined?'': this.state.regionValue,
          PageSize:PageSize,
          PageIndex:PageIndex,
          EntType:2,
          operationpersonnel:this.state.operationpersonnel,
      }
  })
}
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
  cardTitle = () => {

    return <>
      <Select
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
          this.setState({
            regionValue: value
          })
        }}>
        {this.children()}
      </Select>
      <Select
        allowClear
        style={{ width: 200, marginLeft: 10, marginRight: 10 }}
        placeholder="运维状态"
        maxTagCount={2}
        maxTagTextLength={5}
        maxTagPlaceholder="..."
        onChange={(value) => {
          this.setState({
            operationpersonnel: value,
          })
        }}>
        <Option value="1">已设置运维人员</Option>
        <Option value="2">未设置运维人员</Option>
      </Select>
      <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
      <Button style={{ marginRight: 10 }} onClick={this.exportReport}><ExportOutlined />导出</Button>
    </>;
  }
  

  pageContent = () => {

    const {airStationList,loading} = this.props
    console.log(airStationList)
    const fixed = false
    const columns = [
      {
        title: "行政区",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'regionName',
        key: 'regionName'
      },
      {
        title: "空气站名称",
        width: 100,
        align: 'left',
        fixed: fixed,
        dataIndex: 'entName',
        key: 'entName'
      },
      {
        title: "空气监测点名称",
        width: 100,
        align: 'left',
        fixed: fixed,
        dataIndex: 'pointName',
        key: 'pointName'
      },
      {
        title: "设备编号(MN)",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'x',
        key: 'x'
      },
      {
        title: "站点属性",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'attentionName',
        key: 'attentionName'
      },
      {
        title: "经度",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'longitude',
        key: 'longitude'
      },
      {
        title: "纬度",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'latitude',
        key: 'latitude'
      },
      {
        title: "负责人手机号",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'x',
        key: 'x'
      },
      {
        title: "运维状态",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'operationStatus',
        key: 'operationStatus',
        render:(text)=>{
          return text == '0' ? '进行中':'已结束'
        }
      },
      
      {
        title: "是否上传监控数据",
        align: 'center',
        fixed: fixed,
        dataIndex: 'judgeOverData',
        key: 'judgeOverData',
        render:(text)=>{
           if(text==0){
             return '不上传监控数据'
           }
           if(text==1){
            return '上传监控数据'
          }
          if(text==2){
            return '不监控数据'
          }
        }
      },
      {
        title: "是否判断缺失报警",
        align: 'center',
        fixed: fixed,
        dataIndex: 'monitorData',
        key: 'monitorData',
        render:(text)=>{
          return text == '0' ? '不判断报警': '判断报警'
        }
      },
      {
        title: "运维负责人",
        width: 100,
        align: 'center',
        fixed: fixed,
        dataIndex: 'operationName',
        key: 'operationName',
        render:(text)=>{
          return text == '' ? '-':text
        }
      },
      {
        title: "最新数据上传时间",
        align: 'center',
        fixed: fixed,
        dataIndex: 'latestTime',
        key: 'latestTime'
      },
      {
        title: "监测因子设置",
        width: 100,
        align: 'left',
        fixed: fixed,
        dataIndex: 'pollutantNames',
        key: 'pollutantNames'
      },
    ]

    return <>{
      <SdlTable columns={columns} dataSource={airStationList}
       loading={loading}
       pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: this.props.PageSize,
        current: this.props.PageIndex,
        onChange: this.onChange,
        onShowSizeChange: this.onChangeHandle,
        pageSizeOptions: ['20', '30', '40', '100'],
        total: this.props.total,
      }} />
    }
    </>
    //
  }
  render() {
    return (
      <>
        <div id="siteParamsPage" className={style.cardTitle}>
          <BreadcrumbWrapper title="空气站查询">
            <Card
              extra={
                <>
                    {this.cardTitle()}
                </>
              }
              className="contentContainer"
            >
              {this.pageContent()}
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;

