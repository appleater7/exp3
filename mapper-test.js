var mybatis = require('mybatis-mapper');

mybatis.createMapper(['./mapper/test-sql.xml']);

var param = {ti_num:1};
var sql = mybatis.getStatement('test', 'selectList', param);
console.log(sql);