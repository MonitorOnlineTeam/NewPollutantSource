import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { LeftOutlined,RollbackOutlined,ExportOutlined} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, Button, message, Modal } from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { router } from 'umi'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, entWorkOrderStatistics }) => ({
  secondTableTitleData:entWorkOrderStatistics.secondTableTitleData,
  secondTableDataSource:entWorkOrderStatistics.secondTableDataSource,
  entList:entWorkOrderStatistics.entList,
  loading: loading.effects["entWorkOrderStatistics/getSecondTableDataSource"],
  exportLoading:loading.effects["entWorkOrderStatistics/exportThird"]
}))
@Form.create()
class RegionStaticstics extends PureComponent {
  
  componentDidMount() {
    // 获取企业列表
    const {location:{query:{RegionCode}}} = this.props;

    this.props.dispatch({
      type: 'entWorkOrderStatistics/getEntByRegion',
      payload: { RegionCode: RegionCode },
    });

    this.getTableDataSource('');
  }


  // 获取标题标题头及数据
  getTableDataSource = (entCode='') => {

    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime}}} = this.props;

    let values = this.props.form.getFieldsValue();
    // console.log("values=", values)

    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getSecondTableTitleData',
      payload: { PollutantTypeCode: PollutantTypeCode },
    });

    // 获取一级数据
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getSecondTableDataSource',
      payload: { 
        PollutantTypeCode,
        AttentionCode,
        RegionCode,
        EntCode: entCode,
        BeginTime,
        EndTime,
      },
    });
  }

  // 导出
  onExport = () => {

    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime}}} = this.props;
    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getSecondTableTitleData',
      payload: { PollutantTypeCode: PollutantTypeCode },
    });

    this.props.dispatch({
      type: 'entWorkOrderStatistics/exportThird',
      payload: { 
        PollutantTypeCode,
        AttentionCode,
        RegionCode,
        EntCode: this.state.entCode,
        BeginTime,
        EndTime,
        titleType:2,
      },
    });
  }

  getColumns=()=>{
    const columns = [{
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      render:(text, record,index)=>{
        return index + 1
      }
   },];
    this.props.secondTableTitleData.map((item,index)=>{
      columns.push({
        title: item.TypeName,
        dataIndex: item.ID,
        key: item.ID,
        width: 120,
        sorter: index>=3? (a, b) => a[item.ID] - b[item.ID] : undefined,
      });
    })
    return columns;
  }


  render() {
    const {
 form: { getFieldDecorator, getFieldValue }, entList, detailsLoading, secondTableDataSource, loading, exportLoading,
} = this.props;

    const columns = this.getColumns();
    return (
      <Card>
        <Form layout="inline" style={{ marginBottom: 20 }}>
          <Row>
              <FormItem  label="">
                  {getFieldDecorator('EntCode', {})
                  (
                  <Select 
                      showSearch 
                      filterOption={
                        (input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      } 
                      style={{ width: 200 }} 
                      onChange={v=>{this.setState({entCode:v}); this.getTableDataSource(v)}} 
                      allowClear placeholder="请选择企业">
                      {
                        entList.map((item,index) => <Option key={'entList${index}'} value={item.EntCode}>
                          {item.EntName}
                          </Option>)
                      }
                  </Select>,
                  )}
              </FormItem>

              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                <Button 
                  icon={<RollbackOutlined />} 
                  style={{ marginLeft: 10 }} 
                  onClick={()=>{
                    if(this.props.goBack){
                      this.props.dispatch({
                        type:'entWorkOrderStatistics/updateState',
                        payload:{param:this.props.location.query}
                     })
                     this.props.goBack('CityStaticstics',this.props.location.query)
                    }else{
                      history.go(-1)
                    }
                  }}
                >
                  返回
                </Button>
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
        <SdlTable align="center" dataSource={secondTableDataSource} columns={columns} loading={loading} />
      </Card>
    );
  }
}

export default RegionStaticstics;
