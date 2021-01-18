<?php 

	include 'filetojson.php';

	$json = file_to_json("dashboard_procurement.txt");

	print($json);
 ?>