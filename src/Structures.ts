interface Channel {
  id: string;
  name: string;
  uploadId: string;
}

interface Video {
  id: string;
  channel: Channel;
  publishDate: Date;
  description: string;
  thumbnail: string;
  title: string;
}



const MAX_RESULTS = 5;

export { Channel, Video, MAX_RESULTS };