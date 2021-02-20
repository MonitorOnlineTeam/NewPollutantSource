
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  ParamData from './components/ParamData'
import NavigationTree from '@/components/NavigationTree'

/**
 * 动态管控 参数备案
 * jab 2020.08.27
 */
import { connect } from 'dva';
@connect(({ loading,paramsfil }) => ({
    dgimn:paramsfil.dgimn
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
        this.setState({  title: `${value[0].entName} - ${value[0].pointName}`, dgimn: value[0].key })
        let { dgimn, dispatch} = this.props;
         dgimn = value[0].key;
         dgimn? dispatch({ type: 'paramsfil/updateState', payload: { dgimn} }) : null;
         
    }

    render() {
        const { title,dgimn } = this.state;
        return (
            <div id="paramData">
          <NavigationTree onItemClick={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn ?   <ParamData  initLoadData /> : <PageLoading /> }
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
