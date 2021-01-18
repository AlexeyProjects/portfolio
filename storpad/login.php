<?php 

include 'array_func.php';
include 'db/database.php';

define("salt","9F3xla");

global $link, $global_user, $link2;

function make_pass_salt($pass)
{
    $md5_pass = salt . md5(salt . $pass);
    return $md5_pass;
}

function auth()
{
	global $link;

	$data = $_POST;
	if (isset($data["storpad_login"]) && isset($data["storpad_password"]))
	{
		$login = mysqli_real_escape_string($link,trim($data["storpad_login"]));
		if (trim($data["storpad_login"]) === "Lestate15")
		{
			$passhash = mysqli_real_escape_string($link, md5(trim($data["storpad_password"])));
		}
		else
		{
			$passhash = mysqli_real_escape_string($link, make_pass_salt(trim($data["storpad_password"])));
		}
	}
	else
	{
		return false;
	}

	$sql = "SELECT seller_id, device_id 
			FROM in_display_user 
			WHERE login = '$login' AND pass = '$passhash'";
	$res = db_query($sql);
	$data = db_fetch_all($res);

	if (!$data)
	{
		return false;	
	}

	/*--ПРОВЕРКА НА НАЛИЧИЕ КУКИ--*/
	if (!isset($_COOKIE["sess_id"])) 
	{
		$tmp=rand(0,100000).time()."random string";
        $tmp=md5($tmp);
        $time=time()+86400*90;
		setcookie("sess_id",$tmp,$time,"/");

		$selid = $data["seller_id"];
		$dispid = $data["device_id"];
		$ip = $_SERVER["REMOTE_ADDR"];
		$tstart = time();
		$browser = get_browser(null, true);

		//include 'inssess.php';
		//insert_sess($selid, $dispid, $ip, $tstart, $browser["browser"], $tmp);

	}
	//include 'checkotherconnect.php';
	//check_other_connect();

	information($login);

	return true;
	
}



/*----ПОЛУЧЕНИЕ ВСЕЙ ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ----*/
function information($login)
{
	if(isset($_COOKIE["sess_id"]))
	{
		global $global_user, $link;
		$log = $login;
		$sql = "SELECT * 
				FROM in_display_user 
				WHERE login = '$log'";
		$res = db_query($sql);
		$global_user = db_fetch_all($res);
		if (!$global_user)
		{
			//что-то для ошибки
		}
	}
}

$isLogin = auth();

if($isLogin)
{
	
	$content=datout("./templates/main.html");

	$common=datout("./templates/common.html");

	$out=str_replace("##content##",$content,$common);

	print($out);
	
}
else
{
	header("Location: login.html?errorAuth");
}

	/* для check_other
	$sql = "SELECT *
			FROM sess_at_moment
			WHERE seller_id = '$sid'";*/

	/* для проверки куки
        $sql = "UPDATE sess_at_moment
        		SET sess_id = '$tmp', date_start = '$tstart'
        		WHERE sess_id = '$cookie' AND seller_id = '$selid'";*/		


    /* на всякий случай
    if (isset($_COOKIE["sess_id"])) //Если есть, то обновляем дату и данные в базе по данной сессии и обновляем куку
	{
		$cookie = $_COOKIE["sess_id"];
		$time=time()+86400*90;
		setcookie("sess_id",$cookie,$time,"/");
		

		$cookie = mysqli_real_escape_string($link, $cookie);
        $tstart = time();
        $selid = $data["seller_id"];

        $sql = "UPDATE sess_at_moment
        		SET date_start = '$tstart'
        		WHERE sess_id = '$cookie' AND seller_id = '$selid'";
        $res = db_query($sql);

	}
	else //Если нет, то создаем запись в базе о данной сессии и ставим куку
	{
		$tmp=rand(0,100000).time()."random string";
        $tmp=md5($tmp);
        $time=time()+86400*90;
		setcookie("sess_id",$tmp,$time,"/");

		$selid = $data["seller_id"];
		$dispid = $data["device_id"];
		$ip = $_SERVER["REMOTE_ADDR"];
		$tstart = time();

		db_insert("sess_at_moment", array("seller_id" => $selid,
											"display_id" => $dispid,
											"ip" => $ip,
											"date_start" => $tstart,
											"sess_id" => $tmp), false);
	}
	*/
 ?>


