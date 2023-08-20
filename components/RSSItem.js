import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
  Image,
  Alert
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import moment from "moment";
import RenderHtml from "react-native-render-html";
import { useEffect, useState } from "react";
import translate from 'google-translate-api-x';

export default function RSSItem({ item, onClick }) {
  const { width } = useWindowDimensions();
  const maxImageSize = 240

  const [isTranslate, setIsTranslate] = useState(false)

  const renderersProps = {
    a: {
      onPress(event, url, htmlAttribs, target) {
        WebBrowser.openBrowserAsync(url);
      },
    }
  }

  const tagStyles = {
    strong: {
      color: '#0B0B0B',
      fontWeight: '500'
    },
    p: {
      color: '#0B0B0B',
      marginTop: 10,
      marginBottom: 0
    },
    a: {
      color: '#5D9AE4',
      fontWeight: 'bold',
      textDecorationLine: 'none',
    },
    li: {
      marginLeft: 6,
      fontSize: 16,
      marginBottom: 6,
    }
  }

  const baseStyle = {
    fontSize: 16,
    color: '#0B0B0B',
    lineHeight: 25,
    whiteSpace: 'normal',
  }

  useEffect(() => {

  }, [])

  return (
    <Pressable
      onPress={async () => {
        console.log(`open --> [${item.link}]`);
        if (item.link != undefined) {
          let result = await WebBrowser.openBrowserAsync(item.link);
          console.log(result);
        }
      }}
    >
      {item.id == 0 ?
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            <View>
              <Text style={styles.author}>{item.author}</Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={styles.channelTitle}>@{item.channel.title}</Text>
                <Text style={styles.time}>· {moment(item.published).fromNow()}</Text>
              </View>
            </View>
          </View>
          {item.title && item.title.length > 0 ? <Text style={styles.itemTitle}>{item.title}</Text> : null}
          <View style={{ width: "100%", marginTop: 2 }}>
            <RenderHtml
              source={{ html: item.description }}
              contentWidth={width}
              baseStyle={baseStyle}
              tagsStyles={tagStyles}
              renderersProps={renderersProps}
              enableExperimentalGhostLinesPrevention={true}
            />
          </View>
          {item.imageList.length > 0 ? <Image
            style={{
              width: (item.imageWidth > item.imageHeight ? maxImageSize : maxImageSize * item.imageWidth / item.imageHeight),
              height: (item.imageWidth > item.imageHeight ? maxImageSize * item.imageHeight / item.imageWidth : maxImageSize),
              borderRadius: 6,
              borderWidth: 2,
              borderColor: '#f5f5f5',
              marginTop: 16
            }}
            source={{
              uri: item.imageList[0],
            }}
          /> : null}
          <View style={{ flexDirection: 'row', height: 30, marginTop: 12, alignItems: 'center' }}>
            <Pressable onPress={async () => {
              if (!isTranslate) {
                setIsTranslate(true)
                const transTitle = await translate(item.title, { to: 'zh-CN' })
                const transDes = await translate(item.description, { to: 'zh-CN' })
                setIsTranslate(false)
                Alert.alert(transTitle.text, transDes.text, [
                  { text: 'OK', onPress: () => { } },
                ]);
              }
            }} style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }} >
              <Image source={isTranslate ? require('../res/loading.png') : require('../res/translate.png')} style={{ width: 20, height: 20 }} />
            </Pressable>
            <Pressable onPress={() => {
              alert(JSON.stringify(item))
            }} style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 12 }} >
              <Image source={require('../res/api.png')} style={{ width: 20, height: 20 }} />
            </Pressable>
          </View>
        </View> :
        <Pressable onPress={() => {
          onClick()
        }}>
          <View style={{ width: '100%', height: 50, marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#1f1f1f', fontWeight: 'bold' }}>{"看完了，换一批"}</Text>
          </View>
        </Pressable>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    marginBottom: 4,
    paddingBottom: 24
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    marginEnd: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: "white",
  },
  author: {
    fontSize: 14,
    color: "#3E3E3E",
    marginLeft: 8,
    fontWeight: 'bold'
  },
  channelTitle: {
    fontSize: 12,
    marginLeft: 6,
    color: "#1D1D1D",
  },
  time: {
    fontSize: 12,
    marginLeft: 6,
    color: "#1D1D1D",
  },
  itemTitle: {
    marginTop: 12,
    fontWeight: "500",
    fontSize: 17,
    lineHeight: 26,
    color: '#0B0B0B',
  },
});
