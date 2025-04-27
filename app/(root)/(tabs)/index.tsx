import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text className="font-rubik-bold text-3xl justify-content-center align-items-center text-black-300 mb-2">
        Bienvenue sur Sosa<Text className="text-primary-300">Inzo</Text>
      </Text>
      <Text className="font-light text-lg mb-8">Le Airbnb Congolais</Text>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/properties/1">Property</Link>
    </View>
  );
}
