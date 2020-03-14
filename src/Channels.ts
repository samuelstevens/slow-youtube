import { getChannelInfo } from './YouTube';
import LocalStorage from './LocalStorage';
import { Channel } from './Structures';
import { parseChannelId } from './Util';
import { writeChannelName, removeChannelVideos } from './Dom';

const addChannel = (url: string, storage: LocalStorage) => {
  /**
   * Adds the channel to locally stored channels, writes it to the sidebar, and updates videos.
   */

  const channelId = parseChannelId(url);

  const existingChannel = storage.channels.find(ch => ch.id === channelId);

  if (!channelId) {
    alert(`Couldn't parse ${url}.`);
    return;
  }

  getChannelInfo(channelId, storage, (result) => {
    if (typeof result === 'string') {
      alert(result);
      return;
    }

    if (existingChannel) {
      alert(`Already subscribed to ${result.name}.`);
      return;
    }

    const newChannel = { id: channelId, ...result };

    storage.saveChannel(newChannel);
    writeChannelName(newChannel, storage);
    // updateAll();
  });
};

const removeChannel = (channel: Channel, storage: LocalStorage) => {
  /**
   * Removes a channel from local storage, the sidebar, and the channel's videos from the main content.
   */

  // Local storage
  const index = storage.channels.findIndex(ch => ch.id == channel.id);

  if (index > -1) {
    storage.channels = [...storage.channels.slice(0, index), ...storage.channels.slice(index + 1)];
  }

  // Sidebar
  $('.channel-name').remove();
  storage.channels.forEach(ch => writeChannelName(ch, storage));

  // channel videos
  removeChannelVideos(channel);
};

export { addChannel, removeChannel };