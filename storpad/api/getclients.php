<?php 

	include 'api/formingJSON.php';
	include 'api/query.php';

	$sql = "SELECT io.order_count, io.customer_fio, io.customer_phone
			FROM in_order io, in_display_user idu 
			WHERE idu.id=io.source_id AND io.user_id in ('$userid')
			ORDER BY order_number desc";

	query($sql);


 ?>