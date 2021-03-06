var exp = require('express');
var oraDB = require('oracledb');
var dbconf = require('../confs/db.conf.js');
var router = exp.Router();

oraDB.createPool(dbconf);

router.get('/',async function(req,res){
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
})

router.post('/', async function(req,res){
    let sql = 'insert into test_info(ti_num, ti_name)';
    sql += ' values(:ti_num, :ti_name)';
    console.log(req.body);
    var con = await oraDB.getConnection();
    var result = await con.execute(sql, req.body);
    console.log(result);    
    await con.commit();
    await con.close();

    res.json(result);
})

router.put('/', async function(req,res){
    let sql = 'update test_info';
    sql += ' set ti_name=:ti_name';
    sql += ' where ti_num=:ti_num';
    console.log(req.body);
    var con = await oraDB.getConnection();
    var result = await con.execute(sql, req.body);  
    await con.commit();
    await con.close();

    res.json(result);
})

router.delete('/:ti_num', async function(req,res){
    let sql = 'delete from test_info';
    sql += ' where ti_num=:ti_num';
    console.log(req.params);
    var con = await oraDB.getConnection();
    var result = await con.execute(sql, req.params);  
    await con.commit();
    await con.close();

    res.json(result);
})

module.exports = router;