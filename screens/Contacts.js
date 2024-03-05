import {Linking, Text, View, Dimensions, Alert} from "react-native";
import React from "react";
import {useTheme} from "@react-navigation/native";
import {useHeaderHeight} from "@react-navigation/elements";
import Button from "../components/Button";
import ButtonList from "../components/ButtonList";
import * as NativeContact from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import useContacts from "../hooks/useContacts";

// Sets the priorityLevel threshold at which a button will 
// recieve the emergency coloration and be placed on the 
// emergency list at the top.
const emergencyThreshold = 30;

function formatPhoneNumber(phone) {
    if (phone.length != 10) {
        return null;
    } else {
        let areaCode = phone.slice(0,3);
        let firstHalf = phone.slice(3,6);
        let secondHalf = phone.slice(6, 10);
        return `(${areaCode}) ${firstHalf}-${secondHalf}`;
    }
}

export default function Contacts() {
    const {colors, fonts} = useTheme();
    const headerHeight = useHeaderHeight();

    function renderItem ({item}) {  
        const emergency = item.priorityLevel >= emergencyThreshold;
        const unpressedText = emergency ? colors.emergencyText : colors.text;
        const unpressedButton = emergency ? colors.emergency : colors.card;

        const styles = (pressed) => {
            return {
                front: {
                    backgroundColor:  
                        pressed ?
                            colors.notification : 
                            unpressedButton,
                    color: 
                        pressed ? 
                            colors.notificationText : 
                            unpressedText,
                    borderRadius: 5,
                    margin: 2,
                    numberText: fonts.regular,
                    numberSize: 18,
                    nameText: fonts.bold,
                    nameSize: 24
                },
                button: {
                    backgroundColor: 
                        pressed ?
                            colors.notification : 
                            unpressedButton,
                    color:
                        pressed ? 
                            colors.notificationText : 
                            unpressedText,
                    borderRadius: 8
                }
            }
        }
        
        return (
            <Button
                onLongPress={(() => requestAddAlert(item))}
                delayLongPress={650}
                onPress={()=>{Linking.openURL(`tel:${item.number}`);}}
                styles={styles}
                accessibilityLabel={item.name}
                accessibilityHint={`Press to call ${item.name} at ${item.number}, long press to save their contact.`}
                front={renderFront(item)}
                frontResponsive={true}
                />
        )
    }

    const normalStyle = {
        bounding: {
            borderRadius: 10, 
            backgroundColor: colors.card, 
            marginHorizontal: 20,
            marginVertical: 5,
            marginBottom: 10,
            padding: 5,
            alignSelf: "center",
            position: "absolute",
            top: 85,
            width: "95%",
            height: Dimensions.get("window").height - 85 - 30 - headerHeight,
            flexGrow: 10
        },
        loadingText: {
            fontFamily: fonts.bold, 
            fontSize: 20,
            color: colors.text,
        },
        scrollEnabled: true,
    };

    const emergencyStyle = {
        ...normalStyle,
        bounding: {
            ...normalStyle.bounding,
            marginBottom: 5,
            marginTop: 10,
            top: 0,
            height: "auto",
            width: "95%",
            flex: 1,
            flexGrow: 1,
            position: "absolute"
        },
        scrollEnabled: false,
    };

    const [data, fetching, loading] = useContacts();

    return (
        <View style={{flex:1, paddingBottom: 38 + 60}}>
            {(fetching && loading) && 
                <View style={normalStyle.bounding}>
                    <Text style={normalStyle.loadingText}>Loading...</Text>
                </View>
            }
            {data && data[0] != undefined && (!fetching || !loading) &&
                <SafeAreaView>
                    <View style={emergencyStyle.bounding}>
                        {renderItem({item: data[0].value[0]})}
                    </View>
                    <ButtonList
                        extraData={colors}
                        estimatedItemSize={60}
                        data={data[1].value}
                        keyExtractor = {(item) => item["id"].toString()}
                        style= {normalStyle}
                        renderItem= {renderItem}
                        sorter= {(vals) => {
                            console.log(vals); 
                            return vals.sort((a,b) => a.name.localeCompare(b.name))
                                .sort((a,b) => b.priorityLevel - a.priorityLevel)
                            }}
                    />
                </SafeAreaView>
            }
        </View>
            
    );
}

function requestAddAlert(item) {
        Alert.alert("Add Contact?",
            `Would you like to add ${item.name} to your contact book?`,
            [
                {text: "Cancel", onPress: () => {}},
                {text: "Ok", onPress: () => saveContact(item), isPreferred: true}
            ]
        )
}

const saveContact = async (item) => {
    let {status, canAskAgain} = await NativeContact.getPermissionsAsync();
    const contact = {
        [NativeContact.Fields.Name]: item.name,
        [NativeContact.Fields.PhoneNumbers]: [{
            number: formatPhoneNumber(item.number),
            isPrimary: true,
            digits: item.number.toString(),
            countryCode: "US",
            label: "mobile"
        }],
        [NativeContact.Fields.Company]: "Furman University",
    };

    if (status != NativeContact.PermissionStatus.GRANTED && canAskAgain) {
        const request = await NativeContact.requestPermissionsAsync();
        status = request.status;
    }

    if (status != NativeContact.PermissionStatus.GRANTED) {
        return
    }

    try {
        await NativeContact.addContactAsync(contact)
            .then(Alert.alert("Completed",`Successfully added ${item.name} to your contacts.`))
            .catch((err) => {
                alert(err);
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
}

const renderFront = (item) => (styles) => {
    return (
        <View style={{paddingVertical: 3, paddingHorizontal: 10}}>
            <Text style={ 
                        {fontFamily: styles.nameText,
                        fontSize: styles.nameSize,
                        color: styles.color}}>
                {item.name} 
            </Text>
            <View style={{alignContent: "center", 
                    marginTop: 5,
                    marginLeft: 10}}>
                <Text style={
                                {fontFamily: styles.numberText,
                                fontSize: styles.numberSize,
                                color: styles.color}
                            }>
                    {formatPhoneNumber(item.number)}
                </Text>
            </View>
        </View>)
}

