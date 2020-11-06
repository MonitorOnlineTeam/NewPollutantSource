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
  
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,
    };
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
    const { entList, detailsLoading, fourTableDataSource, loading, exportLoading,title,showModal,onCloseListener} = this.props;

    const columns = this.getColumns();
    return (
      <Modal
      title={title}
      width={'80%'}
      visible={showModal}
      onCancel={onCloseListener}
      footer={null}
    >
          <div>
            <Row>
                <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                  <Button icon="left" style={{ marginLeft: 10 }} onClick={()=>{history.go(-1)}}>返回</Button>
                  {/* 
                  <Button
                        style={{ margin: '0 5px' }}
                        icon="export"
                        loading={exportLoading}
                        onClick={this.onExport}
                  >
                      导出
                  </Button>
                  */}  
                  
                </div>
            </Row>
          </div>
          <SdlTable align="center" dataSource={fourTableDataSource} columns={columns} loading={loading} />
      </Modal>
    );
  }
}

export default PointStaticstics;
