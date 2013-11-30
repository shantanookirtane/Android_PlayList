var data = {
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


$(document).on('pageinit', '[data-role="page"]', function(){
	// alert('A page with an id of "aboutPage" was just pageinit by jQuery Mobile!');
	localStorage.setObj('favouritePlayList',[]);
	localStorage.setObj('myPlayList',[]);
	populatePlayList();
	populatefavouritePlayList();
	populateMyPlayList();
//	$('#contentVideosId').jScrollPane();
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from the list
		// populate them in Li
		// refresh the list
	});
	
	// My PlayList
	$('ul#myPlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
	});
	
	// Favourates
	$('ul#favouritePlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
	});
	
	$('ul#video-list').on('click', 'a.starButton', function(evt){
		$this = $(this);
		$this.toggleClass('starSelected');
		// check if the class there then remove that from local storage
		// else add the class and add that entry in localstorage
		// change the tooltiptext
	});
	
	$('ul#video-list').on('click', 'a.addButton', function(evt){
		$this = $(this);
		$this.toggleClass('plusAdded');
		// check if the class there then remove that from local storage
		// else add the class and add that entry in localstorage
		// change the tooltiptext
	});
	
});

$(document).on('pagebeforeshow', '[data-role="page"]', function(){
//	$('#video-list').jScrollPane();
});


$(document).ready(function () {
	// resize videos
	// resizeVideos();
	$('div.video-wrapper').jScrollPane({
		verticalDragMinHeight: 20,
		verticalDragMaxHeight: 40
	});
	
	//$("ul#video-list").listview("refresh");
});


function populatePlayList() {
	// Ajax call to get the playList
	// Call another function to do the business logic on the result
	var videoListMap = buildVideoListDS(data);
	console.log(" videoListMap :: "+videoListMap);
	// This function will return list of li or a single li which will say no data found
	//var playListDiv = $('div#playListDiv');
	localStorage.setObj('videoListService', videoListMap); // for objects to store in local storage you have to stringify
	// refer http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
	var localStorageVideoListMap = localStorage.getObj('videoListService'); // and while getting parse it
	var $playListUl = $('ul#playListUl');
	$.each(localStorageVideoListMap, function (key, value) {
	    //alert("key "+key+" value "+value);
		$playListUl.append('<li class="liElement"><a href="alias1.html">' + key + '(' + value + ')</a></li>');
	    // .append('<li class="liElement"><a href="alias1.html">' + key + '(' + value + ')</a></li>');
	});
	
	
	/*
	$playListUl.append('<li><a href="#">Dora(5)</a></li>'+
			'<li><a href="#">Micky Mouse(2)</a></li>'+
			'<li><a href="#">Barbeey(7)</a></li>'+
			'<li><a href="#">Poppey(3)</a></li>');*/
	// Always call this to set the design to added elements
	$playListUl.listview("refresh");
	
}

function populatefavouritePlayList() {
	// load the playlist from localstorage
	var favouritePlayList = localStorage.getObj('favouritePlayList');
	var $favouritePlayListUl = $('ul#favouritePlayListUl');
	if (favouritePlayList.length === 0) {
		$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
		$favouritePlayListUl.listview("refresh");
		$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
		//$favouritePlayListUl.find('li.ui-first-child').attr("data-collapsed-icon","none");
		//$favouritePlayListUl.find('li.ui-first-child').attr("data-icon","false");
		// data-collapsed-icon="none" data-icon="false"
	} else {
		//$.each(staredPlayList, function(i, playItem){
		$favouritePlayListUl.append('<li><a href="#">'+favouritePlayList[0]+'</a></li>');
		// Always call referesh after adding elements dynamically
		$favouritePlayListUl.listview("refresh");
//	});	
	}
}


function populateMyPlayList() {
	// load the playlist from localstorage
	var myPlayList = localStorage.getObj('myPlayList');
	var $myPlayListUl = $('ul#myPlayListUl');
	if (myPlayList.length === 0) {
		$myPlayListUl.append('<li><a href="#">No items found</a></li>');
		$myPlayListUl.listview("refresh");
		// removes the icon
		$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
		//attr("data-collapsed-icon","none");
	//	$myPlayListUl.find('li.ui-first-child').attr("data-icon","false");
	} else {
		//$.each(staredPlayList, function(i, playItem){
		$myPlayListUl.append('<li><a href="#">'+myPlayList[0]+'</a></li>');
		// Always call referesh after adding elements dynamically
		$myPlayListUl.listview("refresh");
//	});	
	}	
}


// Will get called after Ajax call
function buildVideoListDS(data) {

    var dataList = data.menu;
  //   alert("I am here");
    var videoListMap = {};
    //var html = "<ul id='ulList'></ul>";
    //$('div#content').append('<BR><BR><div id="dataDiv"></div>').append(html);
    $.each(dataList, function (i, dataMap) {
        var aliases = dataMap.alsoknownas;
        $.each(aliases, function (i, alias) {
            if (videoListMap[alias]) {
                var value = videoListMap[alias] + 1;
                videoListMap[alias] = value;
            } else {
            	videoListMap[alias] = 1;
            }
        });
    });
    return videoListMap;
//alert("my map" + JSON.stringify(myMap));
   /* $.each(myMap, function (key, value) {
        //alert("key "+key+" value "+value);
        $('div#content').find('ul#ulList')
.append('<li class="liElement"><a href="alias1.html">' + key + '(' + value + ')</a></li>');
    });*/
    
   //  alert("div : "+ $('div#dataDiv').html);
}


Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


function resizeVideos() {
// Find all YouTube videos
var $allVideos = $("iframe"),
 
// The element that is fluid width
$fluidEl = $("body");
 
// Figure out and save aspect ratio for each video
$allVideos.each(function() {
  $(this).data('aspectRatio', this.height / this.width)
     // and remove the hard coded width/height
    .removeAttr('height')
    .removeAttr('width');
});
 
// When the window is resized
$(window).resize(function() {
  var newWidth = $fluidEl.width();
  // Resize all videos according to their own aspect ratio
  $allVideos.each(function() {
    var $el = $(this);
    $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
  });
// Kick off one resize to fix all videos on page load
}).resize();
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



