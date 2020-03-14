const parseChannelId = (url: string): string | null => {
  // takes https://www.youtube.com/channel/UCMu3_s7WCRCJrbh37UKmJ-A/featured?flow=grid
  // returns UCMu3_s7WCRCJrbh37UKmJ-A

  // FUTURE: must have a trailing / after the channel id. Could that cause problems?
  const re = /http?s:\/\/(?:www\.)?youtube.com\/channel\/(.*?)\/.*/;

  const match = url.match(re);

  if (match && match.length > 1) {
    return match[1];
  } else {
    return null;
  }
};

const makeDateString = (date: Date) => {
  /**
   * date: Date
   * returns: March 3, 2020
   */

  // FUTURE

  return date.toLocaleString();
};

export { parseChannelId, makeDateString };