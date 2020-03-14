import { Channel, Video } from './Structures';
import * as Cookies from 'js-cookie';

const COOKIES = {
  CHANNELS: 'channels',
  SEEN_VIDEOS: (channelId: string): string => {
    return `seen-videos-${channelId}`;
  },
};

class LocalStorage {
  private _channels: Channel[];
  private _seenVideoIds: Record<string, string[]>;

  constructor() {

    console.log('constructor', Cookies.getJSON());
    this.channels = Cookies.getJSON(COOKIES.CHANNELS) || [];
    this._seenVideoIds = {};
    this.channels.forEach(chan => {
      this._seenVideoIds[chan.id] = Cookies.getJSON(COOKIES.SEEN_VIDEOS(chan.id)) || [];
    });
  }

  get channels(): Channel[] {
    return this._channels;
  }

  set channels(channels: Channel[]) {
    Cookies.set(COOKIES.CHANNELS, channels);

    this._channels = channels;
  }

  get seenVideoIds(): Record<string, string[]> {
    return this._seenVideoIds;
  }

  set seenVideoIds(videoIds: Record<string, string[]>) {
    for (const channelId in videoIds) {
      Cookies.set(COOKIES.SEEN_VIDEOS(channelId), videoIds[channelId]);
    }

    this._seenVideoIds = videoIds;
  }

  saveChannel = (channel: Channel) => {
    /**
     * Saves the channel to offline storage.
     */

    const existingChannel = this.channels.find(ch => ch.id === channel.id);

    if (!existingChannel) { // just add it to the end
      this.channels.push(channel);

    } else {
      Object.assign(existingChannel, channel);
    }

    Cookies.set(COOKIES.CHANNELS, this.channels);
  };

  seen = (video: Video): boolean => {
    return this.seenVideoIds[video.channel.id].some(videoId => videoId === video.id);
  };

  markVideoAsSeen = (video: Video) => {
    if (!this.seen(video)) {
      this.seenVideoIds[video.channel.id].push(video.id);
      this.seenVideoIds = this.seenVideoIds;
    }
  };

  clearSeenVideos = () => {
    for (const channelId in this.seenVideoIds) {
      Cookies.remove(COOKIES.SEEN_VIDEOS(channelId));
    }
  };
}

export default LocalStorage;;