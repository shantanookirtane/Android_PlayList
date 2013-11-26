/*$(document).delegate("#demo-page", "pageinit", function() {
  alert('A page with an id of "aboutPage" was just pageinit by jQuery Mobile!');
  $('#firstList').bind('click', function () {
	    alert('clicked');
	    $('div#firstList').find("ul:jqmData(role='listview')").append('<li><a href="#">Road</a></li>'+
                			'<li><a href="#">ATB</a></li>'+
                			'<li><a href="#">Fixed Gear</a></li>'+
                			'<li><a href="#">Cruiser</a></li>');
//	  $('[data-role=page]').trigger('pagecreate');
  $( "#testUL" ).listview("refresh");
	}).bind('collapse', function () {
	    alert('Collapsed');
	});
  
    
});*/


$(document).on('pageinit', '[data-role="page"]', function(){
	// alert('A page with an id of "aboutPage" was just pageinit by jQuery Mobile!');
	localStorage.setItem('staredPlayList','Dora(5)');
	populatePlayList();
	populateStaredPlayList();
//	$('#contentVideosId').jScrollPane();
	$('ul#playListUl').on('click', 'li', function(evt){
		alert("li item clicked");
	});
});

$(document).on('pagebeforeshow', '[data-role="page"]', function(){
//	$('#video-list').jScrollPane();
});


$(document).ready(function () {
	$('div.video-wrapper').jScrollPane({
		verticalDragMinHeight: 20,
		verticalDragMaxHeight: 20
	});
});


function populatePlayList() {
	// Ajax call to get the playList
	// Call another function to do the business logic on the result
	// This function will return list of li or a single li which will say no data found
	//var playListDiv = $('div#playListDiv');
	var $playListUl = $('ul#playListUl');
	$playListUl.append('<li><a href="#">Dora(5)</a></li>'+
			'<li><a href="#">Micky Mouse(2)</a></li>'+
			'<li><a href="#">Barbeey(7)</a></li>'+
			'<li><a href="#">Poppey(3)</a></li>');
	// Always call this to set the design to added elements
	$playListUl.listview("refresh");
	
}

function populateStaredPlayList() {
	// load the playlist from localstorage
	var staredPlayList = localStorage.getItem('staredPlayList');
	var $starPlayListUl = $('ul#staredPlayListUl');
	//$.each(staredPlayList, function(i, playItem){
		$starPlayListUl.append('<li><a href="#">'+staredPlayList+'</a></li>');
//	});
	// Always call this to set the design to added elements
	$starPlayListUl.listview("refresh");
}


// $(document).delegate("#demo-page", "pageinit", function() {



/*var data = {
        menu: [{
            id: '0',
            name: 'name1',
            alsoknownas: ['alias1',
                'alias3']
        }, {
            id: '1',
            name: 'name2',
            alsoknownas: ['alias3', 'alias1']
        }, {
            id: '2',
            name: 'name3',
            alsoknownas: ['alias1', 'alias2']
        }]
    };


         $(document).ready(function () {
             buildJSON(data.menu);
         });


         function buildJSON(data) {

             var dataList = data;
           //   alert("I am here");
             var myMap = {};
             var html = "<ul id='ulList'></ul>";
             $('div#content').append('<BR><BR><div id="dataDiv"></div>').append(html);
             $.each(dataList, function (i, dataMap) {
                 var aiases = dataMap.alsoknownas;
                 $.each(aiases, function (i, alias) {

                     if (myMap[alias]) {
                         var value = myMap[alias] + 1;
                         myMap[alias] = value;
                     } else {
                         myMap[alias] = 1;
                     }
                 });
             });
         //alert("my map" + JSON.stringify(myMap));
             $.each(myMap, function (key, value) {
                 //alert("key "+key+" value "+value);
                 $('div#content').find('ul#ulList')
         .append('<li class="liElement"><a href="alias1.html">' + key + '(' + value + ')</a></li>');
             });
             
            //  alert("div : "+ $('div#dataDiv').html);
         }*/



