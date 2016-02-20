import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

// COMPONENTS
import StreamEntry from './StreamEntry.js';
import NavBar from './NavBar.js';
import Loading from './Loading.js';
import NoStream from './NoStream.js';

// MATERIAL UI
import List from '../../node_modules/material-ui/lib/lists/list';
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardMedia from '../../node_modules/material-ui/lib/card/card-media';
import Paper from '../../node_modules/material-ui/lib/paper';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import FlatButton from '../../node_modules/material-ui/lib/flat-button';
import Favorite from '../../node_modules/material-ui/lib/svg-icons/action/favorite';
import Colors from '../../node_modules/material-ui/lib/styles/colors';


class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  goToListen() {
    this.history.push({
      pathname: '/listen'
    });
  }

  createBroadcast() {
    this.history.push({
      pathname: '/broadcast/setup'
    });
  }


  render() {

    return (
      <div>
        <NavBar title="" history={this.history}/>

        <div style={styles.cover}>
          <div style={styles.boxCenter}>
            <img src='http://www.iconsplace.com/icons/preview/white/radio-tower-256.png'/>
          </div>
          <div style={styles.boxCenter}>
            <h1 style={styles.titleFont}>Socket Radio</h1>
            <h2 style={styles.subtextFont}>Be Heard. Listen In.</h2>
          </div>
          <div style={styles.boxCenter}>
            <RaisedButton onClick={this.goToListen.bind(this)} label="Let's Go" primary={true} style={styles.buttonCover}/>
          </div>
        </div>

        <div style={styles.whiteSection}>
          <div style={styles.flexRow}>

            <div style={styles.boxLeft}>
              <div style={styles.boxLeft}>
                <h1 style={styles.titleFontBlack}>Listen Together... Wherever, Whenever</h1>
                <h2 style={styles.subtextFontBlack}>
                  Join live streams from any of your devices and send hearts to your favorite broadcasters
                  <Favorite style={styles.icon} color={Colors.red500}/>
                </h2>
              </div>
              <div style={styles.boxLeft}>
                <FlatButton onClick={this.goToListen.bind(this)} label="Listen" secondary={true} style={styles.buttonSection}/>
              </div>
            </div>

            <div style={styles.boxRight}>
              <img style={styles.img} src='http://digitalsynopsis.com/wp-content/uploads/2013/12/flat-design-apple-icon-devices.jpg'/>
            </div>

          </div>
        </div>

        <div style={styles.whiteSection}>
          <div style={styles.flexRow}>

            <div style={styles.boxLeft}>
              <div style={styles.LeftRight}>
                <img style={styles.img} src='http://i.imgur.com/FPXsrKD.png'/>
              </div>
            </div>

            <div style={styles.boxRight}>
              <div style={styles.boxRight}>
                <h1 style={styles.titleFontBlack}>Share Your Sound with the World</h1>
                <h2 style={styles.subtextFontBlack}>
                  Create a live broadcast from your desktop or laptop using your microphone, line-in, or SoundCloud
                </h2>
              </div>
              <div style={styles.boxRight}>
                <FlatButton onClick={this.createBroadcast.bind(this)} label="Broadcast" primary={true} style={styles.buttonSection}/>
              </div>
            </div>
            
          </div>
        </div>

        <div style={styles.blackSection}>
          <span><a style={styles.footerText} href='https://github.com/deliquescentlicorice/silent-disco'>Team</a><span style={styles.footerText}> | </span><a style={styles.footerText} href='https://github.com/deliquescentlicorice/silent-disco'>GitHub <i className="fa fa-github"></i></a></span>
          <div>
            <span style={styles.subFooterText}><i className="fa fa-copyright"></i> 2016 Deliquescent Licorice</span>
          </div>
        </div>

      </div>
    )
  }
}

var styles = {
  cover: {
    backgroundColor:'#00bcd4',
    overflow:'hidden',
    padding:'24px',
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center'
  },

  titleFont: {
    fontWeight:'300',
    fontFamily: 'Roboto, sans-serif',
    color:'rgba(255,255,255,0.87)',
    textAlign: 'center'
  },

  subtextFont: {
   'fontWeight': '300',
   'fontSize': '20px',
    fontFamily: 'Roboto, sans-serif',
    color:'rgba(255,255,255,0.87)',
    textAlign: 'center'
  },

  buttonCover: {
    fontFamily: 'Roboto, sans-serif',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
  },

  buttonSection: {
    fontFamily: 'Roboto, sans-serif',
    textAlign: 'center',
    display: 'flex'

  },

  flexRow: {
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center'
  },

  img: {
    width: '100%',
    height: 'auto'
  }, 

  boxCenter: {
    flex: 1,
    alignSelf: 'center'
  },

  boxLeft: {
    flex: 1,
    alignSelf: 'left'
  },

  boxRight: {
    flex: 1,
    alignSelf: 'right'
  },

  titleFontBlack: {
    fontWeight:'300',
    fontFamily: 'Roboto, sans-serif',
    color:'black',
    textAlign: 'left'
  },

  subtextFontBlack: {
   'fontWeight': '300',
   'fontSize': '20px',
    fontFamily: 'Roboto, sans-serif',
    color:'black',
    textAlign: 'left'
  },

  greySection: {
    backgroundColor:'rgb(238, 238, 238)',
    overflow:'hidden',
    padding:'24px',
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center'
  },

  whiteSection: {
    backgroundColor:'white',
    overflow:'hidden',
    padding:'24px',
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center'
  },

  blackSection: {
    padding: '48px 24px',
    backgroundColor:'rgb(33, 33, 33)',
    overflow:'hidden',
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center',
    textAlign: 'center' 
  },

  boxText: {
    maxWidth:'700px',
    margin:'0 auto',
    padding: 0,
    fontWeight: 300,
    fontSize: '20px',
    lineHeight: '28px',
    paddingTop: '19px',
    marginBottom: '13px',
    letterSpacing: 0,
    color:'rgba(0, 0, 0, 0.87)'
  },

  footerText: {
    margin: '0 auto',
    padding: 0,
    color:'white',
    maxWidth: '335px',
    textDecoration: 'none',
    fontFamily: 'Roboto, sans-serif',
  },

  subFooterText: {
    margin: '0 auto',
    padding: 0,
    color:'white',
    maxWidth: '335px',
    textDecoration: 'none',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '50%'
  }

  
}

reactMixin.onClass(Landing, History);

export default Landing;
