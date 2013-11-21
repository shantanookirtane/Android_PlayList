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
	
	$('ul#playListUl').on('click', 'li', function(evt){
		alert("li item clicked");
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

