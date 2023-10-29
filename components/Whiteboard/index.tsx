import React, {useEffect, useState} from 'react';
import {RoomDetailsI, getAgoraRoomDetails} from './utils';
import {WhiteboardView} from '@netless/react-native-whiteboard';

const WhiteBoard = () => {
  const [roomData, setRoomData] = useState({} as RoomDetailsI);
  useEffect(() => {
    (async () => {
      const data = await getAgoraRoomDetails();
      setRoomData(data);
    })();
  }, []);

  if (!roomData.roomToken) return null;

  return (
    <WhiteboardView
      sdkConfig={{
        appIdentifier: 'xxxxxx',
      }}
      roomConfig={{
        uid: 'ggjh3g3uuy3',
        uuid: roomData.roomUUID,
        roomToken: roomData.roomToken,
      }}
      joinRoomCallback={data => {
        console.log('Room Joined');
      }}
      style={{flex: 1}}
    />
  );
};

export default WhiteBoard;
