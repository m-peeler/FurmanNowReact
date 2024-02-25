import {View, FlatList} from "react-native";

export default function ButtonList(props) {
    const {data, sorter, renderItem, keyExtractor, style} = props;
    return (
        <View style={style.bounding}>
            <FlatList
                data={sorter(data)}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                scrollEnabled={style.scrollEnabled}
            />
        </View>
    )
}