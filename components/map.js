import MapView, { Callout, Circle, Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useMemo } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native"
import { filterData, immediateAction } from "./dataCluster";
import data from "./predictions.json";

/**
 * Select dropdown with all actions
 * Both the views: Heatmap and Circle
 * Legend showing what the colors mean
 */

const initialRegion = {
	latitude: 40.5,
	longitude: -88.9,
	latitudeDelta: 0.5,
	longitudeDelta: 0.5,
};

const filterTypes = {
	none: "none",
	immediate: "immediate"
}
const RenderMap = () => {
	const { height: windowHeight } = useWindowDimensions()
	const [filterType, setFilterType] = useState(filterTypes.none);
	const actionFilteredData = useMemo(() => filterData(data), [])
	const immediateActionData = useMemo(() => filterData(data, immediateAction), [])


	return (
		<View style={{ margin: 0, padding: 0, backgroundColor: '#a7f3d0' }}>
			<MapView
				style={{ width: '100%', height: windowHeight }}
				showsUserLocation={true}
				showsCompass={true}
				showsPointsOfInterest={false}
				provider={PROVIDER_GOOGLE}
				initialRegion={initialRegion}
			>
				{(filterType === filterTypes.immediate ? immediateActionData : actionFilteredData).map((d, index) => {
					return (
						<Circle
							key={index}
							radius={filterType === filterTypes.immediate ? 50 : 20}
							fillColor={d.color}
							strokeColor={d.color}
							center={{ latitude: d.lat, longitude: d.lng }}
						>
							<Callout>
								<Text>{JSON.stringify({ latitude: d.lat, longitude: d.lng })}</Text>
							</Callout>
						</Circle>
					);
				})}

				{/* <Heatmap
					points={((filterType === filterTypes.immediate ? immediateActionData : actionFilteredData) || []).map((d) => ({
						latitude: d.lat,
						longitude: d.lng,
						weight: (1 / (d.time + 1)) * 5
					}))} /> */}
			</MapView>

			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<Pressable
					style={{
						backgroundColor: "#0ea5e9",
						paddingVertical: 10,
						marginBottom: 5,
						marginTop: 5,
						borderRadius: 10,
						paddingHorizontal: 20,
					}}
					onPress={() => {
						setFilterType((prev) => {
							return prev === filterTypes.immediate ? filterTypes.none : filterTypes.immediate
						})
					}}>
					<Text style={{ color: "white", fontWeight: "bold" }}>
						{filterType === filterTypes.immediate ? "Show all Action points" : "Show Immediate action points"}
					</Text>
				</Pressable>
			</View>
		</View>
	)
}

export default RenderMap
