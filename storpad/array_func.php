<?php


function datout($val)
{
	if (file_exists($val)) {
		$x = file_get_contents($val);
		proc_if($x);
		proc_var($x);
		proc_arr($x);	
		return $x;
	} else {
//return false;
		return "Template not found";
	}
}


function l($v)
{
	global $level;
	return $level[$v]["name"];
}


function proc_var(&$c)
{


	$a = "";
	$b = "";
	$pat = "~##(.*?)##~smi";

	preg_match_all($pat, $c, $xarr);

	//print_r($xarr); // exit;

	foreach ($xarr[0] as $k => $v) {
		$a = trim($xarr[1][$k]);
		global $$a;
		//print($k."<hr>");
		//print_r($xarr[1][$k]);
		$b = $$a;
		$c = str_replace($v, $b, $c);

	}


}

function proc_arr(&$c)
{
	$a = "";
	$b = "";
	$pat = "~<mx (.*?)>(.*?)</mx>~smi";

	preg_match_all($pat, $c, $xarr);

//print_r($xarr); // exit;

	foreach ($xarr[0] as $k => $v) {
		$a = trim($xarr[1][$k]);
		global $$a;
//print($k."<hr>");
//print_r($xarr[2][$k]);
		$b = arout($xarr[2][$k], $$a);
		$c = str_replace($v, $b, $c);
	}

}


//function limit_sql($page,$num)
function pagination($page, $num)
{

	global $notfirst; //redefine notlast in select - of number of records less then num of records in limit
	if ($page > 1) {
		$notfirst = 1;
	} else {
		$notfirst = 0;
	}

	$a = $num * ($page - 1);
	$b = $num * $page;

	return " Limit $a, $b";

}

function proc_if(&$c) //content
{
//process ifs
	$pat = "~<if (.*?)>(.*?)</if>~smi"; //for pagination
	preg_match_all($pat, $c, $arr);

//print_r($arr); exit;

	if (isset($arr[0])) {
		foreach ($arr[0] as $k => $v) {
			$a = trim($arr[1][$k]);
			global $$a;

			$a = $$a;
			if ($a || $a > 0 || $a > "") {
				$b = $arr[2][$k];
			} else {
				$b = "";
			}
			$c = str_replace($v, $b, $c);
		}
	}

}


function arout($txt, &$arr)
{
//if name = ins - get content of ins array?

	if (!count($arr) > 0) return;

	$s = "";
	$d = "#";

//get inner names

	foreach ($arr as $v) {

		$a = array();
		$b = array();

//print_r("v<hr>");print_r($v);

		foreach ($v as $kk => $vv) {

			if (!is_array($vv)) {
				$a[] = $d . $kk . $d;
				$b[] = $vv;
			} else {
				$pat = "~<mxi " . $kk . ">(.*?)</mxi>~smi";
				preg_match_all($pat, $txt, $xarr);
//                print_r($xarr);
				$a[] = trim($xarr[0][0]);
				$b[] = arout($xarr[1][0], $vv);

			}

		}

//print_r($a); print_r($b);
		if (!is_array($txt)) $s .= str_replace($a, $b, $txt);
//exit;
	}

	return $s;
}

//using named array. if array not named - a1 as 1

//in arrays


?>