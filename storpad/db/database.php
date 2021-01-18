<?php
 global $link, $db;

   include_once("config.php");

   $link = mysqli_connect($db["hostname"], $db["username"], $db["password"]);

   if ($link !== false) {
       mysqli_select_db($link, $db["database"]);
       mysqli_set_charset($link, "utf8");
   } else {
       die("Could not connect!");
   }

   function db_query($sql) {
       if (empty($sql)) return false;

       global $link;
       $result = mysqli_query($link, $sql);

       if ($result === false) {
           print(mysqli_error($link) . " in " . $sql);
       }
       return $result;
   }

   function db_num_rows(&$result) {
       if ($result !== false) {
           return mysqli_num_rows($result);
       }
       return false;
   }

   function db_fetch_row(&$result) {
       if ($result !== false) {
           return mysqli_fetch_row($result);
       }
       return false;
   }

   function db_fetch_assoc(&$result) {
       if ($result !== false) {
           return mysqli_fetch_assoc($result);
       }
       return false;
   }

   function db_fetch_all(&$result) {
       if (!empty(db_num_rows($result))) {
           $x = array();
           while ($y = mysqli_fetch_assoc($result)) {
               $x[] = $y;
           }
           return $x;
       }
       return false;
   }

   function db_fetch_entry($sql) {
       $result = db_query($sql . " LIMIT 1");
       if (!empty(db_num_rows($result))) {
           return db_fetch_assoc($result);
       }
       return false;
   }

   function db_insert($table, $array, $update) {
       $result = new InsertArrayConverter($array, $update);
       $sql = "INSERT INTO `" . $table . "` " . $result->fields . " VALUES " . $result->insert;
       if ($update) $sql .= " ON DUPLICATE KEY UPDATE " . $result->update;
       return db_query($sql);
   }

   function db_escape($string) {
       global $link;
       return mysqli_real_escape_string($link, $string);
   }

   class InsertArrayConverter {

       public $fields;
       public $insert;
       public $update;

       public function __construct($array, $update) {

           $fields_array = array();
           $insert_array = array();
           $update_array = array();

           foreach (array_keys($array) as $key) {
               $value = db_escape($array[$key]);
               array_push($fields_array, "`" . $key . "`");
               array_push($insert_array, "'" . $value . "'");
               if ($update !== false)
               {
                    array_push($update_array, "`" . $key . "`='" . $value . "'");
               }
           }

           $this->fields = "(" . implode(",", $fields_array) . ")";
           $this->insert = "(" . implode(",", $insert_array) . ")";
          if ($update !== false)
          {
            $this->update = implode(",", $update_array);
          }
       }
   }
?>