import { View , Text, Animated } from "react-native";
import AnimatedButton from "./AnimatedButton";
import { useState } from "react";

export const renderHSNavButton = (styles, onPress) => ({item}) => {
    return <HomeScreenNavButton styles={styles} onPress={onPress} item={item}/>
}

export const HomeScreenNavButton = ({styles, onPress, item}) => {
    
    return (
        <AnimatedButton
            accessibilityLabel=
                {item.name}
            accessibilityHint=
                {`Press to travel to the ${item.name} page.`}
            under={<Text
                    accessible= {true}
                    accessibilityLabel= {`${item.name}, title`}
                    style= {styles.label}
                    zIndex={1}
                    >
                        {item.name}
                    </Text>}
            front={<View/>}
            styles={styles.buttonStyles}
            onPress={onPress}
        /> 
    )
}