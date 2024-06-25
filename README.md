# Chat GPT Clone

Chat GPT Clone mobile app built using React Native Expo and Firebase. The app provides features like user login, registration, chat completion, and generating images.

![Chat GPT Mobile](https://i.ibb.co/RcNyyT6/chatgpt.png)

## Features

The Chat GPT Clone app offers the following features:

1. **User Authentication:**

-   Login: Existing users can log in using their credentials.
-   Register: New users can create an account by providing necessary information.

2. **Chat Completion:**

-   Users can engage in conversations with the Chat GPT model and receive intelligent responses.
-   The app utilizes the power of GPT-3.5, a large language model, to generate human-like text responses.

3. **Image Generation**

-   Users can generate images based on specific prompts or descriptions.
-   The app uses AI models and image generation algorithms to create images.

## Prerequisites

Before setting up the app, make sure you have the following prerequisites installed:

-   **Node.js**: Install Node.js from the official website (https://nodejs.org) or use a package manager like Homebrew (macOS) or Chocolatey (Windows).
-   **Expo CLI**: Install the Expo CLI globally by running the following command:

```shell
npm install --global expo-cli

```

-   **Firebase Account**: Create a Firebase account at https://firebase.google.com and set up a new project.

## Getting Started

To get started with the Chat GPT Clone app, follow these steps:

1. **Clone the repository:**

```shell
git clone https://github.com/bizzara/ChatGPT.git

cd ChatGPT
```

2. **Install dependencies:**

```shell
npm install
```

3. **Set up Firebase:**

-   Create a new Firebase project
-   Enable Authentication and Firestore services.
-   In the Firebase console, navigate to Project Settings and copy the Firebase configuration object.

4. **Configure Firebase in the app:**

-   Replace the placeholder values in firebaseHelper.js with your Firebase configuration values.

5. **Start the Expo development server:**

```shell
expo start
```

6. **Install the Expo Go app** on your iOS or Android device.
7. **Scan the QR code** displayed in the terminal or in the browser using the Expo Go app to launch the app on your device.
8. You should now be able to use the Chat GPT Clone app on your device.

## Technologies Used

The Chat GPT Clone app utilizes the following technologies:

-   **React Native**: A framework for building native apps using React.
-   **Expo**: A framework and platform for universal React applications.
-   **Firebase**: A backend-as-a-service platform for building web and mobile apps.
-   **GPT-3.5**: A state-of-the-art language model developed by OpenAI.

## Contributing

Contributions to the Chat GPT Clone app are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request


import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Image, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';

const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [outputMessage, setOutputMessage] = useState('Results should be shown here.');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const { colors } = useTheme();

    const renderMessage = (props) => {
        const { currentMessage } = props;

        if (currentMessage.user._id === 1) {
            return (
                <View style={styles.rightMessageContainer}>
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: COLORS.primary,
                                marginRight: 12,
                                marginVertical: 12,
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
                <View style={styles.leftMessageContainer}>
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
            createAt: new Date(),
            user: { _id: 1 },
        };

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));

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
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.choices[0]?.message?.content);
                setInputMessage('');
                setOutputMessage(data.choices[0]?.message?.content?.trim() || '');

                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: data.choices[0]?.message?.content?.trim() || '',
                    createAt: new Date(),
                    user: { _id: 2, name: 'ChatGPT' },
                };

                setIsTyping(false);
                setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
            })
            .catch((error) => {
                console.error('Error fetching chat response:', error);
                setIsTyping(false);
                setOutputMessage('Error: Failed to fetch response');
            });
    };

    const generateImages = () => {
        setIsTyping(true);
        const message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };

        setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));

        fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer your_own_openai_api_key',
            },
            body: JSON.stringify({
                prompt: inputMessage,
                n: 1,
                size: '1024x1024',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data[0].url);
                setInputMessage('');
                setOutputMessage(data.data[0].url);
                setIsTyping(false);

                data.data.forEach((item) => {
                    const message = {
                        _id: Math.random().toString(36).substring(7),
                        text: 'Image',
                        createdAt: new Date(),
                        user: { _id: 2, name: 'ChatGPT' },
                        image: item.url,
                    };

                    setMessages((previousMessage) => GiftedChat.append(previousMessage, [message]));
                });
            });
    };

    const submitHandler = () => {
        if (inputMessage.toLowerCase().startsWith('generate image')) {
            generateImages();
        } else {
            generateText();
        }
    };

    const handleInputText = (text) => {
        setInputMessage(text);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Save chat')}>
                    <Ionicons name="bookmark-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.chatContainer}>
                <GiftedChat
                    messages={messages}
                    renderInputToolbar={() => {}}
                    user={{ _id: 1 }}
                    minInputToolbarHeight={0}
                    renderMessage={renderMessage}
                    isTyping={isTyping}
                />
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        value={inputMessage}
                        onChangeText={handleInputText}
                        placeholder="Enter your question"
                        placeholderTextColor={colors.text}
                        style={[styles.input, { color: colors.text }]}
                    />

                    <TouchableOpacity onPress={submitHandler} style={styles.sendButton}>
                        <FontAwesome name="send-o" color={COLORS.primary} size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(153, 204, 255, 0.7)', // gradiente azul-esverdeado
    },
    header: {
        height: 60,
        backgroundColor: 'rgba(153, 204, 255, 0.7)', // gradiente azul-esverdeado
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 22,
        width: SIZES.width,
        zIndex: 9999,
    },
    backButton: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(153, 204, 255, 0.7)', // gradiente azul-esverdeado
        paddingVertical: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        backgroundColor: 'rgba(153, 204, 255, 0.7)', // gradiente azul-esverdeado
        paddingVertical: 8,
        marginHorizontal: 12,
        borderRadius: 12,
        borderColor: COLORS.text,
        borderWidth: 0.2,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontFamily: 'Arial', // trocar para a fonte desejada
    },
    sendButton: {
        padding: 6,
        borderRadius: 8,
        marginHorizontal: 12,
    },
    rightMessageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    leftMessageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
});

export default Chat;
