
/**
 * 行政区详情 市级别 二级页面
 */
import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, Button, message, Modal } from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { Link, router } from 'umi'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList'
import { LeftOutlined,RollbackOutlined,ExportOutlined} from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, autoForm, entWorkOrderStatistics }) => ({
  regionList: autoForm.regionList,
  initialForm: entWorkOrderStatistics.initialForm,
  attentionList: entWorkOrderStatistics.attentionList,
  tableTitleData:entWorkOrderStatistics.tableTitleData,
  tableDataSource:entWorkOrderStatistics.tableDataSource,
  loading: loading.effects["entWorkOrderStatistics/getTableDataSource"],
  param:entWorkOrderStatistics.param,
  exportLoading:loading.effects["entWorkOrderStatistics/exportSecond"],
  cityRegionCode:entWorkOrderStatistics.cityRegionCode,
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
          return index + 100
        }
     },
      {
        title: '行政区',
        dataIndex: '00_RegionName',
        key: '00_RegionName',
        render: (text, record) => { 
        //   const values = this.props.form.getFieldsValue();
          const values = this.props.location.query;
          const {initialForm:{RegionCode},changePage,dispatch, param} = this.props;
          const query={
            RegionCode :RegionCode?RegionCode:record["00_RegionCode"],            
            PollutantTypeCode: values&&values.PollutantTypeCode,
            AttentionCode: values&&values.AttentionCode?values.AttentionCode:"",
            BeginTime: values&&values.BeginTime,
            EndTime: values&&values.EndTime,
          }
          if(query.RegionCode == 'all') query.RegionCode = '';

          if(changePage){
            return <a onClick={()=>{
              dispatch({
              type:'entWorkOrderStatistics/updateState',
              payload:{param:query}
           })
              changePage({page:'RegionStaticstics',query:query&&query.PollutantTypeCode?query: param})
            }}>{text}</a>
          }else{
            return <Link to={{  pathname: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',query}} >
              {text}
            </Link>

          }
        },
        width: 180,
      },
        {
              title: '运维企业数',
              dataIndex: '00_Opsenters',
              key: '00_Opsenters',
              sorter: (a, b) => a['00_Opsenters'] - b['00_Opsenters'],
      },{
            title: '运维监测点数',
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

    // // 获取关注列表
    // this.props.dispatch({
    //   type: 'entWorkOrderStatistics/getAttentionDegreeList',
    //   payload: { RegionCode: '' },
    // }); 
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
    // let values = this.props.form.getFieldsValue();
    const values = this.props.location.query;

    // console.log("values=", values)
   const { param } = this.props;

    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getTableTitleData',
      payload: { PollutantTypeCode: values&&values.PollutantTypeCode?values.PollutantTypeCode:param.PollutantTypeCode },
    });
    values&&values.RegionCode&&this.props.dispatch({
      type:'entWorkOrderStatistics/updateState',
      payload:{cityRegionCode:values.RegionCode}
    }) //记住从一级行政区传过来的行政区regionCode
  
   
    // 获取一级数据
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getTableDataSource',
      payload: { 
        PollutantTypeCode: values&&values.PollutantTypeCode?values.PollutantTypeCode:param.PollutantTypeCode,
        AttentionCode: values&&values.AttentionCode?values.AttentionCode:param.AttentionCode?param.AttentionCode:'',
        RegionCode: values&&values.RegionCode? values.RegionCode : this.props.cityRegionCode?  this.props.cityRegionCode : '',
        EntCode: "",
        BeginTime: values&&values.BeginTime?values.BeginTime:param.BeginTime,
        EndTime: values&&values.EndTime?values.EndTime:param.EndTime,
        regionLevel:'2'
      },
    });
  }

  // 导出 二级
  onExport = () => {
    const values = this.props.location.query;
    const { param } = this.props;
    this.props.dispatch({
      type: 'entWorkOrderStatistics/exportSecond',
      payload: { 
        PollutantTypeCode: values&&values.PollutantTypeCode?values.PollutantTypeCode:param.PollutantTypeCode,
        AttentionCode: values&&values.AttentionCode?values.AttentionCode:param.AttentionCode?param.AttentionCode:'',
        RegionCode: values&&values.RegionCode?values.RegionCode:param.RegionCode?param.RegionCode:'',
        EntCode: "",
        BeginTime: values&&values.BeginTime?values.BeginTime:param.BeginTime,
        EndTime: values&&values.EndTime?values.EndTime:param.EndTime,
        regionLevel:'2',
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
                {/* <FormItem label="日期查询">
                    {getFieldDecorator('Time', {
                      initialValue: initialForm.Time,
                    })(
                        <RangePicker_ allowClear={false} style={{ width: "100%", marginRight: '10px' }}  dataType='day'/>
                    )}
                </FormItem> */}

                {/* <FormItem  label="行政区">
                    {getFieldDecorator('RegionCode', {
                      initialValue:initialForm.RegionCode,
                    })(
                    <RegionList  changeRegion={''} RegionCode={''}/>
                    )}
                </FormItem> */}

                {/* <FormItem label="关注程度">
                    {getFieldDecorator('AttentionCode', {
                      initialValue:initialForm.AttentionCode,
                    })(
                        <Select allowClear style={{ width: 200 }} placeholder="请选择关注程度">
                        {
                            attentionList.map(item => <Option key={item.AttentionCode} value={item.AttentionCode}>
                                {item.AttentionName}
                            </Option>)
                        }
                        </Select>,
                    )}
                </FormItem> */}

                {/* <FormItem label="企业类型">
                    {getFieldDecorator('PollutantTypeCode', {
                      initialValue: pollutantTypeCode?pollutantTypeCode:initialForm.PollutantTypeCode,
                    })(
                    <Select style={{ width: 200 }} placeholder="请选择企业类型" onChange={value => {
                        this.setState({ pollutantType: value }, () => {
                        })
                    }}>
                        <Option value="1">废水</Option>
                        <Option value="2">废气</Option>
                    </Select>,
                    )}
                </FormItem> */}

                <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                    {/* <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.search}>查询</Button> */}
    
                    <Button
                        style={{ margin: '0 5px' }}
                        icon={<ExportOutlined />}
                        loading={exportLoading}
                        onClick={this.onExport}
                    >
                        导出
                    </Button> 
                                    <Button 
                  icon={<RollbackOutlined />} 
                  style={{ marginLeft: 10 }} 
                  onClick={()=>{
                    if(this.props.goBack)
                      this.props.goBack();
                    else
                      history.go(-1)

                      this.props.dispatch({
                        type:'entWorkOrderStatistics/updateState',
                        payload:{cityRegionCode:''}
                      })
                  }}
                 
                >
                  返回
                </Button>
                </div>
            </Row>

          </Form>
          <SdlTable align="center" dataSource={tableDataSource} columns={columns} loading={loading} pagination={false}/>
          
        </Card>
    );
  }
}

export default EntWorkOrderStatistics;
