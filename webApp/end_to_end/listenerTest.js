casper.on('remote.message', function(msg) {
  this.echo('remote.msg: ' + msg);
});

casper.on('page.error', function(msg, trace) {
  this.echo('page.error: ' + msg);
});

casper.test.begin("Testing radio from listener's perspective", 35, function suite(test) {
  casper.start();

  casper.thenOpen('http://localhost:3000', function() {
    test.assertTitle('Socket Radio', 'title is expected title');
    test.assertEvalEquals(function() {
      var buttons = Array.prototype.slice.call(document.querySelectorAll('button'))
        .filter(function(elem) {
          return window.getComputedStyle(elem)['background-color'] === 'rgb(255, 64, 129)';
        });
      return buttons.length;
    }, 1, 'one pink button appears on landing page');
  });

  casper.thenEvaluate(function() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'))
      .filter(function(elem) {
        return window.getComputedStyle(elem)['background-color'] === 'rgb(255, 64, 129)';
      });
      buttons[0].classList.add('pink-listen');
  });

  casper.then(function() {
    this.click('.pink-listen');
    this.echo(this.getCurrentUrl());
  });

  casper.then(function() {
    test.assertExists('h1', 'a header exists');
    test.assertSelectorHasText('h1', 'Listen', 'header reads listen');
  });

  casper.thenEvaluate(function() {
    //make sure user is logged out
    localStorage.removeItem('me');
  });

  casper.then(function() {
    this.click('button');
  });

  casper.then(function() {

    test.assertEval(function() {
      var changedDivs = Array.prototype.slice.call(document.querySelectorAll('div'))
        .map(function(elem) {
          return window.getComputedStyle(elem);
        }).filter(function(style) {
          return style.transitionProperty === 'transform';
        });
      return changedDivs.length === 1 && changedDivs[0].left === '0px';
    }, 'exactly one div changed on click, and that div is on the left');
  });

  casper.thenEvaluate(function() {
    var changedDivs = Array.prototype.slice.call(document.querySelectorAll('div'))
      .filter(function(elem) {
        return window.getComputedStyle(elem).transitionProperty === 'transform';
      });
    changedDivs[0].classList.add('left-navbar');
  });


  casper.then(function() {
    test.assertSelectorHasText('.left-navbar > div:nth-child(2) span', 'Listen', 'menu item reads listen');
    this.click('.left-navbar > div:nth-child(2) span');
  });

  casper.then(function() {
    test.assertVisible('.left-navbar', 'left navbar still visible after click on listen');
  });

  casper.then(function() {
    //last-child of navbar is broadcast, last-child of that is a wrapper div, last-child of that is login
    test.assertSelectorHasText('.left-navbar > div:last-child > div:last-child > div:last-child span',
      'Login', 'last menu item reads login');
    this.click('.left-navbar > div:last-child > div:last-child > div:last-child span');
  });

  casper.then(function() {
    this.wait(1000, function() {
      test.assertEvalEquals(function() {
        return document.location.pathname;
      }, '/login', 'login button sends user to login page');
    });
    //check that the soundcloud button exists, then click it
    test.assertEvalEquals(function() {
      var buttonSpans = Array.prototype.slice.call(document.querySelectorAll('button span'))
        .filter(function(elem) {
          return elem.classList.length === 0;
        });
      return buttonSpans.length;
    }, 1, 'there is a nontrivial button');
  });
  });

  casper.then(function() {
    this.wait(1000, function() {
      test.assertEvalEquals(function() {
        return document.location.pathname;
      }, '/login', 'login button sends user to login page');
    });
    //check that the soundcloud button exists, then click it
    test.assertEvalEquals(function() {
      var buttonSpans = Array.prototype.slice.call(document.querySelectorAll('button span'))
        .filter(function(elem) {
          return elem.classList.length === 0;
        });
        return buttonSpans.length;
    }, 1, 'there is a nontrivial button');
  });

  casper.thenEvaluate(function() {
    var buttonSpans = Array.prototype.slice.call(document.querySelectorAll('button span'))
      .filter(function(elem) {
        return elem.classList.length === 0;
      });
    buttonSpans[0].classList.add('soundcloud');
  });

  casper.then(function() {
    test.assertSelectorHasText('.soundcloud ', 'Login With SoundCloud', 'soundcloud button has expected text');
    this.click('.soundcloud');
  });

  casper.then(function() {
    this.wait(2000, function() {

    });
  });

  //the next two tests work irregularly; timing isn't guaranteed
  casper.waitForPopup('', function() {
    test.assertEquals(this.popups.length, 1, 'a single popup window appears');
  });

  casper.then(function() {
    this.wait(1000, function() {

    });
  });

  casper.withPopup('', function() {
    test.assertTitle('Authorize access to your account on SoundCloud - Create, record and share your sounds for free',
      'popup title is the expected title');
    //facebook and google OAuth buttons appear
    test.assertExists('.facebook-signin');
    test.assertExists('.google-plus-signin');
  });

  casper.thenOpen('http://localhost:3000/listen', function() {
    //dump spoofed data into localstorage
    this.evaluate(function() {
      var spoof = {
        avatar_url: "https://i1.sndcdn.com/avatars-000202938842-4r611z-large.jpg",
        city: null,
        country: null,
        description: null,
        discogs_name: null,
        first_name: "Max",
        followers_count: 1,
        followings_count: 0,
        full_name: "Max Kahn",
        id: 203676733,
        kind: "user",
        last_modified: "2016/02/11 01:22:58 +0000",
        last_name: "Kahn",
        locale: "",
        myspace_name: null,
        online: false,
        permalink: "max-kahn-987548411",
        permalink_url: "http://soundcloud.com/max-kahn-987548411",
        plan: "Free",
        playlist_count: 0,
        primary_email_confirmed: true,
        private_playlists_count: 0,
        private_tracks_count: 0,
        public_favorites_count: 0,
        quota: Object,
        subscriptions: Array[0],
        track_count: 0,
        upload_seconds_left: 10800,
        uri: "https://api.soundcloud.com/users/203676733",
        username: "Max Kahn",
        website: null,
        website_title: null
      };
      spoof = JSON.stringify(spoof);
      localStorage.setItem('me', spoof);
      __utils__.echo(localStorage.getItem('me'));
    });
  });

  casper.then(function() {
    this.reload(function() {
      this.echo('reloaded!');
    });
  });

  casper.then(function() {
    this.click('button');
  });

  casper.thenEvaluate(function() {
    var changedDivs = Array.prototype.slice.call(document.querySelectorAll('div'))
      .filter(function(elem) {
        return window.getComputedStyle(elem).transitionProperty === 'transform';
      });
    changedDivs[0].classList.add('left-navbar');
  });

  casper.then(function() {
    test.assertEval(function() {
      return !!localStorage.getItem('me');
    });
    test.assertSelectorHasText('.left-navbar > div:last-child > div span', 'Broadcast', 'menu item reads broadcast');
    test.assertSelectorHasText('.left-navbar > div:last-child > div > div:last-child > div:first-child div',
      'Create Broadcast', 'first broadcast submenu item: create broadcast');
    test.assertSelectorHasText('.left-navbar > div:last-child > div > div:last-child > div:nth-child(2) div',
      'Profile', 'second broadcast submenu item: profile');
    test.assertSelectorHasText('.left-navbar > div:last-child > div > div:last-child > div:last-child div',
      'Logout', 'last broadcast submenu item: logout');
  });

  casper.thenEvaluate(function() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'))
      .filter(function(elem) {
        return window.getComputedStyle(elem).top === '0px';
      });
    buttons[0].classList.add('hamburger');
  });

  casper.then(function() {
    this.click('.hamburger');
  });

  casper.then(function() {
    test.assertSelectorDoesntHaveText('body', 'example', 'example stream has not yet been created');
  });

  casper.then(function() {
    this.click('.hamburger');
  });

  //spoofing the MediaStreamTrack.getSources method that Chrome and Firefox have
  casper.thenEvaluate(function() {
    __utils__.echo(navigator.mediaDevices.enumerateDevices);
    var overSources = function(callback) {
      navigator.mediaDevices.enumerateDevices()
        .then(callback);
    };
    MediaStreamTrack.getSources = MediaStreamTrack.getSources || overSources;
  });

  casper.then(function() {
    //hitting create broadcast path
    this.click('.left-navbar > div:last-child > div > div:last-child > div:first-child div');
    this.echo(this.getCurrentUrl());
  });


  casper.then(function() {
    test.assertEvalEquals(function() {
      return document.location.pathname;
    }, '/broadcast/setup', 'landed on create broadcast page');
    test.assertExists('h1', 'a header exists');
    test.assertSelectorHasText('h1', 'Broadcast', 'header reads broadcast');
    test.assertSelectorHasText('span', 'Tell Us About Your Stream', 'invitation to describe stream appears');
  });

  casper.then(function() {
    this.wait(1000, function() {

    });
  });


  //the next several tests work irregularly; timing isn't guaranteed
  casper.waitForPopup('', function() {
    test.assertEquals(this.popups.length, 1, 'a single popup window appears');
  });

  casper.withPopup('', function() {
    test.assertTitle('Authorize access to your account on SoundCloud - Create, record and share your sounds for free',
      'popup title is the expected title');
    //facebook and google OAuth buttons appear
    test.assertExists('.facebook-signin');
    test.assertExists('.google-plus-signin');
  });

  casper.thenOpen('http://localhost:3000', function() {
    //dump spoofed data into localstorage
    this.evaluate(function() {
      var spoof = {
        avatar_url: "https://i1.sndcdn.com/avatars-000202938842-4r611z-large.jpg",
        city: null,
        country: null,
        description: null,
        discogs_name: null,
        first_name: "Max",
        followers_count: 1,
        followings_count: 0,
        full_name: "Max Kahn",
        id: 203676733,
        kind: "user",
        last_modified: "2016/02/11 01:22:58 +0000",
        last_name: "Kahn",
        locale: "",
        myspace_name: null,
        online: false,
        permalink: "max-kahn-987548411",
        permalink_url: "http://soundcloud.com/max-kahn-987548411",
        plan: "Free",
        playlist_count: 0,
        primary_email_confirmed: true,
        private_playlists_count: 0,
        private_tracks_count: 0,
        public_favorites_count: 0,
        quota: Object,
        subscriptions: Array[0],
        track_count: 0,
        upload_seconds_left: 10800,
        uri: "https://api.soundcloud.com/users/203676733",
        username: "Max Kahn",
        website: null,
        website_title: null
      };
      spoof = JSON.stringify(spoof);
      localStorage.setItem('me', spoof);
      __utils__.echo(localStorage.getItem('me'));
    });
  });

  casper.then(function() {
    this.reload(function() {
      this.echo('reloaded!');
    });
  });

  casper.then(function() {
    this.click('button');
  });

  casper.thenEvaluate(function() {
    var changedDivs = Array.prototype.slice.call(document.querySelectorAll('div'))
      .filter(function(elem) {
        return window.getComputedStyle(elem).transitionProperty === 'transform';
      });
    changedDivs[0].classList.add('left-navbar');
  });

  casper.then(function() {
    test.assertEval(function() {
      return !!localStorage.getItem('me');
    });
    test.assertSelectorHasText('.left-navbar > div:last-child > div span', 'Broadcast', 'menu item reads broadcast');
    test.assertSelectorHasText('.left-navbar > div:last-child > div > div:last-child > div:first-child div',
      'Create Broadcast', 'first broadcast submenu item: create broadcast');
    test.assertSelectorHasText('.left-navbar > div:last-child > div > div:last-child > div:nth-child(2) div',
      'Profile', 'second broadcast submenu item: profile');
    test.assertSelectorHasText('.left-navbar > div:last-child > div > div:last-child > div:last-child div',
      'Logout', 'last broadcast submenu item: logout');
  });

  casper.thenEvaluate(function() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'))
      .filter(function(elem) {
        return window.getComputedStyle(elem).top === '0px';
      });
    buttons[0].classList.add('hamburger');
  });

  casper.then(function() {
    this.click('.muzak');
  });

  casper.then(function() {
    this.wait(1000, function() {});
  });

  casper.then(function() {
    this.echo(this.getCurrentUrl());
    test.assertEvalEquals(function() {
      var divs = Array.prototype.slice.call(document.querySelectorAll('div'))
        .filter(function(elem) {
          return elem.hasAttribute('title');
        });
      return divs.length;
    }, 2, 'two title divs appear on broadcast live page');
  });

  casper.thenEvaluate(function() {
    var divs = Array.prototype.slice.call(document.querySelectorAll('div'))
      .filter(function(elem) {
        return elem.hasAttribute('title');
      });
    divs[1].classList.add('stream-title');
    divs[1].parentNode.classList.add('stream-description-wrapper');
  });

  casper.then(function() {
    this.wait(1000, function() {});
  });

  casper.then(function() {
    test.assertSelectorHasText('.stream-title > span', 'Max', 'stream name displays correctly');
    test.assertSelectorHasText('.stream-description-wrapper > div', 'example stream goes here',
      'stream description displays correctly');
    test.assertEvalEquals(function() {
      var divs = Array.prototype.slice.call(document.querySelectorAll('div'))
        .filter(function(elem) {
          return window.getComputedStyle(elem)['padding-left'] === '24px' && window.getComputedStyle(elem)['padding-right'] === '48px';
        });
      return divs.length;
    }, 1, 'a single padded menu div exists on broadcast live page');
  });

  casper.thenEvaluate(function() {
    var divs = Array.prototype.slice.call(document.querySelectorAll('div'))
      .filter(function(elem) {
        return window.getComputedStyle(elem)['padding-left'] === '24px' && window.getComputedStyle(elem)['padding-right'] === '48px';
      });
    divs[0].classList.add('select-audio');
  });

  casper.then(function() {
    test.assertSelectorHasText('.select-audio', 'Select a source', 'drop-down menu is correctly labeled');
    this.click('.select-audio');
  });

  casper.then(function() {
    test.assertSelectorHasText('body', 'Built-in Audio Analog Stereo', 'at least the menu item appears somewhere');
    test.assertEvalEquals(function() {
      var possibButtons = Array.prototype.slice.call(document.querySelectorAll('span'))
        .filter(function(elem) {
          return elem.hasAttribute('type') && elem.getAttribute('type') === 'button' && window.getComputedStyle(elem)['font-size'] === '15px';
        });
      return possibButtons.length;
    }, 3, 'there are three options in drop-down menu (assume no line-in)');
  });

  casper.thenEvaluate(function() {
    var possibButtons = Array.prototype.slice.call(document.querySelectorAll('span'))
      .filter(function(elem) {
        return elem.hasAttribute('type') && elem.getAttribute('type') === 'button' && window.getComputedStyle(elem)['font-size'] === '15px';
      });
    possibButtons[2].classList.add('microphone');
  });

  casper.then(function() {
    test.assertSelectorHasText('.microphone', 'Built-in Audio Analog Stereo', 'last item in drop-down is the microphone');
    this.click('.microphone');
  })

});

casper.run(function() {
  this.test.done();
});

//create a profile ioRadioTester, and put the following there:
//slimerjs -CreateProfile ioRadioTester

//then in that file:
// user_pref("media.navigator.permission.disabled", true);

//before running, run this command from the command line:
//export SLIMERJSLAUNCHER=/opt/firefox39/firefox (or wherever firefox39 is installed.)
//*must* be 39, any lower, and no audio support, any higher, and Slimer won't work

//run using the following command from commandline
//casperjs test --engine=slimerjs -P  ioRadioTester listenerTest.js
