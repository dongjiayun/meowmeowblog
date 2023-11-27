import { Loading } from '@/utils'

export const getLocation = () => {
    Loading.show()
    return new Promise<Position>((resolve) => {
        const getPosition = (position:GeolocationPosition) => {
            const { coords } = position
            const { latitude, longitude } = coords
            resolve({ latitude: String(latitude), longitude: String(longitude) })
        }
        try {
            navigator.geolocation.getCurrentPosition(getPosition)
        } catch (error) {
            resolve({ latitude: '135.27089', longitude: '36.39818' })
        }
    }).finally(() => {
        Loading.close()
    })
}

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const earthRadius = 6371 // 地球半径，单位为千米

    const toRadians = (degrees: number) => {
        return degrees * (Math.PI / 180)
    }

    const deltaLat = toRadians(lat2 - lat1)
    const deltaLon = toRadians(lon2 - lon1)

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = earthRadius * c

    if (distance >= 1) {
        return distance.toFixed(1) + ' km'
    } else {
        const distanceInMeters = distance * 1000
        return distanceInMeters.toFixed(1) + ' m'
    }
}
