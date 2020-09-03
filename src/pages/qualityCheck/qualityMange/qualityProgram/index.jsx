
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  QualityProData from './components/QualityProData'

import NavigationTree from '@/components/NavigationTreeNew'


/**
 * 质控核查 质控方案管理
 * jab 2020.09.02
 */
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
            title: selectItem.title,
        })
    }

    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="qualityProgram">
          <NavigationTree domId="" onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn ?    <QualityProData dgimn={dgimn} initLoadData/> : <PageLoading /> }  
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
