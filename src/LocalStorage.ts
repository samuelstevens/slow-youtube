import { Channel, Video } from './Structures';

const KEYS = {
  CHANNELS: 'channels',
  SEEN_VIDEOS: (channelId: string): string => {
    return `seen-videos-${channelId}`;
  },
};


class LocalStorage {
  private _channels: Channel[];
  private _seenVideoIds: Record<string, string[]>;

  constructor() {

    this.channels = this.getObject(KEYS.CHANNELS, []);

    this._seenVideoIds = {};
    this.channels.forEach(chan => {
      this._seenVideoIds[chan.id] = this.getObject(KEYS.SEEN_VIDEOS(chan.id), []);
    });
  }

  get channels(): Channel[] {
    return this._channels;
  }

  set channels(channels: Channel[]) {
    this.setObject(KEYS.CHANNELS, channels);

    this._channels = channels;
  }

  get seenVideoIds(): Record<string, string[]> {
    return this._seenVideoIds;
  };

  set seenVideoIds(videoIds: Record<string, string[]>) {
    for (const channelId in videoIds) {
      this.setObject(KEYS.SEEN_VIDEOS(channelId), videoIds[channelId]);
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

    this.setObject(KEYS.CHANNELS, this.channels);
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
      this.removeObject(KEYS.SEEN_VIDEOS(channelId));
    }
  };

  getObject = <T>(key: string, defaultObj: T): T => {
    const stored = window.localStorage.getItem(key);

    return stored ? JSON.parse(stored) : defaultObj;
  };

  setObject = (key: string, obj: any) => {
    window.localStorage.setItem(key, JSON.stringify(obj));
  };

  removeObject = (key: string) => {
    window.localStorage.removeItem(key);
  };
}

export default LocalStorage;;