import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Card, Tag, Modal } from 'antd';
import NavigationTree from '@/components/NavigationTree'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { connect } from 'dva';
import { router } from 'umi';
import ContentPages from './ContentPages'

@connect()
class EquipmentManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: null,
      path:null,
    };
  }

  componentDidMount() {
    this.setState({path:this.props.match.path})
  }

  render() {
    const { DGIMN,path } = this.state;

    const  isAir = path === '/dataSearch/deviceParam/smokeAir';
    
    return (
      <>
       {path&&<NavigationTree choice={false} polShow={isAir&&true} type={isAir&&"air"} onItemClick={value => {
          if (value && value[0]) {
            this.setState({
              DGIMN: value[0].key
            })
          }
        }} /> }
        <div id='contentWrapper'>
          <BreadcrumbWrapper >
          <ContentPages  DGIMN={DGIMN} type={ isAir?'smoke':'water'}/>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}


export default EquipmentManage;