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

// Global Variables

var $videoContainer;
videojs.options.flash.swf = "video-js.swf";

/*$(document).bind('mobileinit', function() {
	// For loading image
	$.mobile.loader.prototype.options.text = "loading";
	$.mobile.loader.prototype.options.textVisible = false;
	$.mobile.loader.prototype.options.theme = "a";
	$.mobile.loader.prototype.options.html = "<div class='custom-spinner'></div>";
});*/
	

$(document).on('pageinit', '[data-role="page"]', function() {
	
	populatePlayListMenu();
	populatefavouritePlayListMenu(localStorage.getObj('favouritePlayList'));
	populateMyPlayListMenu(localStorage.getObj('myPlayList'));
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt) {
		
		/*$.mobile.loading("show", {
            text: "loading videos..",
            textVisible: true
        });*/
		
		/*setTimeout(function () {
	        $.mobile.loading("show", {
	            text: "loading videos..",
	            textVisible: true
	        });
	    }, 5);
	*/	
		//var current = evt.currentTarget;
		var $li = $(this);	
		//console.log(" current target :: "+$(current));
		console.log(" this :: "+$li.attr("data-vmapp-val"));
		// clear the contents
		$videoContainer = $("ul#video-list");
		$videoContainer.html("");
		
		// first check if the li elements list in localstorage, if yes pull it from there.
		var liElementList = localStorage.getObj($.trim($li.attr("data-vmapp-val")));
		
		var myPlayList = localStorage.getObj('myPlayList');
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		
		if (liElementList) {
			$videoContainer.html(liElementList);
			var liElementList = $videoContainer.find('li');
			_.each(liElementList, function(element, index, list) {
				var $liElement = $(element);
				var videoId = $liElement.attr('data-video-id');
				// if the element is in favourite playlist then select it
				if (_.indexOf(favouritePlayList, videoId) != -1) {
					$liElement.find('a.starButton').addClass('starSelected');
					//.remove();
				}
				if (_.indexOf(myPlayList, videoId) != -1) {
					$liElement.find('a.addButton').addClass('plusAdded');
					//.remove();
				}
			});
			//$.mobile.loading('hide');
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
			
			$videoContainer = populateVideoContents(videoIdListVal, videoIdBasedMap, null, favouritePlayList, myPlayList);			
			// store the li list in localstorage
			localStorage.setObj($.trim($li.attr("data-vmapp-val")), $videoContainer.html());
		//	$.mobile.loading('hide');
		}
		// console.log("video UL :: "+$videoContent.html());
		// refresh the UL
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		$videoContainer.listview("refresh");
		
		
		
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('div#headerDiv').find('h1').html("PlayList");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "");
		
		//
		// $.unblockUI();
		
	});
	
	// My PlayList
	$('ul#myPlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var myPlayList = localStorage.getObj('myPlayList');
		$videoContainer = $("ul#video-list");
		var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
		$videoContainer.html("");
		
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		
		$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, "myPlayList", favouritePlayList);
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('div#headerDiv').find('h1').html("My PlayList");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "myPlayList");
	});
	
	// Favourates
	$('ul#favouritePlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		$videoContainer = $("ul#video-list");
		var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
		$videoContainer.html("");
		
		var myPlayList = localStorage.getObj('myPlayList');
		
		$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, "favouritePlayList", null, myPlayList);
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('div#headerDiv').find('h1').html("Favourites");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "favouritePlayList");
	});
	
	$('ul#video-list').on('click', 'a.starButton', function(evt) {
		$this = $(this);
		evt.stopPropagation();
		//$this.toggleClass('starSelected');
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id');
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		if ($this.hasClass('starSelected')) {
			// Dont do anything
		} else {
			
			// add Class
			$this.addClass('starSelected');
			if (favouritePlayList) {
				favouritePlayList.push(videoId);
			} else {
				favouritePlayList = [];
				favouritePlayList.push(videoId);
			}
			//favouritePlayList = _.omit(favouritePlayList, videoId);
		}
		localStorage.setObj('favouritePlayList', favouritePlayList);
		console.log("favouritePlayList :: ",favouritePlayList);
		
		// Populate the menu
		populatefavouritePlayListMenu(favouritePlayList);
		
	});
	
	$('ul#video-list').on('click', 'a.addButton', function(evt) {
		$this = $(this);
		evt.stopPropagation();
	//	$this.toggleClass('plusAdded');
		var myPlayList = localStorage.getObj('myPlayList');
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id');
		// var $myPlayListUl = $('ul#myPlayListUl');
		if ($this.hasClass('plusAdded')) {
			// Do not do anything
		} else {
			// remove the element from localstorage
			// remove from LHS menu
			// change the tooltip text
			//$this.attr('title','Add to My PlayList.');
			//myPlayList = _.omit(myPlayList, videoId);
			$this.addClass('plusAdded');
			if (myPlayList) {
				myPlayList.push(videoId);
				// favouritePlayListMap[videoId] = liElement;
			} else {
				myPlayList = [];
				myPlayList.push(videoId);
			}
		}
		localStorage.setObj('myPlayList', myPlayList);
		console.log("myPlayListMap :: ",myPlayList);
		
		// populate my playlist
		populateMyPlayListMenu(myPlayList);
	});
	
	
	$('ul#video-list').on('click', 'a.deleteButton', function(evt) {
		$this = $(this);
		evt.stopPropagation();
		var $liElement = $this.closest('li');
		console.log("delete button clicked ::");
		var playListName = $('div#headerDiv').find('h1').attr("data-playlist-name");
		if (playListName === "myPlayList") {
			var myPlayList = localStorage.getObj('myPlayList')
			myPlayList = _.without(myPlayList, $liElement.attr('data-video-id'));
			localStorage.setObj('myPlayList', myPlayList);
			$liElement.remove();
			console.log("Delete :: myPlayList", myPlayList);
			// render the menu again
			populateMyPlayListMenu(myPlayList);
		} else if (playListName === "favouritePlayList") {
			var favouritePlayList = localStorage.getObj('favouritePlayList');
			favouritePlayList = _.without(favouritePlayList, $liElement.attr('data-video-id'));
			localStorage.setObj('favouritePlayList', favouritePlayList);
			$liElement.remove();
			console.log("Delete :: favouritePlayList", favouritePlayList);
			// Populate the menu
			populatefavouritePlayListMenu(favouritePlayList);
		}
		return;
	});
	
	
	$('ul#video-list').on('click', 'li', function(evt) {
		$this = $(this);
		var videoId = $this.attr('data-video-id');
		var iFrameEle = $('div#contentVideosId').find('div.video-container-div').find('iframe');
		iFrameEle.attr('src', 'http://www.youtube.com/embed/'+videoId);
		// iframeDiv.append(iFrameEle);
		return;
	});
	
});


