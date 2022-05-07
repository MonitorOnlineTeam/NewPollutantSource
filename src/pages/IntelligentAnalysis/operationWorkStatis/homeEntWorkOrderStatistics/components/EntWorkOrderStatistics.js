import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, Button, message, Modal } from 'antd';
import {  ExportOutlined } from '@ant-design/icons';
import { connect } from 'dva'
import moment from 'moment'
import { Link, router } from 'umi'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList'

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, autoForm, entWorkOrderStatistics }) => ({
  regionList: autoForm.regionList,
  initialForm: entWorkOrderStatistics.initialForm,
  attentionList: entWorkOrderStatistics.attentionList,
  tableTitleData:entWorkOrderStatistics.tableTitleData,
  tableDataSource:entWorkOrderStatistics.tableDataSource,
  loading: loading.effects["entWorkOrderStatistics/getTableDataSource"],
  exportLoading:loading.effects["entWorkOrderStatistics/exportReport"],
}))
@Form.create()
class EntWorkOrderStatistics extends PureComponent {
  state = {
    showTime: true,
    format: 'YYYY-MM-DD HH',
    pollutantType: "1",
    checkedValues: [],
    secondQueryCondition: {},
    queryCondition: {},
  }
  
  _SELF_ = {
    columns:[
      {
        title: '序号',
        dataIndex: 'num',
        key: 'num',
        render:(text, record,index)=>{
          return index + 1
        }
     },
      {
        title: '行政区',
        dataIndex: '00_RegionName',
        key: '00_RegionName',
        render: (text, record) => { 
          const values = this.props.form.getFieldsValue();
          const {initialForm:{RegionCode},changePage} = this.props;
          const query={
            RegionCode :RegionCode?RegionCode:record["00_RegionCode"],            
            PollutantTypeCode: values.PollutantTypeCode,
            AttentionCode: values.AttentionCode?values.AttentionCode:"",
            BeginTime: values.Time[0].format("YYYY-MM-DD HH:mm:ss"),
            EndTime: values.Time[1].format("YYYY-MM-DD HH:mm:ss"),
          }
          if(query.RegionCode == 'all') query.RegionCode = '';
          if(changePage){
            return <a onClick={()=>{changePage({page:'CityStaticstics',query})}}>{text}</a>
          }else{
            // return <Link to={{  pathname: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',query}} >
            //   {text}
            // </Link>
            return <Link to={{  pathname: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/cityLevel',query}} >
            {text}
          </Link>
          }
        },
        width: 180,
      },
         {
              title: '运营企业数',
              dataIndex: '00_Opsenters',
              key: '00_Opsenters',
              sorter: (a, b) => a['00_Opsenters'] - b['00_Opsenters'],
      },
         {
            title: '运营监测点数',
            dataIndex: '00_Opspoints',
            key: '00_Opspoints',
            width: 120,
            align:'center',
            sorter: (a, b) => a['00_Opspoints'] - b['00_Opspoints'],
          },
    ]
  }

  componentDidMount() {
    // 获取行政区列表
    // this.props.dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: '', PointMark: '2' },
    // });

    // 获取关注列表
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getAttentionDegreeList',
      payload: { RegionCode: '' },
    });

    this.getTableDataSource();
  }


  //查询
  search=()=>{
    let values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'entWorkOrderStatistics/updateState',
      payload: {
        initialForm: {
          ...values,
        },
      },
    })
    this.getTableDataSource();
  }

  // 获取标题标题头及数据
  getTableDataSource = () => {
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)

    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getTableTitleData',
      payload: { PollutantTypeCode: values.PollutantTypeCode },
    });

    // 获取一级数据
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getTableDataSource',
      payload: { 
        PollutantTypeCode: values.PollutantTypeCode,
        AttentionCode: values.AttentionCode?values.AttentionCode:"",
        RegionCode: values.RegionCode?values.RegionCode:"",
        EntCode: "",
        BeginTime: values.Time[0].format("YYYY-MM-DD HH:mm:ss"),
        EndTime: values.Time[1].format("YYYY-MM-DD HH:mm:ss"),
      },
    });
  }

  // 导出 一级页面
  onExport = () => {
    let values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'entWorkOrderStatistics/exportReport',
      payload: { 
        PollutantTypeCode: values.PollutantTypeCode,
        AttentionCode: values.AttentionCode?values.AttentionCode:"",
        RegionCode: values.RegionCode?values.RegionCode:"",
        EntCode: "",
        BeginTime: values.Time[0].format("YYYY-MM-DD HH:mm:ss"),
        EndTime: values.Time[1].format("YYYY-MM-DD HH:mm:ss"),
        titleType:1,
      },
    });
    
  }

  getColumns=()=>{
    const { columns} = this._SELF_;
    const _columns = [...columns];

   this.props.tableTitleData.map((item,index)=>{
      if(index>4){
        _columns.push({
          title: item.TypeName,
          dataIndex: item.ID,
          key: item.ID,
          width: 120,
          sorter: (a, b) => a[item.ID] - b[item.ID],
        });
      }
    })
    return _columns;
  }


  render() {
    const {
 form: { getFieldDecorator, getFieldValue }, pollutantTypeCode, initialForm, regionList, attentionList, detailsLoading, tableDataSource, loading, exportLoading,
} = this.props;

    const columns = this.getColumns();
    const _regionList = regionList.length ? regionList[0].children : [];

    return (
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
                <FormItem label="日期查询">
                    {getFieldDecorator('Time', {
                      initialValue: initialForm.Time,
                    })(
                        <RangePicker_ allowClear={false} style={{ width: "100%", marginRight: '10px' }}  dataType='day'/>
                    )}
                </FormItem>

                <FormItem  label="行政区">
                    {getFieldDecorator('RegionCode', {
                      initialValue:initialForm.RegionCode,
                    })(
                    // <Select style={{ width: 200 }} allowClear placeholder="请选择行政区">
                    //     {
                    //     _regionList.map(item => <Option key={item.key} value={item.value}>
                    //         {item.title}
                    //         </Option>)
                    //     }
                    // </Select>,
                    <RegionList  changeRegion={''} RegionCode={''}/>
                    )}
                </FormItem>

                <FormItem label="企业类型" hidden>
                    {getFieldDecorator('PollutantTypeCode', {
                      initialValue: pollutantTypeCode?pollutantTypeCode:initialForm.PollutantTypeCode,
                    })(
                    <Select style={{ width: 200 }} placeholder="请选择企业类型" onChange={value => {
                        this.setState({ pollutantType: value }, () => {
                        })
                    }}>  
                        <Option value="2">废气</Option>
                        <Option value="1">废水</Option>
                    </Select>,
                    )}
                </FormItem>

                <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                    <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.search}>查询</Button>
                    {
                       
                    <Button
                        style={{ margin: '0 5px' }}
                        icon={<ExportOutlined />}
                        loading={exportLoading}
                        onClick={this.onExport}
                    >
                        导出
                    </Button>
                    
                   }
                </div>
            </Row>

          </Form>
          <SdlTable align="center" dataSource={tableDataSource} columns={columns} loading={loading} />
          
        </Card>
    );
  }
}

export default EntWorkOrderStatistics;
