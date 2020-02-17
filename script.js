;(function(window) {
	if (window.JCSmartFinder)
		return;

	window.JCSmartFinder = function(params)
	{

		this.tableId = '';
		this.listId = '';
		this.tableFootId = '';
		this.controlAllId = '';
		this.printCheckCountId = '';
		this.buttonDownloadCheckedId = '';

		this.tableObj = null;
		this.listObj = null;
		this.tableFootObj = null;
		this.controlAllObj = null;
		this.printCheckCountObj = null;
		this.buttonDownloadCheckedObj = null;

		this.controlClassCheck = '';

		this.useAjaxTransition = false;
		this.useBreadcrumbs = false;
		this.breadcrumbsLayer = 0;

		this.siteId = '';
		this.ajaxUrl = '';
		this.countAllItems = 0;
		this.countCheckItems = 0;

		this.controlLoadStatus = false;
		this.controlAllStatus = false;
		this.controlUrlAdres = false;
		this.listCheckItems = {};
		this.oneCheckItems = {};
		this.oneCheckFlag = false;
		this.componentParams = {};

		if (BX.type.isPlainObject(params))
		{		
			/*ids objects*/
			if (BX.type.isNotEmptyString(params.tableId))
				this.tableId = params.tableId;		
			if (BX.type.isNotEmptyString(params.listId))
				this.listId = params.listId;
			if (BX.type.isNotEmptyString(params.tableFootId))
				this.tableFootId = params.tableFootId;			
			if (BX.type.isNotEmptyString(params.controlAllId))
				this.controlAllId = params.controlAllId;			
			if (BX.type.isNotEmptyString(params.printCheckCountId))
				this.printCheckCountId = params.printCheckCountId;
			if (BX.type.isNotEmptyString(params.buttonDownloadCheckedId))
				this.buttonDownloadCheckedId = params.buttonDownloadCheckedId;

			/*classes objects*/
			if (BX.type.isNotEmptyString(params.controlClassCheck))
				this.controlClassCheck = params.controlClassCheck;

			if (BX.type.isBoolean(params.useAjaxTransition))
				this.useAjaxTransition = params.useAjaxTransition;

			/*param bredcrumbs*/
			if (BX.type.isBoolean(params.useBreadcrumbs))
				this.useBreadcrumbs = params.useBreadcrumbs;
			if (BX.type.isNotEmptyString(params.breadcrumbsLayer))
				this.breadcrumbsLayer = parseInt(params.breadcrumbsLayer);

			/*other params*/
			if (BX.type.isNotEmptyString(params.siteId))
				this.siteId = params.siteId;	
			if (BX.type.isNotEmptyString(params.ajaxUrl))
				this.ajaxUrl = params.ajaxUrl;					
			if (BX.type.isNotEmptyString(params.countAllItems))
				this.countAllItems = parseInt(params.countAllItems);

			if (BX.type.isObject(params.componentParams))
				this.componentParams = params.componentParams;	
		}

		BX.ready(BX.proxy(this.init, this));		
	};

	window.JCSmartFinder.prototype.init = function()
	{
		if (BX.type.isNotEmptyString(this.tableId))
			this.tableObj = BX(this.tableId);

		if (BX.type.isNotEmptyString(this.listId))
			this.listObj = BX(this.listId);

		if (BX.type.isNotEmptyString(this.tableFootId))
			this.tableFootObj = BX(this.tableFootId);

		if (BX.type.isNotEmptyString(this.controlAllId))
			this.controlAllObj = BX(this.controlAllId);

		if (BX.type.isNotEmptyString(this.printCheckCountId))
			this.printCheckCountObj = BX(this.printCheckCountId);

		if (BX.type.isNotEmptyString(this.buttonDownloadCheckedId))
			this.buttonDownloadCheckedObj = BX(this.buttonDownloadCheckedId);		

		if (BX.type.isElementNode(this.buttonDownloadCheckedObj))
		{
			BX.bind(this.buttonDownloadCheckedObj, 'click', BX.proxy(this.downloadCheckFolder, this));
		}

		this.controlTransitionUrl();
	};

	window.JCSmartFinder.prototype.click = function(inputContainer, idChecks)
	{
		input = BX(idChecks);

		if (!BX.type.isElementNode(input))
			return;		

		this.controlCheckItem(input, input.checked);
		this.renderControl();
	};
	
	window.JCSmartFinder.prototype.clickAll = function(inputContainer)
	{
		if (!BX.type.isElementNode(this.listObj) && !BX.type.isElementNode(this.controlAllObj))
			return;

		if(this.controlAllStatus != this.controlAllObj.checked)
		{
			this.controlAllStatus = this.controlAllObj.checked;


			listChecks = BX.findChildren(
				this.listObj, 
				{ 				
					className: this.controlClassCheck
				}, 
				true
			); 

			if(listChecks.length <= 0)
				return;

          	for (var i = 0; i <= listChecks.length - 1; i++) 
          	{
          		if (!BX.type.isElementNode(listChecks[i]))
          			break;
            	
            	this.controlCheckItem(listChecks[i], this.controlAllStatus)
            }

			this.renderControl();
		}
	};

	window.JCSmartFinder.prototype.controlCheckItem = function(input, status)
	{
		if (!BX.type.isElementNode(input))
			return;

		input.checked = status;
		
		idItem = BX.data(input,'item');
		typeItem = BX.data(input,'type');

		if(status)
		{
			this.listCheckItems[idItem] = {
				"id": idItem,
				"type": typeItem
			};
		}	
		else
		{
			delete this.listCheckItems[idItem];	
		}			
	};

 	window.JCSmartFinder.prototype.renderControl = function()
	{
		countItemsCheck = Object.keys(this.listCheckItems).length;

		this.controlAllStatus = ((countItemsCheck == this.countAllItems) && (countItemsCheck > 0)) ? true : false; 
		this.controlAllObj.checked = this.controlAllStatus;
		
		if (BX.type.isElementNode(this.printCheckCountObj))
			this.printCheckCountObj.innerHTML = countItemsCheck;

		if(BX.type.isElementNode(this.buttonDownloadCheckedObj)){
			if(countItemsCheck)
			{
				BX.removeClass(this.buttonDownloadCheckedObj, 'link-download-hidden');
				
			}
			else
			{
				BX.addClass(this.buttonDownloadCheckedObj, 'link-download-hidden');
			}
		}	
	};

	window.JCSmartFinder.prototype.downloadOneFolder = function(input)
	{
		if(!this.controlLoadStatus)
		{
			idItem = BX.data(input,'item');

			this.oneCheckItems[idItem] = {
				"id": idItem,
				"type": "S"
			};

			this.oneCheckFlag = true;
				
			this.handlerDownload(
				null, 
				false,
				false,
				false						
			);
		}	
	};

	window.JCSmartFinder.prototype.downloadCheckFolder = function(event)
	{
		if(!this.controlLoadStatus)
		{
			countItemsCheck = Object.keys(this.listCheckItems).length;

			if(countItemsCheck)
			{
				this.handlerDownload(
					null, 
					false,
					false,
					false						
				);			
			}
		}	
	};

 	window.JCSmartFinder.prototype.handlerDownload = function(
 		event=null, 
 		ajax_continue=false, 
 		arPackFiles=false, 
 		arhive=false
 	){

		if(!this.controlLoadStatus)
		{
			BX.showWait();
			this.controlLoadStatus = true;

			items = this.oneCheckFlag ? this.oneCheckItems : this.listCheckItems;

			BX.ajax({
				'timeout': 30,
				'method': 'POST',
				'dataType': 'html',
				'url': this.ajaxUrl,
				'data': {
					sessid: BX.bitrix_sessid(),
					site_id: this.siteId,
					items: items,
					params: this.componentParams,
					continue_status: ajax_continue,
					ar_pack_files: arPackFiles,
					arhive: arhive,
				},
				'onsuccess': BX.proxy(this.checkAjaxResult, this),
				'onfailure': BX.proxy(this.checkErrorResult, this)
			});
		}
	};

	window.JCSmartFinder.prototype.checkAjaxResult = function(result)
	{
		BX.closeWait();
		this.controlLoadStatus = false;

		convertJson = this.convertJson(result);

		if(convertJson["result"]) 
		{			
			if(convertJson.object["result"] && convertJson.object["arhive"])
			{

				if(convertJson.object["fmPackTimeout"])
				{
					this.handlerDownload(
						null, 
						true,
						convertJson.object["arPackFiles"],
						convertJson.object["arhive"]						
					);
				}
				else
				{	

					this.clearCheckList();
					var link = document.createElement('a');
					link.setAttribute('href',convertJson.object["arhive"]);
					link.setAttribute('download','arhive.tar.gz');
					onload=link.click();
				}	
			}
			else
			{
				alert("Ошибка архивации");
				console.log(convertJson.object);
			}		
		}
		else
		{
			alert("Ошибка архивации");
			console.log(convertJson);
		}
	};

	window.JCSmartFinder.prototype.checkErrorResult = function(result)
	{
		BX.closeWait();
		this.controlLoadStatus = false;
		alert("Ошибка архивации");
		console.log(result);	
	};

	window.JCSmartFinder.prototype.clearCheckList = function()
	{
		if (!BX.type.isElementNode(this.listObj) && !BX.type.isElementNode(this.controlAllObj))
			return;

		this.controlAllStatus = false;
		try{
			this.controlAllObj.checked = this.controlAllStatus;
		}
		catch(e){}	

		listChecks = BX.findChildren(
			this.listObj, 
			{ 				
				className: this.controlClassCheck
			}, 
			true
		); 

		if(listChecks.length <= 0)
			return;

      	for (var i = 0; i <= listChecks.length - 1; i++) 
      	{
      		if (!BX.type.isElementNode(listChecks[i]))
      			break;
        	
        	this.controlCheckItem(listChecks[i], this.controlAllStatus)
        }

        this.oneCheckItems = {};
        this.oneCheckFlag = false 

		this.renderControl();			
	};

	window.JCSmartFinder.prototype.convertJson = function(result)
	{
		try
		{
			return {
				"object": JSON.parse(result),
				"result": true
			};
		}	
		catch(error)
		{
			return {
				"result": false,
				"object": result,
				"message": error
			};
		}	
	};

	window.JCSmartFinder.prototype.controlTransitionUrl = function()
	{
		if(this.useBreadcrumbs && this.useAjaxTransition)
		{
			breadcrumbContainer = BX("breadcrumb");


			if (!BX.type.isElementNode(breadcrumbContainer))
				return

            breadcrumbs = BX.findChildren(
				breadcrumbContainer, 
				{ 				
					tag: "a",
				}, 
				true
			); 

			for (var i = this.breadcrumbsLayer; i <= breadcrumbs.length - 1; i++) {
            	BX.bind(breadcrumbs[i], 'click', BX.proxy(this.bindTransitionUrl, this));
            }
		}

		var self = this;

		setTimeout(function(){BX.unbind(window, 'popstate', BX.ajax.history.__hashListener);}, 700);
		setTimeout(function(){BX.bind(window, 'popstate', function(event){self.handerHistoryTransitionUrl(event);});}, 1000);		
	};

	window.JCSmartFinder.prototype.bindTransitionUrl = function(event)
	{
		if(this.useAjaxTransition)
		{	
			$.Event(event).preventDefault(false);		
			var element = BX.proxy_context;
			this.handerTransitionUrl(element, event); 
		}	
	};

	window.JCSmartFinder.prototype.clickTransitionUrl = function(element, event)
	{
		if(this.useAjaxTransition)
		{	
			$.Event(event).preventDefault(false);
			this.handerTransitionUrl(element, event); 
		}	
	};

	window.JCSmartFinder.prototype.handerTransitionUrl = function(element, event)
	{
		url = element.href;

		if (!BX.type.isNotEmptyString(url))
			return;

		this.ajaxTransitionUrl(url, true);
	};

	window.JCSmartFinder.prototype.handerHistoryTransitionUrl = function(event)
	{		
		$.Event(event).preventDefault(false);	
		smartFinder.ajaxTransitionUrl(event.target.location.href, false);
	};

	window.JCSmartFinder.prototype.ajaxTransitionUrl = function(url, modeControlUrl)
	{
		if (!BX.type.isNotEmptyString(url))
			return;

		if(!this.controlLoadStatus)
		{

			// console.log(url);
			// console.log(modeControlUrl);

			BX.showWait();
			this.controlLoadStatus = true;

			if(modeControlUrl)
				this.controlUrlAdress(url);

			this.clearCheckList();
			this.listCheckItems = {};

			BX.ajax({
				'timeout': 30,
				'method': 'GET',
				'dataType': 'html',
				'url': url,
				'data': {
					sessid: BX.bitrix_sessid(),
					site_id: this.siteId
				},
				'onsuccess': BX.proxy(this.handerPostTransitionUrl, this),
				'onfailure': BX.proxy(this.checkErrorResult, this)
			});
		}	
	};

	window.JCSmartFinder.prototype.handerPostTransitionUrl = function(result)
	{
		BX.closeWait();
		// this.controlUrlAdress(BX.proxy_context.url);

		this.clearCheckList();

		this.listCheckItems = {};

		this.controlLoadStatus = false;

		var nodePage = BX.create(
			{ 
				tag: 'html', 
				html: result
			}
		);

		if (!BX.type.isElementNode(nodePage))
			return;
		
		if(this.useBreadcrumbs)
		{	
			breadcrumbsContainer = BX.findChild(
				nodePage, 
				{ 		
					tag: 'div',	
					className: 'breadcrumbs',	
					attribute: {
						id: "breadcrumb"
					}	
				}, 
				true
			);

			if (!BX.type.isElementNode(breadcrumbsContainer))
				return;

			BX("breadcrumb").innerHTML = breadcrumbsContainer.innerHTML;

			this.controlTransitionUrl()
		}

		tableContainer = BX.findChild(
			nodePage, 
			{ 		
				tag: 'table',	
				attribute: {
					id: this.tableId
				}	
			}, 
			true
		); 

		if (!BX.type.isElementNode(tableContainer))	
			return;
		
		this.tableObj.innerHTML = tableContainer.innerHTML;

	};
 	
 	window.JCSmartFinder.prototype.controlUrlAdress = function(url)
	{
		window.history.pushState({}, '', url);
		// if(this.controlUrlAdres){
		// 	this.controlUrlAdres = false;
		// 	window.history.pushState({}, '', url);
		// }
		// else{
		// 	window.history.replaceState({}, '', url);
		// }	
	};

})(window);	