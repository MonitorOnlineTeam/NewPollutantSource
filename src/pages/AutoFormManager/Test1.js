import React, { PureComponent, Fragment } from 'react';
import {
  List, Card, Divider, Button, message
} from 'antd';
import { connect } from 'dva';
import SdlTable from './Table'
import AutoFormAdd from './AutoFormAdd';
import AutoFormEdit from './AutoFormEdit';
import AutoFormView from './AutoFormView';

const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
];

@connect()
class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this.props.match.params.configId,
        test: true
      }
    })
  }
  render() {
    return (
      // <React.Fragment>
      //   <SdlTable
      //     configId="TestCommonPoint"
      //   // searchParams={[
      //   //   {
      //   //     Key: "test",
      //   //     Value: false,
      //   //     Where: "$like"
      //   //   }
      //   // ]}
      //   />
      //   <AutoFormAdd
      //     configId="TestCommonPoint"
      //     breadcrumb={false}
      //   />

      //   <AutoFormEdit
      //     configId="TestCommonPoint"
      //     keysParams={{ "dbo.T_Bas_CommonPoint.PointCode": "0EB9F198-A195-48F3-B476-AE0B9EA8FFDD" }}
      //     // uid={null}
      //     breadcrumb={false}
      //   />
      //   <AutoFormView 
      //     configId="TestCommonPoint"
      //     keysParams={{ "dbo.T_Bas_CommonPoint.PointCode": "0EB9F198-A195-48F3-B476-AE0B9EA8FFDD" }}
      //     breadcrumb={false}
      //   />

      //   {/* */}

      // </React.Fragment>
      <Card>
        <Card title="自定义DOM" bordered={false}>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Card title={item.title}>Card content</Card>
              </List.Item>
            )}
          />
        </Card>
        <Card title="AutoForm - Table" bordered={false}>
          <SdlTable
            configId="TestCommonPoint"
            rowChange={(key, row) => {
              this.setState({
                key, row
              })
            }}
          // searchParams={[
          //   {
          //     Key: "test",
          //     Value: false,
          //     Where: "$like"
          //   }
          // ]}
          >
            <Fragment key="top">
              <Button icon="printer" type="primary" onClick={() => {
                // dispatch(routerRedux.push(`/autoformmanager/test/TestCommonPoint`))
                if(this.state.row) {
                  message.success('成功获取数据：'+ JSON.stringify(this.state.row));
                  return;
                }
                message.error('至少选择一行！')
              }}>获取数据</Button>
            </Fragment>
          </SdlTable>
        </Card>
      </Card>
    );
  }
}

export default Test;