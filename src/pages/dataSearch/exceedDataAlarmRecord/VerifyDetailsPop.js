/*
 * @Author: jiaanbo
 * @Date: 2021-01-14
 * @Last Modified by: jiaanbo
 * @Last Modified time:2021-01-14
 * @desc: 核实详情查看附件
 */
import React, { PureComponent } from 'react';
import { Popover, Table, Divider } from "antd"
import { uploadHost } from '@/config'

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    const { dataSource } = this.props;
    const content = (
       <div >
        备注：<p style={{maxWidth:300,display:'inline-block',verticalAlign:'Top'}}>{dataSource.length>0&&dataSource[0].remark?dataSource[0].remark:'-'}</p>
       <p>附件：{dataSource.length>0&&dataSource[0].attach ?<a href={ dataSource[0].attach}>{dataSource[0].name}</a>:'-'} </p>
       </div>
    );
    return (
      <Popover content={content} title="核实信息" trigger="click">
        <a onClick={(e) => {
          e.stopPropagation()
        }}>详情</a>
      </Popover>
    );
  }
}

export default index;
