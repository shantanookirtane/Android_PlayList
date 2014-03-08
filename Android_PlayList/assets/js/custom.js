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
 * youtube api json format
 * 
 * {
    "apiVersion":"2.1",
    "data":{
        "updated":"2011-10-31T19:24:09.441Z",
        "totalItems":14,
        "startIndex":1,
        "itemsPerPage":1,
        "items":[{
            "id":"O9f1bBeYpqA",
            "uploaded":"2011-10-19T13:07:28.000Z",
            "updated":"2011-10-31T16:57:34.000Z",
            "uploader":"ironmaiden",
            "category":"Music",
            "title":"IMTV London",
            "description":"A quick IMTV from the O2. The full IMTV UK episode will be available to fanclub members soon!",
            "tags":["iron","maiden","imtv","on","board","flight","666","Iron Maiden","United Kingdom","Metal"],
            "thumbnail":{
                "sqDefault":"http://i.ytimg.com/vi/O9f1bBeYpqA/default.jpg",
                "hqDefault":"http://i.ytimg.com/vi/O9f1bBeYpqA/hqdefault.jpg"
            },
            "player":{
                "default":"http://www.youtube.com/watch?v=O9f1bBeYpqA&feature=youtube_gdata_player",
                "mobile":"http://m.youtube.com/details?v=O9f1bBeYpqA"
            },
            "content":{
                "5":"http://www.youtube.com/v/O9f1bBeYpqA?version=3&f=videos&app=youtube_gdata",
                "1":"rtsp://v3.cache5.c.youtube.com/CiILENy73wIaGQmgppgXbPXXOxMYDSANFEgGUgZ2aWRlb3MM/0/0/0/video.3gp",
                "6":"rtsp://v2.cache8.c.youtube.com/CiILENy73wIaGQmgppgXbPXXOxMYESARFEgGUgZ2aWRlb3MM/0/0/0/video.3gp"
            },
            "duration":316,
            "aspectRatio":"widescreen",
            "rating":4.9898734, // avg_rating
            "likeCount":"394", // like count
            "ratingCount":395,
            "viewCount":47086, // total views
            "favoriteCount":110,
            "commentCount":105,
            "accessControl":{
                "comment":"allowed",
                "commentVote":"allowed",
                "videoRespond":"moderated",
                "rate":"allowed",
                "embed":"allowed",
                "list":"allowed",
                "autoPlay":"allowed",
                "syndicate":"allowed"
            }
        }]
    }
 * 
 * 
 * 
 * 
 * 
 * */

// Global Variables

var $videoContainer;

var videoplayer = {};

try{
    //we replace default localStorage with our Android Database one
    window.localStorage = LocalStorage;    
}catch(e){
    //LocalStorage class was not found. be sure to add it to the webview
	console.log("LocalStorage ERROR : can't find android class LocalStorage. switching to raw localStorage")		        
}


/*$(document).on('pageinit', '[data-url="welcome-page"]', function() {


	console.log("pageinit : welcome -page");
	$("button#show-video-playlist-app").on("click", function (evt) {
		$.mobile.changePage( $("div[data-url='demo-page']"), "slide", true, true);
		return;
	});

});*/

$(document).on('pagebeforecreate', '[data-url="demo-page"]', function() {
	console.log("pagebeforecreate event");
	// showLoader();
	if (!getObj(window.localStorage.getItem('videoListService'))) {
		console.log(" Not found in local storage :: calling build JSON function :: ");
		videoListMap = buildVideoListDS(videosJsonData);
		window.localStorage.setItem('videoListService', setObj(videoListMap));
		console.log(" Setting object in localstorage :: ");
	}
});




$(document).on('pageinit', '[data-url="demo-page"]', function() {
	console.log("page init event ");
	// hideLoader();
	videoplayer.maxItems = 10;
	populatePlayListMenu();
	populatefavouritePlayListMenu(getObj(window.localStorage.getItem('favouritePlayList')));
	populateMyPlayListMenu(getObj(window.localStorage.getItem('myPlayList')));
	
	
	
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
	
	
	// refresh the json data and reload it
	$("div#headerDiv").on("click", "div.refreshRhsMenu", function (evt) {
		console.log("clicked refresh menu");
		// Clears the DB
		window.localStorage.clear();

		var videoListMap;
		try {
			var videoJsonDatFrmServer = window.localStorage.getJsonData();
			videoListMap = buildVideoListDS(JSON.parse(videoJsonDatFrmServer));
		} catch (e) {
			//console.log("No method found window.localStorage.getJsonData() ")
			videoListMap = buildVideoListDS(videosJsonData);
		}
		window.localStorage.setItem('videoListService', setObj(videoListMap));
		console.log(" Setting object in localstorage :: ");
		// call playlist lhs menu render method
		populatePlayListMenu();
		populatefavouritePlayListMenu(getObj(window.localStorage.getItem('favouritePlayList')));
		populateMyPlayListMenu(getObj(window.localStorage.getItem('myPlayList')));

/*		ajaxOptions.setServiceName = "";
		var ajax = $.ajax(ajaxOptions);
        ajax.done(function (data) {
        	console.log("setting new data into LS");
        	var videoListMap = buildVideoListDS(data);
    		localStorage.setItem('videoListService', setObj(videoListMap));
    		console.log(" Setting object in localstorage :: ");
    		// call playlist lhs menu render method
    		populatePlayListMenu();
        });*/
	});
	
	
	// on clicking search
	$('ul#searchPlaylistUl').on('click', 'li', function(evt) {
		$("div#contentVideosId").find("div.video-wrapper").toggleClass("show hide"); //css("display","none");
		$("div#contentVideosId").find("div.video-search-wrapper").toggleClass("show hide"); //.css("display","block");
		
		$('div#headerDiv').find('h1').html("Search");
		$('div#headerDiv').find('h1').attr("data-playlist-name", "");
		
		// remove warning when coming back
		$('ul#search-result-video-list').find("div.searchInfo").remove();
	});
	
	// search videos
	$('div.video-search-div').on('click', 'a.search-video-button', function(evt) {
		var queryString = $("#video-search-input").val();
		getVideosFromYoutube(queryString);
		
	});
	
	// add to localStorage
	$('ul#search-result-video-list').on('click', 'a.searchAddButton', function(evt) {
		
		// $("div#popupBasic").popup("open");
		var $this = $(this);
		var liEle = $this.closest('li.videoLiEle');
		var searchVId = liEle.attr("search-video-id");

		var videoListMap = getObj(window.localStorage.getItem('videoListService'));
		
		var $ulParent = $('ul#search-result-video-list');
		
		
		if (videoListMap["Searched_Videos"]) {
			var innerMap = videoListMap["Searched_Videos"];
			var count = innerMap["occurance"]
			// If reached 30 then do not allow to add 
			if (count === 2) {
				if ($ulParent.find("div.searchInfo").length === 0) {
					$ulParent.prepend("<div class='searchInfo alert-danger'>Unable to add Video, Max 30 Videos are allowed in Searched_Videos category, Please remove some videos and try again!!!<div>");
				}
				$.mobile.silentScroll(0);
				return;
			}
			innerMap["occurance"] = count + 1;
			innerMap["videoIdList"].push(searchVId);
		} else {
			var innerMap = {};
			innerMap["occurance"] = 1;
			innerMap["videoIdList"] = [];
			(innerMap["videoIdList"]).push(searchVId);
			videoListMap["Searched_Videos"] = innerMap;
		}
		// set the updated map back to LS
		window.localStorage.setItem('videoListService', setObj(videoListMap));
		
		var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
		var searchVideoMap = getObj(window.localStorage.getItem("tempSearchVideoMap"));
		videoIdBasedMap[searchVId] = searchVideoMap[searchVId];
		
		// set the updated map back to LS
		window.localStorage.setItem('videoIdBasedMap', setObj(videoIdBasedMap));
		
		// delete the Li
		liEle.remove();
		
		// populate the playlist Menu
		populatePlayListMenu();
		
	//	$("div#popupBasic").popup("close");
		
	});
	
	
	
	// Video PlayList 
	$('ul#playListUl').on('click', 'li', function(evt) {
		if ($("div#contentVideosId").find("div.video-wrapper").hasClass("hide")) {
			$("div#contentVideosId").find("div.video-wrapper").toggleClass("show hide"); //css("display","none");	
		}
		if ($("div#contentVideosId").find("div.video-search-wrapper").hasClass("show")) {
			$("div#contentVideosId").find("div.video-search-wrapper").toggleClass("show hide"); //.css("display","block");
		}

		showPlaylist($(this),true);
	});
		
	
	// My PlayList
	$('ul#myPlayListUl').on('click', 'li', function(evt) {
		
		if ($("div#contentVideosId").find("div.video-wrapper").hasClass("hide")) {
			$("div#contentVideosId").find("div.video-wrapper").toggleClass("show hide"); //css("display","none");	
		}
		if ($("div#contentVideosId").find("div.video-search-wrapper").hasClass("show")) {
			$("div#contentVideosId").find("div.video-search-wrapper").toggleClass("show hide"); //.css("display","block");
		}
		
		
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
		$videoContainer = $("ul#video-list");
		// var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
		$videoContainer.html("");
		
		var favouritePlayList = getObj(window.localStorage.getItem('favouritePlayList'));
		
		// set active category = which ever is clicked
		videoplayer.activeCategory = "myPlayList";
		var videoListSubSet;
		if (myPlayList.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(myPlayList, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(myPlayList, videoplayer.maxItems);
			// set global object into localstorage
			window.localStorage.setItem('videoPlayer', setObj(videoplayer));	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(myPlayList, videoIdBasedMap, "myPlayList", favouritePlayList);
			$videoContainer.append("<li class='load-more-data'>Load More Videos</li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
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
	$('ul#favouritePlayListUl').on('click', 'li', function(evt) {
		
		if ($("div#contentVideosId").find("div.video-wrapper").hasClass("hide")) {
			$("div#contentVideosId").find("div.video-wrapper").toggleClass("show hide"); //css("display","none");	
		}
		if ($("div#contentVideosId").find("div.video-search-wrapper").hasClass("show")) {
			$("div#contentVideosId").find("div.video-search-wrapper").toggleClass("show hide"); //.css("display","block");
		}
		
		// alert("li item clicked");
		// get the videos from localStorage
		// populate them in Li
		// refresh the list
		var favouritePlayList = getObj(window.localStorage.getItem('favouritePlayList'));
		$videoContainer = $("ul#video-list");
		var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
		$videoContainer.html("");
		
		var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
		
		// set active category = which ever is clicked
		videoplayer.activeCategory = "favouritePlayList";
		var videoListSubSet;
		if (favouritePlayList.length > videoplayer.maxItems) {
			// load only first videoplayer.maxItems
			videoListSubSet = _.first(favouritePlayList, videoplayer.maxItems);
			// set the rest of the videoList for that category
			videoplayer.category = _.rest(favouritePlayList, videoplayer.maxItems);
			// set global object into localstorage
			window.localStorage.setItem('videoPlayer', setObj(videoplayer));	
			console.log(" loading only "+videoListSubSet.length+" elements");
			var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
			$videoContainer = populateVideoContents(favouritePlayList, videoIdBasedMap, "favouritePlayList", null, myPlayList);
			$videoContainer.append("<li class='load-more-data'>Load More Videos</li>");
		} else {
			console.log(" Not dividing the list ");
			var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
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
		var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
		var firstV = _.first(myPlayList);
		var playList = "";
		_.each(_.rest(myPlayList, 1), function (videoId, i, list) {
			if(playList == "") {
				playList += videoId;
			} else {
				playList += ","+videoId;
			}
		});
		var iFrameEle = $('div#contentVideosId').find('div.video-container-div').find('iframe');//.find("source");
		iFrameEle.attr('src', 'http://www.youtube.com/embed/'+firstV+'?playlist='+playList);
		$self.prop("value", "Playing All");
		// $self.attr('disabled', true);
		//$('iframe').attr('src','http://www.youtube.com/embed/3PADxcM_Vi8?playlist=FbgsaVD-6u0,QyPRTblP2-4,OyiNc7zNN9c')
		
	});
	
	
	$('ul#video-list').on('click', 'a.starButton', function(evt) {
		$this = $(this);
		var liElement = $this.closest('li');
		var videoId = $(liElement).attr('data-video-id');
		var favouritePlayList = getObj(window.localStorage.getItem('favouritePlayList'));
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
		window.localStorage.setItem('favouritePlayList', setObj(favouritePlayList));
		console.log("favouritePlayList :: ",favouritePlayList);
		
		// Populate the menu
		populatefavouritePlayListMenu(favouritePlayList);
		
	});
	
	$('ul#video-list').on('click', 'a.addButton', function(evt) {
		$this = $(this);
		var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
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
		window.localStorage.setItem('myPlayList', setObj(myPlayList));
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
			var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
			myPlayList = _.without(myPlayList, $liElement.attr('data-video-id'));
			window.localStorage.setItem('myPlayList', setObj(myPlayList));
			$liElement.remove();
			console.log("Delete :: myPlayList", myPlayList);
			// render the menu again
			populateMyPlayListMenu(myPlayList);
		} else if (playListName === "favouritePlayList") {
			var favouritePlayList = getObj(window.localStorage.getItem('favouritePlayList'));
			favouritePlayList = _.without(favouritePlayList, $liElement.attr('data-video-id'));
			window.localStorage.setItem('favouritePlayList', setObj(favouritePlayList));
			$liElement.remove();
			console.log("Delete :: favouritePlayList", favouritePlayList);
			// Populate the menu
			populatefavouritePlayListMenu(favouritePlayList);
		}
		return;
	});
	
	$('ul#video-list').on('click', 'a.deleteSearchRButton', function(evt) {
		var $this = $(this);
		// evt.stopPropagation();
		var $liElement = $this.closest('li');
		var videoListMap = getObj(window.localStorage.getItem('videoListService'));
		var videoId = $.trim($liElement.attr("data-video-id"));
		var videoIdListVal = videoListMap["Searched_Videos"].videoIdList;
		
		// remove from this
		videoIdListVal = _.without(videoIdListVal, videoId);
		if (videoIdListVal == undefined || videoIdListVal.length == 0) {
			videoListMap = _.omit(videoListMap, "Searched_Videos");
		} else {
			videoListMap["Searched_Videos"]["occurance"] = videoIdListVal.length;
			videoListMap["Searched_Videos"]["videoIdList"] = videoIdListVal;	
		}
		window.localStorage.setItem('videoListService', setObj(videoListMap));
		
		// Remove from this map as well
		var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
		videoIdBasedMap = _.omit(videoIdBasedMap, videoId); 
		window.localStorage.setItem('videoIdBasedMap', setObj(videoIdBasedMap));
		$liElement.remove();
		// render the menu again
		populatePlayListMenu("deleteSearchVideo");
		return;
	});
	
	
	
	$('ul#video-list').on('click', 'img.thumbnail,span.title', function(evt) {
		console.log("click on image");
		var $this = $(this);
		var videoId = $this.closest('li.videoLiEle').attr('data-video-id');
		var iFrameEle = $('div#contentVideosId').find('div.video-container-div').find('iframe');//.find("source");
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
		videoplayer = getObj(window.localStorage.getItem('videoPlayer'));
		var category = videoplayer.activeCategory;
		var videoListSubSet = _.first(videoplayer.category, videoplayer.maxItems);
		videoplayer.category = _.rest(videoplayer.category, videoplayer.maxItems);
		// set global object into localstorage
		window.localStorage.setItem('videoPlayer', setObj(videoplayer));

		if (videoListSubSet) {
			var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
    		var favouritePlayList = getObj(window.localStorage.getItem('favouritePlayList'));
    		var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
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


$(document).on('pageload', '[data-url="demo-page"]', function() {
	console.log("page load event ");
	// Load this only first time
	$('ul#playListUl').find("li").first().trigger("click");
	
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
		var $buttonAnchor2 = $("<a href='' data-role='button' data-icon='delete' data-iconpos='notext' data-inline='true' class='deleteSearchRButton'>");
		var $buttonDelete = $("<a href='' data-role='button' data-icon='delete' data-iconpos='notext' data-inline='true' class='deleteButton'>");
		var likeIcon = '<i class="fa fa-thumbs-o-up fa-lg">'+getFormatedDigits(trim(videoMap.likes))+'</i>';
		var disLikesIcon = '<i class="fa fa-thumbs-o-down fa-lg">'+getFormatedDigits(trim(videoMap.dislikes))+'</i>';
		var $titleSpan = $('<span class="title">');
		var $statSpan = $('<span class="stat">');
		var $ratingDiv = $('<div>');
		var $likeDislikeSpan = $('<span class="stat">');   
		// If its normal playlist then do this
		if (playListName != "myPlayList" && playListName != "favouritePlayList") {
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
		
		if (playListName === "Searched_Videos") {
			$buttonDiv.append($buttonAnchor2);
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



function populatePlayListMenu(actionDelegator) {
	
	var videoListMap;
	// Call another function to do the business logic on the result
	/*if (!localStorage.getObj('videoListService')) {
		console.log(" Not found in local storage :: calling build JSON function :: ");
		videoListMap = buildVideoListDS(videosJsonData);
		window.localStorage.setItem('videoListService', setObj(videoListMap));
		console.log(" Setting object in localstorage :: ");
	}*/ 
	// get it from localstorage
	videoListMap = getObj(window.localStorage.getItem('videoListService'));
	// for objects to store in local storage you have to stringify
	// refer http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
	var $playListUl = $('ul#playListUl');
	
	// clear the playlist
	$playListUl.html("");
	
	var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
	$.each(videoListMap, function (key, value) {
		var imgEle = $("<img width='80px' height='60px'>");
		var anchore = $("<a href='#'>");
		var anchoreDiv = $("<div>");
		var liEle = $("<li>");
		if (value.videoIdList == undefined) {
			console.error("value undefined :: ", key, value);
		}
		var videoId = value.videoIdList[(value.videoIdList.length) - 1];
		
		liEle.attr("data-vmapp-val", key);
		liEle.attr("class", "liElement");
		
		imgEle.attr("src", trim(videoIdBasedMap[videoId].thumbnail));
		
		anchore.text(key+" ("+value.occurance+")");
		
		liEle.append(imgEle);
		anchoreDiv.append(anchore);
		liEle.append(anchoreDiv);
		$playListUl.append(liEle);
		
		// $playListUl.append('<li class="liElement" data-vmapp-val="'+key+'"><a href="#">' + key + '(' + value.occurance + ')</a></li>'); 
	});
	
	// Added to handle the search videos deletion
	if (!actionDelegator) {  
		// Load first li elements on main content
		// $playListUl.find("li").first().trigger("click");
		showPlaylist($playListUl.find("li").first(),false);
	}

	// Always call this to set the design to added elements
	$playListUl.listview("refresh");
	
	
	
	
}


function showPlaylist($li,clickflg) {
	// var $li = $(thi);	
	//console.log(" current target :: "+$(current));
	console.log(" this :: "+$li.attr("data-vmapp-val"));
	// clear the contents
	$videoContainer = $("ul#video-list");
	$videoContainer.html("");
	// first check if the li elements list in localstorage, if yes pull it from there		
	var myPlayList = getObj(window.localStorage.getItem('myPlayList'));
	var favouritePlayList = getObj(window.localStorage.getItem('favouritePlayList'));
	var videoListMap = getObj(window.localStorage.getItem('videoListService'));
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
		window.localStorage.setItem('videoPlayer', setObj(videoplayer));	
		console.log(" loading only "+videoListSubSet.length+" elements");
		var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
		$videoContainer = populateVideoContents(videoListSubSet, videoIdBasedMap, category, favouritePlayList, myPlayList);
		$videoContainer.append("<li class='load-more-data' data-theme='b'><a href='#'>Load More Videos</a></li>");
	} else {
		console.log(" Not dividing the list ");
		var videoIdBasedMap = getObj(window.localStorage.getItem("videoIdBasedMap"));
		$videoContainer = populateVideoContents(videoIdListVal, videoIdBasedMap, category, favouritePlayList, myPlayList);
	}

	$videoContainer.prepend("<li data-role='list-divider' data-theme='a'>Showing Video(s) from "+category+"</li>");

	$videoContainer.prepend("<li class='showVideoList hide' data-theme='b'><a href='#'>Show Video List</a></li>");

	$videoContainer.listview("refresh");

	// refresh the control group div
	$("#demo-page").trigger("create");

	if (clickflg == true) {
		$('div.lhsMenu').trigger('click');
	}

	$('div#headerDiv').find('h1').html("PlayList");
	$('div#headerDiv').find('h1').attr("data-playlist-name", "");
	
}






function populatefavouritePlayListMenu(favouritePlayList) {
	console.log("favouritePlayListDiv :: clicked");
	// var favouritePlayListMap = getObj(window.localStorage.getItem('favouritePlayList'));
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
			window.localStorage.setItem("favouritePlayListMenu", setObj('<li><a href="#">Videos ('+favouritePlayList.length+') </a></li>'));
			$favouritePlayListUl.append(getObj(window.localStorage.getItem("favouritePlayListMenu")));
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
	//var myPlayListMap = getObj(window.localStorage.getItem('myPlayList'));
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
			window.localStorage.setItem("myPlayListMenu", setObj('<li><a href="#">Videos ('+myPlayList.length+') </a></li>'));
			$myPlayListUl.append(getObj(window.localStorage.getItem("myPlayListMenu")));
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
	window.localStorage.setItem("videoIdBasedMap", setObj(videoIdBasedMap));
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


function getVideosFromYoutube(queryString) {
	
	var URL = "https://gdata.youtube.com/feeds/api/videos?max-results=20&orderby=viewCount&safeSearch=strict&restriction=US&v=2&alt=jsonc&start-index=1";
	URL+= "&q=";
	URL+= queryString;
	$.getJSON(URL, 
            function(response) {
				var $searchVideoContainer = $("ul#search-result-video-list");
				$searchVideoContainer.html("");
                if(response.data && response.data.items) {
                	 console.info("YT data ", response.data.items);
                    var items = response.data.items;
                    if (items.length === 0) {
                    	// show some message and return
                    }
                    var videoMap = {}    
                    _.each(items, function(value, index, list) {
                    	var videoDetailMap = {};
                    	var valiases = [];
                    	valiases.push(value.category);
                    	videoDetailMap["video_id"] = value.id;
                    	videoDetailMap["aliases"] = valiases;
                    	videoDetailMap["avg_rating"] = value.rating;
                    	videoDetailMap["likes"] = value.likeCount;
                    	videoDetailMap["dislikes"] = 0;
                    	videoDetailMap["total_views"] = value.viewCount;
                    	videoDetailMap["title"] = value.title;
                    	videoDetailMap["thumbnail"] = value["thumbnail"]["sqDefault"];
                    	videoMap[value.id] = videoDetailMap;
                    	if (_.contains(_.keys(getObj(window.localStorage.getItem("videoIdBasedMap"))), value.id)) {
                    		populateSearchVideosContent(value.id, videoDetailMap, $searchVideoContainer, true);
                    	} else {
                    		populateSearchVideosContent(value.id, videoDetailMap, $searchVideoContainer, false);
                    	}
                    });
                    
                    $searchVideoContainer.prepend("<li data-role='list-divider' data-theme='a'>Search Result</li>");
                    $searchVideoContainer.listview("refresh");
            		// refresh the control group div
            		$("#demo-page").trigger("create");
                    window.localStorage.setItem("tempSearchVideoMap", setObj(videoMap))
                   // console.log("temp search obj", videoMap);
                    // show the list on screen, add add to playlist button or disable it to show that its already added
                    // on click of add to playlist button
                }
            });
}


	function populateSearchVideosContent(videoId, videoMap, $searchVideoContainer, disableFlag) {
	
	
		var $videoLi = $("<li class='videoLiEle' data-theme='c'>");
		var videoId = trim(videoMap.video_id);
		$videoLi.attr('search-video-id', videoId);
		var $videoImg = $("<img class='thumbnail'>");
		var $infoDiv = $("<div data-role='controlgroup' data-type='vertical' class='infoDiv'>");
		var $buttonDiv = $("<div data-role='controlgroup' data-type='horizontal'>");
		var $buttonAnchor = $("<a href='' data-mini='true' data-theme='b' data-role='button' data-inline='true' data-corners='false' class='searchAddButton'>");
		var likeIcon = '<i class="fa fa-thumbs-o-up fa-lg">'+getFormatedDigits(trim(videoMap.likes))+'</i>';
	//	var disLikesIcon = '<i class="fa fa-thumbs-o-down fa-lg">'+getFormatedDigits(trim(videoMap.dislikes))+'</i>';
		var $titleSpan = $('<span class="title">');
		var $statSpan = $('<span class="stat">');
		var $ratingDiv = $('<div>');
		var $likeDislikeSpan = $('<span class="stat">');
		
		
		if (disableFlag) {
			$buttonAnchor.addClass("ui-disabled");
			$buttonAnchor.text("Already in Playlist");
		} else {
			$buttonAnchor.text("Add to Playlist");
		}
		
		$buttonDiv.append($buttonAnchor);
		$titleSpan.text(trim(videoMap.title));
		$statSpan.text(getFormatedDigits(trim(videoMap.total_views))+" Views");
		$likeDislikeSpan.html(likeIcon);
		$ratingDiv.raty({score: trim(videoMap.avg_rating)}) //.text("Avg Rating "+trim(videoMap.avg_rating));

		$infoDiv.append($titleSpan).append($statSpan).append($likeDislikeSpan).append($ratingDiv);
		$videoImg.attr("src", trim(videoMap.thumbnail));
		$videoLi.append($videoImg).append($infoDiv).append($buttonDiv);
		$searchVideoContainer.append($videoLi);
			
 }