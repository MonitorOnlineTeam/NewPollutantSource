
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    Radio
} from 'antd'
import { connect } from 'dva';

@connect(({ loading, monitorTarget }) => ({
    pollutantTypelist: monitorTarget.pollutantTypelist,
    pollutantType: monitorTarget.pollutantType
}))
class PollutantType extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
       
    }
    handlePollutantTypeChange = (e) => {
        let { handlePollutantTypeChange } = this.props;
       
        handlePollutantTypeChange&&handlePollutantTypeChange(e.target.value);
    }
    render() {
        const { pollutantTypelist, pollutantType } = this.props;
        return (
            <div>
                <Radio.Group {...this.props} value={pollutantType} onChange={this.handlePollutantTypeChange}>
                    {
                        pollutantTypelist && pollutantTypelist.map(radio => {
                            return <Radio.Button key={radio.pollutantTypeCode} value={radio.pollutantTypeCode}>{radio.pollutantTypeName}</Radio.Button>
                        })
                    }
                </Radio.Group>
            </div>

        );
    }
}


// SearchSelect.propTypes = {
//   // placeholder
//   placeholder: PropTypes.string,
//   // mode
//   mode: PropTypes.string,
//   // configId
//   configId: PropTypes.string.isRequired,
//   // itemName
//   itemName: PropTypes.string.isRequired,
//   // itemValue
//   itemValue: PropTypes.string.isRequired,
// }

export default PollutantType;