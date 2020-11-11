
{/****
 缺数数据 企业 弹框
 贾安波
*/}
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import MissingRateModelData from './MissingRateModelData'
import {Modal } from 'antd'
import { connect } from 'dva';



export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }

  componentDidMount() {

   }
  render() {
      const {missingRateVisible,missingRateCancel,type,time} = this.props;
    return (
        <Modal
        title={type=='air'? '数据缺失报警响应率(空气站)':'数据缺失报警响应率(企业)'}
        width={'90%'}
        visible={missingRateVisible}
        onCancel={missingRateCancel}
        footer={null}
    >
           <MissingRateModelData  Atmosphere={type=='air'?true:false} time={time} types={type} isModel={true} />
        </Modal>
    );
  }
}
                                                                                             