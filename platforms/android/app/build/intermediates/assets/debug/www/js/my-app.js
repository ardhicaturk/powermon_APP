// Initialize app
var myApp = new Framework7({
    modalTitle: 'Power Monitor',
	swipePanel: 'left'
});
var login = false;
var namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var host = "https://andidb.000webhostapp.com";
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});
 var selectedIndexDate = 0;
function getCurrentSSID() {
	var WifiManager = cordova.plugins.WifiManager;
	WifiManager.isWifiEnabled(function(err, info){
		if(info){
			WifiManager.getConnectionInfo(function(err, c){
				myApp.alert("Terhubung ke " + c.SSID + " - " + c.BSSID + " - " + c.networkId);
				WifiManager.getConfiguredNetworks(function(err, wifiConfigurations){
						var a =  JSON.stringify(wifiConfigurations);
						console.log(a);
					})
			});
		} else {
			myApp.confirm('Tidak terhubung ke jaringan, nyalakan WiFi?', function() {
				WifiManager.setWifiEnabled(true, function (err, success) {
				  if(err){
					myApp.alert("Gagal mengaktifkan WiFi");
					
				  }
				})
			},
			function() {
			});
		}
		
	});
	/*
	cordovaNetworkManager.getCurrentSSID(function(s){
		myApp.alert(s);
	}, function(e){});
	

	cordovaNetworkManager.androidConnectNetwork("BATCAVE", "", function(success){
		myApp.alert(success);
	}, function(err){
		myApp.alert(err);
	});
*/
}
// Handle Cordova Device Ready Event
var datafile = new Array();
var har= new Array();
var bul= new Array();
var thn= new Array();
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	//getCurrentSSID();
    document.addEventListener('backbutton', onBackKeyDown, false);
	var WifiManager = cordova.plugins.WifiManager;
	WifiManager.onscanresultsavailable = function () {
		//myApp.alert("Scan Finish");
		/*
		WifiManager.getScanResults(function(err, scanResults){
			//var a =  JSON.stringify(scanResults);
			var results = scanResults;
			var popupHTML = '<div class="popup">'+
                    '<div class="content-block">'+
                     results+
                      '<p><a href="#" class="close-popup">Close me</a></p>'+
                    '</div>'+
                  '</div>';
			myApp.popup(popupHTML);
		});
		*/
	}
	cordovaHTTP.get(host+'/read.php', {},{}, 
	function(response){
		if(response.status == 200){
			console.log(response.data);
			var myObj = JSON.parse(response.data);
			
			for (var i = 0; i < myObj.length; i++){
				datafile.push(myObj[i]);
				//var buf = datafile[i].split("-");
				har.push(myObj[i].substring(1,3));
				bul.push(namaBulan[parseInt(myObj[i].substring(3,5))-1]);
				thn.push(myObj[i].substring(5,9));
				console.log(myObj[i]);
			}
			console.log(har);
			console.log(bul);
			console.log(thn);
			
		}
	}, function(response) {
		myApp.alert(response.error);
	});

});
function datalogUpdate(){
		myApp.showIndicator();
		var getDataV1 = [];
		var getDataV2 = [];
		var getDataA1 = [];
		var getDataA2 = [];
		
		var getDaya1 = [];
		var getDaya2 = [];
		$$("#bodyDatalog").html('');
		console.log(datafile);
		cordovaHTTP.get(host+'/read.php?date='+datafile[selectedIndexDate], {},{}, 
		function(response) {
			if(response.status == 200){
				var myObj = JSON.parse(response.data);
				console.log(myObj);
				for(var i =0; i<myObj.length;i++){
					getDataV1.push(myObj[i].v1);
					getDataV2.push(myObj[i].v2);
					getDataA1.push(myObj[i].a1);
					getDataA2.push(myObj[i].a2);
				}
				for(var i = 0; i < getDataV1.length ; i++){
					getDaya1[i] = getDataV1[i] * getDataA1[i];
					getDaya2[i] = getDataV2[i] * getDataA2[i];
					
					var node = document.createElement("tr");
					
					var node2 = document.createElement("td");
					node2.className = 'label-cell';
					var textnode = document.createTextNode("01.00");
					node2.appendChild(textnode);
					node.appendChild(node2);
					
					var node2 = document.createElement("td");
					node2.className = 'numeric-cell';
					var textnode = document.createTextNode(getDataV1[i]);
					node2.appendChild(textnode);
					node.appendChild(node2);
					
					var node2 = document.createElement("td");
					node2.className = 'numeric-cell';
					var textnode = document.createTextNode(getDataV2[i]);
					node2.appendChild(textnode);
					node.appendChild(node2);
					
					var node2 = document.createElement("td");
					node2.className = 'numeric-cell';
					var textnode = document.createTextNode(getDataA1[i]);
					node2.appendChild(textnode);
					node.appendChild(node2);
					
					var node2 = document.createElement("td");
					node2.className = 'numeric-cell';
					var textnode = document.createTextNode(getDataA2[i]);
					node2.appendChild(textnode);
					node.appendChild(node2);
					
					var node2 = document.createElement("td");
					node2.className = 'numeric-cell';
					var textnode = document.createTextNode(getDaya1[i].toFixed(2));
					node2.appendChild(textnode);
					node.appendChild(node2);
					
					var node2 = document.createElement("td");
					node2.className = 'numeric-cell';
					var textnode = document.createTextNode(getDaya2[i].toFixed(2));
					node2.appendChild(textnode);
					node.appendChild(node2);
					document.getElementById("bodyDatalog").appendChild(node);
				}
				myApp.hideIndicator();
			}
			
		}, function(response) {
			myApp.hideIndicator();
			myApp.alert(response.error);
		});
}
function chartUpdateF(){
		myApp.showIndicator();
		$$("#chField").html('');
		$$("#chField").append("<canvas id=\"myChart1\" width=\"80vh\" height=\"60vh\"></canvas>");
		$$("#chField").append("<canvas id=\"myChart2\" width=\"80vh\" height=\"60vh\"></canvas>");
		var myChart;
		var myChart2;
		var getDataV1 = [];
		var getDataV2 = [];
		var getDataA1 = [];
		var getDataA2 = [];
		
		var getDaya1 = [];
		var getDaya2 = [];
		
		var ctx = document.getElementById("myChart1");
		var ctx2 = document.getElementById("myChart2");
		cordovaHTTP.get(host+'/read.php?date='+datafile[selectedIndexDate], {}, {}, 
		function(response) {
			if (response.status == 200) {
				var myObj = JSON.parse(response.data);
				for(var i =0; i<myObj.length;i++){
					getDataV1.push(myObj[i].v1);
					getDataV2.push(myObj[i].v2);
					getDataA1.push(myObj[i].a1);
					getDataA2.push(myObj[i].a2);
				}
				for(var i = 0; i < getDataV1.length ; i++){
					getDaya1[i] = getDataV1[i] * getDataA1[i];
					getDaya2[i] = getDataV2[i] * getDataA2[i];
				}
				vmyChart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: ["00.00", "01.00", "02.00", "03.00", "04.00", "05.00", "06.00", "07.00", "08.00", "09.00"
						, "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00", "19.00", "20.00"
						, "21.00", "22.00", "23.00"],
						datasets: [{
							label: 'Watt',
							data: getDaya1,
							fill: false,
							backgroundColor: 'rgb(255, 99, 132)',
							borderColor:'rgb(255, 99, 132)'
						}]
					},
					options: {
						responsive: true,
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						},
						title: {
						display: true,
						text: 'Daya 1'
						},
						tooltips: {
							mode: 'index',
							intersect: false,
						},
						hover: {
							mode: 'nearest',
							intersect: true
						},
						legend: {
							display:false
						}
					}
				});
				myChart2 = new Chart(ctx2, {
					type: 'line',
					data: {
						labels: ["00.00", "01.00", "02.00", "03.00", "04.00", "05.00", "06.00", "07.00", "08.00", "09.00"
						, "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00", "19.00", "20.00"
						, "21.00", "22.00", "23.00"],
						datasets: [{
							label: 'Watt',
							data: getDaya2,
							fill: false,
							backgroundColor: 'rgb(54, 162, 235)',
							borderColor:'rgb(54, 162, 235)'
						}]
					},
					options: {
						responsive: true,
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						},
						tooltips: {
							mode: 'index',
							intersect: false,
						},
						hover: {
							mode: 'nearest',
							intersect: true
						},
						title: {
						display: true,
						text: 'Daya 2'
						},
						legend: {
							display:false
						}
					}
				});
				myApp.hideIndicator();
			}
		}, function(response) {
			myApp.hideIndicator();
			myApp.alert(response.error);
		});
}

