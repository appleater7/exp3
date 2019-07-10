var dbconf = require('./confs/db.conf.js');
var exp = require('express');
var path = require('path');
var oraDB = require('oracledb');
var bodyParser = require('body-parser');

var server = exp();
server.use(bodyParser.urlencoded({extended:true}));

var selectBoardInfoFunc = async function(req,res){
    // console.log("========================");
    // console.log('params : ', req.params);
    // console.log('body : ', req.body);
    // console.log('query : ', req.query);
    var sql = 'select * from test_info';
    if(req.query['ti_num']){
        sql += ' where ti_num='+req.query['ti_num'];
    }
    var con = await oraDB.getConnection();
    oraDB.fetchAsString = [oraDB.CLOB];
    var result = await con.execute(sql);
    
    let cols = [];
    for(let col of result['metaData']){
        cols.push(col.name);
    }
    let list = [];
    for(let row of result['rows']){
        let board = {};
        for(let idx in row){
            board[cols[idx]] = row[idx];
        }
        list.push(board);
    }
    await con.close();
    res.json(list);
}
server.get('/test',selectBoardInfoFunc);

server.listen(82,async function(){
    await oraDB.createPool(dbconf);
    console.log('test');
})