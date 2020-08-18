
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  ZeroPointData from './components/ZeroPointData'
import NavigationTree from '@/components/NavigationTreeNew'


/**
 * 质控核查 零点核查设置
 * jab 2020.08.18
 */
import { connect } from 'dva';
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
        //  dispatch({ type: 'standardData/updateState', payload: { dgimn,pollType } })
    }

    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="zeroPointData">
          <NavigationTree domId="standard" onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                    <ZeroPointData  DGIMN={dgimn} initLoadData/>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
