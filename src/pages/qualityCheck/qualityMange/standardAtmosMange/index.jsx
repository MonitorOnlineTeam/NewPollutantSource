
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  StandardData from './components/StandardData'

import NavigationTree from '@/components/NavigationTreeNew'


/**
 * 质控核查 标准气管理
 * jab 2020.08.13
 */
import { connect } from 'dva';
@connect(({ loading,standardData }) => ({
    dgimn:standardData.dgimn
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            title: '',
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({
            dgimn: value,
            // title: selectItem.title,
        })
        let { dgimn, dispatch,pollType} = this.props;
         dgimn = value;
         pollType = selectItem.PointType;
         dispatch({ type: 'standardData/updateState', payload: { dgimn,pollType } })
    }

    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="standardData">
          <NavigationTree domId="standard" onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                    <StandardData  DGIMN={dgimn} initLoadData/>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
