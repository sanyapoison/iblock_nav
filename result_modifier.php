<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();?>

<?
foreach($arResult["ITEMS"] as &$arItem)
{
	switch ($arItem["TYPE"]) 
	{
		case 'E':
			$arItem["PROPERTIES"]["ICON"]["VALUE_MOD"] = $arItem["PROPERTIES"]["ICON"]["VALUE_ENUM"] ? $arItem["PROPERTIES"]["ICON"]["VALUE_ENUM"] : 'blank';

			if($arItem["PROPERTIES"]["FILE"]["VALUE"])
			{
				$arFile = CFile::GetFileArray($arItem["PROPERTIES"]["FILE"]["VALUE"]);
				$arItem["PROPERTIES"]["FILE"]["FULL_DESCRIPTION"] = $arFile;				
				$path_parts = pathinfo($arFile["ORIGINAL_NAME"]);
				$arFile["ORIGINAL_NAME"] = $arItem["CODE"]. ".". $path_parts['extension']; 

				$arItem["PROPERTIES"]["FILE"]["PRINT_NAME"] = $arFile["ORIGINAL_NAME"] ? $arFile["ORIGINAL_NAME"] : $arFile["FILE_NAME"];

				$file_exists = file_exists($_SERVER["DOCUMENT_ROOT"]."/dealers/cabinet/file-format-icons/". $path_parts['extension']. ".svg");	

				$arItem["PROPERTIES"]["ICON"]["VALUE_MOD"] = $file_exists ? $path_parts['extension'] : 'blank';	
			}	
			else
			{
				$arItem["PROPERTIES"]["ICON"]["VALUE_MOD"] = 'blank';
				unset($arItem);
			}			
			break;
		
		case 'S':
			// $arItem["PROPERTIES"]["ICON"]["VALUE_MOD"] = 'section-folder';
			$arItem["PROPERTIES"]["ICON"]["VALUE_MOD"] = 'section-folder_yelow';
			break;
 
		default:
			$arItem["PROPERTIES"]["ICON"]["VALUE_MOD"] = 'blank';
			break;
	}

	// debug($arItem["PROPERTIES"]["ICON"]["VALUE_MOD"]);
}

$arResult["COUNT_ITEMS"] = count($arResult["ITEMS"]);
?>