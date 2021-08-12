import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, message,Table } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';

const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

@connect(({ loading, dataquery, global }) => ({
  co2Loading:loading.effects['dataquery/getCO2SumData'],
  CO2SumData:dataquery.CO2SumData
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'dataquery/getCO2SumData',
      payload: {
      },
    });
  }


  render() {
    const { CO2SumData,co2Loading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Table columns={columns} dataSource={CO2SumData} loading={co2Loading} showHeader={false} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;