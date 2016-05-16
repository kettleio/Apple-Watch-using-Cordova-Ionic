// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    function initWatchAppPage(){
      var d = new Date();
      var payload = {
        'group': { // the page wrapper. the defaults are probably best though
          'cornerRadius': 0
        },
        'title': 'Back', // optional, shown in the navbar. Better not to set it if this is shown modally (because the default 'Cancel' is shown briefly first)
        'label': {
          'value': 'Refreshed @ ' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
          'color': '#1884C4',
          'font': { // optional
            'size': 10
          }
        },
        'label2': {
          'value': fromAction === undefined ? 'Default text :)' : fromAction
        },
        'table': { // this element is superawesome.. it's quite flexible and extendible. It can't have buttons, but it can have a callback which gets the selected row index.
          'callback': 'onDetailTableRowSelected',
          'rows': [
            {
              'type': 'OneColumnRowType', // available types are specified in ObjC
              'group': {
                'backgroundColor': '#1884C4',
                'cornerRadius': 8
              },
              'label': {'value': 'With image'},
              'imageRight': {'src': 'www/img/logo.png', 'width': 30}
            },
            {
              'type': 'OneColumnRowType',
              'group': {
                'backgroundColor': '#1884C4',
                'cornerRadius': 8
              },
              'label': {'value': '2nd, no img'}
            }
          ]
        },
        'actionButton': {
          'title': {
            'value': 'Refresh!',
            'color': '#FFA500',
            'font': {
              'size': 12
            }
          },
          'color': '#1884C4',
          'alpha': 1, // default 1
          'callback': 'onDetailPageButtonPressed'
        },
        'contextMenu': {
          'items': [
            {
              'title': 'Delete',
              'iconNamed': 'trash',
              'callback': 'onContextMenuDelete'
            }
          ]
        }
      };
      applewatch.loadAppDetail(payload);
    };

    //applewatch.callback.onLoadAppDetailRequest = initWatchAppPage;

  });

})

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'map.html',
    controller: 'mapCtrl'
  })
  .state('compass', {
    url: '/compass',
    templateUrl: 'compass.html',
    controller: 'compassCtrl'
  });

})

.factory('Location', function() {

  var position = {
    lat: '',
    lng: ''
  };

  var get = function(){
    return position;
  }

  var save = function(latitude, longitude){
    position = {
      lat: latitude,
      lng: longitude
    };
    console.log(position);
  }

  return {
    get: get,
    save: save
  };

})

.controller('mapCtrl', function($scope, $ionicPlatform, $state, Location) {

  $scope.ifValidAddress = false;
  
  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function(){
      document.getElementById('search-place').blur();
    });
  };

  $scope.openCompass = function(){    
    $state.go('compass');
  };

  

  $scope.initWatchGlance = function(){

    var payload = {
      'label2': {'value': 'Table with a colors. ' + new Date(), 'color': '#FFFFFF'},
      'table': { // don't add selectable rows to a glance since glances are read-only
        'rows': [
          {
            'type': 'OneColumnRowType', // available types are specified in ObjC
            'group': {
              'backgroundColor': '#1884C4',
              'cornerRadius': 8
            },
            'label': {'value': '  images!'}, // unlike HTML, multiple spaces have effect
            'imageLeft': {'src': 'www/img/ionic.png', 'width': 25, 'height': 30},
            'imageRight': {'src': 'www/img/ionic.png', 'width': 25, 'height': 30}
          },
          {
            'type': 'OneColumnRowType',
            'group': {
              'backgroundColor': '#7884C4',
              'cornerRadius': 8
            },
            'label': {'value': '2nd row, no img'}
          }
        ]
      }
    };

    applewatch.loadGlance(payload);

    console.log('loading first glance');

  };

  $scope.mapWatchGlance = function(){

    $scope.location = Location.get();

    var payload = {
      'label': {
        'value': "Kettle's Locator",
        'color': '#FFFFFF',
        'font': {
          'size': 12
        }
      },
      'label2': {
        'value': "We have a new location. @" + new Date(),
        'color': '#FFFFFF',
        'font': {
          'size': 10
        }
      },
      'map': {
        'center': {

          // Amersfoort, The Netherlands
          'lat': $scope.location.lat,
          'lng': $scope.location.lng
          },

          'zoom': 2, // 0.001 is streetlevel, 4 fits the entire Netherlands

          'annotations': [ // up to 5 annotations (custom pins), any more are ignored (play with the zoom value to make them all fit)
            {
            'pinColor': 'green', // green | red | purple
            'lat': $scope.location.lat,
            'lng': $scope.location.lng
            }
          ]
      }
    };

    applewatch.loadGlance(payload);

    console.log('loading map glance');

  };

  document.addEventListener('deviceready', function(){
    console.log('device ready');
    // Apple Watch load Glance
    applewatch.callback.onLoadGlanceRequest = $scope.initWatchGlance();
    //applewatch.callback.onLoadAppDetailRequest = $scope.initWatchAppPage();
    console.log('end device ready');
  }, false);

  $ionicPlatform.ready(function() {
    /*
    applewatch.callback.onError = function (message) {
      console.log("Error: " + message);
    };
    */

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('search-place');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        $scope.ifValidAddress = false;
        $scope.$apply();
        console.log($scope.ifValidAddress);
        return;
      }

      $scope.ifValidAddress = true;
      $scope.$apply();
      console.log($scope.ifValidAddress);

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });

      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {

        Location.save(place.geometry.location.lat(), place.geometry.location.lng());

        $scope.mapWatchGlance();

        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

      });

      map.fitBounds(bounds);

    });

  });

})

