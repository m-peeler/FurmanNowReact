import {View} from "react-native";
import {FlashList} from "@shopify/flash-list";

export default function ButtonList(props) {
    const {data, sorter, renderItem, keyExtractor, style, estimatedItemSize} = props;
    return (
        <View style={style.bounding}>
            <FlashList
                estimatedItemSize={estimatedItemSize}
                data={sorter(data)}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                scrollEnabled={style.scrollEnabled}
            />
        </View>
    )
}