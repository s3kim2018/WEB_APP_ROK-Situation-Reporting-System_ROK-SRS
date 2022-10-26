import Constants from 'expo-constants'
import asyncStorage from '@react-native-async-storage/async-storage'

const getUserByIdApi = async ({ _id }) => {
  try {
    const res = await fetch(
      Constants.manifest.extra.appPublicBackendRoot +
        'api/user/id?search=' +
        _id,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await asyncStorage.getItem('roksrs-token')}`,
        },
      }
    )
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export default getUserByIdApi
