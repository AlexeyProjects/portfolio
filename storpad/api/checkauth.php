<?php 

function checkauth()
{
	/*
	if (isset($_COOKIE["sess_id"]))
	{
		$cookie = $_COOKIE["sess_id"];
		*/
		$sql = "SELECT * from in_display_user WHERE login = 'lestate15'";
		$data = db_fetch_entry($sql);
		if (isset($data["login"]))
		{
			return $data;
		}
		else
		{
			return false;
		}
	//}
}

 ?>