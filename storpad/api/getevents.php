<?php 

	include 'api/formingJSON.php';
	include 'api/query.php';

	$sql = "SELECT device_id 
			FROM in_display_user 
			WHERE id in ('$userid')";

	$data = query($sql, true);
	
	$vitrins = array_column($data, "device_id");
	$vitrinsStroke = implode("','", $vitrins);

	$untime = time() - $day*86400;

	$sql = "SELECT COUNT(eventid) as numevents, atime 
			FROM all_events,sys_devices 
			WHERE all_events.eventid=1 and sys_devices.vendor_tag=9007 and sys_devices.device_id=all_events.deviceid and sys_devices.device_id in ('$vitrinsStroke') AND all_events.atime > ('$untime')";

	$data = query($sql, true, false);
	$json["session"] = $data[0];

	$sql = "SELECT COUNT(eventid) as numevents 
			FROM all_events,sys_devices 
			WHERE all_events.eventid=3 and sys_devices.vendor_tag=9007 and sys_devices.device_id=all_events.deviceid and sys_devices.device_id in ('$vitrinsStroke') AND all_events.atime > ('$untime')";

	$data = query($sql, true, false);
	$json["card"] = $data[0];

	$sql = "SELECT COUNT(eventid) as numevents 
			FROM all_events,sys_devices
			WHERE all_events.eventid=13 and sys_devices.vendor_tag=9007 and sys_devices.device_id=all_events.deviceid and sys_devices.device_id in ('$vitrinsStroke') AND all_events.atime > ('$untime')";

	$data = query($sql, true, false);
	$json["orders"] = $data[0];


	print(json_encode($json));

 ?>