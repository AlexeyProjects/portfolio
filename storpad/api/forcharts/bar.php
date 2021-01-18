<?php 
	
	include 'api/formingJSON.php';
	include 'api/query.php';

	$sql = "SELECT order_status, SUM(summ_with_discount_vitrina) as sum, idu.device_id as device_id
			FROM in_order io, in_display_user idu
			WHERE idu.id=io.source_id AND io.user_id in ('$userid') AND  io.date_create > date_add(curdate(),INTERVAL - ('$day') DAY)
			GROUP BY idu.device_id, order_status";

	$data = query($sql, true);

	/*--ФОРМИРОВАНИЕ ОБЪЕКТОВ КАЖДОЙ ВИТРИНЫ--*/
	foreach ($data as $k => $v) 
	{
		$id = $v["device_id"];
		$json[$id] = array();
		foreach ($data as $k2 => $v2) 
		{
			if ($v["device_id"] == $v2["device_id"])
			{
					$json[$id][] = [$v2["order_status"] => $v2["sum"]];
			}
		}
	}

	print(json_encode($json));
 ?>