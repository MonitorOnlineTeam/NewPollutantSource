import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message, Icon, Modal } from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { router } from 'umi'

import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm }) => ({
  regionList: autoForm.regionList,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {

  }
  render() {
    return (
      <BreadcrumbWrapper title="超标报警核实率">
      </BreadcrumbWrapper>
    );
  }
}
