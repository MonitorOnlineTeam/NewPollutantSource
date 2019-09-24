import React, { Component } from 'react';
import { Popconfirm } from 'antd';

class PdPopconfirm extends Component {
    render() {
        const {operationUserID,children}=this.props;
        const text='没有关联运维人,是否前去关联?';
        if(operationUserID)
        {
            return children;
        }
        return (
            <Popconfirm title={text} onConfirm={()=>this.props.addoperationInfo()} okText="是" cancelText="否">
                {
                    children
                }
            </Popconfirm>
        );
    }
}

export default PdPopconfirm;