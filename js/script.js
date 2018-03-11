// Global Variables
var map;
var anchorGPS = {lat: 40.7713024, lng: -73.9632393};
var myLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// setting up viewmodel
function mapViewModel() {
var self = this;
  // knockout observable variable for the input given by a user
  self.searchTerm = ko.observable("");
  // knockout observable array to store location list items
  //this.locationList = ko.observableArray([]);
  // creating a blank array to store locations from the initialList variable
  self.markers = [];

  self.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    self.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    self.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(anchorGPS),
            zoom: 13,
            //styles: styles
        };

        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].lat;
            this.markerLng = myLocations[i].lng;
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    self.initMap();

    // Append locations to a list using data-bind (filter tool)
    self.filteredLocationList = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            this.name = this.markers[i].title;
            //this.bounce = function(){bounce(this.markers[i].id)};
            markerLocation.bounce = function(){ self.markers[i].populateAndBounceMarker}
            if (markerLocation.title.toLowerCase().includes(this.searchTerm()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
    
    function bounce(id){
        self.markers[id].setAnimation(google.maps.Animation.BOUNCE);
    }
 }

//activating Knockout
function startApp() {
    ko.applyBindings(new mapViewModel());
}