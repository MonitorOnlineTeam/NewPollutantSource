
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  ContentPage from './components/ContentPage'

import NavigationTree from '@/components/NavigationTreeNew'


/**
 *动态管控 历史管控数据
 * jab 2020.09.01
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
            <div>
          <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn ?    <ContentPage dgimn={dgimn} initLoadData/> : <PageLoading /> }  
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
