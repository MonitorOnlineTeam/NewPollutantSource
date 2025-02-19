import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Progress, Form, Button, TreeSelect } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import EntAtmoList from '@/components/EntAtmoList';
import RegionList from '@/components/RegionList';

const { SHOW_PARENT } = TreeSelect;


const dvaPropsData = ({ loading, wordSupervision }) => ({});

const Rank = props => {
  const { taskInfo } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const [title, setTitle] = useState('');
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    initPageInfo();
  }, [props.match.params.type]);

  const initPageInfo = () => {
    let title = '',
      data = [];
    switch (props.match.params.type) {
      case 'ent':
        title = '企业';
        data = [
          { key: '***发电有限公司', val: 8.32, rank: 1 },
          { key: '***热电有限责任公司', val: 8.22, rank: 2 },
          { key: '***电热有限责任公司', val: 8.12, rank: 3 },
          { key: '***节能有限公司', val: 8.02, rank: 4 },
          { key: '***新材料科技有限公司', val: 7.92, rank: 5 },
          { key: '***冶炼有限公司', val: 7.82, rank: 6 },
          { key: '***生物科技有限公司', val: 7.72, rank: 7 },
          { key: '***股份有限公司', val: 7.62, rank: 8 },
          { key: '***环保科技股份有限公司‌', val: 7.52, rank: 9 },
          { key: '***过程控制有限公司', val: 7.42, rank: 10 },
          { key: '***科技股份有限公司', val: 7.32, rank: 11 },
          { key: '***科技(中国)有限公司', val: 6.92, rank: 12 },
          { key: '***机电设备有限公司', val: 6.91, rank: 13 },
          { key: '***电缆有限公司', val: 6.9, rank: 14 },
          { key: '***化工有限公司', val: 6.89, rank: 15 },
          { key: '***建材有限公司', val: 6.88, rank: 16 },
          { key: '***有限公司', val: 6.87, rank: 17 },
          { key: '***科技有限公司', val: 6.84, rank: 18 },
          { key: '***塑业有限公司', val: 6.83, rank: 19 },
          { key: '***水泥有限责任公司', val: 6.81, rank: 20 },
          { key: '***发电有限公司', val: 6.8, rank: 21 },
        ];
        break;
      case 'region':
        title = '区域';
        data = [
          { key: '***市', val: 8.18, rank: 1 },
          { key: '***市', val: 8.12, rank: 2 },
          { key: '***市', val: 8.05, rank: 3 },
          { key: '***市', val: 8.01, rank: 4 },
          { key: '***市', val: 7.98, rank: 5 },
          { key: '***市', val: 7.96, rank: 6 },
          { key: '***市', val: 7.94, rank: 7 },
          { key: '***市', val: 7.92, rank: 8 },
          { key: '***市', val: 7.9, rank: 9 },
          { key: '***市', val: 7.88, rank: 10 },
          { key: '***市', val: 7.86, rank: 11 },
          { key: '***市', val: 7.84, rank: 12 },
          { key: '***市', val: 7.82, rank: 13 },
          { key: '***市', val: 7.8, rank: 14 },
          { key: '***市', val: 7.78, rank: 15 },
          { key: '***市', val: 7.76, rank: 16 },
          { key: '***市', val: 7.74, rank: 17 },
          { key: '***市', val: 7.72, rank: 18 },
          { key: '***市', val: 7.7, rank: 19 },
          { key: '***市', val: 7.68, rank: 20 },
          { key: '***市', val: 7.66, rank: 21 },
          { key: '***市', val: 7.64, rank: 22 },
          { key: '***市', val: 7.62, rank: 23 },
        ];
        break;
      case 'opera':
        title = '运维公司';
        data = [
          { key: '***环保股份有限公司', val: 8.51, rank: 1 },
          { key: '***检测有限公司', val: 8.49, rank: 2 },
          { key: '***环境检测有限公司', val: 8.42, rank: 3 },
          { key: '***环保科技有限公司', val: 8.41, rank: 4 },
          { key: '***运维环保设备有限公司', val: 8.36, rank: 5 },
          { key: '***环境环保科技有限公司', val: 8.34, rank: 6 },
          { key: '***有限公司', val: 8.31, rank: 7 },
          { key: '***科技股份有限公司', val: 8.3, rank: 8 },
          { key: '***环保科技股份有限公司‌', val: 8.29, rank: 9 },
          { key: '***科技有限公司', val: 8.28, rank: 10 },
          { key: '***环保科技有限公司', val: 8.27, rank: 11 },
          { key: '***环境检测有限公司', val: 8.23, rank: 12 },
          { key: '***运维环保设备有限公司', val: 8.22, rank: 13 },
          { key: '***环保科技有限公司', val: 8.21, rank: 14 },
          { key: '***环境检测有限公司', val: 8.2, rank: 15 },
          { key: '***检测有限公司', val: 8.17, rank: 16 },
          { key: '***环保股份有限公司', val: 8.16, rank: 17 },
          { key: '***检测有限公司', val: 8.15, rank: 18 },
          { key: '***环境检测有限公司', val: 8.14, rank: 19 },
          { key: '***环保科技有限公司', val: 8.13, rank: 20 },
          { key: '***运维环保设备有限公司', val: 8.04, rank: 21 },
          { key: '***环境环保科技有限公司', val: 8.01, rank: 22 },
        ];
        break;
      case 'brand':
        title = '品牌';
        data = [
          { key: '***股份有限公司', val: 7.31, rank: 1 },
          { key: '***环保科技股份有限公司‌', val: 7.22, rank: 2 },
          { key: '***过程控制有限公司', val: 7.04, rank: 3 },
          { key: '***科技股份有限公司', val: 7.02, rank: 4 },
          { key: '***科技(中国)有限公司', val: 6.92, rank: 5 },
          { key: '***科技有限公司', val: 6.92, rank: 6 },
          { key: '***环保科技股份有限公司‌', val: 6.91, rank: 7 },
          { key: '***环境科技股份有限公司', val: 6.89, rank: 8 },
          { key: '***生态环境股份有限公司', val: 6.88, rank: 9 },
          { key: '***环保集团有限公司', val: 6.87, rank: 10 },
          { key: '***节能环保科技有限公司', val: 6.86, rank: 11 },
          { key: '***环境集团有限公司', val: 6.85, rank: 12 },
          { key: '***环境工程有限公司', val: 6.84, rank: 13 },
          { key: '***绿色能源科技有限公司', val: 6.83, rank: 14 },
          { key: '***环境监测技术有限公司', val: 6.82, rank: 15 },
          { key: '***固废处理有限公司', val: 6.81, rank: 16 },
          { key: '***新能源科技有限公司', val: 6.8, rank: 17 },
          { key: '***环境修复工程有限公司', val: 6.79, rank: 18 },
          { key: '***清洁能源股份有限公司', val: 6.78, rank: 19 },
          { key: '***过程控制有限公司', val: 6.74, rank: 20 },
          { key: '***环境科技股份有限公司', val: 6.73, rank: 21 },
        ];
        break;
      default:
        title = '名称';
        data = [];
        break;
    }
    setTitle(title);
    setDataSource(data);
  };

  const getColumns = () => {
    return [
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
        width: 60,
      },
      {
        title: title,
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: props.match.params.type === 'brand' ? '故障率' : '异常率',
        dataIndex: 'val',
        key: 'val',
        sorter: (a, b) => a.allRate - b.allRate,
        render: (text, record) => {
          return (
            <div>
              <Progress
                percent={text && text}
                size="small"
                style={{ width: '80%' }}
                status="normal"
                format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}
              />
            </div>
          );
        },
      },
    ];
  };

  return (
    <BreadcrumbWrapper>
      <Card
        title={
          <Form layout="inline">
            <Form.Item label={title}>
              {props.match.params.type === 'region' ? (
                <RegionList
                  treeCheckable={true}
                  showCheckedStrategy={SHOW_PARENT}
                  maxTagCount={2}
                  maxTagTextLength={5}
                  maxTagPlaceholder="..."
                  style={{ width: 230 }}
                />
              ) : (
                <EntAtmoList placeholder="请选择" style={{ width: 230 }} />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary">查询</Button>
            </Form.Item>
          </Form>
        }
      >
        <SdlTable dataSource={dataSource} columns={getColumns()} />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Rank);