$$(document).on('pageInit', function (e) {
    // Get page data from event data
	var page = e.detail.page;
	console.log(e.detail);
    // if (page.name === 'about') {
    //     // Following code will be executed for page with data-page attribute equal to "about"
    //     myApp.alert('Here comes About page');
	// }


// <----------------------- DATALOG ---------------------------------> //	
	if(page.name === 'datalog'){
		
		for(var i = 0; i < bul.length; i++){
			if(i==selectedIndexDate){	
				$$("#datedata").append("<option value=\""+i+"\" selected>"+bul[i]+" "+har[i]+", "+thn[i]+"</option>");
			}else{
				$$("#datedata").append("<option value=\""+i+"\" >"+bul[i]+" "+har[i]+", "+thn[i]+"</option>");
			}
		}
		$$("#datedata").change(function(){
			selectedIndexDate = $$("#datedata").val();
			datalogUpdate();
		});
		datalogUpdate();
	}
	
// <------------------------ CHART --------------------------------- > //
	if(page.name === 'chart' ){
		
		for(var i = 0; i < bul.length; i++){
			if(i == selectedIndexDate){
				$$("#datedata").append("<option value=\""+i+"\">"+bul[i]+" "+har[i]+", "+thn[i]+"</option>");
			}else{
				$$("#datedata").append("<option value=\""+i+"\" >"+bul[i]+" "+har[i]+", "+thn[i]+"</option>");
			}
		}
		
		$$("#datedata").change(function(){
			selectedIndexDate = $$("#datedata").val();
			chartUpdateF();
		});
		chartUpdateF();
	}
    
})
$$(".sign").on('click', function(){
	myApp.showIndicator();
	var username = $$('input[name="username"]').val();
	var password = $$('input[name="password"]').val();
	cordovaHTTP.get(host+'/auth.php?userName='+username+'&password='+password, {},{}, 
		function(response) {
			if(response.status == 200){
				if(response.data == 1){
					myApp.hideIndicator();
					login = true;
					$$(".scL").css('display','none');
					$$(".mL").css('display','block');
				} else {
					myApp.hideIndicator();
					myApp.alert("Username atau Password salah !");
				}
			}
		}, function(response) {
			myApp.hideIndicator();
			myApp.alert(response.error);
		});
	
});


