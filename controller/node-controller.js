var exp = require('express');
var oraDB = require('oracledb');
var dbconf = require('../confs/db.conf.js');
var router = exp.Router();

oraDB.createPool(dbconf);

router.get('/',async function(req,res){
    var sql = 'select * from node_test';
    if(req.query['nt_num']){
        sql += ' where nt_num = ' + req.query['nt_num'];
    }
    var con = await oraDB.getConnection();
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
});

router.post('/',async function(req,res){
    var sql = 'insert into node_test(nt_num, nt_name, nt_etc)';
    sql += ' values(:nt_num, :nt_name, :nt_etc)';
    var con = await oraDB.getConnection();
    var result = await con.execute(sql,req.body);
    console.log(result);
    
    await con.commit();
    await con.close();

    res.json(result);
});

router.put('/',async function(req,res){
    var sql = 'update node_test';
    sql += ' set nt_name=:nt_name, nt_etc=:nt_etc';
    sql += ' where nt_num=:nt_num';
    var con = await oraDB.getConnection();
    var result = await con.execute(sql,req.body);
    console.log(result);
    
    await con.commit();
    await con.close();

    res.json(result);
});

router.delete('/:nt_num',async function(req,res){
    var sql = 'delete from node_test ';
    sql += ' where nt_num=:nt_num';
    var con = await oraDB.getConnection();
    var result = await con.execute(sql,req.params);
    console.log(result);
    
    await con.commit();
    await con.close();

    res.json(result);
});

module.exports = router;