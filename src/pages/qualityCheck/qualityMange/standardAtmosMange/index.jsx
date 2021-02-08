
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  StandardData from './components/StandardData'

import NavigationTree from '@/components/NavigationTree'


/**
 * 质控核查 标准气管理
 * jab 2020.08.13
 */
// import { connect } from 'dva';
// @connect(({ loading,standardData }) => ({
//     dgimn:standardData.dgimn
// }))
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
            dgimn:  value[0].key,
            title: `${value[0].entName} - ${value[0].pointName}`,
        })
        // let { dgimn, dispatch} = this.props;
        //  dgimn = value;
        //  pollType = selectItem.PointType;
        //  dispatch({ type: 'standardData/updateState', payload: { dgimn,pollType } })
    }

    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="standardData">
          <NavigationTree domId="standard" onItemClick={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />
                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn ?    <StandardData dgimn={dgimn} initLoadData/> : <PageLoading /> }  
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
