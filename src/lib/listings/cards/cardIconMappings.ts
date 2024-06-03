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
import PineTree from 'virtual:icons/mdi/pine-tree';
import Hiking from 'virtual:icons/mdi/hiking';
import Coffee from 'virtual:icons/mdi/coffee';
import Museum from 'virtual:icons/mdi/museum';

export const iconMapping = {
    restaurant: {
        name: 'Restaurant',
        component: RestaurantIcon,
        bgColor: 'bg-yellow-400',
        filterBy: true
    },
    coffee: {
        name: 'Coffee',
        component: Coffee,
        bgColor: 'bg-green-400',
        filterBy: true
    },
    'park': {
        name: 'Park',
        component: PineTree,
        bgColor: 'bg-green-200',
        filterBy: true
    },
    'hiking': {
        name: 'Hiking',
        component: Hiking,
        bgColor: 'bg-green-200',
        filterBy: true
    },
    'beach': {
        name: 'Beach',
        component: BeachIcon,
        bgColor: 'bg-blue-200',
        filterBy: true
    },
    "museum": {
        name: 'Museum',
        component: Museum,
        bgColor: 'bg-purple-100',
        filterBy: true
    },
    'bike': {
        name: 'Biking',
        component: BikeIcon,
        bgColor: 'bg-orange-100',
        filterBy: true
    },
    'shopping': {
        name: 'Shopping',
        component: ShoppingIcon,
        bgColor: 'bg-pink-100',
        filterBy: true
    },
    "sightseeing": {
        name: 'Sightseeing',
        component: MapMarkerIcon,
        bgColor: 'bg-yellow-100',
        filterBy: true
    },
    'city': {
        name: 'City',
        component: CityIcon,
        bgColor: 'bg-purple-100',
        filterBy: true
    },
    'home': {
        name: 'Home',
        component: HomeOutlineIcon,
        bgColor: 'bg-blue-100',
        filterBy: false
    },
    'car': {
        name: 'Car',
        component: CarIcon,
        bgColor: 'bg-gray-100',
        filterBy: false
    },
    'wifi': {
        name: 'WiFi',
        component: WifiIcon,
        bgColor: 'bg-indigo-100',
        filterBy: false
    },
};

