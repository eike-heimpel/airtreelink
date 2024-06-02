import RestaurantIcon from 'virtual:icons/mdi/restaurant';
import HomeOutlineIcon from 'virtual:icons/mdi/home-outline';
import BedOutlineIcon from 'virtual:icons/mdi/bed-outline';
import MapMarkerIcon from 'virtual:icons/mdi/map-marker';
import BeachIcon from 'virtual:icons/mdi/beach';
import BikeIcon from 'virtual:icons/mdi/bike';
import ShoppingIcon from 'virtual:icons/mdi/shopping';
import CarIcon from 'virtual:icons/mdi/car';
import WifiIcon from 'virtual:icons/mdi/wifi';
import PoolIcon from 'virtual:icons/mdi/pool';
import DogServiceIcon from 'virtual:icons/mdi/dog-service';
import CityIcon from 'virtual:icons/mdi/city';
import NaturePeopleIcon from 'virtual:icons/mdi/nature-people';

export const iconMapping = {
    restaurant: {
        name: 'Restaurant',
        component: RestaurantIcon,
        bgColor: 'bg-yellow-400'
    },
    'home-outline': {
        name: 'Home',
        component: HomeOutlineIcon,
        bgColor: 'bg-blue-100'
    },
    'bed-outline': {
        name: 'Bed',
        component: BedOutlineIcon,
        bgColor: 'bg-green-100'
    },
    'map-marker': {
        name: 'Map Marker',
        component: MapMarkerIcon,
        bgColor: 'bg-red-100'
    },
    'beach': {
        name: 'Beach',
        component: BeachIcon,
        bgColor: 'bg-blue-200'
    },
    'bike': {
        name: 'Bike',
        component: BikeIcon,
        bgColor: 'bg-orange-100'
    },
    'shopping': {
        name: 'Shopping',
        component: ShoppingIcon,
        bgColor: 'bg-pink-100'
    },
    'car': {
        name: 'Car',
        component: CarIcon,
        bgColor: 'bg-gray-100'
    },
    'wifi': {
        name: 'WiFi',
        component: WifiIcon,
        bgColor: 'bg-indigo-100'
    },
    'pool': {
        name: 'Pool',
        component: PoolIcon,
        bgColor: 'bg-teal-100'
    },
    'dog-service': {
        name: 'Dog Service',
        component: DogServiceIcon,
        bgColor: 'bg-yellow-200'
    },
    'city': {
        name: 'City',
        component: CityIcon,
        bgColor: 'bg-purple-100'
    },
    'nature-people': {
        name: 'Nature People',
        component: NaturePeopleIcon,
        bgColor: 'bg-green-200'
    }   
};

