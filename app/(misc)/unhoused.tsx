import { app, auth } from "../../utils/FirebaseConfig";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import Button from "../../components/Button";
import { ProfileSettingCard } from "../../components/profile/ProfileSettingCard";
import {
  getUserDataFromDatabase,
  sendJoinRequest,
} from "../../services/userService";
import {
  approveJoinRequest,
  fillCollectiveWithRooms,
  getAllCollectives,
  getRoomsInCollective,
  isRoomAvailable,
} from "../../services/generalService";
import CollectiveView from "../../components/collective/CollectiveView";
import { signOut } from "@firebase/auth";
import {
  BACKGROUND_COLOR,
  CALM_WHITE,
  FULL_WHITE,
} from "../../constants/colors";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyProfileData = {
  imageUrl:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQUHAgMGBAj/xAA7EAABAgQEAwYDBwQBBQAAAAABAgMABBEhBRIxUSIyQQYTIzNCYQdxoRRDUoGRwdE0YmOxJBVTcpLh/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAgEQEBAAIDAAMAAwAAAAAAAAAAAQIRAyExEhNBBDJR/9oADAMBAAIRAxEAPwC6B4dSjjKtfaFQI4EmqVanaAcB8IZs3N7QABIKUHMg8ytoB0AHdV4Nc0I8XhE0QPVvBoMgu11VHjxbEpXCZBczPud3KooAoCpUToAOsB7Dx+GrhSnRW8M0csvhCdCesROCdocMx9KkyT/lCpQsZVj3ptEqfE8w5AOX3gWa9Fe8opfCU6DeCuYhw2WnRO8BOc1c4VDlG8F1HOoUcGid4B2J70849MKtD3uqyOSCt85Hij0wXB7wCrpsU7QAOA94kZlK1TtDHh8SBmKrkbQgSk503cPMnaAEou2M5PMNoA8sUQcwVqdodkeGk1SrU7QgMgo3xBXMdoAMvAjiQeZW0AxYd0LoPqhajujZA9cGg7seX1VtAbjuyaND1QARn8NXChOit4dneFfCE6HeFzDIsUQNFbwHj4XeFI5TvAPvVkckEGd38FIIAFvJufV7QcIs2fDPNCF7M2/EYdjduzY5xAFqUHk9TFa/GmYcaksIbH9Op9ZGxUEin0Kosm2o8nqI4H40S7j/AGZkVtpSWmsQQo11AKFi35kRyqw/srzCJ+YkJlqblFFDrRqD0O4PtF29ncblsdkEvghK02W3W6VfxtFJSLVWUlJrvE7gGKO4JiLc0kEs1o6gdU9YidVvnJnFyXPnWX6YZ3X5vpEa5d5uYYQ8lYcS4kFpYvUGM7iy7u+kxo8x3rU+b0EF61FO+6iDrQnxuhhdaA+P1gC4u35vqEMVF2bq9XzhXNQ35o5jDubM2UOb5wALeTdPqvBalG/KPMYQoT4Jokc8QnaLtHKYM1kbIdmFC0uDf5nYRy3Tslt1EytxttPGtKWOqlGn1MCHG3E8C0rl9ApJr9YpTEsRncQmVPTT6lKJqE1OVPyHSOs+GU04JublHCSwpoOlPQKBAr8yCP0iZnutcuH4472sIgaOWa9MLWz3L6SILUq6fCPLBoKvXT6YtiZL3UfSCDK9vWCAQqs+FwlPN7wApIKkWQOYbwDxRRJy5dfeHmz8aRQJ1TvAKopnA8L8PvHJ/FBlb3ZFxaD4aX2lZfatP3jrK/e6JHpiI7WyqpvsziQRqphSm0+44h9RHHcfVN4ZlyA5gmhj3vIK0EAhWxTHllZZxSw6jKELFwTSkSyWEpAqdIzeyTSU7FdpnMNSZPEUKMnfIoCpYP5apr+kWHK4jJzKAWJpl5SrpUlYNIq9paEqISiqiaGkSEqy4shRaSkk8WbaKl0zy4pbtZOyfvDosQXJyDzRqqOJYbVLp/47zjRrU5FERsdmsQU2aTr+hFAafXWHzT9F/wBdlQnhRUL1Kt4Oaoa4VDmO8UDiuMdoJfFplJxCfayLTyzCqU312jyD4ldrFyRl/wDqQ4+VXcpDlP8Ay2+vvHfkj66tHt124RhazhmDKBxBQo4ulQz/ACr/AF9I4SWS4oremHFuvOGqlLreObwZ1bsyXnyFLPqUaknqY6ptyqdU19wYzyu3p48Zi0PCiqR2/wANGkoenX1CoCEpI+ZP8COPCC6u4JI2MWD8O5VTGGzM44k5XXAlIPqSBr+pI/KO4euct1jXWHgGZy7fpTAaIFXbpVyjaCyPEVdKtBtB5XEoZwrT2jV4zKHa3UP1gg7pY9cEAEd7TNwZdPeDMVkLIylGid4R8QeJwAcvvASVEKUMqk8qd4B1qe9pxfgjBxOZta+q0kZdq2jKpqHCPE/BEB2jxcy1ZaXNJhxPiq/7YPQe8ct0rHG5XUVuhoIWpGUpKLW0IhlxahlRcjc/vEq7K98ghkBPvTWOA7TYk/JGYbC8iW1hFUHiWrWg2trGUr23qbd7hiGeJSVha/VxdYmZfTN0ij8Mx6dZdS5xZQrKlWetD/ukW1gmI/bcNYmRbOKKGxFj9YVyWXx0KEBQhqGUaxqYcqi5vGmcmcoyjWJUjsXkGpoEFAzHVQFz7RXfabAiwpahlSkiwrt7R3GP9opLBmEuTqiVqHC2jmVHDYl20lcRVldw1TaNAtRqRFRnlIhpCYLLyW3Sb2FB+8dbJLUpAKVBSKc1Y46YDQVnSSUnT5e8dFgjylpSlVVQsVx9+ulkUd44hpoZlrUEgDqSaARb0hKokJNhpq4aQEhO/v8AnFX4DLLGOYckAV79Ksqfa/7Ra9we8Aq4fRF4Mv5F7kA4D3g4irVO0A8MlSRnKum0FcpK0cSzqnaGKt8TfEVHiA6RbzF3KR95WCDu2xousEA+anfWHp94Lm7goscg3ha+dp6aQzWvieZ6aQGK1ZUlZ80A29orR+aXNOuvuqqt1RUfb2ixZ8kSMySaPBlVD0HCYqtp0d2mp6RnyV6OD9qWk1UpSOU7X9kJqdeE1hJbCw732VRFQq29ukTTEworCU/rEg3NU1GnWM9t/YquQ7I4lJvman5dRKaqyIHMYsDs8wuSwdhh9GR2pUU7Ekn94k3XkkZlUAERi59ta6Nqzf3DSFu3cMPyJZL+QUrQxrcdCl1VtEZ3iic1TGbT4dqhRvpBdx04DtahU9NTcwpwJKFlFV14EAVCRTc/7jl5FQ75lOQnMvKsVqHAT9KCLlVgWHzDrinGxV2y76xpl+wOBsu962HkqrWyx/FoqZajDPC27iuJuRcDDnckOIZdW3UmhNDGjDcVekXkhFAUkVSsUqPnFl492fS1KIbw9pIZbuG09TW5J1Jiv8Wwh9uXVMuthsIVQEk0P6xUs0nLc8W/8KsTlMX+0P8Adq+2tpBQSBlCTrT339qRYgrzJHi0unaPnj4T4oqQ7USiAspbePdqrpU2/wB0j6HvW3nddorFjyb3sVy8Td3TzCA1Tdm6jze0Opqe7r3vq2hD/DzeqsUzPKzXX6wQqM9KwoDI0T51weWCihZw1WeU7QrN3c4s3L7QEFByKNVK5TtAYTIBYdQ5zlBqfakU3m4QBpFxTaM0q+wfMU2oBXzBilVOUSAIzzb8P69LUyGwaEC8bUzgOpvESsqpY3PWI6ZemkLBbuIyeh2KJts2WbbGIbFZKXzoeYUpCkrCqIUQNYiW8SmEJo4m/wDaaw14opQulUVprh12kFzTjjbiGllC1AhKqVynenWN+D4VNHI7Oz6106JSBX5xCSU8lsrzgg5qioiUZxhtIALmnSsNKzz346jNlFAdIYfUDSv1jnFYu1SiVghW6ozbxAWsD8o5pgmlzwS53TqrKFUxpxKRbxDDXZcgcQsaaGI95wTBSUmpHKaRMSRKmwlVt4b0nLtXuD4VMSPaBpg5hRYUkge+sfRkk4XpRhX3620qJ/KK6akEJmA8BVXSLGlUBEsywLLQhIzflGmF2w5PG0cXC2aOjmMAuSGuFQ5jvD5jkRZadVbwh4nCjhI1O8aMQFMm4T9IIO9R+D6QQB5P9+b6QZchyE5ivRW0A8O6OLNr7QUCOBJqlWp2gAj7kmtfVFL4mx9nxObl6UDT60D5BRAi6KfdV4D6orb4g4aqUxQTraT3MwLr6ZxrEZzprxXV05ZSajSNCkAdI9CFgiBSKxk9O3k7tOWgSBTaEplJBEblIIjWokR3bvyaDLJItWMFSSBr13jel2l1RocdK1UJt7Q2baXpVKTRIrG+XSoBIBsIE3j0yyMxFBpBO3rZqlCb3idkV50A0pEQyzmpWJeTby0Fa1iLXNugwSW+1zrTZsBxKtoBHZ0r4IsR64h+zUmpmV7x0Xf0OyRExqO6NQgaLjfCajz8l3RTvPD0p694d3eAHLk67wjxeGrhSn1bwebwr4QnQ7xbMB21m6QQ++V+AwQAKor3XETzV6QqBIIQaoPMdoYsfBv+KvSAZaHu/L9ftAK1Mg8rqqPJi2HtYph7sk/QMqTwLI5VdDHrtT/D1MFstFeSNDAUhOyjshOOyr4yuNrKSP3HsYwBO8WV2z7NLxZCZyUCRNNjKEmwdTtXcdIrd5lxh1TTyFNuJNFJWKEGMcpp6sc5lGtRO0aFm9xG5VYx+cSpodaHSMUyqSY3qoYyQDHAmZZBI6RJS8ulOgtGEqgFdVJCREky2Ab6Ry3TgZaFMwGkdB2ewz7e+FrQRLtnjO/tHmwbCX8TeIZBRLg8bhFgPbcx3cpLsysulmVTRgDi9/eKwwtu6jPOY9RtAATkT5O8FARkPldFQdOHyepgOnEfB6GPQ85niGVdmxyqhEBQAd4UjlO8HQd55XpMB/zWR6IBlbx1SIIKveqlYIBC9e5sfVXrBY3bFEDnG8MVWaNHKRze8IZVAqQKIHMN4AtSoHg7QWsTdnoILUzizX4YLBOdV2jomAD0Lt2/SI8OJ4RIYmimIsJWdEOJstP5iPdZAzru2eVO0Boi73EDy9aQI4LEPh+6k/8ABnUqJ0Q+L/8AsP4iDmux+OS6sv2LvPdtxJ/+xbRqk0d4lHlO0K4ORZq4dFbRHwjScuUUyrs/jCV5f+lzhPsyoxuY7O4y4qjeGTIVXRaMv+6RcNxwHzeioWp7tNndSreOfXHftqtpHsfjMwoJdQ1L5TfvHASP0rHT4f2SlmgPtD6ppadUkZUfpr9Y6KhVVCDRwcyt4YBXUNcJHN7x2YSJvJlWLaUIbCJVIQ2mxSBSnyEZW+7FGxzVhA5xVrhA5hvBYjM3Zscw3i0AaVTZnqIOlT5PQQajOPK6pgsBnI8L8NIANBdy7XpEOtPO5fTaFXKM67tnRMB4Lu8SDyjaAYD1NRBBkd6rqYIBPnKlGW1daRk7Z5sCwOogggEf6kJ9O0CbzCk+mhtBBADV31g3A0EEvxKXmvQ2rBBAJi7ThNyNCflAg1YWo6itDBBAA/plK9W8CrS4PXfrBBADtmEKFiaXED/ChBTYkdIIIBv8K0BNgYHbPISLA0t+cEEAH+oCem0A/qSn0006QQQA3d9aTcDpAwKuOA3ANqwQQGkKVuf1hwQQH//Z",
  username: "ERROR_USER",
  placed: false,
  phoneNumber: "NOT SET",
  email: "error@error.error",
  realname: "NOT SET",
  collective: "NOT SET",
  room: "NOT SET",
};

