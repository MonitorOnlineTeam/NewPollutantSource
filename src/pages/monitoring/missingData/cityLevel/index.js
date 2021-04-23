
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import MissingData from '../components/MissingData'
import { connect } from 'dva';


@connect(({  missingData }) => ({
  type: missingData.type,
}))
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      path:null
    };
    
  }

  componentDidMount() {
    const { dispatch,match:{path} } = this.props;
    dispatch({
      type: 'missingData/updateState',
      payload: {type: path === '/monitoring/missingData/cityLevel/ent'? 'ent' : 'air'},
    });
   }
  render() {
    const { match:{path} } = this.props;
    return (
        <BreadcrumbWrapper title="数据缺失报警(企业)">
          { path === '/monitoring/missingData/cityLevel/ent'?
           <MissingData types='ent'  level='2'  query={this.props.location.query}/>
           :
           <MissingData types='air'  level='2' query={this.props.location.query}/>
        }
        </BreadcrumbWrapper>
    );
  }
}
                                                                                             