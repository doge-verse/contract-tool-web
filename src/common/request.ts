import axios from "axios";

const baseURL =
  'https://doge.instruments.sbs/api/';

export const request = axios.create({
  baseURL,
});


// const res = await request('/api/graphin', {
//   method: 'get',
//   params: {
//     client_id,
//   },
// });
