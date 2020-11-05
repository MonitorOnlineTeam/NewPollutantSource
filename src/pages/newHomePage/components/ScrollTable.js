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
                     {/* <span className='ceShiTable-text2'>12</span>
                    <span className='ceShiTable-text2'>123</span>
                    <span className='ceShiTable-text2'>1234</span>
                    <span className='ceShiTable-text2'>12334</span>
                    <span className='ceShiTable-text2'>12345</span>  */}
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
                            : <span className='noData'>暂无数据</span>

                        }

                    </ul>


                </div>
            </div>
            </div>
        );
    }

    tableBody = (item, index) => {
        const { type } = this.props;
        // wasteWater wasteGas airStatistics
        return (
            <li key={index}>
                {/* <span className='ceShiTable-text2'>
                 <img style={{height:'18px'}} src='/chao.png'/> 
                  <span className='chao'>超</span>
                </span> */}
                <span className='ceShiTable-text2' style={{width: type=='airStatistics'? '20%' : '25%'}}>
                <span className='chao'>超</span> {item.value}
                </span>
                <span className='ceShiTable-text2' style={{width: type=='airStatistics'? '20%' : '25%'}}>
                  {item.name}
                </span>
                <span className='ceShiTable-text2' style={{width: type=='airStatistics'? '20%' : '25%'}}>
                  {item.label}
                 </span>
                <span className='ceShiTable-text2' style={{width: type=='airStatistics'? '20%' : '25%'}}>
                 {item.title}
                </span>

            </li>
        );
    }


}
