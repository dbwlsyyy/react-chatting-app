import {
    child,
    DataSnapshot,
    off,
    onChildAdded,
    ref as dbRef,
    onChildRemoved,
} from 'firebase/database';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { useState } from 'react';
import { db } from '../../../../firebase';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Message from './Message';
import { setUserPosts } from '../../../store/chatRoomSlice';
import { useRef } from 'react';
import Skeleton from '../../../components/Skeleton';

const MainPanel = () => {
    const messagesRef = dbRef(db, 'messages');
    const typingRef = dbRef(db, 'typing');

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);

    const { currentChatRoom } = useSelector((state) => state.chatRoom);
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    useEffect(() => {
        if (currentChatRoom.id) {
            addMessagesListner(currentChatRoom.id);
            addTypingListners(currentChatRoom.id);
        }

        return () => {
            off(messagesRef);
        };
    }, [currentChatRoom.id]);

    const addTypingListners = (chatRoomId) => {
        let typingUsers = [];

        onChildAdded(child(typingRef, chatRoomId), (DataSnapshot) => {
            if (DataSnapshot.key !== currentUser.uid) {
                typingUsers = typingUsers.concat({
                    id: DataSnapshot.key,
                    name: DataSnapshot.val(),
                });
                setTypingUsers(typingUsers);
            }
        });

        onChildRemoved(child(typingRef, chatRoomId), (DataSnapshot) => {
            const index = typingUsers.findIndex(
                (user) => user.id === DataSnapshot.key
            );
            if (index !== -1) {
                typingUsers = typingUsers.filter(
                    (user) => user.id !== DataSnapshot.key
                );
                setTypingUsers(typingUsers);
            }
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setSearchLoading(true);

        handleSearchMessages(event.target.value);
    };

    const handleSearchMessages = (searchTerm) => {
        const chatRoomMessages = [...messages];
        const regex = new RegExp(searchTerm, 'gi');
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message);
            }
            return acc;
        }, []);
        setSearchResults(searchResults);
        setSearchLoading(false);
    };

    const addMessagesListner = (chatRoomId) => {
        let messagesArray = [];
        setMessages([]);

        onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) => {
            messagesArray.push(DataSnapshot.val());
            const newMessageArray = [...messagesArray];

            setMessages(newMessageArray);
            setMessagesLoading(false);
            userPostsCount(newMessageArray);
        });
    };

    const userPostsCount = (messages) => {
        const userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    image: message.user.image,
                    count: 1,
                };
            }
            return acc;
        }, {});
        dispatch(setUserPosts(userPosts));
    };

    const renderMessages = (messages) => {
        return (
            messages.length > 0 &&
            messages.map((message) => (
                <Message
                    key={message.timestamp}
                    message={message}
                    user={currentUser}
                />
            ))
        );
    };

    const renderTypingUsers = (typingUsers) =>
        typingUsers.length > 0 &&
        typingUsers.map((user) => (
            <span key={user.name.userUid}>
                {user.name.userUid}님이 채팅을 입력하고 있습니다 ...
            </span>
        ));

    const renderMessageSkeleton = (loading) =>
        loading && (
            <>
                {[...Array(13)].map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </>
        );

    return (
        <div style={{ padding: '2rem 2rem 0 2rem' }}>
            <MessageHeader handleSearchChange={handleSearchChange} />
            <div
                style={{
                    width: '100%',
                    height: 450,
                    border: '0.2rem solid #ececec',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto',
                }}
            >
                {renderMessageSkeleton(messagesLoading)}
                {searchLoading && <div>loading ...</div>}

                {searchTerm
                    ? renderMessages(searchResults)
                    : renderMessages(messages)}

                {renderTypingUsers(typingUsers)}
                <div ref={messageEndRef} />
            </div>
            <MessageForm />
        </div>
    );
};

export default MainPanel;
