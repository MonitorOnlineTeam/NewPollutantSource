import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import Region from './components/Region'
/**
 * 运转率
 * jab 2020.12.16
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <div>
                 <Region types='ent'/>
            </div>
        );
    }
}
export default Index;
