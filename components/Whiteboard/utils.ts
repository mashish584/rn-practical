import axios from 'axios';

const agoraAPI = 'https://api.netless.link/v5';
const agoraSDKToken = 'xxxxxxx';

const api = axios.create({
  baseURL: agoraAPI,
  headers: {
    token: agoraSDKToken,
    region: 'in-mum',
  },
});

export interface RoomDetailsI {
  roomUUID: string;
  teamUUID: string;
  appUUID: string;
  roomToken: string;
}

export async function getAgoraRoomDetails(): Promise<RoomDetailsI> {
  const response = await api.post(`/rooms/`, {});

  const data = response.data;

  const roomInfo = await api.post(`/tokens/rooms/${data.uuid}/`, {
    lifespan: 3600000,
    role: 'admin',
  });

  return {
    roomUUID: data.uuid,
    teamUUID: data.teamUUID,
    appUUID: data.appUUID,
    roomToken: roomInfo.data,
  };
}

// const createRoom = createAsyncThunk("tutor/createRoom", async () => {
//     const resRD = await agoraApi.post("/rooms", {});
//     const roomData = resRD.data as createRoomReturnType;

//     const roomTokenBody = {
//       // Room token has lifespan in miliseconds. Here 3600000 = 60 minutes
//       lifespan: 3600000,
//       role: "admin",
//     };
//     const resRR = await agoraApi.post(
//       `/tokens/rooms/${roomData.uuid}`,
//       roomTokenBody
//     );
//     const roomToken = resRR.data as string;

//     return { roomData, roomToken };
//   });
