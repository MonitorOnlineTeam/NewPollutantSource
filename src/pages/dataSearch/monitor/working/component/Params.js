import React, { PureComponent } from 'react';
import SdlTable from '@/components/SdlTable'


const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

class FlowChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      <SdlTable dataSource={dataSource} columns={columns} />

    );
  }
}

export default FlowChart;