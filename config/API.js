export const before = '/rest/PollutantSourceApi';
export const API = {
    // 
    systemApi: {
        // 获取系统配置
        GetSystemConfigInfo: before + '/ConfigureApi/GetSystemConfigInfo',
        // 获取权限菜单
        GetSysMenuByUserID: before + '/MenuApi/GetSysMenuByUserID',
        // 获取中间页系统列表
        GetSysList: before + '/MenuApi/GetSysList',
        // 手机下载特殊情况
        IfSpecial: before + '/ConfigureApi/IfSpecial',
    },
}