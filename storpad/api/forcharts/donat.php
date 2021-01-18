<?php 

	include 'api/formingJSON.php';
	include 'api/query.php';

	$sql = "SELECT order_status, COUNT(order_status) as number_status
    		FROM in_order
    		WHERE date_create > date_add(curdate(),INTERVAL - ('$day') DAY)
    		GROUP BY order_status";

    query($sql);
 ?>