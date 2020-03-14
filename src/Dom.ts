import { Channel, Video } from './Structures';
import { removeChannel } from './Channels';
import { makeDateString } from './Util';
import LocalStorage from './LocalStorage';

const channelDomId = (channel: Channel, isSelector: boolean) => {
  let id = `channel-${channel.name}`;
  if (isSelector) {
    id = '#' + id;
  }
  return id;
};

const videoDomId = (video: Video, isSelector: boolean) => {
  let id = `video-${video.id}`;
  if (isSelector) {
    id = '#' + id;
  }
  return id;
};

const markVideoAsSeen = (video: Video, storage: LocalStorage) => {
  $(videoDomId(video, true)).addClass('seen');
  storage.markVideoAsSeen(video);
};

const makeIFrame = (video: Video): JQuery<HTMLElement> => {
  return $('<iframe>')
    .attr('src', `https://www.youtube-nocookie.com/embed/${video.id}`)
    .attr('frameborder', 0)
    .attr('allow', "fullscreen")
    .attr('allowfullscreen', '');
};

const showVideo = (video: Video, storage: LocalStorage) => {
  /**
   * video: an object that passes validateVideo()
   * Puts a div containing an <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/opvXNnv0Sq8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> on the screen.
   */

  /*
  <div id="video-player">
    <div class="aspect-ratio">
      <iframe src="https://www.youtube-nocookie.com/embed/opvXNnv0Sq8" frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <button>Finished</button>
    <button>Already seen it</button>
    <button>Exit</button>
  </div>
  */



  const playerElement = $("<div><div></div></div>")
    .attr('id', "video-player")
    .find("div")
    .addClass('aspect-ratio')
    .end();

  playerElement.find('div').append(makeIFrame(video));

  playerElement.append($("<button>").text("Finished").click(() => {
    playerElement.remove();
    $("body").removeClass('stop-scrolling');
    $(".content").removeClass('blurred');
    markVideoAsSeen(video, storage);
  }));

  // FUTURE
  // playerElement.append($("<button>").text("Already seen it").click(() => {
  //   playerElement.remove();
  //   enableScrolling();
  //   // TODO: make video 'seen' and all previous videos 'seen'
  // }));

  playerElement.append($("<button>").text("Exit").click(() => {
    playerElement.remove();
    $("body").removeClass('stop-scrolling');
    $(".content").removeClass('blurred');
  }));

  $('html, body').animate({ scrollTop: 0 }, 400, () => {
    $("body").append(playerElement);
    $("body").addClass('stop-scrolling');
    $(".content").addClass('blurred');
  });
};

const makeThumbnail = (video: Video, storage: LocalStorage): JQuery<HTMLElement> => {
  /**
   * video: an object that passes validateVideo()
   * returns: DOM element with a thumbnail, description, etc., and link to showVideo
   */

  /*
    <div class="video-thumbnail">
      <img src="https://i.ytimg.com/vi/5WCQMWMqOX0/sddefault.jpg" />
      <h2>
        Holy Mackerel + Cobalt Guardian = Strong ft. Zalae | Firebat Battlegrounds
      </h2>
      <h3>Firebat</h3>
      <span>March 13, 2020</span>
    </div>
  */

  const channelElement = $('<div><img/><h3></h3><span></span>')
    .addClass("video-thumbnail")
    .attr('id', videoDomId(video, false))
    .click(() => showVideo(video, storage))
    .find("img")
    .attr("src", video.thumbnail)
    .end()
    .find("h3")
    .html(video.title)
    .end()
    .find("span")
    .html(makeDateString(video.publishDate))
    .end();

  if (storage.seen(video)) {
    channelElement.addClass("seen");
  }

  return channelElement;
};

const writeChannelTitle = (channel: Channel): JQuery<HTMLElement> => {
  const title = $('#video-list').children(channelDomId(channel, true));
  if (title.length > 0) {
    // title already exists.
    return title;
  }

  const channelColumn = $('<div><h2></h2></div>')
    .attr('id', channelDomId(channel, false))
    .find('h2')
    .html(channel.name)
    .end();
  $('#video-list').append(channelColumn);

  return channelColumn;
};

const writeChannelVideos = (channel: Channel, videos: Video[], storage: LocalStorage) => {
  const channelTitle = writeChannelTitle(channel);

  videos
    .map(video => makeThumbnail(video, storage))
    .forEach(thumbnail => {
      channelTitle.append(thumbnail);
    });
};

const writeChannelName = (channel: Channel, storage: LocalStorage) => {
  const channelElement = $('<div><span></span><button></button></div>')
    .addClass('channel-name')
    .find('span')
    .text(channel.name)
    .end()
    .find('button')
    .html('Remove')
    .click(() => {
      if (confirm(`Are you sure you want to stop watching ${channel.name}?`)) {
        removeChannel(channel, storage);
      }
    }).end();


  $('#channel-list').append(channelElement);
};

// FUTURE: use better name
const removeChannelVideos = (channel: Channel) => {
  /**
   * Removes a channel from the 
   */

  // TODO
};

export { writeChannelName, writeChannelVideos, removeChannelVideos };