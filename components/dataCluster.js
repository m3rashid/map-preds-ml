export function dbScan(data, radius, minPoints) {
	const clusters = [];
	const visitedPoints = new Set();

	const getNeighbourPoints = (point) => {
		return data.filter((p) => {
			if (p.id === point.id) return false;
			return getDistance(p, point) < radius;
		});
	};

	const getDistance = (p1, p2) => {
		// euclidean distance
		return Math.sqrt(
			Math.pow(p1.lat - p2.lat, 2) +
			Math.pow(p1.lng - p2.lng, 2)
		);

		// straight line distance
		// return (
		//   Math.abs(p1.lat - p2.lat) +
		//   Math.abs(p1.lng - p2.lng)
		// );
	};

	for (let i = 0; i < data.length; i++) {
		if (visitedPoints.has(data[i].id)) continue;
		visitedPoints.add(data[i].id);

		const neighbours = getNeighbourPoints(data[i]);
		if (neighbours.length >= minPoints) {
			clusters.push(neighbours);
			for (let j = 0; j < neighbours.length; j++) {
				visitedPoints.add(neighbours[j].id);
			}
		}
	}

	return clusters;
}

const origin = { lat: 0, lng: 0 };

export function getMetrics(data) {
	const metrics = [];

	for (let i = 0; i < data.length; i++) {
		let metric = { mean: origin, span: 0 };

		let sum = origin;
		for (let j = 0; j < data[i].length; j++) {
			sum = {
				lat: sum.lat + data[i][j].lat,
				lng: sum.lng + data[i][j].lng,
			};
		}

		metric.mean = {
			lat: Number((sum.lat / data[i].length).toFixed(4)),
			lng: Number((sum.lng / data[i].length).toFixed(4)),
		};

		let maxRadius = 0;
		for (let j = 0; j < data[i].length; j++) {
			maxRadius = Math.max(
				maxRadius,
				Math.sqrt(
					Math.pow(data[i][j].lat - metric.mean.lat, 2) +
					Math.pow(data[i][j].lng - metric.mean.lng, 2)
				)
			);
		}

		metric.span = Math.min(10, maxRadius * 10000);
		metrics.push(metric);
	}
	return metrics;
}

export const noAction = 'No action required.';
export const immediateAction = 'Recommend taking IMMEDIATE action.'
export const recommendationTimeColorMap = [
	'#dc2626', // red
	'#ea580c', // orange
	'#ca8a04', // yellow
	'#fefce8', // white
]

export function getTimeForActionTime(actionTime) {
	if (actionTime < 1) return recommendationTimeColorMap[0]
	if (actionTime <= 2) return recommendationTimeColorMap[1]
	if (actionTime <= 4) return recommendationTimeColorMap[2]
	return recommendationTimeColorMap[3]
}

export function filterData(data, filterType) {
	return data.reduce((acc, d) => {
		try {
			if (d.Recommendation === noAction) return acc
			if (filterType && d.Recommendation !== filterType) return acc

			if (d.Recommendation === immediateAction) return [...acc, { ...d, time: 0, color: getTimeForActionTime(0) }]

			const actionTime = Number((d.Recommendation || "").match(/\d+/)[0]);
			if (isNaN(actionTime)) return acc
			return [...acc, { ...d, time: actionTime, color: getTimeForActionTime(actionTime) }]
		} catch (err) {
			return acc
		}
	}, [])
}
