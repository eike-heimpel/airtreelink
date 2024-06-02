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
import Hiking from 'virtual:icons/mdi/hiking';

export const iconMapping = {
    restaurant: {
        name: 'Restaurant',
        component: RestaurantIcon,
        bgColor: 'bg-yellow-400',
        filterBy: true
    },
    'home': {
        name: 'Home',
        component: HomeOutlineIcon,
        bgColor: 'bg-blue-100',
        filterBy: false
    },
    'beach': {
        name: 'Beach',
        component: BeachIcon,
        bgColor: 'bg-blue-200',
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
    'city': {
        name: 'City',
        component: CityIcon,
        bgColor: 'bg-purple-100',
        filterBy: true
    },
    'nature-people': {
        name: 'Nature',
        component: NaturePeopleIcon,
        bgColor: 'bg-green-200',
        filterBy: true
    },
    'hiking': {
        name: 'Hiking',
        component: Hiking,
        bgColor: 'bg-green-200',
        filterBy: true
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

