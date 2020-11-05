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
import PointStaticstics from './PointStaticstics';

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
  
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,
      modalTitle:'--'
    };
  }

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
  getTableDataSource = (entCode) => {

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
        EntCode: entCode,
        BeginTime,
        EndTime,
      },
    });
  }
  

  // 获取站点表单的标题标题头及数据
  getChildTableDataSource = (EntCode) => {

    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime}}} = this.props;

    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getFourTableTitleData',
      payload: { PollutantTypeCode: PollutantTypeCode },
    });

    // 获取一级数据
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getFourTableDataSource',
      payload: { 
        PollutantTypeCode,
        AttentionCode,
        RegionCode,
        EntCode,
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
            return <a onClick={()=>{
              this.setState({
                showModal:true,
                modalTitle:`${text}（${BeginTime}-${EndTime}）`,
              })
              this.getChildTableDataSource(record['00_EntCode'])
            }}>{text}</a>
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

    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime}}} = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
                <FormItem  label="企业">
                    {getFieldDecorator('EntCode', {
                     
                    })(
                    <Select 
                        showSearch 
                        filterOption={
                          (input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        } 
                        style={{ width: 200 }} 
                        onChange={v=>{this.getTableDataSource(v)}} 
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
                    <Button icon="left" style={{ marginLeft: 10 }} onClick={()=>{history.go(-1)}}>返回</Button>
                    {
                      /*   
                    <Button
                        style={{ margin: '0 5px' }}
                        icon="export"
                        loading={exportLoading}
                        onClick={this.onExport}
                    >
                        导出
                    </Button>
                    */
                   }
                </div>
            </Row>
          </Form>
          <SdlTable align="center" dataSource={thirdTableDataSource} columns={columns} loading={loading} />
        </Card>

        <PointStaticstics title = {this.state.modalTitle} showModal = {this.state.showModal}
          onCloseListener ={()=>{
            this.setState({showModal:false});
          }}
        >
        </PointStaticstics>

      </BreadcrumbWrapper>
    );
  }
}

export default EntStaticstics;
