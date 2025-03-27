import { DataSnapshot, onChildAdded, ref } from 'firebase/database';
import { FaRegSmile } from 'react-icons/fa';
import { db } from '../../../../firebase';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    setCurrentChatRoom,
    setPrivateChatRoom,
} from '../../../store/chatRoomSlice';

const DirectMessages = () => {
    const usersRef = ref(db, 'users');
    const [users, setUsers] = useState([]);
    const [activeChatRoom, setActiveChatRoom] = useState('');

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser?.uid) addUsersListner(currentUser.uid);
        return () => {};
    }, [currentUser?.uid]);

    const addUsersListner = (currentUserId) => {
        let usersArray = [];

        onChildAdded(usersRef, (DataSnapshot) => {
            if (currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user['uid'] = DataSnapshot.key;
                usersArray.push(user);

                const newUsersArray = [...usersArray];
                setUsers(newUsersArray);
            }
        });
    };

    const getChatRoomId = (userId) => {
        const currentUserId = currentUser.uid;

        return userId > currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`;
    };

    const changeChatRoom = (user) => {
        const chatRoomId = getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name,
        };

        dispatch(setCurrentChatRoom(chatRoomData));
        dispatch(setPrivateChatRoom(true));
        setActiveChatRoom(user.uid);
    };

    const renderDirectMessages = (users) =>
        users.length > 0 &&
        users.map((user) => (
            <li
                key={user.uid}
                style={{
                    backgroundColor:
                        user.uid === activeChatRoom ? '#ffffff45' : '',
                }}
                onClick={() => changeChatRoom(user)}
            >
                # {user.name}
            </li>
        ));

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegSmile style={{ marginRight: 3 }} />
                DIRECT MESSAGES
            </span>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {renderDirectMessages(users)}
            </ul>
        </div>
    );
};

export default DirectMessages;
