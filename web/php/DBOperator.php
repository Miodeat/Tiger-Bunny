<?php


class DBOperator
{
    private $host = "127.0.0.1";
    private $port = 5432;
    private $dbname = "webgis";
    private $user = "postgres";
    private $password = "123456";
    private $connection;

    public function connect(){
        $connect_string = "host={$this->host} 
            port={$this->port} 
            dbname={$this->dbname}
            user={$this->user} 
            password={$this->password}";

         $this->connection = @pg_connect($connect_string);
         return $this->connection;
    }

    public function queryWithParam($sql, $params){
        return @pg_query_params($this->connection, $sql, $params);
    }

    public function query($sql){
        return @pg_query($this->connection, $sql);
    }

    public function getConnection()
    {
        return $this->connection;
    }
}