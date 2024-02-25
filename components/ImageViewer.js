import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ imageSource, styles}) {
    if (styles == null) {
        styles = defaultStyles;
    };
    return (
        <Image imageSource={imageSource} style={styles.image} />
    );
}

const defaultStyles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    }
})