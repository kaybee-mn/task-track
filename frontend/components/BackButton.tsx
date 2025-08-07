import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { TouchableOpacity } from "react-native"

const BackButton = () =>{
    const onPress=()=>{
        router.back()
    }
 return (
    <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-back" size={30} color="#ffffff"></Ionicons>
    </TouchableOpacity>
 )
}
export default BackButton