import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
 Card, Form, Col, Row, Select, Input, Checkbox, Button, message, Icon, Modal,
} from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { router } from 'umi'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, autoForm, entWorkOrderStatistics }) => ({
  regionList: autoForm.regionList,
  attentionList: entWorkOrderStatistics.attentionList,
  secondTableTitleData:entWorkOrderStatistics.secondTableTitleData,
  secondTableDataSource:entWorkOrderStatistics.secondTableDataSource,
  entList:entWorkOrderStatistics.entList,
}))
@Form.create()
class RegionStaticstics extends PureComponent {
  state = {
    showTime: true,
    format: 'YYYY-MM-DD HH',
    pollutantType: "1",
    checkedValues: [],
    secondQueryCondition: {},
    queryCondition: {},
  }

  _SELF_ = {}

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2' },
    });

    // 获取企业列表
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getEntByRegion',
      payload: { RegionCode: '' },
    });

    this.getTableDataSource();
  }


  // 获取标题标题头及数据
  getTableDataSource = () => {
    let values = this.props.form.getFieldsValue();
    // console.log("values=", values)

    // 获取一级数据标题头
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getSecondTableTitleData',
      payload: { PollutantTypeCode: values.PollutantTypeCode },
    });

    // 获取一级数据
    this.props.dispatch({
      type: 'entWorkOrderStatistics/getSecondTableDataSource',
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

  // 导出
  onExport = () => {
   
  }

  getColumns=()=>{
    const columns = [];
    this.props.secondTableTitleData.map((item,index)=>{
        if(index>4){
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
 form: { getFieldDecorator, getFieldValue }, entList, detailsLoading, secondTableDataSource, loading, exportLoading,
} = this.props;

    const columns = this.getColumns();

    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
                <FormItem  label="企业">
                    {getFieldDecorator('EntCode', {
                    })(
                    <Select style={{ width: 200 }} allowClear placeholder="请选择企业">
                        {
                          entList.map(item => <Option key={item.key} value={item.EntCode}>
                            {item.EntName}
                            </Option>)
                        }
                    </Select>,
                    )}
                </FormItem>

                <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                    <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.getTableDataSource}>查询</Button>
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
          <SdlTable align="center" dataSource={secondTableDataSource} columns={columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default RegionStaticstics;
