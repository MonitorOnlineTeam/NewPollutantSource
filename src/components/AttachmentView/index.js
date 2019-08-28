import React, { PureComponent } from 'react';
import { Popover, Table, Divider } from "antd"

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      columns: [
        {
          title: '附件名称',
          dataIndex: 'name'
        },
        {
          title: "附件",
          dataIndex: 'attach',
          render: (text, record) => {
            return (
              <>
                <a target="_blank" onClick={(e) => {
                  e.stopPropagation()
                  window.open(text)
                }}>预览</a>
                <Divider type="vertical" />
                <a href={text} download onClick={(e) => {
                  e.stopPropagation()
                }}>下载</a>
              </>
            )
          }
        }
      ],
    }
  }

  render() {
    const { columns } = this._SELF_;
    const { dataSource } = this.props;
    const content = (
      <Table style={{ fontSize: 20 }} dataSource={dataSource} columns={columns} size="small" bordered={false} pagination={false} />
    );
    return (
      <Popover content={content} title="附件详情" trigger="click">
        <a onClick={(e) => {
          e.stopPropagation()
        }}>查看附件</a>
      </Popover>
    );
  }
}

export default index;
