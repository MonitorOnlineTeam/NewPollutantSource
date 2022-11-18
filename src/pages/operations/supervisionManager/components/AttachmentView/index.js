/*
 * @Author: Jiaqi 
 * @Date: 2019-8-29 15:30:25 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-10-29 15:30:51
 * @desc: 查看附件组件
 */
import React, { PureComponent } from 'react';
import { Popover, Table, Divider } from "antd"
import { uploadHost } from '@/config'

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
                  window.open(`/upload/${text}`)
                }}>预览</a>
                <Divider type="vertical" />
                <a href={`/upload/${text}`} download onClick={(e) => {
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
        }}>{dataSource&&dataSource[0]? "查看附件" : ''}</a>
      </Popover>
    );
  }
}

export default index;
