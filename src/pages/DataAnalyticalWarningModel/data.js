 [
  {
    title: 'O2浓度接近21%',   // 标题
    date: ['06-01 08:42', '06-02 08:42'],  // x轴时间
    data: {
      O2: {
        data: [1,2,3,4,5,6],
        standardUpper: 21,  // 标准上限
        standardLower: 19,  //  标准下限
      },
    }, 
  },
  {
    title: '气态污染物浓度接近于0',   // 标题
    date: ['06-01 08:42', '06-02 08:42'],  // x轴时间
    data: {
      SO2: {
        data: [1,2,3,4,5,6],
        standardUpper: 5,  // 标准上限
      },
      NOx: {
        data: [1,2,3,4,5,6],
        standardUpper: 6,  // 标准上限
      }
    },  
  },
   {
    title: '其他参数趋于正常范围',   // 标题
    date: ['06-01 08:42', '06-02 08:42'],  // x轴时间
    data: {
      "温度": {
        data: [1,2,3,4,5,6],
        standardUpper: 110,  // 标准上限
        standardLower: 40,  //  标准下限
      },
      "湿度": {
        data: [1,2,3,4,5,6],
        standardUpper: 60,  // 标准上限
        standardLower: 40,  //  标准下限
      },
      ...
    },  
  }
]