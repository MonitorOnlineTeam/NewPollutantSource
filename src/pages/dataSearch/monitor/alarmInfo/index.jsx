
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  ContentPage from './components/ContentPage'



/**
 *数据查询 报警信息
 * jab 2020.09.04
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            title: '',
        };
    }


    render() {
        const { dgimn,title } = this.state;
        return (
            <div>
                <BreadcrumbWrapper extraName={ `${ title}`}>
                 <ContentPage dgimn={dgimn} initLoadData location={this.props.location}/> 
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
