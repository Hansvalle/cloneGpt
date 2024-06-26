import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { COLORS, SIZES, images } from '../constants';
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient
//import { View, TouchableOpacity, TextInput, Linking } from 'react-native';



const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [outputMessage, setOutputMessage] = useState('Results should be shown here.');
    const { colors } = useTheme();

    const renderMessage = (props) => {
        const { currentMessage } = props;
    
        if (currentMessage.user._id === 1) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: COLORS.primary,
                                marginRight: 12,
                                marginVertical: 12,
                                borderTopRightRadius: 0, // Remover o canto superior direito
                                borderBottomLeftRadius: 16, // Adicionar o canto de fala no canto inferior esquerdo
                                borderBottomRightRadius: 16, // Adicionar o canto de fala no canto inferior direito
                            },
                        }}
                        textStyle={{
                            right: {
                                color: COLORS.white,
                            },
                        }}
                    />
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Image
                        source={images.avatar}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            marginLeft: 8,
                        }}
                    />
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: COLORS.secondaryWhite,
                                marginLeft: 12,
                                borderTopLeftRadius: 0, // Remover o canto superior esquerdo
                                borderBottomLeftRadius: 16, // Adicionar o canto de fala no canto inferior esquerdo
                                borderBottomRightRadius: 16, // Adicionar o canto de fala no canto inferior direito
                            },
                        }}
                        textStyle={{
                            left: {
                                color: COLORS.black,
                            },
                        }}
                    />
                </View>
            );
        }
    };
    

    const generateText = () => {
        setIsTyping(true);

        const message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };

        setMessages(previousMessages => GiftedChat.append(previousMessages, [message]));

        const apiKey = 'sk-proj-bTuQFyIIV3cRv30jYyunT3BlbkFJEtZPdJYFkEDDPYEImR4R'; // Replace with your actual OpenAI API key

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: inputMessage,
                    },
                ],
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.choices[0]?.message?.content);
                setInputMessage('');
                setOutputMessage(data.choices[0]?.message?.content?.trim() || '');

                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: data.choices[0]?.message?.content?.trim() || '',
                    createdAt: new Date(),
                    user: { _id: 2, name: 'ChatGPT' },
                };

                setIsTyping(false);
                setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
            })
            .catch(error => {
                console.error('Error fetching chat response:', error);
                setIsTyping(false);
                setOutputMessage('Error: Failed to fetch response');
            });
    };

    const generateGradientBackground = () => {
        return (
            <LinearGradient
                colors={['#87CEEB', '#4169E1']} // Cores do gradiente: de verde água (#87CEEB) para azul (#4169E1)
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar style="auto" />
                    {/*<View
                        style={{
                            height: 130,
                            //backgroundColor: 'rgba(0,0,0,0.3)',
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            top: 25,
                            right: 0,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            paddingHorizontal: 22,
                            width: SIZES.width,
                            zIndex: 9999,
                        }}
                    >
                        <TouchableOpacity onPress={() => console.log('Save chat')}>
                            <Ionicons
                                name="star"
                                size={24}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons 
                                //name="home-outline"
                                name="home" 
                                size={33} 
                                color={COLORS.white} 
                            />
                            <MaterialIcons
                                name="arrow-circle-left"                             
                                size={33}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                        
                    </View>*/}

                    <View style={{ flex: 1 }}>
                        <GiftedChat
                            messages={messages}
                            renderInputToolbar={() => {}}
                            user={{ _id: 1 }}
                            minInputToolbarHeight={0}
                            renderMessage={renderMessage}
                            isTyping={isTyping}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            //backgroundColor: 'rgba(0,0,0,0.3)',
                            backgroundColor: 'transparent',
                            paddingVertical: 8,
                            paddingTop: 8,
                            marginTop: 25,
                        }}
                        
                    >
                        <LinearGradient
                            colors={['#87CEEB', '#4169E1']} // Cores do gradiente: de verde água (#87CEEB) para azul (#4169E1)
                            style={{
                                position: 'absolute',
                                right: 0,
                                left: 0,
                                top: 0,
                                height: '90%',
                                //colors={['rgba(67, 206, 162, 0)','rgba(65, 105, 225, 1)','rgba(67, 206, 162, 1)','rgba(67, 206, 162, 0)',]} // Cores do gradiente: de azul para verde e depois transparente
                        //}}
                                //style={{
                                    //position: 'absolute',
                                    //left: 0,
                                    //right: 0,
                                    //top: 0,
                                    //height: '100%', // Ajuste a altura conforme necessário
                                }}
                                    />
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                marginLeft: 10,
                                paddingVertical: 11,
                                marginHorizontal: 12,
                                borderRadius: 12,
                                borderColor: COLORS.white,
                                borderWidth: 0.2,
                                
                            }}
                        >
                            <TextInput
                                value={inputMessage}
                                onChangeText={handleInputText}
                                placeholder="Como posso te ajudar?"
                                placeholderTextColor={COLORS.white}
                                style={{
                                    color: COLORS.white,
                                    flex: 1,
                                    paddingHorizontal: 15,
                                }}
                            />

                            <TouchableOpacity
                                onPress={submitHandler}
                                style={{
                                    padding: 16,
                                    borderRadius: 8,
                                    marginHorizontal: 16,
                                }}
                            >
                                <FontAwesome
                                    //name="send-o"
                                    name="send"
                                    //color={COLORS.primary}
                                    color={COLORS.white}
                                    size={29}
                                />
                                
                            </TouchableOpacity>
                        </View>
                        <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            //backgroundColor: 'transparent',
                            paddingVertical: 6,
                            //paddingTop: 8,
                            marginTop: 25,
                            //padding: 6,
                            borderRadius: 80,
                            marginHorizontal: 16,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <TouchableOpacity style={{ paddingHorizontal: 13 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons 
                                //name="home-outline"
                                name="home" 
                                size={24} 
                                color={COLORS.white} 
                            />
                        </TouchableOpacity>
                        </TouchableOpacity>
                       {/*<TouchableOpacity style={{ paddingHorizontal: 16 }}>
                            <Ionicons name="search" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 16 }}>
                            <Ionicons name="notifications" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 16 }}>
                            <Ionicons name="person-outline" size={24} color={COLORS.white} />
                        </TouchableOpacity>*/}

                        <TouchableOpacity style={{ paddingHorizontal: 16 }}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.vindeacristo.org/crencas/deus/como-orar')}>
                            <Ionicons 
                                name="globe" 
                                size={24} 
                                color={COLORS.white} 
                                
                            />
                        </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    </View>
                    
                </SafeAreaView>
            </LinearGradient>
        );
    };

    const submitHandler = () => {
        if (inputMessage.toLowerCase().startsWith('generate image')) {
            generateText(); // Altere para gerar imagem se desejar manter essa funcionalidade
        } else {
            generateText();
        }
    };

    const handleInputText = text => {
        setInputMessage(text);
    };

    return generateGradientBackground();
};

export default Chat;
