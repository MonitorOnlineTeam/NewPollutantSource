import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
        };
    }

    changeDgimn=dgimn => {
        this.setState({
            dgimn,
        })
    }

    render() {
        return (
            <div id="alarmrecord">
                <PageHeaderWrapper>
                 <AlarmRecord DGIMN={this.state.dgimn} />
                </PageHeaderWrapper>
                <NavigationTree domId="#alarmrecord" choice={false} onItemClick={value => {
                    console.log('111111111111111111111111111111', value);
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
