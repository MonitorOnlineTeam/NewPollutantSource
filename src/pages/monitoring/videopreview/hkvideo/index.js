import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '../../../../components/NavigationTree'
import HkShowVideo from '../../../../components/hkvideo/HkShowVideo'

/**
 * 视频预览
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
        };
    }

    changeDgimn=dgimn => {
        this.setState({
            dgimn,
        })
    }

    render() {
        console.log('qweqweqweqw')
        return (
            <div id="hkvideo">
                <BreadcrumbWrapper>
                 <HkShowVideo DGIMN={this.state.dgimn} />
                </BreadcrumbWrapper>
                <NavigationTree runState='1' domId="#hkvideo" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
