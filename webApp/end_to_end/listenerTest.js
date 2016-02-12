casper.on('remote.message', function(msg) {
  this.echo('remote.msg: ' + msg);
});

casper.on('page.error', function(msg, trace) {
  this.echo('page.error: ' + msg);
});

// phantom.cookiesEnabled = true;

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
        last_name: "Doe",
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

  //ok, so muzak doesn't exist anymore, bcs I eliminated all the streams that aren't playing…
  //how  do I check that something isn't there?
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

  //first things first: make sure I'm in the right place
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
    this.click('.hamburger');
  });

  casper.thenEvaluate(function() {
    //find the first stream, then click on it
    var divs = divs.filter(function(elem){
return elem.textContent === 'muzak';
});
    divs[0].classList.add('muzak');
  });

  casper.then(function() {
    this.click('.muzak');
  });

  casper.then(function() {
    this.wait(1000, function() {});
  });

  casper.then(function() {
    var v = slimer.geckoVersion;
    this.echo('version: ' + v.major + '.' + v.minor + '.' + v.patch);
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

  //find the drop-down menu, find the built-in microphone, then select it
  //find the drop-down menu, click on the built-in microphone in the menu
  //then check that we have the same built-in microphone, and not anything else
  //then launch the stream
  //

  // casper.thenEvaluate(function() {
  //     //find the first stream, then click on it
  //     var divs = Array.prototype.slice.call(document.querySelectorAll('div'))
  //       .filter(function(elem) {
  //         return elem.textContent === 'muzak';
  //       }); 
  //       divs[0].classList.add('muzak');
  //     });

  //   casper.then(function() {
  //     this.click('.muzak');
  //   });

});

casper.run(function() {
  this.test.done();
});

//create a profile ioRadioTester, and put the following there:
// user_pref("media.navigator.permission.disabled", true);

//before running, run this command from the command line:
//export SLIMERJSLAUNCHER=/opt/firefox39/firefox (or wherever firefox39 is installed.)
//*must* be 39, any lower, and no audio support, any higher, and Slimer won't work
//we need a firefox 39 or higher
//casperjs test --engine=slimerjs -P  ioRadioTester listenerTest.js
//doc this ^, not the obvious command
//from Listen,  click on left navbar
//click on Listen menu item, does nothing
//check for login button
//login button takes user to login page
//login with soundcloud
//check for create broadcast, profile, logout options
//click on stream in list
//route to a stream (check URL)
//click play (no more than once) (ie, button, disabled after clicked)
//click pause, play button is reenabled
//click heart, should upheart the song
// });


// casper.on('remote.message', function(msg) {
//   this.echo('remote.msg: ' + msg);
// });

// casper.userAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

// casper.test.begin("Testing Radio from listener's perspective", 1, function suite(test) {
//   casper.start('http://localhost:3000', function() {
//     this.echo(this.getPageContent());
//     test.assertTitle('Silent Disco', 'application title is the one expected');
//     //my guess is that casper only sees index.html, which has a single div
//     // test.assertEvalEquals(function() {
//     //   var divs = document.querySelectorAll('div');
//     //   var rootDiv = document.getElementById('root');
//     //   var mysteryDivZ = window.getComputedStyle(Array.prototype.slice.call(divs)[1]).zIndex;
//     //   __utils__.echo(rootDiv.childElementCount);
//     //   //returns 0; but everything I care about is a child of root!
//     //   return true;
//     // }, true, 'so helpless');
//     //I seem to have an extra script tag and an extra div?
//   });


//   casper.run(function() {
//     test.done();
//   });
// });

//     test.assertEvalEquals(function() {
//       this.click('button');
//       var navbars;
//       this.wait(1000, function() {
//         var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
//         var navbarPossibs = [];
//         for (var i = 0; i < divs.length; i++) {
//           if (divs[i].style.left === '0px' && divs[i].style.width === '256px') {
//             navbarPossibs.push(divs[i]);
//           }
//         }
//         navbars = navbarPossibs.length;
//       });
//       return navbars;
//     }, 2, 'navbar appears on left side');
//   });
// });

// this.click('button');
// casper.then(function() {
//   this.wait(1000, function() {
//     test.assertEvalEquals(function() {
//       var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
//       var navbarPossibs = [];
//       for (var i = 0; i < divs.length; i++) {
//         if (divs[i].style.left === '0px' && divs[i].style.width === '256px') {
//           navbarPossibs.push(divs[i]);
//         }
//       }
//       __utils__.echo(Object.keys(navbarPossibs[0].style));
//       return this.visible(navbarPossibs[0]);
//     }, true, 'navbar appears on the left');
//   });
// test.assertEvalEquals(function() {
//   var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
//   var navbarpossibs = [];
//   for (var i = 0; i < divs.length; i++) {
//     if (divs[i].style.left === '0px' && divs[i].style.width === '256px') {
//       navbarpossibs.push(divs[i]);
//     }
//   }
//   if (navbarpossibs.length === 1) {
//     return true;
//   }
//   else {
//     return null;
//   }
//   var divStyles = divs.map(function(item) {
//     return item.style;
//     // return window.getComputedStyle(item, null);
//   });
//   // __utils__.echo(Object.keys(divStyles[0]));
//   // __utils__.echo(divStyles[0]['transitionTimingFunction']);
//   var opaqueStyles = divStyles.map(function(style) {
//     return style['left'] === '0px' && style['width'] === '256px';
//      // && style[left] === '0px' && style[transitionProperty] !== 'all';
//             // && style.hasOwnProperty("will-change");
//       // && style.hasOwnProperty("left")
//       // && style[opacity] === '1' 
//       // && style[will - change] === 'opacity'
//       // &&style[left] === '0px';
//   });
//   // __utils__.echo(Object.keys(divStyles[0]));
//   // __utils__.echo(divStyles.map(function(style) {
//   //   return style['transitionProperty'];
//   // }));
//   return opaqueStyles.reduce(function(item1, item2) {
//     return item1 || item2;
//   }, false);
// }, true, "navbar appears on the left");
//make sure the left navbar appears
//checking the react id is a bad idea: that could change in later versions!
//instead, we check that there exists a div with 1) will-change opacity
//2) left-position is 0px, 3) opacity is 1
// test.assertEvalEquals(function() {
//     var divs = __utils__.findAll('div');
//     return divs.map(function(item) {
//         var cs = window.getComputedStyle(item, null);
//         if (cs['will-change'] === 'opacity' && cs[opacity] === '1' && cs[left] === '0px') {
//             return true;
//         } 
//         else {
//             return false;
//         }
//     }).reduce(function(boolean1, boolean1) {
//         return boolean1 || boolean2;
//     }, false);
// }, true, 'navbar div appears on left');
// });
//from Listen,  click on left navbar
//click on Listen menu item, does nothing
//check for login button
//login button takes user to login page
//login with soundcloud
//check for create broadcast, profile, logout options
//click on stream in list
//route to a stream (check URL)
//click play (no more than once) (ie, button, disabled after clicked)
//click pause, play button is reenabled
//click heart, should upheart the song
// });