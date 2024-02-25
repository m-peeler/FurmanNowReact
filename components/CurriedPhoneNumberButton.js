// This uses a pattern called 

import { Text } from "react-native";

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


function PhoneNumberButton({props, backgroundColor, color}){
    const item = props.item;
    return (
        <View style={{paddingVertical: 3, paddingHorizontal: 10}}>
                <Text style={ 
                            {fontFamily: fonts.bold,
                            fontSize: 20,
                            color: color}}>
                    {item.name} 
                </Text>
                <View style={{alignContent: "center", 
                        marginTop: 5,
                        marginLeft: 10}}>
                    <Text style={
                                    {fontFamily: fonts.regular,
                                    fontSize: 15,
                                    color: color}
                                }>
                        {formatPhoneNumber(item.number)}
                    </Text>
                </View>
            </View>
        )
}

export default function CurriedPhoneNumberButton(props) {
    return function(backgroundColor, color) {
        return <PhoneNumberButton props={props}
                backgroundColor={backgroundColor}
                color={color}/>
    }
}