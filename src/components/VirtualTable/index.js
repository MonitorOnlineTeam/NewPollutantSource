import { Table } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import {  BaseTable } from 'ali-react-table'
import 'antd/dist/antd.css';

const VirtualTable = (props) => {


  return props.dataSource.length > 0 ? <BaseTable defaultColumnWidth={100}  stickyTop={6} {...props} /> : null
};


export default VirtualTable;
