import Constants from 'expo-constants'
import asyncStorage from '@react-native-async-storage/async-storage'

const addUnitApi = async ({ Unitname, Unitslogan, Logo }) => {
  try {
    console.log(Constants.manifest.extra.appPublicBackendRoot + 'api/unit')
    const res = await fetch(URL + '/api/unit/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await asyncStorage.getItem('roksrs-token')}`,
      },
      body: JSON.stringify({ Unitname, Unitslogan, Logo }),
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export default addUnitApi
