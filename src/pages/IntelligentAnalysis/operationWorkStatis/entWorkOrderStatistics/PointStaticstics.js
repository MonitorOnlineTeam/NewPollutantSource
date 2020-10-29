import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
 Card, Col, Row, Input, Checkbox, Button, message, Icon, Modal,
} from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { router } from 'umi'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


@connect(({ loading, entWorkOrderStatistics }) => ({
  fourTableTitleData:entWorkOrderStatistics.fourTableTitleData,
  fourTableDataSource:entWorkOrderStatistics.fourTableDataSource,
  entList:entWorkOrderStatistics.entList,
  loading: loading.effects["entWorkOrderStatistics/getFourTableDataSource"],
}))

class PointStaticstics extends PureComponent {
  
  componentDidMount() {
    // 获取企业列表
    this.getTableDataSource();
  }


  // 获取标题标题头及数据
  getTableDataSource = () => {

    const {location:{query:{PollutantTypeCode,AttentionCode,RegionCode,BeginTime,EndTime,EntCode}}} = this.props;

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
    this.props.fourTableTitleData.map((item,index)=>{
      columns.push({
        title: item.TypeName,
        dataIndex: item.ID,
        key: item.ID,
        width: 120,
      });
    })
    return columns;
  }


  render() {
    const { entList, detailsLoading, fourTableDataSource, loading, exportLoading,} = this.props;

    const columns = this.getColumns();
    return (
      <BreadcrumbWrapper>
        <Card>
          <div>
            <Row>
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
          </div>
          <SdlTable align="center" dataSource={fourTableDataSource} columns={columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default PointStaticstics;
