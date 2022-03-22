import React, { PureComponent } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Row, Col, Input, Select, Card, Button, DatePicker, message, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import style from './index.less';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlCascader from '../AutoFormManager/SdlCascader';
import SearchSelect from '../AutoFormManager/SearchSelect';
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import  DatePickerTool from '@/components/RangePicker/DatePickerTool';

import { getDirLevel } from '@/utils/utils';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;

@connect(({ loading, report }) => ({
  loading: loading.effects['report/getStatisticsReportDataList'],
  entloading: loading.effects['report/getEntSewageList'],
  exportLoading: loading.effects['report/getStatisticsReportDataExcel'],
  statisticsReportDataList: report.statisticsReportDataList,
  EntSewageList:report.EntSewageList,
  StatisticsReportDataWhere:report.StatisticsReportDataWhere
 
}))
@Form.create({
})
class StatisticsReportDataList extends PureComponent {
  constructor(props) {
    super(props);
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      defaultSearchForm: {
        PollutantSourceType: 1,
        // Regions: ["110000000", "110100000", "110101000"],
        EntCode: "",
        ReportTime: moment()
      },
    }
  }

  componentDidMount() {
    this.statisticsReport();
     
  }

  

  statisticsReport() {
    const { dispatch } = this.props;
    //获取报表数据
    dispatch({
        type:"report/getStatisticsReportDataList",
        payload:{
        }
    })
    //获取污水处理厂数据
    dispatch({
        type:"report/getEntSewageList",
        payload:{
        }
    })
    
  }

  // 报表导出
  export=()=> {
    const { form,dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
         dispatch({
          type: 'report/getStatisticsReportDataExcel',
          payload: {
          },
        });
      }
    });
  }

  // 分页
  onTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        StatisticsReportDataWhere: {
          ...this.props.StatisticsReportDataWhere,
          PageIndex:current,
        },
      },
    });
    setTimeout(() => {
      // 获取表格数据
      this.statisticsReport();
    }, 0);
  };

  /**
   * 时间框回调
   */
  onDateCallBack=(dates,beginTime,endTime)=>{
   
       const {form:{setFieldsValue},dispatch,StatisticsReportDataWhere}=this.props;
       setFieldsValue({"MonitorTime":dates});
       dispatch({
        type: 'report/updateState',
        payload: {
          StatisticsReportDataWhere: {
            ...this.props.StatisticsReportDataWhere,
            beginTime:beginTime,
            endTime:endTime
          },
        },
       })
  }

  render() {
    const { formLayout, defaultSearchForm, currentDate } = this.SELF;
    const {form: { getFieldDecorator },loading,statisticsReportDataList,EntSewageList,exportLoading,form,StatisticsReportDataWhere,entloading,dispatch }=this.props;
    const columns=[
        {
        title: '月份',
        dataIndex: 'MonitorTime',
        width: 200,
        fixed: 'left',
        render: (text, row, index) => {
            if(text)
            {
                return moment(text).format('YYYY-MM')
            }
        }
        },{
        title: '企业名称',
        dataIndex: 'EntName',
        width: 300,
        fixed: 'left',
        render: (text, row, index) => {
          return(<span className={style.entClick} onClick={()=>dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/dataReportList/statisticsReportDataList/statisticsReportDataListView/DataReportingView/${row.MonitorTime}/${row.EntCode}`))}>
            {text}
          </span>)
        }   
     },{
        title: '进水量(万m³)',
        dataIndex: 'Imported',
        width: 200,
        
      //  render: (text, row, index) => {}   
     },{
        title: '出水量(万m³)',
        dataIndex: 'Exit',
        width: 200,
      //  render: (text, row, index) => {}   
     }
     ,{
        title: '回水量(万m³)',
        dataIndex: 'BackEntry',
        width: 200,
     //   render: (text, row, index) => {}   
     }
     ,{
        title: '污泥含水率(%)',
        dataIndex: 'SludgeWater',
        width: 200,
      //  render: (text, row, index) => {}   
     }
     ,{
        title: '处理污泥量(m³)',
        dataIndex: 'DealSludge',
        width: 200,
      //  render: (text, row, index) => {}   
     }
     ,{
        title: '泥饼处理量(m³)',
        dataIndex: 'DealMudCake',
        width: 200,
      //  render: (text, row, index) => {}   
     }
     ,{
        title: 'COD减排量(吨)',
        dataIndex: 'CODEmissionReduction',
        width: 200,
      //  render: (text, row, index) => {}   
     }
     ,{
        title: '氨氮减排量(吨)',
        dataIndex: 'NHEmissionReduction',
        width: 200,
       // render: (text, row, index) => {}   
     }
     ,{
        title: '用电量(万度)',
        dataIndex: 'Electricity',
        width: 200,
       // render: (text, row, index) => {}   
     }
     ,{
        title: '电耗(度/m³)',
        dataIndex: 'PowerConsumption',
        width: 200,
        //render: (text, row, index) => {}   
     }
     ,{
        title: 'PAM用电(Kg)',
        dataIndex: 'PAMElectricity',
        width: 200,
       // render: (text, row, index) => {}   
     }
     ,{
        title: '运行成本(元/m³)',
        dataIndex: 'RunningCost',
        width: 200,
       // render: (text, row, index) => {}   
     }
     ,{
        title: '收取污水处理费(元/m³)',
        dataIndex: 'DealSewageCost',
        width: 200,
       // render: (text, row, index) => {}   
     }
    ];
  //  let timeEle = <MonthPicker allowClear={false} style={{ width: '100%' }} />;
    
    let timeEle=<DatePickerTool  callback={this.onDateCallBack} picker="month" allowClear={false} style={{ width: '100%' }}/>
    return (
      <BreadcrumbWrapper>
          <Spin spinning={exportLoading || entloading} delay={500}> 
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
            <Col xxl={5} xl={7} sm={24} lg={7}>
            <FormItem {...formLayout} label="统计月份" style={{ width: '100%' }}>
                    {getFieldDecorator('MonitorTime', {
                      initialValue: moment().add(-1,'month'),
                      rules: [
                        {
                          required: true,
                          message: '请填写统计月份',
                        },
                      ],
                    })(timeEle)}
                  </FormItem>
                </Col>
            
            <Col xxl={5} xl={7} sm={24} lg={7}>
                  <FormItem {...formLayout} label="污水处理厂" style={{ width: '100%' }}>
                    {getFieldDecorator('EntList', {
                    })(
                      <Select mode='multiple' placeholder="请选择污水处理厂">
                        {EntSewageList.map(item => (
                          <Option value={item['EntCode']}>{item['EntName']}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
               
                <Col xxl={6} xl={6} lg={8}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      onClick={() => {
                        form.validateFields((err, values) => {
                            if (!err) {
                                this.props.dispatch({
                                    type: 'report/updateState',
                                    payload: {
                                       StatisticsReportDataWhere: {
                                        ...this.props.StatisticsReportDataWhere,
                                        ...values,
                                        PageIndex:1
                                      },
                                    },
                                  });
                                  setTimeout(() => {
                                    this.statisticsReport();
                                  }, 0);
                            }
                          });
                        }
                       }
                    >
                      生成统计
                    </Button>
                    <Button onClick={this.export} loading={exportLoading}>
                      <ExportOutlined />
                      导出
                    </Button>
                  </FormItem>
                </Col>
                </Row>
            </Form>
            {/* {currentEntName && (
              <p className={style.title}>
                {currentEntName}
                {currentDate}报表
              </p>
            )} */}
            <SdlTable
              rowKey={(record, index) => index}
              loading={loading}
              style={{ minHeight: 80 }}
              size="small"
              columns={columns}
              dataSource={statisticsReportDataList}
              defaultWidth={80}
              // scroll={{ y: 'calc(100vh - 65px - 100px - 320px)',x:3100 }}
              rowClassName={(record, index, indent) => {
                if (index === 0 || record.time === '0时') {
                  return;
                } else if (index % 2 !== 0 || record.time === '0时') {
                  return style['light'];
                }
              }}
              bordered
              pagination={{
                // showSizeChanger: true,
                showQuickJumper: true,
                pageSize: StatisticsReportDataWhere.PageSize,
                current: StatisticsReportDataWhere.PageIndex,
                onChange: this.onTableChange,
                total: StatisticsReportDataWhere.total,
              }}
            />
          </Card>
          </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default StatisticsReportDataList;
