import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import PageLoading from '@/components/PageLoading'
import HkShowVideo from '@/components/hkvideo/HkShowVideo'

/**
 * 视频预览
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            title:''
        };
    }

    changeDgimn=(dgimn,selectItem) => {
        this.setState({
            dgimn,
            title: selectItem.title,
        })
    }

    render() {
        const {dgimn} = this.state
        return (
            <div id="hkvideo">
                <BreadcrumbWrapper extraName={ `${ title}`}>
                {dgimn ?   <HkShowVideo DGIMN={dgimn} /> : <PageLoading /> } 
                </BreadcrumbWrapper>
                <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />
            </div>
        );
    }
}
export default Index;
