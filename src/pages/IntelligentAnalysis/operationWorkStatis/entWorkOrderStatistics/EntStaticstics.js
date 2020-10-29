import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
 Card, Form, Col, Row, Select, Input, Checkbox, Button, message, Icon, Modal,
} from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { Link,router } from 'umi'

import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, entWorkOrderStatistics }) => ({
  attentionList: entWorkOrderStatistics.attentionList,
  thirdTableTitleData:entWorkOrderStatistics.thirdTableTitleData,
  thirdTableDataSource:entWorkOrderStatistics.thirdTableDataSource,
  entList:entWorkOrderStatistics.entList,
  loading: loading.effects["entWorkOrderStatistics/getThirdTableDataSource"],
}))
@Form.create()
class EntStaticstics extends PureComponent {
  
  componentDidMount() {
    // 获取企业列表
    const {location:{query:{RegionCode}}} = this.props;

    this.props.dispatch({
      type: 'entWorkOrderStatistics/getEntByRegion',
      payload: { RegionCode: RegionCode },
    });

    this.getTableDataSource();
  }


  // 获取标题标题头及数据
  getTableDataSource = () => {

    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime}}} = this.props;

    let values = this.props.form.getFieldsValue();
    // console.log("values=", values)

    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getThirdTableTitleData',
      payload: { PollutantTypeCode: PollutantTypeCode },
    });

    // 获取一级数据
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getThirdTableDataSource',
      payload: { 
        PollutantTypeCode,
        AttentionCode,
        RegionCode,
        EntCode: values.EntCode?values.EntCode:'',
        BeginTime,
        EndTime,
      },
    });
  }

  // 导出
  onExport = () => {
   
  }

  getColumns=()=>{
    const columns = [];
    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime}}} = this.props;
    this.props.thirdTableTitleData.map((item,index)=>{
      if(item.ID=='00_EntName'){
        columns.push({
          title: item.TypeName,
          dataIndex: item.ID,
          key: item.ID,
          render: (text, record) => { 
            const query={
              RegionCode,            
              PollutantTypeCode,
              AttentionCode,
              BeginTime,
              EndTime,
              EntCode: record['00_EntCode'],
            }
            return <Link to={{  pathname: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/PointStaticstics',query}} >
                     {text}
                 </Link>
          },
          width: 120,
        });
      }else{
        columns.push({
          title: item.TypeName,
          dataIndex: item.ID,
          key: item.ID,
          width: 120,
        });
      }
    })
    return columns;
  }


  render() {
    const {
 form: { getFieldDecorator, getFieldValue }, entList, detailsLoading, thirdTableDataSource, loading, exportLoading,
} = this.props;

    const columns = this.getColumns();
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
                <FormItem  label="企业">
                    {getFieldDecorator('EntCode', {
                      getValueFromEvent:e=>{
                        this.getTableDataSource();
                        return e;
                      }
                    })(
                    <Select style={{ width: 200 }} allowClear placeholder="请选择企业">
                        {
                          entList.map((item,index) => <Option key={'entList${index}'} value={item.EntCode}>
                            {item.EntName}
                            </Option>)
                        }
                    </Select>,
                    )}
                </FormItem>

                <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                    <Button icon="left" style={{ marginLeft: 10 }} onClick={()=>{history.go(-1)}}>返回</Button>
                    <Button
                        style={{ margin: '0 5px' }}
                        icon="export"
                        loading={exportLoading}
                        onClick={this.onExport}
                    >
                        导出
                    </Button>
                </div>
            </Row>
          </Form>
          <SdlTable align="center" dataSource={thirdTableDataSource} columns={columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default EntStaticstics;
