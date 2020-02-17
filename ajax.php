<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>

<?
include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
$APPLICATION->RestartBuffer();


$arResult = array();

if(CUser::isAuthorized())
{
	use Bitrix\Main\IO,
	    Bitrix\Main\Application;

	$arResult["result"] = true;
	$arResult["message"] = "succes";	    
}	
else
{
	$arResult["result"] = false;
	$arResult["message"] = "not auth user";
}


echo CUtil::PHPToJSObject($arResult, true);
?>