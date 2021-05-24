import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  Button,
  Switch,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios';

const Pin: () => Node = props => {
  const {pin, device} = props;

  const isDarkMode = useColorScheme() === 'dark';

  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);

  const pinStatus = async () => {
    try {
      setLoading(true);
      const statusApi = await axios.get(`${device}/gpio/${pin}`);

      if (statusApi.status === 200) {
        setState(statusApi.data.response.replace('\n', ''));
      } else {
        throw statusApi.data.error;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  };

  const pinWrite = async status => {
    try {
      setLoading(true);
      const writeApi = await axios.post(`${device}/gpio/write`, {
        pin: pin,
        state: status ? 1 : 0,
      });
      if (writeApi.status === 200) {
        pinStatus();
      } else {
        throw writeApi.data.error;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  };

  const pinMode = async mode => {
    try {
      setLoading(true);
      const modeApi = await axios.post(`${device}/gpio/mode`, {
        pin: pin,
        mode: mode,
      });
      if (modeApi.status === 200) {
        pinStatus();
      } else {
        throw modeApi.data.error;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  };

  useEffect(() => {
    pinStatus();
  }, []);

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        justifyContent: 'space-between',
      }}
      onPress={() => {}}>
      <View
        style={{
          width: '10%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: isDarkMode ? 'white' : 'black'}}>{pin}</Text>
      </View>
      <View
        style={{
          width: '20%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isDarkMode ? 'white' : 'black'}
          />
        ) : (
          <Switch
            disabled={loading}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={parseInt(state) === 1 ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={pinWrite}
            value={parseInt(state) === 1}
          />
        )}
      </View>

      <View
        style={{
          width: '30%',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isDarkMode ? 'white' : 'black'}
          />
        ) : (
          <>
            <Button
              title="IN"
              disabled={loading}
              onPress={() => {
                pinMode('in');
              }}
            />
            <Button
              title="OUT"
              disabled={loading}
              onPress={() => {
                pinMode('out');
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Pin;
