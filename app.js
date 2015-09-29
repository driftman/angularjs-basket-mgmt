var myApp = angular.module('myApp', ['LocalStorageModule']);

myApp.config(function (localStorageServiceProvider) {

  localStorageServiceProvider
    .setPrefix('myApp')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
    
});


myApp.controller('FirstCtrl', FirstCtrl);
myApp.factory('BasketService', BasketService);
myApp.factory('ItemsService', ItemsService);
function ItemsService()
{
	var items = 
	[{_id: 1, productName: "MacBook Pro", unitPrice: 1200},
	{_id: 2, productName: "HP Laser Jet", unitPrice: 250},
	{_id: 3, productName: "Asus X200", unitPrice: 800}];

	return {
		add: add,
		get: get
	};

	function add(item)
	{
		if(item.productName == undefined || unitPrice == undefined)
		{
			throw new Error('The item should contain a price and a label !');
		}
		item._id = items[items.length-1]._id+1;
		items.push(item);
		return;
	}

	function get()
	{
		return items;
	}
}
function BasketService(localStorageService)
{
	return {
		init : init,
		add: add,
		get: get,
		remove: remove,
		clear: clear
	};

	function add(item) 
	{
		var items = get();

		if (items == null)
			init();

		//Is Setted to true by default !
		var notFound = true;

		for(var i = 0 ; i < items.length ; i++)
		{
			if(items[i]._id == item._id)
			{
				notFound = false;
				items[i]._qty++;
			}
		}
		if(notFound)
		{
			item._qty = 1;
			items.push(item);
		}
		localStorageService.cookie.set('basket', items);
	}

	function remove(item) {
		var array = localStorageService.cookie.get('basket');
		var i = 0;
		while(i<array.length)
		{
			if(array[i++]._id == item._id)
			{
				array.splice(i,1);
			}
		}
	}

	function get() 
	{
		return localStorageService.cookie.get('basket');
	}

	function clear() 
	{
		return localStorageService.cookie.remove('basket');
	}
	
	function init()
	{
		console.log("Initializing the basket cookie ...");
		Array.prototype.addItem = function(item)
		{
			this.push(item);
			return this;
		};
		if(localStorageService.cookie.get('basket') == null)
		{
			localStorageService.cookie.set('basket', new Array());
			console.log("Initialized, Empty Array !");
		}
		else
		{
			console.log("The basket cookie is already setted !");
		}
	}
}

function FirstCtrl($scope, BasketService, ItemsService) {
	BasketService.init();
	$scope.items = ItemsService.get();
	$scope.basket = BasketService.get();
	$scope.hello = "Hello, World!";

	$scope.clearBasket = function() {
		BasketService.clear();
		$scope.basket = [];
	};

	$scope.addToBasket = function(item) {
		BasketService.add(item);
		$scope.basket = BasketService.get();
	};
	
	//{name : 'MacBook Pro', price: '$1250'}
	//{name : 'HP Laser Jet', price: '$140'}
}

