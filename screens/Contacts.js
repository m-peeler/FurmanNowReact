import {Linking, Text, View, Dimensions, Alert} from "react-native";
import React, {useState, useEffect} from "react";
import {useTheme} from "@react-navigation/native";
import {useHeaderHeight} from "@react-navigation/elements";
import Button from "../components/Button";
import arrayPartition from "../utilities/ArrayFunctions";
import ButtonList from "../components/ButtonList";
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import * as NativeContact from "expo-contacts";

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

export default function Contacts({navigation, pages}) {
    const {colors, fonts} = useTheme();
    const headerHeight = useHeaderHeight();

    const processContactsResponse = async (resp) => {
        const parse = await resp.json();
        const partitioned = arrayPartition(parse["results"], ((item) => {return item["priorityLevel"] >= emergencyThreshold}));
        const data = [{key: true,
                       value: partitioned["true"]},
                      {key: false,
                       value: partitioned["false"]}]
        return data;
    }

    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/contactsGet.php", 
            "DATA:Contacts-Cache", 
            processContactsResponse);

    const renderItem = ({item}) => {  

        const emergency = item.priorityLevel >= emergencyThreshold;
        const unpressedText = emergency ? colors.emergencyText : colors.text;
        const unpressedButton = emergency ? colors.emergency : colors.card;

        const styles = {
            button: {
                backgroundColor: (pressed) => 
                    pressed ?
                        colors.notification : 
                        unpressedButton,
                color: (pressed) => 
                    pressed ? 
                        colors.notificationText : 
                        unpressedText,
                borderRadius: 5,
                margin: 2
            }
        }

        const renderFront = (item) => (pressed) => {
            return (
                <View style={{paddingVertical: 3, paddingHorizontal: 10}}>
                    <Text style={ 
                                {fontFamily: fonts.bold,
                                fontSize: 20,
                                color: styles.button.color(pressed)}}>
                        {item.name} 
                    </Text>
                    <View style={{alignContent: "center", 
                            marginTop: 5,
                            marginLeft: 10}}>
                        <Text style={
                                        {fontFamily: fonts.regular,
                                        fontSize: 15,
                                        color: styles.button.color(pressed)}
                                    }>
                            {formatPhoneNumber(item.number)}
                        </Text>
                    </View>
                </View>)
        }
        
        return (
            <Button
                onLongPress={(() => requestAddAlert(item))}
                delayLongPress={1000}
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
            padding: 5
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
        },
        scrollEnabled: false,
    };

    console.log(headerHeight);

    return (
        // What seems to be happening here is that FlatList is a bit
        // of a diva and wants to have all the space on the screen,
        // even if there's another FlatList trying to render above 
        // it, and so the last few elements are too low to be readable.
        // If you ever add more emergency numbers you're gonna have
        // to manually tweak this, I can't come up with any good
        // ideas for it.
        <View style={{flex:1, paddingBottom: 38 + 60 * (data.length > 0 ? data[0].value.length : 1)}}>
            {fetching && loading && 
                <View style={normalStyle.bounding}>
                    <Text style={normalStyle.loadingText}>Loading...</Text>
                </View>
            }
            {(!fetching || !loading) && 
                data.map(({key, value}) =>
                    <ButtonList
                        key={key}
                        data={value}
                        keyExtractor = {(item) => item["id"].toString()}
                        style= {key ? emergencyStyle : normalStyle}
                        renderItem= {renderItem}
                        sorter= {(vals) => 
                            vals.sort((a,b) => a.name.localeCompare(b.name))
                                .sort((a,b) => b.priorityLevel - a.priorityLevel)
                            }
                    />
                )
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
