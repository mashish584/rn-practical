import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import ChatBot from './components/Chatbot';
import WhiteBoard from './components/Whiteboard';

const App = () => {
  return (
    <SafeAreaProvider>
      {/* <WhiteBoard /> */}
      <ChatBot />
    </SafeAreaProvider>
  );
};

export default App;
