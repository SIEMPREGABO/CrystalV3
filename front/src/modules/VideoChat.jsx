import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

const VideoChat = () => {
  const [roomID, setRoomID] = useState('');
  const myCallContainerRef = useRef(null);
  const zpInstance = useRef(null);

  useEffect(() => {
    // Generar un nuevo roomID cada vez que se monta el componente
    const newRoomID = getUrlParams().get('roomID') || randomID(5);
    setRoomID(newRoomID);
  }, []);

  useEffect(() => {
    if (!roomID) return; // No hacer nada si roomID aún no está definido

    const myMeeting = async () => {
      const appID = Number('2119292270');
      const serverSecret = '39a6c54d5ff86c082cc3997ac1edcd63';
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

      zpInstance.current = ZegoUIKitPrebuilt.create(kitToken);
      if (zpInstance.current) {
        zpInstance.current.joinRoom({
          container: myCallContainerRef.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url:
                window.location.protocol + '//' +
                window.location.host + window.location.pathname +
                '?roomID=' +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
        });
      }
    };

    if (myCallContainerRef.current && !zpInstance.current) {
      myMeeting();
    }

    return () => {
      if (zpInstance.current && typeof zpInstance.current.leaveRoom === 'function') {
        zpInstance.current.leaveRoom();
        zpInstance.current = null;
      }
    };
  }, [roomID]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl e-kanbantooltiptemp">
      <Header category="App" title="VideoChat" />
      <div
        className="myCallContainer"
        ref={myCallContainerRef}
        style={{ width: '100%', height: '500px' }}
      ></div>
    </div>
  );
};

export default VideoChat;