.controller('compassCtrl', function($scope, $ionicPlatform, Location) {

  $scope.$on('$ionicView.afterLeave', function(){
    console.log("Before leaving clear the compass");
    if(positionTimerId) navigator.geolocation.clearWatch(positionTimerId); 
    if(compassTimerId) navigator.compass.clearWatch(compassTimerId);
  });

  $scope.location = Location.get();
  console.log($scope.location);

  $scope.isError = false;

  var destinationPosition;
  var destinationBearing;

  var positionTimerId;
  var currentPosition;
  var prevPosition;
  var prevPositionError;      

  var compassTimerId;
  var currentHeading;
  var prevHeading;
  var prevCompassErrorCode;

  $scope.initCompass = function(){

      minPositionAccuracy = 50; // Minimum accuracy in metres to accept as a reliable position

      $scope.watchPosition();            
      $scope.watchCompass();

      $scope.updateDestination();
  };

  $scope.watchPosition = function(){

    if(positionTimerId) navigator.geolocation.clearWatch(positionTimerId); 
    positionTimerId = navigator.geolocation.watchPosition($scope.onPositionUpdate, $scope.onPositionError, {
        enableHighAccuracy: true,
        timeout: 1000,
        maxiumumAge: 0
    });

  }

  $scope.watchCompass = function(){
      if(compassTimerId) navigator.compass.clearWatch(compassTimerId);
      compassTimerId = navigator.compass.watchHeading($scope.onCompassUpdate, $scope.onCompassError, {
          frequency: 100 // Update interval in ms
      });
  }

  $scope.onPositionUpdate = function(position){
      if(position.coords.accuracy > minPositionAccuracy) return;

      prevPosition = currentPosition;
      currentPosition = new LatLon(position.coords.latitude, position.coords.longitude);

      $scope.updatePositions();
  }

  $scope.onPositionError = function(error){

      $scope.watchPosition();

      if(prevPositionError && prevPositionError.code == error.code && prevPositionError.message == error.message){
        $scope.isError = false;
        return ;
      }

      $scope.isError = true;
      $scope.errorMessage = "Error while retrieving current position. <br/>Error code: " + error.code + "<br/>Message: " + error.message;

      prevPositionError = {
          code: error.code,
          message: error.message
      };
  }

  $scope.onCompassUpdate = function(heading){
      prevHeading = currentHeading;
      currentHeading = Math.round(heading.magneticHeading);

      if(currentHeading == prevHeading) return;

      $scope.updateHeading();
  }

  function onCompassError(error){
      console.log('COMPASS ERROR');
      console.log(error);
      $scope.watchCompass();

      if(prevCompassErrorCode && prevCompassErrorCode == error.code) return; 

      var errorType;
      switch(error.code){
          case 1:
              errorType = "Compass not supported";
              break;
          case 2:
              errorType = "Compass internal error";
              break;
          default:
              errorType = "Unknown compass error";
      }

      $scope.isError = true;
      $scope.errorMessage = "Error while retrieving compass heading: "+errorType;

      prevCompassErrorCode = error.code;
  }

  $scope.updateDestination = function(){
      destinationPosition = new LatLon($scope.location.lat, $scope.location.lng);
      $scope.updatePositions();
  }       


  $scope.updatePositions = function(){
      if(!currentPosition) return;

      $scope.isError = false;

      destinationBearing = Math.round(currentPosition.bearingTo(destinationPosition)); 

      $scope.distance = Math.round(currentPosition.distanceTo(destinationPosition)*1000);
      $scope.bearing = destinationBearing;

      $scope.updateDifference(); 
  }

  $scope.updateHeading = function(){
      $scope.heading = currentHeading;
      $scope.updateDifference();
  }

  $scope.updateDifference = function(){
      var diff = destinationBearing - currentHeading;
      $scope.difference = diff;
      $scope.animateRotation = "-webkit-transform: rotate("+diff+"deg)";
      $scope.$apply();
  }

  $ionicPlatform.ready(function() {
    $scope.initCompass();
  });

  
});

