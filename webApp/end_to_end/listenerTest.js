
casper.on('remote.message', function(msg) {
  this.echo('remote.msg: ' + msg);
});

casper.on('page.error', function(msg, trace) {
  this.echo('page.error: ' + msg);
});

// phantom.cookiesEnabled = true;

casper.test.begin("Testing radio from listener's perspective", 20, function suite(test) {
  casper.start();

  casper.thenOpen('http://localhost:3000', function() {
    test.assertTitle('Silent Disco', 'title is expected title');
    test.assertExists('h1', 'a header exists');
    test.assertSelectorHasText('h1', 'Listen', 'header reads listen');
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
//except the stream should actually exist…
  });

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
//except the stream should actually exist…
  });

});

casper.run(function() {
  this.test.done();
});

//casperjs --engine=slimerjs test listenerTest.js
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

  // casper.wait(1000, function() {
  //   test.assertEvalEquals(function() {
  //     var rootDiv = document.getElementById('root');
  //     __utils__.echo(rootDiv.childElementCount);
  //     return true;
  //   }, true, 'so, so helpless');
  // });

  // casper.then(function() {
  //   test.assertEvalEquals(function() {
  //     var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
  //     var styles = divs.map(function(item) {
  //       return window.getComputedStyle(item);
  //     });
  //     // .filter(function(elem) {
  //     //   return elem.borderRadius === '15px';
  //     // });
  //     __utils__.echo(Object.keys(styles[0]));
  //     return styles.length > 0;
  //   }, true, 'there is a div with border radius 15');
  // });

//casperjs --engine=slimerjs test listenerTest.js
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

  // casper.wait(1000, function() {
  //   test.assertEvalEquals(function() {
  //     var rootDiv = document.getElementById('root');
  //     __utils__.echo(rootDiv.childElementCount);
  //     return true;
  //   }, true, 'so, so helpless');
  // });

  // casper.then(function() {
  //   test.assertEvalEquals(function() {
  //     var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
  //     var styles = divs.map(function(item) {
  //       return window.getComputedStyle(item);
  //     });
  //     // .filter(function(elem) {
  //     //   return elem.borderRadius === '15px';
  //     // });
  //     __utils__.echo(Object.keys(styles[0]));
  //     return styles.length > 0;
  //   }, true, 'there is a div with border radius 15');
  // });

  //theory; I'm hitting the loading page, then not leaving. That would be bad

  // casper.waitForSelector('button', function() {
  //   test.assertEvalEquals(function() {
  //     return __utils__.findOne('h1').textContent;
  //   }, 'Listen', 'user lands at Listen page');
  //   });

  // casper.then(function() {
  //   this.click('.penguin button');
  // });

  // casper.then(function() {
  //   this.wait(1000, function() {
  //     test.assertEvalEquals(function() {
  //       var navbarPossibs = [];
  //       var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
  //       for (var i = 0; i < divs.length; i++) {
  //         //so at least I can get the element by reactId
  //         // if (divs[i].getAttribute('data-reactid') === '.0.0.0.1') {
  //         if (divs[i].style.left === '0px' && divs[i].style.width === '256px') {
  //           navbarPossibs.push(divs[i]);
  //         }
  //       }
  //       return navbarPossibs.length;
  //     }, 1, 'navbar appears on left side');
  //   });
  // });

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