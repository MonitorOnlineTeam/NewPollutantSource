import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import NavigationTree from '../../../components/NavigationTree'
import AlarmRecord from './components/AlarmRecord'
/**
 * 报警记录
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            EntCode: '',
        };
    }

    changeDgimn=(dgimn, EntCode) => {
        this.setState({
            dgimn,
            EntCode,
        })
    }

    render() {
        return (
            <div id="alarmrecord">
                <BreadcrumbWrapper>
                 <AlarmRecord DGIMN={this.state.dgimn} EntCode={this.state.EntCode}/>
                </BreadcrumbWrapper>
                <NavigationTree domId="#alarmrecord" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key, value[0].EntCode)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
