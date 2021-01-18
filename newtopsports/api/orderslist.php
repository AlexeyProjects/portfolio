<?php 

	include 'filetojson.php';

	$json = file_to_json("dashboard_table.txt");

	print($json);
 ?>