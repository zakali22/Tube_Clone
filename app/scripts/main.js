

////////////////////////////////////////////////////////////////////////////////////////////
var CLIENT_ID = '122566819561-266nkdlave95pdr558rt9l3f4iolmfv5.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');


function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}


function onSignIn(googleUser) {
   // Useful data for your client-side scripts:
   var profile = googleUser.getBasicProfile();
   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
   console.log('Full Name: ' + profile.getName());
   console.log('Given Name: ' + profile.getGivenName());
   console.log('Family Name: ' + profile.getFamilyName());
   console.log("Image URL: " + profile.getImageUrl());
   console.log("Email: " + profile.getEmail());
   var image = '<img src="' + profile.getImageUrl() + '" width="50px">';
   addTop(image);

   // The ID token you need to pass to your backend:
   var id_token = googleUser.getAuthResponse().id_token;
   console.log("ID Token: " + id_token);
 };

 function handleAuthClick(event) {
   gapi.auth2.getAuthInstance().signIn();
 }

 function handleSignoutClick(event) {
   gapi.auth2.getAuthInstance().signOut();
   $('#detail').css('display', 'none');
 }

 function updateSigninStatus(isSignedIn) {
   if (isSignedIn) {
    //  authorizeButton.style.display = 'none';
    $('.g-signin2').css('display', 'none');
    $('#detail').css('display', 'inline-block');
     getChannel();
   } else {
    $('.g-signin2').css('display', 'inline-block');
    $('#detail').css('display', 'none');
   }
 }

 $('#detail').on('click', function(event) {
   event.preventDefault();
   /* Act on the event */
   handleSignoutClick(event);
 });

/////////////////////////////////////////////////////////////////////////////////////////

 function addTop(item){
   $('#detail').html(item);
 }

/////////////////////////////////////////////////////////////////////////////////////////

 function getChannel() {
   gapi.client.youtube.channels.list({
     'part': 'contentOwnerDetails,snippet,id,statistics,contentDetails,brandingSettings',
     'forUsername': 'MrZMaslam'
   }).then(function(response) {
     var channel = response.result.items[0];
     console.log(response);
   });
 }


//////////////////////////////////////////////////////////////////////////////////////
var token;
function searchVid(searchTerm){
  gapi.client.youtube.search.list({
    'part': 'snippet',
    'q': searchTerm,
    'type': 'video',
    'maxResults': 21
  }).then(function(data){
    console.log(data.result);
    token = data.result.nextPageToken;
    var vid = "";
    $.each(data.result.items, function(key, val) {
      var image = val.id.videoId;
      vid += '<iframe id="player" type="text/html" width="440" height="290" src="http://www.youtube.com/embed/' + image + '?enablejsapi=1" frameborder="0"></iframe>';
    });
    $('.player').html(vid);
  });
}


$('.btn').on('click', function(event) {
  event.preventDefault();
  /* Act on the event */
  var text = encodeURIComponent($('#search').val());
  gapi.client.youtube.search.list({
    'part': 'snippet',
    'q': text,
    'type': 'video',
    'maxResults': 21,
    'pageToken': token
  }).then(function(data){
    console.log(data.result);
    token = data.result.nextPageToken;
    var vid = "";
    $.each(data.result.items, function(key, val) {
      var image = val.id.videoId;
      vid += '<iframe id="player" type="text/html" width="440" height="290" src="http://www.youtube.com/embed/' + image + '?enablejsapi=1" frameborder="0"></iframe>';
    });
    $('.player').html(vid);
  });
});

$('#y_search').on('click', function(event) {
  event.preventDefault();
  /* Act on the event */
  var text = encodeURIComponent($('#search').val());
  searchVid(text);
});

/////////////////////////////////////////////////////////////////////////////////////

    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    function onYouTubeIframeAPIReady() {
      player = new YT.Player('existing-iframe-example', {
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
      });
    }