const Unhoused = () => {
  const [userData, setUserData] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollective, setSelectedCollective] = useState<string | null>(
    null
  );
  const [roomText, setRoomText] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const openJoin = (name: string) => {
    setSelectedCollective(name);
    setRoomText("");
    setModalOpen(true);
  };

  const closeJoin = () => setModalOpen(false);

  const handleJoin = async () => {
    if (!selectedCollective) return;

    const collectiveRooms = await getRoomsInCollective(selectedCollective);

    if (!collectiveRooms) {
      alert(
        "Collective " +
          selectedCollective +
          " does not exist. Did you misspell it?"
      );
      return;
    }

    if (!collectiveRooms.includes(roomText)) {
      alert(
        "Room " +
          roomText +
          " does not exist in " +
          selectedCollective +
          ". Did you misspell it?"
      );
      return;
    }

    const available = await isRoomAvailable(selectedCollective, roomText);

    if (!available) {
      alert(
        "Room " +
          roomText +
          " in " +
          selectedCollective +
          " is already occupied. Please contact an admin if you think this is a mistake."
      );
      return;
    }

    await sendJoinRequest(selectedCollective, roomText);

    alert(
      "Success! Join request sent for room " +
        roomText +
        " in " +
        selectedCollective
    );
  };

  const approveMe = async () => {
    await approveJoinRequest("A2", "6Ty8gfJLIAbnxeo3ypuv");
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const data = await getUserDataFromDatabase();
        setUserData(data);
        setLoading(false);
      };

      const userID = auth.currentUser?.uid;

      if (!userID) {
        throw new Error("User not authenticated");
      }

      fetchUserData();
    }, [])
  );

  const username = userData?.username || dummyProfileData.username;
  const placed = userData?.placed ?? dummyProfileData.placed;
  const phoneNumber = userData?.phoneNumber || dummyProfileData.phoneNumber;
  const email = userData?.email || dummyProfileData.email;
  const imageUrl = userData?.imageUrl || dummyProfileData.imageUrl;
  const realname = userData?.realname || dummyProfileData.realname;
  const collective = userData?.collective || dummyProfileData.collective;
  const room = userData?.room || dummyProfileData.room;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  /*
  const onFillA2Press = async () => {
    const atwo = [
      "H0201",
      "H0202",
      "H0203",
      "H0204",
      "H0205",
      "H0206",
      "H0207",
      "H0208",
      "H0209",
      "H0210",
      "H0211",
      "H0212",
      "H0213",
      "H0214",
    ];
    await fillCollectiveWithRooms("A2", atwo);
  };
  */

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          paddingTop: 20,
        }}
      >
        <View style={styles.headerContainer}>
          <Image
            source={typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl}
            style={styles.image}
          />
          <Text style={styles.headerTextName}>{username}</Text>
          <Text style={styles.headerText}>
            {placed
              ? `Collective: ${collective}, Room: ${room}`
              : "No room set"}
          </Text>
        </View>
        <View style={styles.middleContainer}>
          <ProfileSettingCard
            setting="Phone number"
            settingInfo={phoneNumber}
          />
          <ProfileSettingCard setting="Email" settingInfo={email} />
          <ProfileSettingCard setting="Name" settingInfo={realname} />
          <Button
            text="Change settings"
            path="./settings"
            buttonStyle={styles.formButton}
            buttonTextStyle={styles.formButtonText}
          />
          {/* 
        <Button
          text="FILL A2"
          onPress={onFillA2Press}
          buttonStyle={styles.formButton}
          buttonTextStyle={styles.formButtonText}
        />
        */}
          <Button
            text="Approve me (TESTING ONLY)"
            onPress={approveMe}
            buttonStyle={styles.formButton}
            buttonTextStyle={styles.formButtonText}
          />
          <Button
            text="Log out"
            onPress={handleLogout}
            buttonStyle={styles.formButton}
            buttonTextStyle={styles.formButtonText}
          />

          <CollectiveView onSelect={openJoin} />
          <Modal visible={modalOpen} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalInnerContainer}>
                <Text style={styles.modalRoomText}>
                  Which room is yours in {selectedCollective}?
                </Text>

                <TextInput
                  value={roomText}
                  onChangeText={setRoomText}
                  placeholder="Room number, e.g., H0201"
                  style={styles.modalInput}
                />
                <View style={styles.modalButtonContainer}>
                  <Pressable onPress={closeJoin} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Close</Text>
                  </Pressable>
                  <Pressable onPress={handleJoin} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Apply to join</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: "5%",
    width: "100%",
    backgroundColor: BACKGROUND_COLOR,
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 4,
    borderRadius: 80,
    borderColor: FULL_WHITE,
    alignSelf: "center",
  },
  headerTextName: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
    color: CALM_WHITE,
  },
  headerText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    color: CALM_WHITE,
  },
  middleContainer: {
    alignItems: "center",
    gap: 30,
    width: "100%",
    paddingBottom: 20,
  },
  formButton: {
    backgroundColor: FULL_WHITE,
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },

  modalInnerContainer: {
    backgroundColor: "#ffffffff",
    padding: 16,
    borderRadius: 12,
  },

  modalRoomText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#d3cacaff",
    padding: 20,
    borderRadius: 8,
    marginTop: 12,
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  modalButton: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 8,
    backgroundColor: "#070007ff",
  },

  modalButtonText: {
    color: "#ffffffff",
    fontWeight: "bold",
  },
});
export default Unhoused;
