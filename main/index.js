const loaderUtils = require('loader-utils');
const execSync = require('child_process').execSync; //同步子进程
const path = require('path');
const fs = require('fs');

Date.prototype.Format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'S+': this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
        //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};

module.exports = function (source) {
    const projectRoot = process.cwd();
    const url = loaderUtils.interpolateName(this, 'publish-message.txt', source);
    const commit = execSync('git show -s --format=%H').toString().trim(); //当前提交的版本号
    let name = execSync('git show -s --format=%cn').toString().trim(); //姓名
    let email = execSync('git show -s --format=%ce').toString().trim(); //邮箱
    let date = new Date(execSync('git show -s --format=%cd').toString()); //日期
    let message = execSync('git show -s --format=%s').toString().trim(); //说明
    let versionStr = '';
    versionStr = `git:${commit}\n作者:${name}<${email}>\n日期:${date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()}\n说明:${message}\n发布日期：${new Date().Format('yyyy-MM-dd HH:mm:ss')}\n${new Array(80).join('*')}\n${versionStr}`;
    let readFile = fs.readFileSync(path.join(projectRoot, './publish-message.txt'));
    fs.writeFileSync(path.join(projectRoot, './publish-message.txt'), readFile + versionStr);
    this.emitFile(url, readFile + versionStr);
    return source;
}