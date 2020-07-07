<?php

// 数据库操作类，用于连接数据库、进行查询等
class DBOperator
{
    private $host = "127.0.0.1"; // 数据库所在host
    private $port = 5432; // 端口号
    private $dbname = "webgis"; // 要连接的数据库名称
    private $user = "postgres"; // 用户身份
    private $password = "123456"; // 用户密码
    private $connection; // 建立的连接

    // 连接到指定数据库
    //
    // @param
    // @return
    public function connect() {
        // 构建连接字符串
        $connect_string = "host={$this->host} 
            port={$this->port} 
            dbname={$this->dbname}
            user={$this->user} 
            password={$this->password}";

         $this->connection = @pg_connect($connect_string); // 建立连接
         return $this->connection;
    }

    // 进行带参数的查询
    //
    // @param sql: 查询语句，字符串
    //        params: 查询语句需要的参数
    // @return
    public function queryWithParam($sql, $params) {
        return @pg_query_params($this->connection, $sql, $params);
    }

    // 进行不带参数的sql查询
    //
    // @param sql: 查询语句，字符串
    // @return
    public function query($sql) {
        return @pg_query($this->connection, $sql);
    }

    // 获得当前数据库连接
    //
    // @param
    // @return 当前数据库连接
    public function getConnection() {
        return $this->connection;
    }

    // 获得主机ip
    //
    // @param
    // @return 主机ip
    public function getHost() {
        return $this->host;
    }

    // 获得数据库名称
    //
    // @param
    // @return 数据库名
    public function getDbName() {
        return $this->dbname;
    }

    // 获得用户名
    //
    // @param
    // @return 用户名
    public function getUser() {
        return $this->user;
    }

    // 获得密码
    //
    // @param
    // @return 密码
    public function getPassword() {
        return $this->password;
    }

    // 获得端口号
    //
    // @param
    // @return 端口号
    public function  getPort() {
        return $this->port;
    }
}