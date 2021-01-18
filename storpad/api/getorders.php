<?php 
	
	include 'api/formingJSON.php';
	include 'api/query.php';

    $sql = "SELECT io.id, idu.device_id as device_id, order_id, date_create, customer_fio, customer_phone, summ_with_discount_vitrina, order_status, order_count
        FROM in_order io, in_display_user idu
        WHERE idu.id=io.source_id AND io.user_id in ('$userid')
        ORDER BY order_number desc";


    query($sql);

 ?>