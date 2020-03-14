import LocalStorage from './LocalStorage';
import { Channel, Video, MAX_RESULTS } from './Structures';
import { API_KEY } from './env';

function getChannelInfo(channelId: string, storage: LocalStorage, callback: (result: string | Channel) => void) {
  const localChannel = storage.channels.find(chan => chan.id === channelId);

  if (localChannel) {
    callback(localChannel);
    return;
  }

  $.getJSON("https://www.googleapis.com/youtube/v3/channels", {
    part: ['contentDetails', 'snippet'].toString(),
    id: channelId,
    key: API_KEY
  }).done((json) => {
    const uploadId = json.items[0].contentDetails.relatedPlaylists.uploads;

    const name = json.items[0].snippet.title;

    const channel = { name: name, uploadId: uploadId, id: channelId };

    callback(channel);
  }).fail((xhr, status, errorThrown) => {
    callback(`Error: ${xhr.responseText}`);

    // logging info
    console.error("Error: " + errorThrown);
    console.error("Status: " + status);
    console.dir(xhr);
  });
};

const getUploadedVideos = (channel: Channel, callback: (result: string | Video[]) => void) => {
  /**
   * playlistId: id of a playlist (typically uploads)
   * callback: what to do with the items. Passes parameters like (err, items) => { ... }
   * Items are all objects that pass validateVideo()
   */
  $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems", {
    key: API_KEY,
    part: ['snippet'].toString(),
    playlistId: channel.uploadId,
    maxResults: MAX_RESULTS,
  }).done((json) => {
    const items = json.items as {
      snippet: {
        resourceId: {
          videoId: string;
        };
        publishedAt: string;
        thumbnails: {
          standard: {
            url: string;
            height: number;
            width: number;
          };
        };
        title: string;
        description: string;
      };
    }[];

    const videos = items.map(item => ({
      id: item.snippet.resourceId.videoId,
      publishDate: new Date(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails.standard.url,
      title: item.snippet.title,
      seen: false,
      description: item.snippet.description,
      channel: channel
    }));

    callback(videos);
  }).fail((xhr, status, errorThrown) => {
    callback(`Error: ${xhr.responseText}`);

    // logging info
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr.responseText);
  });
};

export { getChannelInfo, getUploadedVideos };