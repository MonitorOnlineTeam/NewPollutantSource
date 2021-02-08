
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  QualityProData from './components/QualityProData'

import NavigationTree from '@/components/NavigationTree'


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
            dgimn:  value[0].key,
            title: `${value[0].entName} - ${value[0].pointName}`,
        })
    }

    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="qualityProgram">
          <NavigationTree domId="qualityProgramData" onItemClick={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn ?    <QualityProData dgimn={dgimn} initLoadData/> : <PageLoading /> }  
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
