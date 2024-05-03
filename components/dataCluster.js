import data from './predictions.json';

export const recommendationTimeColorMap = [
	"#ff0000", // 1 month
	'#ef4444', // 2 month
	'#ea580c', // 3 month
	'#eab308', // 4 month
	'#84cc16', // 5 month
]

export function getColor(rec) {
	return recommendationTimeColorMap[rec - 1]
}

function groupData() {
	const res = [data, [], [], [], [], []];
	for (let i = 0; i < data.length; i++) {
		res[data[i].month].push(data[i])
	}
	return res
}

export const groupedData = groupData()

export const initialRegion = {
	latitude: 40.5,
	longitude: -88.9,
	latitudeDelta: 0.5,
	longitudeDelta: 0.5,
};

export const selectLabels = [
	'All Actions',
	'Immediate Actions',
	'Action in 2 months',
	'Action in 3 months',
	'Action in 4 months',
	'Action in 5 months',
]

export const viewTypes = {
	heatmap: "heatmap",
	circle: "circle",
}
