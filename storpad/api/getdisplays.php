<?php 

	include 'api/formingJSON.php';
	include 'api/query.php';
	include 'api/getvitrinsstatus.php';

	$sql = "SELECT id,device_id, last_auth, phone, email,city,address, contact 
			FROM in_display_user 
			WHERE id in ('$userid')";

	$allinfo = query($sql, true, true, true);
	
	$vitrins = array_column($allinfo, "device_id");
	$vitrinsStroke = implode("','", $vitrins);
	

	$sql = "SELECT deviceid,eventid,COUNT(id) as event 
			FROM all_events 
			WHERE eventid  in (1,13) and deviceid in ('$vitrinsStroke') 
			GROUP BY eventid, deviceid";

	$data = query($sql, true, true);
	
	$json["event"] = $data;

	/*----ПОЛУЧЕНИЕ АКТИВНЫХ ВИТРИН----*/
	$sql = "SELECT device_id 
			FROM in_display_user 
			WHERE id in ('$userid')";
				
	$data = query($sql, true);
	$column = array_column($data, "device_id");
	$imp = implode("','",$column);
	$time = time()-3600;

	$sql = "SELECT DISTINCT device_id 
			FROM sys_logcat 
			WHERE connect_time > ('$time') AND device_id in('$imp') AND type in ('refresh','initial')";
	
	$active = query($sql, true);

	$actvitrins = array_column($active, "device_id");

	/*---ФОРМИРОВАНИЕ МАССИВА ИЗ 1 и 2---*/
	foreach ($allinfo as $k => &$v) 
	{
		foreach ($allinfo[$k] as $k2 => $v2) 
		{
			foreach ($actvitrins as $k3  => $v3) 
			{
				if ($v3 == $v2)
				{
					$allinfo[$k]["active"] = 1;
				}
			}
		}
	}

	$json["device"] = $allinfo;
	$json["active"] = $active;

	print(json_encode($json)); 

	
 ?>