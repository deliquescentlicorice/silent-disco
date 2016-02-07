//casper file
//listener should:
//navigate to localhost:3000
//there should be a list of icons and a navbar
//the listener should click on one icon
//then go to another page, localhost:3000/stream/...

//NB: we'll need to edit out the hardcoded references to localhost
//probably with hardcoded referencest to our deployment server
//since that's part of what we're testing

casper.test.begin("Testing Radio from listener's perspective", 3, function suite(test) {
  casper.start('http://localhost:3000', function() {
    test.assertTitle("Silent Disco", 'application title is the one expected');
    test.assertEvalEquals(function() {
      return __utils__.findOne('h1').textContent;
    }, 'Listen', 'user lands at Listen page');
  });


  casper.then(function() {
    this.wait(1000, function() {
      test.assertEvalEquals(function() {
        var navbarPossibs = [];
        var divs = Array.prototype.slice.call(document.querySelectorAll('div'));
        for (var i = 0; i < divs.length; i++) {
          if (divs[i].style.left === '0px' && divs[i].style.width === '256px') {
            navbarPossibs.push(divs[i]);
          }
        }
        return navbarPossibs.length;
    });
  });

  casper.run(function() {
    test.done();
  });
});

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