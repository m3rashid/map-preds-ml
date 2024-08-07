import {
	Text,
	View,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	ActivityIndicator,
	useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useTransition } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, Heatmap, PROVIDER_DEFAULT } from 'react-native-maps';

import {
	getColor,
	viewTypes,
	groupedData,
	selectLabels,
	initialRegion,
	recommendationTimeColorMap,
} from './dataCluster';

const RenderMap = () => {
	const [actionTime, setActionTime] = useState(0);
	const [isPending, startTransition] = useTransition();
	const { height: windowHeight } = useWindowDimensions();
	const [modalVisible, setModalVisible] = useState(false);
	const [viewType, setViewType] = useState(
		Platform.OS === 'ios' ? viewTypes.circle : viewTypes.heatmap
	);

	const handleViewChange = () => {
		startTransition(() => {
			setActionTime(3);
			setViewType((prev) =>
				prev === viewTypes.heatmap ? viewTypes.circle : viewTypes.heatmap
			);
		});
	};

	return (
		<SafeAreaView style={{ margin: 0, padding: 0, backgroundColor: '#a7f3d0' }}>
			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible((p) => !p)}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>
							Legend
						</Text>

						{recommendationTimeColorMap.map((color, i) => (
							<View
								key={color}
								style={{ flexDirection: 'row', gap: 10, marginBottom: 5 }}
							>
								<View
									style={{
										backgroundColor: color,
										width: 20,
										height: 20,
										borderRadius: 10,
									}}
								></View>
								<Text>Action in {i + 1} months</Text>
							</View>
						))}
						<Pressable
							style={styles.button}
							onPress={() => setModalVisible((p) => !p)}
						>
							<Text style={styles.textStyle}>Close Legend</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			<View
				style={{
					alignItems: 'center',
					flexDirection: 'row',
					justifyContent: 'center',
					gap: 10,
					height: 60,
					marginHorizontal: 10,
				}}
			>
				<RNPickerSelect
					value={actionTime}
					onValueChange={(value) => setActionTime(value)}
					style={pickerSelectStyles}
					items={[
						{ label: selectLabels[1], value: 1, key: 1 },
						{ label: selectLabels[2], value: 2, key: 2 },
						{ label: selectLabels[3], value: 3, key: 3 },
						{ label: selectLabels[4], value: 4, key: 4 },
						{ label: selectLabels[5], value: 5, key: 5 },
						{ label: selectLabels[0], value: 0, key: 0 },
					]}
				/>

				{Platform.OS === 'android' ? (
					<Pressable
						style={{
							backgroundColor: '#0ea5e9',
							paddingVertical: 10,
							borderRadius: 10,
							paddingHorizontal: 20,
						}}
						onPress={handleViewChange}
					>
						{isPending ? (
							<ActivityIndicator />
						) : (
							<Text style={{ color: 'white', fontWeight: 'bold' }}>
								{viewType === viewTypes.heatmap ? 'Dots View' : 'Show Heatmap'}
							</Text>
						)}
					</Pressable>
				) : null}

				<View style={{ backgroundColor: '#fff', padding: 4, borderRadius: 32 }}>
					<Icon
						size={32}
						color='#000'
						name='information-circle-outline'
						onPress={() => setModalVisible(true)}
					/>
				</View>
			</View>

			<MapView
				style={{ width: '100%', height: windowHeight }}
				showsUserLocation={true}
				showsCompass={true}
				showsPointsOfInterest={false}
				provider={PROVIDER_DEFAULT}
				initialRegion={initialRegion}
			>
				{viewType === viewTypes.circle ? (
					groupedData[actionTime].map((d, i) => (
						<Circle
							key={i}
							radius={40}
							fillColor={getColor(d.month)}
							strokeColor={getColor(d.month)}
							center={{ latitude: d.lat, longitude: d.lng }}
						/>
					))
				) : (
					<Heatmap
						points={groupedData[actionTime].map((d) => ({
							latitude: d.lat,
							longitude: d.lng,
							weight: (1 / (d.time + 1)) * 100 || 1,
						}))}
					/>
				)}
			</MapView>
		</SafeAreaView>
	);
};

export default RenderMap;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: 'white',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 50,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		elevation: 5,
	},
	button: {
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: '#0ea5e9',
		elevation: 2,
		marginTop: 20,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingTop: 16,
		paddingHorizontal: 10,
		borderRadius: 4,
		color: 'black',
		width: 200,
		paddingRight: 30, // to ensure the text is never behind the icon
	},
	inputAndroid: {
		width: 220,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	},
});
