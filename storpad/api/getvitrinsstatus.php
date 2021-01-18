<?php

	function getActiveVitrins()
	{
		$sql = "SELECT device_id 
				FROM in_display_user 
				WHERE id in ('$userid')";
		print($userid);
		$data = query($sql, true);
		$column = array_column($data, "device_id");
		$imp = implode("','",$column);
		$time = time()-3600;

		$sql = "SELECT DISTINCT device_id 
				FROM sys_logcat 
				WHERE connect_time>('$time') AND device_id in('$imp') AND type in ('refresh','initial')";
		$statuses = query($sql, true);

		return $statuses;
	}
	

?>