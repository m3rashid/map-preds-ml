import React from 'react';
import {StyleSheet, View} from 'react-native';

import RenderMap from "./components/map";

function App() {
	return (
		<View style={styles.container}>
			<RenderMap/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default App