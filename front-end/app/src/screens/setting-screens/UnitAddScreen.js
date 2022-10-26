import React, { useState, useCallback } from 'react'
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import { ImagePicker } from '../../components/ImagePicker'
import { window } from '../../constants/layout'
import addUnitApi from '../../apis/unit/addUnitApi'
import { MyButton } from '../../components/MyButton'

export function UnitAddScreen() {
  const addUnitHandler = useCallback(async ({ Unitname, Unitslogan }) => {
    const res = await addUnitApi({ Unitname, Unitslogan })
    if (res.Unitname) {
      Alert.alert('업데이트에 성공하였습니다.')
    } else {
      Alert.alert(res.message)
    }
  }, [])

  const [Unitname, setUnitname] = useState('')
  const [Unitslogan, setUnitslogan] = useState('')
  const [Logo, setLogo] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <ImagePicker
          imageUrl={Logo}
          setImageUrl={setLogo}
          style={{ marginBottom: 30 }}
        />
        <TextInput
          label="부대 이름"
          dense={true}
          activeUnderlineColor="#008275"
          onChangeText={(Unitname) => setUnitname(Unitname)}
          style={styles.textInput}
        />
        <TextInput
          label="부대 슬로건"
          dense={true}
          activeUnderlineColor="#008275"
          onChangeText={(Unitslogan) => setUnitslogan(Unitslogan)}
          style={styles.textInput}
        />
      </View>
      <MyButton
        text="새로운 부대 추가"
        onPress={() => addUnitHandler({ Unitname, Unitslogan, Logo })}
        style={{ marginTop: 15, width: '65%' }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  view: {
    width: '85%',
    alignItems: 'center',
    marginBottom: (20 / 812) * window.height,
  },
  textInput: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: (15 / 812) * window.height,
  },
})
