/*
 * Data Structure
 * 
 * videoListService is a Map
 * 
 * {key ==> LHS Menu name : Value ==> {occurance : no. of time the videos are present, videoList : List of videoIds w.r.t this key} }
 * 
 * videoIdBasedMap is a Map
 * 
 * {key ==> VideoId : Value : {The whole Map which contains all the information about this video Id}}
 * 
 * Anonymous key : value pair in localstorage
 * {key ==> LHS Menu name : Value : {generated list of Li elements}}
 * 
 * 
 * */


$(document).on('pageinit', '[data-role="page"]', function() {
	// alert('A page with an id of "aboutPage" was just pageinit by jQuery Mobile!');
	localStorage.setObj('favouritePlayList',[]);
	localStorage.setObj('myPlayList',[]);
	populatePlayListMenu();
	populatefavouritePlayListMenu(localStorage.getObj('favouritePlayList'));
	populateMyPlayListMenu(localStorage.getObj('myPlayList'));
	//var data = videosJsonData;
	//console.log("sfdssdfs ::: "+ JSON.stringify(data));
//	$('#contentVideosId').jScrollPane();
	
	// My playlist 
/*	$('div#lhsMenuDiv').bind('click', 'div#myPlayListDiv', function(evt) {
		console.log("myPlayListDiv :: clicked");
		var myPlayListMap = localStorage.getObj('myPlayList');
		var $myPlayListUl = $('ul#myPlayListUl');
		$myPlayListUl.html("");
		if (myPlayListMap) {
			var videoIdList = _.keys(myPlayListMap);
			if (videoIdList.length === 0) {
				$myPlayListUl.append('<li><a href="#">No items found</a></li>');
				$myPlayListUl.listview("refresh");
				$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
				return true;
			} else {
				$myPlayListUl.append('<li><a href="#">Videos ('+videoIdList.length+') </a></li>');
				$myPlayListUl.listview("refresh");
				return true;
			}
		} else {
			$myPlayListUl.append('<li><a href="#">No items found</a></li>');
			$myPlayListUl.listview("refresh");
			$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
			return true;
		}
	});*/
	
	// Favourite list
	/*$('div#lhsMenuDiv').bind('click', 'div#favouritePlayListDiv', function(evt) {
		console.log("favouritePlayListDiv :: clicked");
		var favouritePlayListMap = localStorage.getObj('favouritePlayList');
		var $favouritePlayListUl = $('ul#favouritePlayListUl');
		$favouritePlayListUl.html("");
		if (favouritePlayListMap) {
			var videoIdList = _.keys(favouritePlayListMap);
			if (videoIdList.length === 0) {
				$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
				$favouritePlayListUl.listview("refresh");
				$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
				return true;
			} else {
				$favouritePlayListUl.append('<li><a href="#">Videos ('+videoIdList.length+') </a></li>');
				$favouritePlayListUl.listview("refresh");
				return true;
			}
		} else {
			$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
			$favouritePlayListUl.listview("refresh");
			$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
			return true;
		}
	});*/
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt) {
		//var current = evt.currentTarget;
		var $li = $(this);
		//console.log(" current target :: "+$(current));
		console.log(" this :: "+$li.attr("data-vmapp-val"));
		// clear the contents
		var $videoContent = $("ul#video-list");
		$videoContent.html("");
		
		// first check if the li element list in localstorage, if yes pull it from there.
		var liElementList = localStorage.getObj($.trim($li.attr("data-vmapp-val")));
		if (liElementList) {
			$videoContent.html(liElementList);
		} else {
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
			
			$videoContent = populateVideoContents(videoIdListVal, videoIdBasedMap, $videoContent);
			
/*			_.each(videoIdListVal, function(element, index, list) {	
				var videoMap = videoIdBasedMap[element];
				var $videoLi = $("<li data-videoId="+videoMap.video_id+">");
				var $videoImg = $("<img>");
				var $infoDiv = $("<div data-role='controlgroup' data-type='vertical'>");
				var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
				var $buttonAnchor = $("<a href='#' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true' class='addButton'>");
				var $buttonAnchor1 = $("<a href='#' data-role='button' data-icon='star' data-iconpos='notext' data-inline='true' class='starButton'>");
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
			});*/
			// store the li list in localstorage
			localStorage.setObj($.trim($li.attr("data-vmapp-val")), $videoContent.html());
		}
		// console.log("video UL :: "+$videoContent.html());
		// refresh the UL
		$videoContent.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('div#headerDiv').find('h1').html("Showing Videos from PlayList");
	});
	
	// My PlayList
	$('ul#myPlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var myPlayList = localStorage.getObj('myPlayList');
		var $videoContainer = $("ul#video-list");
		var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
		$videoContainer.html("");
		$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, $videoContainer);
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('div#headerDiv').find('h1').html("Showing Videos from My PlayList");
	});
	
	// Favourates
	$('ul#favouritePlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		var $videoContainer = $("ul#video-list");
		var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
		$videoContainer.html("");
		$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, $videoContainer);
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('div#headerDiv').find('h1').html("Showing Videos from Favourites");
		
	});
	
	$('ul#video-list').on('click', 'a.starButton', function(evt) {
		$this = $(this);
		$this.toggleClass('starSelected');
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id');
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		if ($this.hasClass('starSelected')) {
			// add the li element in the localstorage
			// and add the element in LHS menu as well
			// change the tooltip text
			$this.attr('title','Added to Favourite.');
			if (favouritePlayList) {
				favouritePlayList.push(videoId);
				// favouritePlayListMap[videoId] = liElement;
			} else {
				favouritePlayList = [];
				favouritePlayList.push(videoId);
			}
		} else {
			// remove the element from localstorage
			// remove from LHS menu
			// change the tooltip text
			$this.attr('title','Add to Favourtie.');
			favouritePlayList = _.omit(favouritePlayList, videoId);
		}
		localStorage.setObj('favouritePlayList', favouritePlayList);
		console.log("favouritePlayList :: ",favouritePlayList);
		
		// Populate the menu
		populatefavouritePlayListMenu(favouritePlayList);
		
	});
	
	$('ul#video-list').on('click', 'a.addButton', function(evt) {
		$this = $(this);
		$this.toggleClass('plusAdded');
		var myPlayList = localStorage.getObj('myPlayList');
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id');
		// var $myPlayListUl = $('ul#myPlayListUl');
		if ($this.hasClass('plusAdded')) {
			// add the li element in the localstorage
			// and add the element in LHS menu as well
			// change the tooltip text
			$this.attr('title','Added to My PlayList');
			if (myPlayList) {
				myPlayList.push(videoId);
				// favouritePlayListMap[videoId] = liElement;
			} else {
				myPlayList = [];
				myPlayList.push(videoId);
			}
		} else {
			// remove the element from localstorage
			// remove from LHS menu
			// change the tooltip text
			$this.attr('title','Add to My PlayList.');
			myPlayList = _.omit(myPlayList, videoId);
		}
		localStorage.setObj('myPlayList', myPlayList);
		console.log("myPlayListMap :: ",myPlayList);
		
		// populate my playlist
		populateMyPlayListMenu(myPlayList);
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


function populateVideoContents(videoIdList, videoIdInfoMap, videoContainer) {
	var $videoContainer = videoContainer;
	_.each(videoIdList, function(element, index, list) {	
		var videoMap = videoIdInfoMap[element];
		var $videoLi = $("<li>");
		$videoLi.attr('data-video-id', trim(videoMap.video_id));
		var $videoImg = $("<img>");
		var $infoDiv = $("<div data-role='controlgroup' data-type='vertical'>");
		var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
		var $buttonAnchor = $("<a href='#' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true' class='addButton' title='Add to my playlist'>");
		var $buttonAnchor1 = $("<a href='#' data-role='button' data-icon='star' data-iconpos='notext' data-inline='true' class='starButton' title='Add to Favourite'>");
		//$buttonAnchor.attr("title","Add to my playlist")
		//$buttonAnchor1.attr("title","Add to Favourite")
		/*var $videoIdDiv = $('<div style="display:none">');
		$videoIdDiv.text(videoMap.video_id);*/
		$buttonDiv.append($buttonAnchor);
		$buttonDiv.append($buttonAnchor1);
		var infoStr = "Title: "+trim(videoMap.title)+"<BR>"+"Total Views: "+trim(videoMap.total_views)+"<BR>"+"Likes: "+trim(videoMap.likes)+" DisLikes: "+trim(videoMap.dislikes);
		infoStr += "<BR>"+"Avg Rating: "+trim(videoMap.avg_rating);
		$infoDiv.html(infoStr);
		$videoImg.attr("src", trim(videoMap.thumbnail));
		$videoLi.append($videoImg).append($infoDiv).append($buttonDiv);
		$videoContainer.append($videoLi);
		infoStr = "";
		console.log("video LI :: "+$videoLi.html());
	});
	return $videoContainer;
	//localStorage.setObj(key, $videoContainer.html());
}



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

function populatefavouritePlayListMenu(favouritePlayList) {
	console.log("favouritePlayListDiv :: clicked");
	// var favouritePlayListMap = localStorage.getObj('favouritePlayList');
	var $favouritePlayListUl = $('ul#favouritePlayListUl');
	$favouritePlayListUl.html("");
	if (favouritePlayList) {
		// var videoIdList = _.keys(favouritePlayListMap);
		if (favouritePlayList.length === 0) {
			$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
			$favouritePlayListUl.listview("refresh");
			$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
			return true;
		} else {
			$favouritePlayListUl.append('<li><a href="#">Videos ('+favouritePlayList.length+') </a></li>');
			$favouritePlayListUl.listview("refresh");
			return true;
		}
	} else {
		$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
		$favouritePlayListUl.listview("refresh");
		$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
		return true;
	}
}


function populateMyPlayListMenu(myPlayList) {
	console.log("myPlayListDiv :: clicked");
	//var myPlayListMap = localStorage.getObj('myPlayList');
	var $myPlayListUl = $('ul#myPlayListUl');
	$myPlayListUl.html("");
	if (myPlayList) {
		//var videoIdList = _.keys(myPlayListMap);
		if (myPlayList.length === 0) {
			$myPlayListUl.append('<li><a href="#">No items found</a></li>');
			$myPlayListUl.listview("refresh");
			$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
			return true;
		} else {
			$myPlayListUl.append('<li><a href="#">Videos ('+myPlayList.length+') </a></li>');
			$myPlayListUl.listview("refresh");
			return true;
		}
	} else {
		$myPlayListUl.append('<li><a href="#">No items found</a></li>');
		$myPlayListUl.listview("refresh");
		$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
		return true;
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

/*function populateFavouritePlayListMenu() {
	console.log("favouritePlayListDiv :: clicked");
	var favouritePlayListMap = localStorage.getObj('favouritePlayList');
	var $favouritePlayListUl = $('ul#favouritePlayListUl');
	$favouritePlayListUl.html("");
	if (favouritePlayListMap) {
		var videoIdList = _.keys(favouritePlayListMap);
		if (videoIdList.length === 0) {
			$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
			$favouritePlayListUl.listview("refresh");
			$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
			return true;
		} else {
			$favouritePlayListUl.append('<li><a href="#">Videos ('+videoIdList.length+') </a></li>');
			$favouritePlayListUl.listview("refresh");
			return true;
		}
	} else {
		$favouritePlayListUl.append('<li><a href="#">No items found</a></li>');
		$favouritePlayListUl.listview("refresh");
		$favouritePlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
		return true;
	}
}

function populateMyPlayListMenu() {
	console.log("myPlayListDiv :: clicked");
	var myPlayListMap = localStorage.getObj('myPlayList');
	var $myPlayListUl = $('ul#myPlayListUl');
	$myPlayListUl.html("");
	if (myPlayListMap) {
		var videoIdList = _.keys(myPlayListMap);
		if (videoIdList.length === 0) {
			$myPlayListUl.append('<li><a href="#">No items found</a></li>');
			$myPlayListUl.listview("refresh");
			$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
			return true;
		} else {
			$myPlayListUl.append('<li><a href="#">Videos ('+videoIdList.length+') </a></li>');
			$myPlayListUl.listview("refresh");
			return true;
		}
	} else {
		$myPlayListUl.append('<li><a href="#">No items found</a></li>');
		$myPlayListUl.listview("refresh");
		$myPlayListUl.find('li.ui-first-child').find('span.ui-icon').remove();
		return true;
	}
}*/


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



