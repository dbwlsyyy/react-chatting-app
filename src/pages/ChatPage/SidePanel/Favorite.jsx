import {
    child,
    DataSnapshot,
    off,
    onChildAdded,
    onChildRemoved,
    ref,
} from 'firebase/database';
import { FaRegSmileBeam } from 'react-icons/fa';
import { db } from '../../../../firebase';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    setCurrentChatRoom,
    setPrivateChatRoom,
} from '../../../store/chatRoomSlice';

const Favorite = () => {
    const [favoriteChatRooms, setFavoriteChatRooms] = useState([]);
    const [activeChatRoomId, setActiveChatRoomId] = useState('');

    const usersRef = ref(db, 'users');

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser?.uid) {
            addListner(currentUser.uid);
        }

        return () => {
            removeListner(currentUser.uid);
        };
    }, [currentUser?.uid]);

    const removeListner = (userId) => {
        off(child(usersRef, `${userId}/favorite`));
    };
    const addListner = (userId) => {
        let favoriteArray = [];

        onChildAdded(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
            favoriteArray.push({ id: DataSnapshot.key, ...DataSnapshot.val() });
            const newFavoriteChatRooms = [...favoriteArray];
            setFavoriteChatRooms(newFavoriteChatRooms);
        });

        onChildRemoved(
            child(usersRef, `${userId}/favorite`),
            (DataSnapshot) => {
                const filteredChatRooms = favoriteArray.filter((chatRoom) => {
                    return chatRoom.id !== DataSnapshot.key;
                });

                favoriteArray = filteredChatRooms;
                setFavoriteChatRooms(filteredChatRooms);
            }
        );
    };

    const changeChatRoom = (room) => {
        dispatch(setCurrentChatRoom(room));
        dispatch(setPrivateChatRoom(false));
        setActiveChatRoomId(room.id);
    };

    const renderFavoriteChatRooms = (favoriteChatRooms) =>
        favoriteChatRooms.length > 0 &&
        favoriteChatRooms.map((chatRoom) => (
            <li
                key={chatRoom.id}
                onClick={() => changeChatRoom(chatRoom)}
                style={{
                    backgroundColor:
                        chatRoom.id === activeChatRoomId ? '#ffffff45' : '',
                }}
            >
                # {chatRoom.name}
            </li>
        ));

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegSmileBeam style={{ marginRight: 3 }} />
                FAVORITE
            </span>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {renderFavoriteChatRooms(favoriteChatRooms)}
            </ul>
        </div>
    );
};

export default Favorite;
