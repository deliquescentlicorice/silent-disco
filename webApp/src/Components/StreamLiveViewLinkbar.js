import React from 'react';

class StreamLiveViewLinkbar extends React.Component {
  render() {
    var linkBar = this.props.website ? (
      <div>{this.props.broadcaster}<br />
        <a href={this.props.soundcloud}>SoundCloud</a> - <a href={this.props.website}>{this.props.websiteTitle || this.props.website}</a>
      </div>
    ) : (
      <div>{this.props.broadcaster}<br />
        <a href={this.props.soundcloud}>SoundCloud</a>
      </div>
    )
    return linkBar;
  }
}

export default StreamLiveViewLinkbar;
