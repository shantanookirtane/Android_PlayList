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


$(document).on('pageinit', '[data-role="page"]', function() {
	// alert('A page with an id of "aboutPage" was just pageinit by jQuery Mobile!');
	localStorage.setObj('favouritePlayList',[]);
	localStorage.setObj('myPlayList',[]);
	populatePlayListMenu();
	populatefavouritePlayListMenu();
	populateMyPlayListMenu();
	//var data = videosJsonData;
	//console.log("sfdssdfs ::: "+ JSON.stringify(data));
//	$('#contentVideosId').jScrollPane();
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt) {
		//var current = evt.currentTarget;
		var $li = $(this);
		//console.log(" current target :: "+$(current));
		console.log(" this :: "+$li.attr("data-vmapp-val"));
		// clear the contents
		var $videoContent = $("ul#video-list");
		$videoContent.html("");
		
		/*var $videoLi = $("<li>");
		var videoImg = $("<img>");
		var $infoDiv = $("<div data-role='controlgroup' data-type='vertical'>");
		var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
		var $buttonAnchor = $("<a href='#' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true'>");*/
		var videoListMap = localStorage.getObj('videoListService');
		var videoIdListVal = videoListMap[$.trim($li.attr("data-vmapp-val"))].videoIdList;
		/*
		 * <li>
		 * 		<img>
		 * 		<div1><info>
		 * 		<div2><a>
		 * </li>
		 * "avg_rating": " 3.21",
          "likes": " 480",
          "dislikes": " 389",
          "total_views": "348531",
          "title": "Go Diego Go! English Episode for Children - 2013 (Dora the Explorer Friend)",
          "thumbnail": "http://i.ytimg.com/vi/9-4ki20O6DI/default.jpg"
		 * */
		var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
		_.each(videoIdListVal, function(element, index, list) {
			var $videoLi = $("<li>");
			var $videoImg = $("<img>");
			var $infoDiv = $("<div data-role='controlgroup' data-type='vertical'>");
			var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
			var $buttonAnchor = $("<a href='#' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true'>");
			var $buttonAnchor1 = $("<a href='#' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true'>");
			var videoMap = videoIdBasedMap[element];
			$buttonDiv.append($buttonAnchor.text("Add to my playlist"));
			$buttonDiv.append($buttonAnchor1.text("Add to Favourite"));
			var infoStr = "Title: "+trim(videoMap.title)+"<BR>"+"Total Views: "+trim(videoMap.total_views)+"<BR>"+"Likes: "+trim(videoMap.likes)+" DisLikes: "+trim(videoMap.dislikes);
			infoStr += "<BR>"+"Avg Rating: "+trim(videoMap.avg_rating);
			$infoDiv.html(infoStr);
			$videoImg.attr("src", trim(videoMap.thumbnail));
			$videoLi.append($videoImg).append($infoDiv).append($buttonDiv);
			$videoContent.append($videoLi);
			infoStr = "";
			console.log("video LI :: "+$videoLi.html());
		});
		console.log("video UL :: "+$videoContent.html());
		$videoContent.listview("refresh");
		$("#demo-page").trigger("create");
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
	
	/*$.getJSON( "js/videos.js", function( json ) {
		console.log( "JSON Data: " + JSON.stringify(json));
		$("ul#video-list").html("");
		$("ul#video-list").html(json);
		
	});*/
	
   /* $.ajax({
        url: "js/videos.js",
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });*/
	
	
});

$(document).on('pagebeforeshow', '[data-role="page"]', function(){
//	$('#video-list').jScrollPane();
});


$(document).ready(function () {
	// resize videos
	// resizeVideos();
/*	$('div.video-wrapper').jScrollPane({
		verticalDragMinHeight: 20,
		verticalDragMaxHeight: 40
	});*/
	
	//$("ul#video-list").listview("refresh");
});


function populatePlayListMenu() {
	// Ajax call to get the playList
	// No need to do ajax as the json is coming from local json file
	var videoListMap;
	// Call another function to do the business logic on the result
	if (!localStorage.getObj('videoListService')) {
		console.log(" Not found in local storage :: calling build JSON function :: ");
		videoListMap = buildVideoListDS(videosJsonData);
		localStorage.setObj('videoListService', videoListMap);
		console.log(" Setting object in localstorage :: "+videoListMap);
	} 
	// get it from localstorage
	videoListMap = localStorage.getObj('videoListService');
	// for objects to store in local storage you have to stringify
	// refer http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
	var $playListUl = $('ul#playListUl');
	$.each(videoListMap, function (key, value) {
		$playListUl.append('<li class="liElement" data-vmapp-val="'+key+'"><a href="#">' + key + '(' + value.occurance + ')</a></li>'); 
	});
	// Always call this to set the design to added elements
	$playListUl.listview("refresh");
	
}

function populatefavouritePlayListMenu() {
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


function populateMyPlayListMenu() {
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
function buildVideoListDS(videosJsonData) {

   
  //   alert("I am here");
    var videoListMap = {};
    //var videoDetails = {};
   //  var videoIdList = [];
    //var html = "<ul id='ulList'></ul>";
    //$('div#content').append('<BR><BR><div id="dataDiv"></div>').append(html);
    var videoIdBasedMap = {};
    // create 2 DS one for LHS menu and one for showing actual contents
    $.each(videosJsonData, function (i, videoMap) {
        var categories = videoMap.aliases;
        // create this DS for main content
        videoIdBasedMap[$.trim(videoMap["video_id"])] = videoMap;
        $.each(categories, function (i, category) {
            if (videoListMap[category]) {
                var value = videoListMap[category]["occurance"] + 1;
                // videoDetails["occurance"] = value;
                videoListMap[category]["occurance"] = value;
                var videoIdList = videoListMap[category]["videoIdList"];
                videoIdList.push($.trim(videoMap["video_id"]));
                videoListMap[category]["videoIdList"] = videoIdList;
                // videoListMap[category] = videoDetails;
            } else {
            	 var videoDetails = {};
            	 var videoIdList = [];
            	 // videoListMap[category] = 1;
            	 videoDetails["occurance"] = 1;
            	 videoIdList.push($.trim(videoMap["video_id"]));
                 videoDetails["videoIdList"] = videoIdList;
                 videoListMap[category] = videoDetails;
            }
        });
    });
    // set the video ID based Map
    localStorage.setObj("videoIdBasedMap", videoIdBasedMap);
    
    console.log(" new data structure :: " + JSON.stringify(videoListMap));
    console.log(" new DS For Main Content :: " + JSON.stringify(videoIdBasedMap));
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
    return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getObj = function(key) {
	if (this.getItem(key) != "undefined") {
		return JSON.parse(this.getItem(key));
	} else {
		return null;
	}
}

function trim(str) {
	return $.trim(str);
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



