import axios from "axios";

const baseURL =
  'http://107.173.87.120:8080/api/';

export const request = axios.create({
  baseURL,
});


// const res = await request('/api/graphin', {
//   method: 'get',
//   params: {
//     client_id,
//   },
// });
