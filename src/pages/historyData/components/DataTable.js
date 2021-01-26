import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import style from  './table.less'
const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
const exceed = {
    color:"red"
}
class DataTable extends React.Component {

  state = {
    columns: [
        {
            title: '时间',
            dataIndex: 'time',
            width: 100,
            align:"center"
          },
      {
        title: '实测烟尘(氮氧化物³)',
        dataIndex: 'a',
        align:"center",
        width: 100,
      render: (text, record) => (<span style={{color: text>=15? exceed.color : ""}}>{text}</span>  ),
      },
      {
        title: '实测SO2(mg/m³)',
        dataIndex: 'b',
        align:"center",
        width: 100
      },
      {
        title: '实测NOx(mg/m³)',
        dataIndex: 'c',
        align:"center",
        width: 100,
      },
      {
        title: '流量(m³)',
        dataIndex: 'd',
        align:"center",
        width: 100,
      },
      {
        title: '氧含量(%)',
        dataIndex: 'e',
        align:"center",
        width: 100,
      },
      {
        title: '流速(m/s)',
        dataIndex: 'f',
        align:"center",
        width: 100,
      },
      {
        title: '烟气静压(MPa)',
        dataIndex: 'g',
        align:"center",
        width: 100,
      },
    //   {
    //     title: '烟尘(mg/m³)',
    //     dataIndex: 'h',
    //     align:"center",
    //     width: 100,
    //   }, 
    //   {
    //     title: '二氧化硫(mg/m³)',
    //     dataIndex: 'i',
    //     align:"center",
    //     width: 100,
    //   }, 
    //   {
    //     title: '氮氧化物(mg/m³)',
    //     dataIndex: 'j',
    //     align:"center",
    //     width: 100,
    //   },     
    ],
  };

  components = {
    header: {
      cell: ResizableTitle,
    },
  };

  data = [
        { time: "类标准限制",            a: '>=15', b: ">=40",c: '>=200', d: '>=400',e:">=18",f:">=20",g:">1.2",h:">=13.5",i:">=25",j:">=13"},
        { time: "2020-07-22 16:14:00", a: '15', b: "37.99",c: '151.386', d: '399.767',e:"16.7",f:"17.41",g:"-0.18",h:"12.1",i:"23.1",j:"10.2"},
        { time: "2020-07-22 16:14:00", a: '14.23', b: "37.99",c: '151.386', d: '399.767',e:"16.7",f:"17.41",g:"-0.18",h:"12.1",i:"23.1",j:"10.2"},
        { time: "2020-07-22 16:14:00", a: '14.23', b: "37.99",c: '151.386', d: '399.767',e:"16.7",f:"17.41",g:"-0.18",h:"12.1",i:"23.1",j:"10.2"},
        { time: "2020-07-22 16:14:00", a: '14.23', b: "37.99",c: '151.386', d: '399.767',e:"16.7",f:"17.41",g:"-0.18",h:"12.1",i:"23.1",j:"10.2"},
        { time: "2020-07-22 16:14:00", a: '14.23', b: "37.99",c: '151.386', d: '399.767',e:"16.7",f:"17.41",g:"-0.18",h:"12.1",i:"23.1",j:"10.2"},
        { time: "2020-07-22 16:14:00", a: '14.23', b: "37.99",c: '151.386', d: '399.767',e:"16.7",f:"17.41",g:"-0.18",h:"12.1",i:"23.1",j:"10.2"},
  ];

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return <Table  size="small"  scroll={{ x: 1200}}  bordered components={this.components} columns={columns} dataSource={this.data} />;
  }
}

export default DataTable;