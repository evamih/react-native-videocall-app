import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export const saveFavorites = async (favorites: { id: string; name: string; photo: string }[]) => {
    try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
};

export const getFavorites = async () => {
    try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error retrieving favorites:', error);
        return [];
    }
};

export const removeFavorite = async (id: string) => {
    try {
        const favorites = await getFavorites();
        const updatedFavorites = favorites.filter((fav: { id: string }) => fav.id !== id);
        await saveFavorites(updatedFavorites);
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
};