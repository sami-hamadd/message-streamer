// /components/MessageList.tsx
'use client'
import { useEffect, useState, useRef } from 'react';
import { Card, Text, Container, Group } from '@mantine/core';
import { IconRobot, IconUser } from '@tabler/icons-react';

type Message = {
    role: string;
    message: string;
};

const MessageList = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [displayedMessages, setDisplayedMessages] = useState<JSX.Element[]>([]);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const messageIndexRef = useRef(0);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');

        ws.onmessage = (event) => {
            const newMessages: Message[] = JSON.parse(event.data);

            // Check if the new message list is shorter, indicating deletions
            if (newMessages.length < messages.length) {
                // Reset displayed messages and start streaming from the beginning
                setDisplayedMessages([]);
                messageIndexRef.current = 0;
                setIsStreaming(false);  // Reset the streaming state to allow re-triggering
            }

            // Update messages state with the new list
            setMessages(newMessages);
        };

        return () => {
            ws.close();
        };
    }, []);


    useEffect(() => {
        if (!isStreaming && messages.length > 0) {
            setIsStreaming(true);
            streamMessages();
        }
    }, [messages]);

    const streamMessages = () => {
        const newContent: JSX.Element[] = [...displayedMessages];

        const streamNextMessage = () => {
            if (messageIndexRef.current >= messages.length) {
                // All messages have been streamed
                setIsStreaming(false);
                return;
            }

            const message = messages[messageIndexRef.current];
            messageIndexRef.current += 1;
            if (!message || !message.message) {
                // Skip this message if it's invalid
                setTimeout(streamNextMessage, 500); // Move to the next message after a delay
                return <Text>No messages!</Text>;
            }
            let charIndex = 0;
            let currentText = '';

            // Add a placeholder for the new message
            newContent.push(
                <Card
                    key={`message-${messageIndexRef.current}`}
                    shadow="sm"
                    padding="lg"
                    style={{
                        backgroundColor: message.role === 'AI' ? '#E0F7FA' : '#FFF3E0',
                        marginBottom: '1rem',
                    }}
                >
                    <Text
                        fw={500}
                        style={{ color: message.role === 'AI' ? '#00796B' : '#BF360C' }}
                    >
                        {message.role}:
                    </Text>
                    <Text
                        style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}
                    >
                        {/* Streaming text will appear here */}
                    </Text>
                </Card>
            );

            const cardIndex = newContent.length - 1;
            setDisplayedMessages([...newContent]);

            const interval = setInterval(() => {
                if (charIndex <= message.message.length) {
                    currentText = message.message.slice(0, charIndex);

                    // Update the Card at cardIndex
                    newContent[cardIndex] = (
                        <Card
                            key={`message-${messageIndexRef.current}`}
                            shadow="sm"
                            padding="lg"
                            style={{
                                backgroundColor: message.role === 'AI' ? '#E0F7FA' : '#FFF3E0',
                                marginBottom: '1rem',
                            }}
                        >
                            <Group>
                                <div style={{
                                    borderRadius: '50%',  // Makes the container circular
                                    backgroundColor: 'white',  // White background
                                    width: '40px',  // Adjust width as needed
                                    height: '40px',  // Adjust height as needed
                                    display: 'flex',  // Use flex to center the icon
                                    justifyContent: 'center',  // Center horizontally
                                    alignItems: 'center',  // Center vertically
                                    marginRight: '0.5rem'  // Space between icon and text
                                }}>
                                    {message.role === 'AI' ? <IconRobot /> : <IconUser />}
                                </div>
                                <Text
                                    fw={500}
                                    style={{ color: message.role === 'AI' ? '#00796B' : '#BF360C' }}
                                >
                                    {message.role}:
                                </Text>
                                <Text
                                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}
                                >
                                    {currentText}
                                </Text>
                            </Group>
                        </Card>

                    );

                    setDisplayedMessages([...newContent]);
                    charIndex++;
                } else {
                    clearInterval(interval);
                    // Proceed to the next message after a short delay
                    setTimeout(streamNextMessage, 500);
                }
            }, 20); // Adjust the speed by changing the interval time
        };

        streamNextMessage();
    };

    return (
        <Container p={30}>
            {displayedMessages}
        </Container>
    );
};

export default MessageList;
