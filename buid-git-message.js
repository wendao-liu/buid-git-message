const loaderUtils = require('loader-utils');
const execSync = require('child_process').execSync; //同步子进程

module.exports = function (source) {
    console.log('Loader a is excuted!');

    const url = loaderUtils.interpolateName(this, 'publish-message.md', source);

    const commit = execSync('git show -s --format=%H').toString().trim(); //当前提交的版本号
    let name = execSync('git show -s --format=%cn').toString().trim(); //姓名
    let email = execSync('git show -s --format=%ce').toString().trim(); //邮箱
    let date = new Date(execSync('git show -s --format=%cd').toString()); //日期
    let message = execSync('git show -s --format=%s').toString().trim(); //说明
    let versionStr = '';
    versionStr = `git:${commit}\n作者:${name}<${email}>\n日期:${date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()}\n说明:${message}\n${new Array(80).join('*')}\n${versionStr}`;

    console.log(versionStr, 'git');
    this.emitFile(url, versionStr);
    return source;
}