import React, { PureComponent } from 'react'
import { Modal } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntWorkOrderStatistics from './components/EntWorkOrderStatistics';
import EntStaticstics from './components/EntStaticstics';
import RegionStaticstics from './components/RegionStaticstics';
class EntWorkOrderModal extends PureComponent {
 

  constructor(props) {
    super(props);
    this.state = {page:'EntWorkOrderStatistics',query:null};
  }

  goBack = ()=>{
    this.changePage({page:'EntWorkOrderStatistics',query:null});
  }

  changePage=({page,query})=>{
    console.log('page->',page)
    this.setState({page,query})
  }

  render() {
    const {showModal,onCloseListener,pollutantTypeCode='1'} = this.props; 
    return (
        <Modal
            title={'近30日运维工单统计（企业）'}
            width={'90%'}
            visible={showModal}
            onCancel={onCloseListener}
            footer={null}
        >
          {
            this.state.page=='EntWorkOrderStatistics'?
              (<EntWorkOrderStatistics changePage ={this.changePage} pollutantTypeCode = {pollutantTypeCode}></EntWorkOrderStatistics>)
            :this.state.page=='EntStaticstics'?
              (<EntStaticstics goBack={this.goBack} location={{query:this.state.query}}></EntStaticstics>)
            :this.state.page=='RegionStaticstics'?
              (<RegionStaticstics goBack={this.goBack} location={{query:this.state.query}}></RegionStaticstics>)
            :null
          }
        </Modal>
    );
  }
}

export default EntWorkOrderModal;
