import React, { PureComponent } from 'react'
import { Modal } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntWorkOrderStatistics from './components/EntWorkOrderStatistics';
import EntStaticstics from './components/EntStaticstics';
import RegionStaticstics from './components/RegionStaticstics';
import CityStaticstics from './components/CityLevel'
import moment from 'moment'
import { connect } from 'dva'

class EntWorkOrderModal extends PureComponent {
 

  constructor(props) {
    super(props);
    this.state = {
      page:'EntWorkOrderStatistics',
      query:null,
    };
  }

  goBack = (page,query)=>{
    page? this.changePage({page:page,query:null}):
     this.changePage({page:'EntWorkOrderStatistics',query:query});
  }

  changePage=({page,query})=>{
    console.log('page->',page)
    this.setState({page,query})
  }
//   cancel=()=>{

//     this.props.dispatch({
//       type: 'entWorkOrderStatistics/updateState',
//       payload: {
//         initialForm: {
//           Time:[moment().subtract(30, "days").startOf("day"), moment().endOf("day")],
//           RegionCode:undefined,
//           AttentionCode:undefined,
//           PollutantTypeCode:'1',
//           },
//       },
//   });

// }
  render() {
    const {showModal,onCloseListener,pollutantTypeCode='1'} = this.props; 
    return (
        <Modal
            title={'近30日运维工单统计（企业）'}
            width={'90%'}
            visible={showModal}
            onCancel={onCloseListener}
            footer={null}
            wrapClassName='spreadOverModal'
        >
          {
            this.state.page=='EntWorkOrderStatistics'?
              (<EntWorkOrderStatistics changePage ={this.changePage} location={{query:this.state.query}} pollutantTypeCode = {pollutantTypeCode}></EntWorkOrderStatistics>)
            :this.state.page=='EntStaticstics'?
              (<EntStaticstics goBack={this.goBack} location={{query:this.state.query}}></EntStaticstics>)
            :this.state.page=='RegionStaticstics'?
              (<RegionStaticstics goBack={this.goBack} location={{query:this.state.query}}></RegionStaticstics>)
              :this.state.page=='CityStaticstics'?
              (<CityStaticstics goBack={this.goBack.bind(this)}   changePage ={this.changePage}  location={{query:this.state.query}}></CityStaticstics>)
            :null
          }
        </Modal>
    );
  }
}

export default EntWorkOrderModal;
