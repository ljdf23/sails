angular.module ('brushfire_videosPage', []).config ([
  '$sceDelegateProvider',
  function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist ([
      'self',
      '*://www.youtube.com/**',
    ]);
  },
]);

angular.module ('brushfire_videosPage').controller ('PageCtrl', [
  '$scope',
  '$timeout',
  function ($scope, $timeout) {
    $scope.videosLoading = true;

    $timeout (function afterRetrievingVideos () {
      var _videos = [
        {
          title: 'FUNNY BABY VIDEOS',
          src: 'https://www.youtube.com/embed/_FvTVWjLiHM',
        },
        {
          title: 'Justin Bieber - Baby ft. Ludacris',
          src: 'https://www.youtube.com/embed/kffacxfA7G4',
        },
        {
          title: 'Charlie bit my finger - again !',
          src: 'https://www.youtube.com/embed/_OBlgSz8sSM',
        },
      ];

      $scope.videosLoading = false;
      $scope.videos = _videos;
    }, 750);

    $scope.submitNewVideo = function () {
      // A little "spin-lock" to prevent double-submission
      // (because disabling the submit button still allows double-posts
      //  if a user hits the ENTER key to submit the form multiple times.)
      if ($scope.busySubmittingVideo) {
        return;
      }

      // Harvest the data out of the form
      // (thanks to ng-model, it's already in the $scope dictionary)
      var _newVideo = {
        title: $scope.newVideoTitle,
        src: $scope.newVideoSrc,
      };

      // create placeholder anchor element
      var parser = document.createElement ('a');

      // assign url to parser.href
      parser.href = _newVideo.src;

      // Use the indexOf parser.search as the first argument and length of
      // parser.search as the second argument of parser.search.substring
      // The result is the YouTube ID --> LfOWehvvuo0
      var youtubeID = parser.search.substring (
        parser.search.indexOf ('=') + 1,
        parser.search.length
      );

      _newVideo.src = 'https://www.youtube.com/embed/' + youtubeID;

      // (this is where you put your client-side validation when relevant)

      // Side note:
      // Why not use something like `$scope.videoForm.title` or `$scope.newVideo.title`?
      // While this certainly keeps things more organized, it is a bit risky in the Angular
      // world.  I'm no Angular expert, but we have run into plenty of 2-way-binding issues/bugs
      // in the past from trying to do this.  I've found two guiding principles that help prevent
      // these sorts of issues:
      // + very clearly separate the $scope variables in your form from the $scope variables
      //   representing the rest of your page.
      // + don't point `ng-model` at the property of an object or array (e.g. `ng-model="foo.bar"`)
      //   Angular handles its 2-way bindings by reference, and it's not too hard to get into weird
      //   situations where your objects are all tangled up.

      // Now we'll submit the new video to the server:

      // First, show a loading state
      // (also disables form submission)
      $scope.busySubmittingVideo = true;

      // Simulate a delay
      $timeout (function () {
        // TODO: handle error state from the server
        // Success!
        // Now we know it's the real deal and the server accepted our submission.

        // Insert HTML for the newly added video into the DOM
        $scope.videos.unshift (_newVideo);

        // Hide the loading state
        // (also re-enables form submission)
        $scope.busySubmittingVideo = false;

        // Clear out form inputs
        $scope.newVideoTitle = '';
        $scope.newVideoSrc = '';
      }, 750);
    };
  },
]);

// $(function whenDomIsReady() {

//   $('.the-list-of-videos .loading').show();

//   setTimeout(function afterRetrievingVideos() {
//     var videos = [{
//       title: 'FUNNY BABY VIDEOS',
//       src: 'https://www.youtube.com/embed/_FvTVWjLiHM'
//     }, {
//       title: 'Justin Bieber - Baby ft. Ludacris',
//       src: 'https://www.youtube.com/embed/kffacxfA7G4'
//     }, {
//       title: 'Charlie bit my finger - again !',
//       src: 'https://www.youtube.com/embed/_OBlgSz8sSM'
//     }];

//     $('.the-list-of-videos .loading').hide();

//     var videosHtml = _.reduce(videos, function (html, video) {
//       html += '<li class="video">' +
//         '  <h2>' + video.title + '</h2>' +
//         '  <iframe width="640" height="390" src="' + video.src + '" frameborder="0" allowfullscreen></iframe>' +
//         '</li>';
//       return html;
//     }, '');

//     $('.the-list-of-videos ul').replaceWith(videosHtml);

//   }, 750);

//   // submit button video
//   $('.submit-video-form').submit(function (e) {

//     e.preventDefault();

//     var newVideo = {
//       title: $('.submit-video-form input[name="title"]').val(),
//       src: $('.submit-video-form input[name="src"]').val()
//     };

//     $('.submit-video-form input').val('');
//     $('.submit-video-form button').text('Submitting...');
//     $('.submit-video-form button').prop('disabled', true);

//     var parser = document.createElement('a');

//     parser.href = newVideo.src

//     var youtubeID = parser.search.substring(parser.search.indexOf("=") + 1, parser.search.length);

//     newVideo.src = 'https://www.youtube.com/embed/' + youtubeID;

//     setTimeout(function () {
//       var newVideoHtml = '<li class="video">' + //#E
//         '  <h2>' + newVideo.title + '</h2>' +
//         '  <iframe width="640" height="390" src="' + newVideo.src + '" frameborder="0" allowfullscreen></iframe>' +
//         '</li>';

//       $('.the-list-of-videos').prepend(newVideoHtml); //#F
//       $('.submit-video-form button').text('Submit Video');
//       $('.submit-video-form button').prop('disabled', false);

//     }, 750);
//   });

// });
