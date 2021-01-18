<?php

    global $link, $db;

    include_once("config.php");

    $link = mysqli_connect($db['hostname'], $db['username'], $db['password']);

    if ($link) {
        mysqli_select_db($link, $db['database']);
        mysqli_set_charset($link, "utf8");
    } else {
        die("Could not connect!");
    }

    function db_query($sql) {
        if (!$sql or !($sql > "")) return false;

        global $link;
        $result = mysqli_query($link, $sql);

        if (!$result) {
            print(mysqli_error($link) . " in " . $sql);
        }
        return $result;
    }

    function db_fetch_row(&$result) {
        if (!$result) return false;
        return mysqli_fetch_row($result);
    }

    function db_num_rows(&$result) {
        if (!$result) return false;
        return mysqli_num_rows($result);
    }

    function db_fetch_assoc(&$result) {
        if (!$result) return false;
        return mysqli_fetch_assoc($result);
    }

    function db_fetch_all(&$result) {
        if (!$result) return false;
        $x = array();
        while ($y = mysqli_fetch_assoc($result)) {
            $x[] = $y;
        }
        return $x;
    }

    function db_free(&$result) {
        if ($result) {
            mysqli_free_result($result);
        }
    }

    function db_escape($str) {
        global $link;
        return mysqli_real_escape_string($link, $str);
    }

    function db_fetch_entry($sql) {
        if ($result = db_query($sql . " LIMIT 1")) {
            $row = db_fetch_assoc($result);
            if ($row) return $row;
        }
        return false;
    }

    function db_insert($table, $input, $update) {
        $object = new ArrayConverter($input);
        $query = "INSERT INTO " . $table . " " . $object->fields . " VALUES " . $object->insert;
        if ($update) $query .= " ON DUPLICATE KEY UPDATE " . $object->update;
        db_query($query);
    }

    class ArrayConverter {

        public $fields;
        public $insert;
        public $update;

        public function __construct($input) {

            $fields_array = array();
            $insert_array = array();
            $update_array = array();

            foreach (array_keys($input) as $key) {
                array_push($fields_array, $key);
                array_push($insert_array, "'" . $input[$key] . "'");
                array_push($update_array, $key . "='" . $input[$key] . "'");
            }

            $this->fields = "(" . implode(",", $fields_array) . ")";
            $this->insert = "(" . implode(",", $insert_array) . ")";
            $this->update = implode(",", $update_array);
        }
    }

?>