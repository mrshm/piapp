import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import uuid from 'react-native-uuid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Pin from '../components/pin';

const Devices: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [refreshing, setRefreshing] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [device, setDevice] = useState(false);
  const [addDevice, setAddDevice] = useState('');
  const [addDeviceName, setAddDeviceName] = useState('');
  const [modal, setModal] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const LoadDeviceList = async () => {
    try {
      setRefreshing(true);
      const devices = await AsyncStorage.getItem('devices');

      console.log(devices);
      if (devices) {
        setDeviceList(JSON.parse(devices));
      } else {
        AsyncStorage.setItem('devices', JSON.stringify([]));
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.log(error);
    }
  };

  const ConnectionTest = async url => {
    try {
      setTestLoading(true);
      const test = await axios.get(`${url}/gpio`);
      setTestLoading(false);
      return test && test.status === 200 ? true : false;
    } catch (error) {
      setTestLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    LoadDeviceList();
  }, []);

  return (
    <>
      {device ? (
        <View style={{width: '100%', height: '100%'}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setDevice(false);
              }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '70%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: isDarkMode ? 'white' : 'black',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {device.name}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                ToastAndroid.show(
                  device.address,
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }}>
              <Ionicons
                name="ios-information-circle-outline"
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{width: '100%'}}
            contentContainerStyle={{
              width: '100%',
            }}
            data={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 21, 22,
              23, 24, 25, 26, 27, 28, 29, 30, 31,
            ]}
            keyExtractor={(item, index) => index}
            renderItem={({item, index, separators}) => {
              return <Pin pin={item} device={device.address} />;
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={LoadDeviceList}
              />
            }
          />
        </View>
      ) : (
        <View style={{width: '100%', height: '100%'}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setDevice(false);
              }}></TouchableOpacity>
            <View
              style={{
                width: '70%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: isDarkMode ? 'white' : 'black',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Devices List
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                Linking.openURL('https://mrshm.ir');
              }}>
              <Ionicons
                name="ios-information-circle"
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{width: '100%'}}
            contentContainerStyle={{
              width: '100%',
            }}
            data={deviceList}
            keyExtractor={(item, index) => index}
            renderItem={({item, index, separators}) => {
              return (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '85%',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    }}
                    onPress={() => {
                      setDevice(item);
                    }}>
                    <Text style={{color: isDarkMode ? 'white' : 'black'}}>
                      {item.name}
                    </Text>
                    <Text style={{color: isDarkMode ? 'white' : 'black'}}>
                      {item.address}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '15%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      const newDeviceList = deviceList.filter(
                        x => x.id !== item.id,
                      );

                      AsyncStorage.setItem(
                        'devices',
                        JSON.stringify(newDeviceList),
                      );

                      LoadDeviceList();

                      ToastAndroid.show(
                        'Device Removed Succeccfuly',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      );
                    }}>
                    <Text
                      style={{
                        color: isDarkMode ? 'white' : 'black',
                        textAlign: 'center',
                      }}>
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={LoadDeviceList}
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    marginVertical: 10,
                    fontSize: 20,
                    color: isDarkMode ? 'white' : 'black',
                  }}>
                  No Device!
                </Text>
                <Text
                  style={{
                    marginVertical: 10,
                    color: isDarkMode ? 'white' : 'black',
                  }}>
                  Pull down to refresh
                </Text>
                <View
                  style={{
                    marginVertical: 10,
                  }}>
                  <Button
                    title="Add New Device"
                    onPress={() => {
                      setModal(true);
                    }}
                  />
                </View>
              </View>
            }
          />
          {modal ? null : (
            <View
              style={{
                width: 50,
                height: 50,
                position: 'absolute',
                right: 20,
                bottom: 30,
                elevation: 1,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isDarkMode ? 'white' : '#2f2f2f',
                  height: '100%',
                  width: '100%',
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setModal(true);
                }}>
                <Ionicons
                  name="ios-add"
                  size={30}
                  color={isDarkMode ? '#2f2f2f' : 'white'}
                />
              </TouchableOpacity>
            </View>
          )}
          <Modal
            transparent={true}
            visible={modal}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => {
              setModal(false);
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: isDarkMode ? '#2f2f2f' : 'white',
                  width: '75%',
                  maxHeight: '75%',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginBottom: 10,
                    fontWeight: 'bold',
                    color: isDarkMode ? 'white' : 'black',
                  }}>
                  Add New Device
                </Text>
                <TextInput
                  style={{
                    color: isDarkMode ? 'white' : 'black',
                    borderWidth: 1,
                    borderColor: isDarkMode ? 'white' : 'black',
                    borderRadius: 5,
                    width: '90%',
                    marginVertical: 10,
                    textAlign: 'center',
                  }}
                  placeholder="Raspberry Pi"
                  placeholderTextColor="gray"
                  value={addDeviceName}
                  onChangeText={text => {
                    setAddDeviceName(text);
                  }}
                />
                <TextInput
                  style={{
                    color: isDarkMode ? 'white' : 'black',
                    borderWidth: 1,
                    borderColor: isDarkMode ? 'white' : 'black',
                    borderRadius: 5,
                    width: '90%',
                    marginVertical: 10,
                    textAlign: 'center',
                  }}
                  placeholder="http://192.168.1.3:80"
                  placeholderTextColor="gray"
                  value={addDevice}
                  onChangeText={text => {
                    setAddDevice(text);
                  }}
                />
                <View style={{marginVertical: 10}}>
                  {testLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Button
                      disabled={testLoading || addDevice.length === 0}
                      title="Connection Test"
                      onPress={async () => {
                        const test = await ConnectionTest(addDevice);

                        ToastAndroid.show(
                          test
                            ? 'Connection Successfuly!'
                            : 'Connection Failed!',
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER,
                        );
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around',
                  }}>
                  <Button
                    title="Cancel"
                    color="red"
                    onPress={() => {
                      setModal(false);
                      ToastAndroid.show(
                        'Canceled',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      );
                    }}
                  />
                  <Button
                    title="Add"
                    disabled={addDevice.length === 0}
                    onPress={async () => {
                      const test = await ConnectionTest(addDevice);
                      if (test) {
                        const devices = JSON.parse(
                          await AsyncStorage.getItem('devices'),
                        );

                        devices.push({
                          id: uuid.v4(),
                          address: addDevice,
                          name:
                            addDeviceName.length > 0
                              ? addDeviceName
                              : `Raspberry Pi ${devices.length + 1}`,
                          date: moment().format('X'),
                        });

                        AsyncStorage.setItem('devices', JSON.stringify(devices))
                          .then(() => {
                            setModal(false);
                            setAddDevice('');
                            setAddDeviceName('');
                            ToastAndroid.show(
                              'Devices Added Successfuly.',
                              ToastAndroid.SHORT,
                              ToastAndroid.CENTER,
                            );
                            LoadDeviceList();
                          })
                          .catch(error => {
                            console.log(error);
                          });
                      } else {
                        ToastAndroid.show(
                          'Connection Failed! Please check address and network connection.',
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER,
                        );
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default Devices;
