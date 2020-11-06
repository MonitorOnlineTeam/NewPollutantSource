import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import styles from './styles/table.less';


@Form.create()
export default class Index extends Component  {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        //文字无缝滚动
        // this.industryNews = setInterval(this.taskIndustryNews, 50);
    }
    taskIndustryNews = () => {
        if (this.refs.newDiv.scrollTop >= this.refs.newDivUI.offsetHeight - this.refs.newDiv.clientHeight) {
            this.refs.newDiv.scrollTop = 0;
        }
        else {
            this.refs.newDiv.scrollTop += 1;
        }
    }


    handleIndustryNewsEnter = () => {
        clearInterval(this.industryNews);
    }
    handleIndustryNewsLeave = () => {
        // this.industryNews = setInterval(this.taskIndustryNews, 50);
    }
    componentWillUnmount = () => {
        clearInterval(this.industryNews);
    }


    render() {
          const { column,type } = this.props;

         let lengths = column.length;

        return (<div className={styles.scrollTable}>
            <div className='ceShiTable'>
                <div className='ceShiTable-title'>
                    {
                        column&&column.length>0?
                        column.map(item=>{
                        return <span className='ceShiTable-text2' style={{width: type=='airStatistics'? '20%' : '25%'}}>{item}</span>
                        })
                        :
                        null
                    }
                </div>
                <div
                    ref='newDiv'
                    className='ceShiTable-body'
                    onMouseEnter={this.handleIndustryNewsEnter.bind(this)}
                    onMouseLeave={this.handleIndustryNewsLeave.bind(this)}
                >
                    <ul ref='newDivUI'>
                        {this.props.data && this.props.data.length > 0
                            ?
                            this.props.data.map(this.tableBody)
                            : <div   className='noData'> 
                               <div style={{paddingTop:40}}> <img alt="暂无数据" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"></img></div>
                                <span>暂无数据</span>
                                </div>

                        }

                    </ul>


                </div>
            </div>
            </div>
        );
    }

    tableBody = (item, index) => {
        const { type } = this.props;

        let airLevel = {
              '优': "#4bd075",
              '良': "#fdd22b",
              '轻度污染': "#f39d16",
              '中度污染': "#f17170",
              '重度污染': "#d15695",
              '严重污染': "#a14458",
              '爆表':"#000000"
            };
 
        return (
            type==='wasteWater' || type === 'wasteGas'?
            <li key={index}>
                <span className='ceShiTable-text2' style={{width:  '25%'}}>
                <span className='chao'>超</span> {item.regionName}
                </span>
                <span title={item.entName} className='ceShiTable-text2 textOverflow' style={{width: '25%'}}>
                  {item.entName}
                </span>
                <span title={item.pointName} className='ceShiTable-text2 textOverflow' style={{width: '25%'}}>
                  {item.pointName}
                 </span>
                <span className='ceShiTable-text2' style={{width: '25%'}}>
                 {item.maxMultiple}
                </span>

            </li>:
            <li key={index}>
             <span className='ceShiTable-text2 textOverflow' title={item.stationName} style={{width:'20%' }}> {item.stationName}</span>
             <span className='ceShiTable-text2 textOverflow' title={item.pointName} style={{width:'20%' }}> {item.pointName}</span>
            <span className='ceShiTable-text2' style={{width:'20%' }}> {item.pollutantName} </span>
            <span className='ceShiTable-text2'  style={{width:'20%'}}>
                <span style={{background:airLevel[item.airQuality],color:'#fff',padding:'3px 15px',borderRadius:30}}> {item.airQuality} </span>
             </span>
            <span className='ceShiTable-text2' style={{width:'20%' }} >  {item.aqiValue}  </span>

        </li>
        );
    }


}
