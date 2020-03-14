import { addChannel } from './Channels';
import LocalStorage from './LocalStorage';
import { writeChannelName, writeChannelVideos } from './Dom';
import { getUploadedVideos } from './YouTube';

const STORAGE = new LocalStorage();

const main = () => {
  /**
   * Adds event handlers to DOM
   */

  const form = document.querySelector('.new-channel-form') as HTMLFormElement;

  form.onsubmit = (_) => {
    const channelUrl = new FormData(form).get('url') as string;
    addChannel(channelUrl, STORAGE);
    return false;
  };

  // Writes channels to the sidebar.
  STORAGE.channels.forEach(ch => writeChannelName(ch, STORAGE));

  // Get videos for each channel
  STORAGE.channels.forEach(ch => {
    getUploadedVideos(ch, (result) => {
      if (typeof result === 'string') {
        alert(result);
      } else {
        writeChannelVideos(ch, result, STORAGE);
      }
    });
  });
};

window.addEventListener("load", main, false);