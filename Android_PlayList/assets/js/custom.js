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

var videoplayer = {};


$(document).on('pageinit', '[data-role="page"]', function() {
	
	populatePlayListMenu();
	populatefavouritePlayListMenu(localStorage.getObj('favouritePlayList'));
	populateMyPlayListMenu(localStorage.getObj('myPlayList'));
	videoplayer.maxItems = 10;
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt) {
		var $li = $(this);	
		//console.log(" current target :: "+$(current));
		console.log(" this :: "+$li.attr("data-vmapp-val"));
		// clear the contents
		$videoContainer = $("ul#video-list");
		$videoContainer.html("");
		// first check if the li elements list in localstorage, if yes pull it from there		
		var myPlayList = localStorage.getObj('myPlayList');
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		var videoListMap = localStorage.getObj('videoListService');
		var category = $.trim($li.attr("data-vmapp-val"));
		var videoIdListVal = videoListMap[category].videoIdList;

		// set active category = which ever is clicked
		videoplayer.activeCategory = category;
		var videoListSubSet;
		if (videoIdListVal.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(videoIdListVal, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(videoIdListVal, videoplayer.maxItems);
			// set global object into localstorage
			localStorage.setObj('videoPlayer', videoplayer);	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
			$videoContainer = populateVideoContents(videoListSubSet, videoIdBasedMap, null, favouritePlayList, myPlayList);
			$videoContainer.append("<li class='load-more-data'><a href='#'>Load More Videos</a></li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
			$videoContainer = populateVideoContents(videoIdListVal, videoIdBasedMap, null, favouritePlayList, myPlayList);
		}

		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");

		$videoContainer.prepend("<li class='showVideoList hide'><a href='#'>Show Video List</a></li>");

		$videoContainer.listview("refresh");

		// refresh the control group div
		$("#demo-page").trigger("create");

		$('span.ui-icon-bars').trigger('click');

		$('div#headerDiv').find('h1').html("PlayList");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "");
	});
	
	// My PlayList
	$('ul#myPlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var myPlayList = localStorage.getObj('myPlayList');
		$videoContainer = $("ul#video-list");
		// var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
		$videoContainer.html("");
		
		var favouritePlayList = localStorage.getObj('favouritePlayList');
		
		// set active category = which ever is clicked
		videoplayer.activeCategory = "myPlayList";
		var videoListSubSet;
		if (myPlayList.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(myPlayList, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(myPlayList, videoplayer.maxItems);
			// set global object into localstorage
			localStorage.setObj('videoPlayer', videoplayer);	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
			$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, "myPlayList", favouritePlayList);
			$videoContainer.append("<li class='load-more-data'>Load More Videos</li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
			$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, "myPlayList", favouritePlayList);
		}
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		
		$videoContainer.prepend("<li class='showVideoList hide'><a href='#'>Show Video List</a></li>");
		
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		
		$('span.ui-icon-bars').trigger('click');
		
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
		
		// set active category = which ever is clicked
		videoplayer.activeCategory = "favouritePlayList";
		var videoListSubSet;
		if (favouritePlayList.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(favouritePlayList, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(favouritePlayList, videoplayer.maxItems);
			// set global object into localstorage
			localStorage.setObj('videoPlayer', videoplayer);	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
			$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, "favouritePlayList", null, myPlayList);
			$videoContainer.append("<li class='load-more-data'>Load More Videos</li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
			$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, "favouritePlayList", null, myPlayList);
		}
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		
		$videoContainer.prepend("<li class='showVideoList hide'><a href='#'>Show Video List</a></li>");
		
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		$('span.ui-icon-bars').trigger('click');
		
		$('div#headerDiv').find('h1').html("Favourites");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "favouritePlayList");
	});
	
	$('ul#video-list').on('click', 'a.starButton', function(evt) {
		$this = $(this);
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
		}
		localStorage.setObj('favouritePlayList', favouritePlayList);
		console.log("favouritePlayList :: ",favouritePlayList);
		
		// Populate the menu
		populatefavouritePlayListMenu(favouritePlayList);
		
	});
	
	$('ul#video-list').on('click', 'a.addButton', function(evt) {
		$this = $(this);
		var myPlayList = localStorage.getObj('myPlayList');
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id')
		if ($this.hasClass('plusAdded')) {
			// Do not do anything
		} else {
			// remove the element from localstorage
			// remove from LHS menu
			// change the tooltip text
			$this.addClass('plusAdded');
			if (myPlayList) {
				myPlayList.push(videoId);
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
	
	
	$('ul#video-list').on('click', 'img.thumbnail,span.title', function(evt) {
		console.log("click on image");
		var $this = $(this);
		var videoId = $this.closest('li.videoLiEle').attr('data-video-id');
		var iFrameEle = $('div#contentVideosId').find('div.video-container-div').find('iframe');
		iFrameEle.attr('src', 'http://www.youtube.com/embed/'+videoId);
		// hide the list and show a single list
		$('ul#video-list').find('li').toggleClass('hide');
		$.mobile.silentScroll(0);
		return;
	});
	
	$('ul#video-list').on('click', 'li.showVideoList', function(evt) {
		console.log("showing video List ");
		var $this = $(this);
		$('ul#video-list').find('li').toggleClass('hide');
		return;
	});
	
	
	$loadMore = $('ul#video-list').children('.load-more-data');
		
	$('ul#video-list').on('click', '.load-more-data', function(evt) {
		console.log("Loading more data ");
		videoplayer = localStorage.getObj('videoPlayer');
		var category = videoplayer.activeCategory;
		var videoListSubSet = _.first(videoplayer.category, videoplayer.maxItems);
		videoplayer.category = _.rest(videoplayer.category, videoplayer.maxItems);
		// set global object into localstorage
		localStorage.setObj('videoPlayer', videoplayer);

		if (videoListSubSet) {
			var myPlayList = localStorage.getObj('myPlayList');
    		var favouritePlayList = localStorage.getObj('favouritePlayList');
    		var videoIdBasedMap = localStorage.getObj("videoIdBasedMap");
    		if ($videoContainer) {
    			if (category === "favouritePlayList") {
    				$videoContainer = populateVideoContents(videoListSubSet, videoIdBasedMap, "favouritePlayList", null, myPlayList);
    			} else if (category === "myPlayList") {
    				$videoContainer = populateVideoContents(videoListSubSet, videoIdBasedMap, "myPlayList", favouritePlayList);
    			} else {
    				$videoContainer = populateVideoContents(videoListSubSet, videoIdBasedMap, null, favouritePlayList, myPlayList);	
    			}
    			$videoContainer.find('li.load-more-data').remove();
    			if (videoplayer.category.length > 0) {
    				$videoContainer.append("<li class='load-more-data'><a href='#'>Load More Videos</a></li>");
    			}
    			$videoContainer.listview("refresh");
    			$("#demo-page").trigger("create");
    		} else {
    			
    		}
		}
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
		
	_.each(videoList, function(element, index, list) {	
		var videoMap = videoIdInfoMap[element];
		var $videoLi = $("<li class='videoLiEle' data-theme='c'>");
		var videoId = trim(videoMap.video_id);
		$videoLi.attr('data-video-id', videoId);
		var $videoImg = $("<img class='thumbnail'>");
		var $infoDiv = $("<div data-role='controlgroup' data-type='vertical' class='infoDiv'>");
		var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
		var $buttonAnchor = $("<a href='' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true' class='addButton' title='Add to my playlist'>");
		var $buttonAnchor1 = $("<a href='' data-role='button' data-icon='star' data-iconpos='notext' data-inline='true' class='starButton' title='Add to Favourite'>");
		var $buttonDelete = $("<a href='' data-role='button' data-icon='delete' data-iconpos='notext' data-inline='true' class='deleteButton'>");
		var likeIcon = '<i class="fa fa-thumbs-o-up fa-lg">'+getFormatedDigits(trim(videoMap.likes))+'</i>';
		var disLikesIcon = '<i class="fa fa-thumbs-o-down fa-lg">'+getFormatedDigits(trim(videoMap.dislikes))+'</i>';
		var $titleSpan = $('<span class="title">');
		var $statSpan = $('<span class="stat">');
		var $ratingDiv = $('<div>');
		var $likeDislikeSpan = $('<span class="stat">');
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
		if (playListName === "myPlayList" || playListName === "favouritePlayList") {
			//$buttonAnchor1.attr("data-icon", "delete");
			$buttonDiv.append($buttonDelete);
		}
		
		$titleSpan.text(trim(videoMap.title));
		$statSpan.text(getFormatedDigits(trim(videoMap.total_views))+" Views");
		$likeDislikeSpan.html(likeIcon+disLikesIcon);
		$ratingDiv.raty({score: trim(videoMap.avg_rating)}) //.text("Avg Rating "+trim(videoMap.avg_rating));

		$infoDiv.append($titleSpan).append($statSpan).append($likeDislikeSpan).append($ratingDiv);
		$videoImg.attr("src", trim(videoMap.thumbnail));
		$videoLi.append($videoImg).append($infoDiv).append($buttonDiv);
		$videoContainer.append($videoLi);
		infoStr = "";
	});
	return $videoContainer;
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

    var videoListMap = {};
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
    return videoListMap;

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

function getFormatedDigits(val) { 
    return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
}