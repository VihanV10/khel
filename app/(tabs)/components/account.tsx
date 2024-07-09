import { useState, useEffect } from 'react'
import { supabase } from '@/app/supabase' 
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { Picker } from '@react-native-picker/picker'
import { Text, Modal, TouchableOpacity} from 'react-native';
import Avatar from './avatar'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [Cricket, setCricket] = useState('')
  const [Pickleball, setPickleball] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showCricketPicker, setShowCricketPicker] = useState(false); // State for showing/hiding Cricket picker
  const [showPickleballPicker, setShowPickleballPicker] = useState(false); // State for showing/hiding Pickleball picker


  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, Cricket, avatar_url,Pickleball`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setCricket(data.Cricket)
        setPickleball(data.Pickleball)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    Cricket,
    avatar_url,
    Pickleball,
  }: {
    username: string
    Cricket: string
    avatar_url: string
    Pickleball:string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        Cricket,
        avatar_url,
        Pickleball,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.container}>
      {/* Other JSX code */}
      
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Cricket:</Text>
        <TouchableOpacity onPress={() => setShowCricketPicker(!showCricketPicker)}>
          <Text style={styles.selectedValue}>{Cricket || 'Select Cricket'}</Text>
        </TouchableOpacity>
        {showCricketPicker && (
          <Picker
            selectedValue={Cricket}
            onValueChange={(itemValue) => setCricket(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
        )}
      </View>

      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Pickleball:</Text>
        <TouchableOpacity onPress={() => setShowPickleballPicker(!showPickleballPicker)}>
          <Text style={styles.selectedValue}>{Pickleball || 'Select Pickleball'}</Text>
        </TouchableOpacity>
        {showPickleballPicker && (
          <Picker
            selectedValue={Pickleball}
            onValueChange={(itemValue) => setPickleball(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
        
        )}
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url)
          }}
        />
      </View>


      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, Cricket,Pickleball, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black', // Adjust as needed
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  selectedValue: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
    color: 'black', // Ensure to define color property
  },
})