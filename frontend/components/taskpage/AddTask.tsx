import Ionicons from "@expo/vector-icons/Ionicons"
import { ThemedView } from "../ThemedView"
import { TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { ROUTES } from "@/constants/routes"

type Props = {

}

export default function AddTask({}:Props){
    // style={{}}
    const handlePress=()=>{
        router.replace(ROUTES.ADD);
    }
    return(
        <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={handlePress}>
            <Ionicons name="add-outline" color="#fff" size={30} />
        </TouchableOpacity>
    )
}