$$("#checkConnection").on('click', function(){
    getCurrentSSID();
	
});
$$("#grid-about").on('click', function(){
    mainView.router.loadPage('about.html');
});
$$("#grid-datalog").on('click', function(){
    mainView.router.loadPage('datalog.html');
});
$$("#grid-graph").on('click', function(){
    mainView.router.loadPage('chart.html');
});
$$("#grid-history").on('click', function(){
    mainView.router.loadPage('history.html');
});
$$("#scanConnection").on('click', function(){
    var WifiManager = cordova.plugins.WifiManager;
	WifiManager.startScan(function(err, sc){
		myApp.alert("Scanning: " + err + sc);
	});
	
});
function onBackKeyDown() {
    var cpage = mainView.activePage;
    var cpagename = cpage.name;
    console.log(cpagename);
	if (($$('.panel-left').hasClass('active')) || ($$('.panel-left').hasClass('active'))) { // #leftpanel and #rightpanel are id of both panels.
        myApp.closePanel();
        return false;
    } else if (($$('.modal-in').length > 0)) {
        myApp.closeModal();
        return false;
    } else if (cpagename == 'index') {
        myApp.confirm('Are you sure you want to exit?', function() {
            navigator.app.exitApp();
        },
        function() {
        });
    } else {
		if(login){
			mainView.router.back();
		}
    }
}