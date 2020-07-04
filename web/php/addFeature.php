<?php

require "DBOperator.php";

// 实例化数据库操作类
$dbOperator = new DBOperator();
$dbOperator->connect(); // 连接数据库

// 连接失败报错
if(!$dbOperator->getConnection()){
    $response = array(
        "success" => false,
        "message" => "Cannot connect to db server!"
    );
    echo json_encode($response);
    return;
}

// 从传入参数构建查询语句，将要素插入数据表中保存
$request = json_decode($_REQUEST["lyrInfo"]);
$sql = "insert into " . $request->layer . "(geom) values (st_geomfromtext($1, 3857))";

// 进行查询
$result = $dbOperator->queryWithParam($sql, array(
    $request->wkt
));

// 根据查询是否成功构建结果消息
if(!$result){
    $response = array(
        "success" => false,
        "message" => pg_last_error($dbOperator->getConnection())
    );

} else {
    $response = array(
        "success" => true,
        "message" => "successfully add a feature"
    );
}

@pg_close($dbOperator->getConnection());

echo json_encode($response); // 写回运行结果
