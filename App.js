import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RenderMap from "./components/map";

function App() {
	return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<RenderMap />
		</SafeAreaProvider>
	);
}

export default App
