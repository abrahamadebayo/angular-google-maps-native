describe('gmMarker', function () {

  var $compile, $rootScope, $scope, $timeout,
    element, scope, googleMaps;


  //---------------------------------------------------------------------------
  // Load Library
  //---------------------------------------------------------------------------

  testTools.mokeGMLibrary();


  //---------------------------------------------------------------------------
  // Inject required
  //---------------------------------------------------------------------------
  beforeEach(inject(function(_$rootScope_, _$timeout_, _$compile_) {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    $compile = _$compile_;
    $scope = $rootScope.$new();
    googleMaps = $rootScope.google.maps;
  }));


  //---------------------------------------------------------------------------
  // TESTS
  //---------------------------------------------------------------------------

  function compile(template) {
    element = $compile('<gm-map options="{center: [37, -122], zoom: 8}">' + template + '</gm-map>')($scope);
    $scope.$digest();
    $timeout.flush();
    element = element.find('gm-marker');
    scope = element.scope();
  }

  it('test simple case', function () {
    compile('<gm-marker options="{position: [1,2]}"></gm-marker>');
    expect(scope.map instanceof googleMaps.Map).to.be.equal(true);
    expect(scope.marker instanceof googleMaps.Marker).to.be.equal(true);
    expect(scope.marker.getMap() === scope.map).to.be.equal(true);
    expect(scope.marker.getPosition().lat()).to.be.equal(1);
    expect(scope.marker.getPosition().lng()).to.be.equal(2);
  });

  it('use map.center', function () {
    compile('<gm-marker options="{position: map.getCenter()}"></gm-marker>');
    expect(scope.map instanceof googleMaps.Map).to.be.equal(true);
    expect(scope.marker instanceof googleMaps.Marker).to.be.equal(true);
    expect(scope.marker.getPosition().lat()).to.be.equal(scope.map.getCenter().lat());
    expect(scope.marker.getPosition().lng()).to.be.equal(scope.map.getCenter().lng());
  });

  it('wait for position', function () {
    compile('<gm-marker position="pos"></gm-marker>');
    expect(scope.map instanceof googleMaps.Map).to.be.equal(true);
    expect(scope.marker instanceof googleMaps.Marker).to.be.equal(false);
    $scope.pos = [1, 2];
    $scope.$digest();
    expect(scope.marker instanceof googleMaps.Marker).to.be.equal(true);
    expect(scope.marker.getPosition().lat()).to.be.equal(1);
    expect(scope.marker.getPosition().lng()).to.be.equal(2);
  });

  it('test events', function () {

    $scope.data = {
      clickedOnce: 0,
      clicked: 0,
      positionChanged: 0
    };

    compile('<gm-marker  ' +
        // classic
      'on-click="data.clicked = data.clicked + 1" ' +
        // test "once"
      'once-click="data.clickedOnce = data.clickedOnce + 1" ' +
        // test with name not normalized
      'on-position_changed = "data.positionChanged = data.positionChanged + 1" ' +
      'options="{position: [1, 2]}"></gm-marker>');

    expect(scope.map instanceof googleMaps.Map).to.be.equal(true);

    googleMaps.event.trigger(scope.marker, 'click');
    googleMaps.event.trigger(scope.marker, 'click');
    googleMaps.event.trigger(scope.marker, 'position_changed');
    googleMaps.event.trigger(scope.marker, 'position_changed');
    $scope.$digest();
    $timeout.flush();

    expect(scope.data.clickedOnce).to.be.equal(1);
    expect(scope.data.clicked).to.be.equal(2);
    expect(scope.data.positionChanged).to.be.equal(2);

  });

  it('test ng-show', function () {

    compile('<gm-marker ng-show="visible" options="{position: [1, 2]}"></gm-marker>');
    expect(scope.map instanceof googleMaps.Map).to.be.equal(true);
    expect(scope.marker instanceof googleMaps.Marker).to.be.equal(true);
    expect(scope.marker.getMap()).to.be.an('undefined');

    $scope.visible = true;
    $scope.$digest();

    expect(scope.marker.getMap() === scope.map).to.be.equal(true);

    $scope.visible = false;
    $scope.$digest();

    expect(scope.marker.getMap() === scope.map).to.be.equal(false);
    expect(scope.marker.getMap()).to.be.an('null');

  });

  it('test ng-hide', function () {

    $scope.hidden = true;

    compile('<gm-marker ng-hide="hidden" options="{position: [1, 2]}"></gm-marker>');
    expect(scope.map instanceof googleMaps.Map).to.be.equal(true);
    expect(scope.marker instanceof googleMaps.Marker).to.be.equal(true);
    expect(scope.marker.getMap()).to.be.an('undefined');

    $scope.hidden = false;
    $scope.$digest();

    expect(scope.marker.getMap() === scope.map).to.be.equal(true);

    $scope.hidden = true;
    $scope.$digest();

    expect(scope.marker.getMap() === scope.map).to.be.equal(false);
    expect(scope.marker.getMap()).to.be.an('null');

  });

});