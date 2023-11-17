import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import ContentPage from './ContentPage'

/**
 * 污染源模型 2023 02.14
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
        };
    }

    changeDgimn=dgimn => {
        this.setState({dgimn, })
    }

    render() {
        return (
            < div id = "pollutantMold" >
                <BreadcrumbWrapper>
                 {this.state.dgimn ? <ContentPage DGIMN={this.state.dgimn} initLoadData/> : <PageLoading/>}
                </BreadcrumbWrapper>
                <NavigationTree runState='1' domId="#pollutantMold" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