function showLoader() {
	$.mobile.loading("show", {
        text: "loading videos..",
        textVisible: true
    });
	return this;
}

function hideLoader() {
	$.mobile.loading('hide');
	
}

$(document).on('pagebeforeshow', '[data-role="page"]', function(){
  //$('#video-list').jScrollPane();
});


$(document).ready(function () {
	// resize videos
	// resizeVideos();
	// $('div.video-wrapper').jScrollPane();
	
	//$("ul#video-list").listview("refresh");
});


function populateVideoContents(videoIdList, videoIdInfoMap, playListName, favouritePlayList, myPlayList) {
	// var $videoContainer = videoContainer;
	var videoList; 
		if (playListName === "myPlayList" || playListName === "favouritePlayList") {
			videoList = videoIdList.reverse();
		} else {
			videoList = videoIdList;
		}
		
	_.each(videoIdList, function(element, index, list) {	
		var videoMap = videoIdInfoMap[element];
		var $videoLi = $("<li>");
		var videoId = trim(videoMap.video_id);
		$videoLi.attr('data-video-id', videoId);
		/*var $videoEle = $("<video>");*/
		/*var iframeDiv = $("<div class='video-container-div' style='display:block'>");
		var iFrameEle = $('<iframe width="800" height="450" frameborder="0">');
		iFrameEle.attr('src', 'http://www.youtube.com/embed/'+videoId);
		iframeDiv.append(iFrameEle);*/
		/*$videoEle.attr('id', videoId);
		$videoEle.attr('controls', "true");
		$videoEle.attr('autoplay', "true");
		$videoEle.attr('preload', "auto");
		$videoEle.attr('width', "640");
		$videoEle.attr('height', "264");
		$videoEle.attr('poster', trim(videoMap.thumbnail));
		$videoEle.attr('class', "video-js vjs-default-skin vjs-big-play-centered");*/
		var $videoImg = $("<img>");
		var $infoDiv = $("<div data-role='controlgroup' data-type='vertical'>");
		var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
		var $buttonAnchor = $("<a href='#' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true' class='addButton' title='Add to my playlist'>");
		var $buttonAnchor1 = $("<a href='#' data-role='button' data-icon='star' data-iconpos='notext' data-inline='true' class='starButton' title='Add to Favourite'>");
		var $buttonDelete = $("<a href='#' data-role='button' data-icon='delete' data-iconpos='notext' data-inline='true' class='deleteButton'>");
		
		// If its normal playlist then do this
		if (!playListName) {
			// if the element is in favourite playlist then select it
			if (_.indexOf(favouritePlayList, videoId) != -1) {
				$buttonAnchor1.addClass('starSelected');
				//.remove();
			}
			if (_.indexOf(myPlayList, videoId) != -1) {
				$buttonAnchor.addClass('plusAdded');
				//.remove();
			}
		}
		
		if (playListName === "myPlayList") {
			if (_.indexOf(favouritePlayList, videoId) != -1) {
				$buttonAnchor1.addClass('starSelected');
				//.remove();
			}
		}
		
		if (playListName === "favouritePlayList") {
			if (_.indexOf(myPlayList, videoId) != -1) {
				$buttonAnchor.addClass('plusAdded');
				//.remove();
			}
		}
		
		if (playListName != "myPlayList") {
			$buttonDiv.append($buttonAnchor);
		}
		
		if (playListName != "favouritePlayList") {
			$buttonDiv.append($buttonAnchor1);
		}
		// $buttonDiv.append($buttonAnchor1);
		
		//$buttonDiv.append($buttonAnchor);
		// $buttonDiv.append($buttonAnchor1);
		
		if (playListName === "myPlayList" || playListName === "favouritePlayList") {
			//$buttonAnchor1.attr("data-icon", "delete");
			$buttonDiv.append($buttonDelete);
		}
		
		var infoStr = "Title: "+trim(videoMap.title)+"<BR>"+"Total Views: "+trim(videoMap.total_views)+"<BR>"+"Likes: "+trim(videoMap.likes)+" DisLikes: "+trim(videoMap.dislikes);
		infoStr += "<BR>"+"Avg Rating: "+trim(videoMap.avg_rating);
		$infoDiv.html(infoStr);
		$videoImg.attr("src", trim(videoMap.thumbnail));
		$videoLi.append($videoImg).append($infoDiv).append($buttonDiv);
		$videoContainer.append($videoLi);
		/*var youTubeURL = "https://www.youtube.com/watch?v="+videoId;
		videojs(videoId, { 
		      "techOrder": ["youtube"],
		      "src": youTubeURL},
		    function() {
		     // do nothing
		});*/
		// $videoEle.attr('data-setup', "{'techOrder':['youtube'], 'src':"+youTubeURL+"}");
		infoStr = "";
		// console.log("video LI :: "+$videoLi.html());
	});
	return $videoContainer;
	//localStorage.setObj(key, $videoContainer.html());
}



function populatePlayListMenu() {
	
	var videoListMap;
	// Call another function to do the business logic on the result
	if (!localStorage.getObj('videoListService')) {
		console.log(" Not found in local storage :: calling build JSON function :: ");
		videoListMap = buildVideoListDS(videosJsonData);
		localStorage.setObj('videoListService', videoListMap);
		console.log(" Setting object in localstorage :: ");
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
			localStorage.setObj("favouritePlayListMenu", '<li><a href="#">Videos ('+favouritePlayList.length+') </a></li>');
			$favouritePlayListUl.append(localStorage.getObj("favouritePlayListMenu"));
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
			localStorage.setObj("myPlayListMenu", '<li><a href="#">Videos ('+myPlayList.length+') </a></li>');
			$myPlayListUl.append(localStorage.getObj("myPlayListMenu"));
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
    
   // console.log(" new data structure :: " + JSON.stringify(videoListMap));
   // console.log(" new DS For Main Content :: " + JSON.stringify(videoIdBasedMap));
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



