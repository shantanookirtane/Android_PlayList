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

/*try{
    //we replace default localStorage with our Android Database one
    window.localStorage = LocalStorage;    
}catch(e){
    //LocalStorage class was not found. be sure to add it to the webview
	alert("LocalStorage ERROR : can't find android class LocalStorage. switching to raw localStorage")		        
}*/


$(document).on('pageinit', '[data-url="welcome-page"]', function() {


	console.log("pageinit : welcome -page");
	$("button#show-video-playlist-app").on("click", function (evt) {
		$.mobile.changePage( $("div[data-url='demo-page']"), "slide", true, true);
		return;
	});

});

$(document).on('pagebeforecreate', '[data-url="demo-page"]', function() {
	console.log("pagebeforecreate event");
	// showLoader();
	if (!getObj(localStorage.getItem('videoListService'))) {
		console.log(" Not found in local storage :: calling build JSON function :: ");
		videoListMap = buildVideoListDS(videosJsonData);
		localStorage.setItem('videoListService', setObj(videoListMap));
		console.log(" Setting object in localstorage :: ");
	}
});




$(document).on('pageinit', '[data-url="demo-page"]', function() {
	console.log("page init event ");
	// hideLoader();
	populatePlayListMenu();
	//populatefavouritePlayListMenu(getObj(localStorage.getItem('favouritePlayList')));
	//populateMyPlayListMenu(getObj(localStorage.getItem('myPlayList')));
	videoplayer.maxItems = 10;
	
	$("div.rhsHomeMenu").on("click", function (evt) {
		$.mobile.changePage( $("div[data-url='welcome-page']"), "slide", true, true);
		return;
	});
	
	$("div.lhsMenu").on("click", function (evt) {
		var $headerDiv = $("div#headerDiv");
		var anchTag = $('<a href="#left-panel">');
		if ($headerDiv.find("a").length === 0) {
			$headerDiv.append(anchTag);	
		}
		$headerDiv.find("a").trigger("click");
		$headerDiv.find("a").remove();
		return;
	});
	
	
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt) {
		var $li = $(this);	
		//console.log(" current target :: "+$(current));
		console.log(" this :: "+$li.attr("data-vmapp-val"));
		// clear the contents
		$videoContainer = $("ul#video-list");
		$videoContainer.html("");
		// first check if the li elements list in localstorage, if yes pull it from there		
		var myPlayList = getObj(localStorage.getItem('myPlayList'));
		var favouritePlayList = getObj(localStorage.getItem('favouritePlayList'));
		var videoListMap = getObj(localStorage.getItem('videoListService'));
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
			localStorage.setItem('videoPlayer', setObj(videoplayer));	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(videoListSubSet, videoIdBasedMap, null, favouritePlayList, myPlayList);
			$videoContainer.append("<li class='load-more-data' data-theme='b'><a href='#'>Load More Videos</a></li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(videoIdListVal, videoIdBasedMap, null, favouritePlayList, myPlayList);
		}

		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");

		$videoContainer.prepend("<li class='showVideoList hide' data-theme='b'><a href='#'>Show Video List</a></li>");

		$videoContainer.listview("refresh");

		// refresh the control group div
		$("#demo-page").trigger("create");

		$('div.lhsMenu').trigger('click');

		$('div#headerDiv').find('h1').html("PlayList");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "");
	});
	
	// My PlayList
	$('ul#myPlayListUl').on('click', 'li', function(evt) {
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var myPlayList = getObj(localStorage.getItem('myPlayList'));
		$videoContainer = $("ul#video-list");
		// var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
		$videoContainer.html("");
		
		var favouritePlayList = getObj(localStorage.getItem('favouritePlayList'));
		
		// set active category = which ever is clicked
		videoplayer.activeCategory = "myPlayList";
		var videoListSubSet;
		if (myPlayList.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(myPlayList, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(myPlayList, videoplayer.maxItems);
			// set global object into localstorage
			localStorage.setItem('videoPlayer', setObj(videoplayer));	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, "myPlayList", favouritePlayList);
			$videoContainer.append("<li class='load-more-data'>Load More Videos</li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, "myPlayList", favouritePlayList);
		}
		
		
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		$videoContainer.prepend("<li class='showVideoList hide'><a href='#'>Show Video List</a></li>");
		
		// add button for play all videos
		$videoContainer.prepend('<button data-theme="c" class="playAllVideos">Play All</button>');
		
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		
		$('div.lhsMenu').trigger('click');
		
		$('div#headerDiv').find('h1').html("My PlayList");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "myPlayList");
	});
	
	// Favourates
	$('ul#favouritePlayListUl').on('click', 'li', function(evt){
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var favouritePlayList = getObj(localStorage.getItem('favouritePlayList'));
		$videoContainer = $("ul#video-list");
		var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
		$videoContainer.html("");
		
		var myPlayList = getObj(localStorage.getItem('myPlayList'));
		
		// set active category = which ever is clicked
		videoplayer.activeCategory = "favouritePlayList";
		var videoListSubSet;
		if (favouritePlayList.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(favouritePlayList, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(favouritePlayList, videoplayer.maxItems);
			// set global object into localstorage
			localStorage.setItem('videoPlayer', setObj(videoplayer));	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, "favouritePlayList", null, myPlayList);
			$videoContainer.append("<li class='load-more-data'>Load More Videos</li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, "favouritePlayList", null, myPlayList);
		}
		$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Video(s)</li>");
		
		$videoContainer.prepend("<li class='showVideoList hide'><a href='#'>Show Video List</a></li>");
		
		$videoContainer.listview("refresh");
		// refresh the control group div
		$("#demo-page").trigger("create");
		//$('span.ui-icon-bars').trigger('click');
		$('div.lhsMenu').trigger('click');
		
		
		$('div#headerDiv').find('h1').html("Favourites");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "favouritePlayList");
	});
	
	$('ul#video-list').on('click', 'button.playAllVideos', function(evt) {
		var $self = $(this);
		console.log("Playing all videos")
		var myPlayList = getObj(localStorage.getItem('myPlayList'));
		var firstV = _.first(myPlayList);
		var playList = "";
		_.each(_.rest(myPlayList, 1), function (videoId, i, list) {
			if(playList == "") {
				playList += videoId;
			} else {
				playList += ","+videoId;
			}
		});
		var iFrameEle = $('div#contentVideosId').find('div.video-container-div').find('iframe');
		iFrameEle.attr('src', 'http://www.youtube.com/embed/'+firstV+'?playlist='+playList);
		$self.prop("value", "Playing All");
		// $self.attr('disabled', true);
		//$('iframe').attr('src','http://www.youtube.com/embed/3PADxcM_Vi8?playlist=FbgsaVD-6u0,QyPRTblP2-4,OyiNc7zNN9c')
		
	});
	
	
	$('ul#video-list').on('click', 'a.starButton', function(evt) {
		$this = $(this);
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id');
		var favouritePlayList = getObj(localStorage.getItem('favouritePlayList'));
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
		localStorage.setItem('favouritePlayList', setObj(favouritePlayList));
		console.log("favouritePlayList :: ",favouritePlayList);
		
		// Populate the menu
		populatefavouritePlayListMenu(favouritePlayList);
		
	});
	
	$('ul#video-list').on('click', 'a.addButton', function(evt) {
		$this = $(this);
		var myPlayList = getObj(localStorage.getItem('myPlayList'));
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
		localStorage.setItem('myPlayList', setObj(myPlayList));
		console.log("myPlayListMap :: ",myPlayList);
		
		// populate my playlist
		populateMyPlayListMenu(myPlayList);
	});
	
	
	$('ul#video-list').on('click', 'a.deleteButton', function(evt) {
		$this = $(this);
		// evt.stopPropagation();
		var $liElement = $this.closest('li');
		console.log("delete button clicked ::");
		var playListName = $('div#headerDiv').find('h1').attr("data-playlist-name");
		if (playListName === "myPlayList") {
			var myPlayList = getObj(localStorage.getItem('myPlayList'));
			myPlayList = _.without(myPlayList, $liElement.attr('data-video-id'));
			localStorage.setItem('myPlayList', setObj(myPlayList));
			$liElement.remove();
			console.log("Delete :: myPlayList", myPlayList);
			// render the menu again
			populateMyPlayListMenu(myPlayList);
		} else if (playListName === "favouritePlayList") {
			var favouritePlayList = getObj(localStorage.getItem('favouritePlayList'));
			favouritePlayList = _.without(favouritePlayList, $liElement.attr('data-video-id'));
			localStorage.setItem('favouritePlayList', setObj(favouritePlayList));
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
		
		// .css("display","none");
		// 
		$.mobile.silentScroll(0);
		$('ul#video-list').find('li').toggleClass('hide');
		//$videoContainer.listview("refresh");
		return;
	});
	
	$('ul#video-list').on('click', 'li.showVideoList', function(evt) {
		console.log("showing video List ");
		var $this = $(this);
		$('ul#video-list').find('li').toggleClass('hide');
		// $videoContainer.listview("refresh");
		return;
	});
	
	
	$loadMore = $('ul#video-list').children('.load-more-data');
		
	$('ul#video-list').on('click', '.load-more-data', function(evt) {
		console.log("Loading more data ");
		videoplayer = getObj(localStorage.getItem('videoPlayer'));
		var category = videoplayer.activeCategory;
		var videoListSubSet = _.first(videoplayer.category, videoplayer.maxItems);
		videoplayer.category = _.rest(videoplayer.category, videoplayer.maxItems);
		// set global object into localstorage
		localStorage.setItem('videoPlayer', setObj(videoplayer));

		if (videoListSubSet) {
			var myPlayList = getObj(localStorage.getItem('myPlayList'));
    		var favouritePlayList = getObj(localStorage.getItem('favouritePlayList'));
    		var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
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
		//var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
		//var $buttonAnchor = $("<a href='' data-role='button' data-icon='plus' data-iconpos='notext' data-inline='true' class='addButton' title='Add to my playlist'>");
		//var $buttonAnchor1 = $("<a href='' data-role='button' data-icon='star' data-iconpos='notext' data-inline='true' class='starButton' title='Add to Favourite'>");
		//var $buttonDelete = $("<a href='' data-role='button' data-icon='delete' data-iconpos='notext' data-inline='true' class='deleteButton'>");
		var likeIcon = '<i class="fa fa-thumbs-o-up fa-lg">'+getFormatedDigits(trim(videoMap.likes))+'</i>';
		var disLikesIcon = '<i class="fa fa-thumbs-o-down fa-lg">'+getFormatedDigits(trim(videoMap.dislikes))+'</i>';
		var $titleSpan = $('<span class="title">');
		var $statSpan = $('<span class="stat">');
		var $ratingDiv = $('<div>');
		var $likeDislikeSpan = $('<span class="stat">');
		// If its normal playlist then do this
/*		if (!playListName) {
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
		}*/
		
		$titleSpan.text(trim(videoMap.title));
		$statSpan.text(getFormatedDigits(trim(videoMap.total_views))+" Views");
		$likeDislikeSpan.html(likeIcon+disLikesIcon);
		$ratingDiv.raty({score: trim(videoMap.avg_rating)}) //.text("Avg Rating "+trim(videoMap.avg_rating));

		$infoDiv.append($titleSpan).append($statSpan).append($likeDislikeSpan).append($ratingDiv);
		$videoImg.attr("src", trim(videoMap.thumbnail));
		$videoLi.append($videoImg).append($infoDiv)/*.append($buttonDiv)*/;
		$videoContainer.append($videoLi);
		infoStr = "";
	});
	return $videoContainer;
}



function populatePlayListMenu() {
	
	var videoListMap;
	// Call another function to do the business logic on the result
	/*if (!localStorage.getObj('videoListService')) {
		console.log(" Not found in local storage :: calling build JSON function :: ");
		videoListMap = buildVideoListDS(videosJsonData);
		localStorage.setItem('videoListService', setObj(videoListMap));
		console.log(" Setting object in localstorage :: ");
	}*/ 
	// get it from localstorage
	videoListMap = getObj(localStorage.getItem('videoListService'));
	// for objects to store in local storage you have to stringify
	// refer http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
	var $playListUl = $('ul#playListUl');
	var videoIdBasedMap = getObj(localStorage.getItem("videoIdBasedMap"));
	$.each(videoListMap, function (key, value) {
		var imgEle = $("<img width='80px' height='60px'>");
		var anchore = $("<a href='#'>");
		var liEle = $("<li>");
		var videoId = value.videoIdList[(value.videoIdList.length) - 1];
		
		liEle.attr("data-vmapp-val", key);
		liEle.attr("class", "liElement");
		
		imgEle.attr("src", trim(videoIdBasedMap[videoId].thumbnail));
		
		anchore.text(key+" ("+value.occurance+")");
		
		liEle.append(imgEle);
		liEle.append(anchore);
		$playListUl.append(liEle);
		
		// $playListUl.append('<li class="liElement" data-vmapp-val="'+key+'"><a href="#">' + key + '(' + value.occurance + ')</a></li>'); 
	});
	// Always call this to set the design to added elements
	$playListUl.listview("refresh");
	
}

function populatefavouritePlayListMenu(favouritePlayList) {
	console.log("favouritePlayListDiv :: clicked");
	// var favouritePlayListMap = getObj(localStorage.getItem('favouritePlayList'));
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
			localStorage.setItem("favouritePlayListMenu", setObj('<li><a href="#">Videos ('+favouritePlayList.length+') </a></li>'));
			$favouritePlayListUl.append(getObj(localStorage.getItem("favouritePlayListMenu")));
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
	//var myPlayListMap = getObj(localStorage.getItem('myPlayList'));
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
			localStorage.setItem("myPlayListMenu", setObj('<li><a href="#">Videos ('+myPlayList.length+') </a></li>'));
			$myPlayListUl.append(getObj(localStorage.getItem("myPlayListMenu")));
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


//Will get called after Ajax call
function buildVideoListDS(videosJsonData) {

	var videoListMap = {};
	var videoIdBasedMap = {};
	console.log(" jsondata :: length :: ",videosJsonData.length);
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
	localStorage.setItem("videoIdBasedMap", setObj(videoIdBasedMap));
	return videoListMap;
}



/*Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getObj = function(key) {
	if (this.getItem(key) != "undefined") {
		return JSON.parse(this.getItem(key));
	} else {
		return null;
	}
}*/

function setObj(obj) {
	return JSON.stringify(obj);
}

function getObj(obj) {
	return JSON.parse(obj);
}


function trim(str) {
	return $.trim(str);
}

function getFormatedDigits(val) { 
    return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
}
