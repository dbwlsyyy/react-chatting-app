import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';
import UserPanel from './UserPanel';
import Favorite from './Favorite';

const SidePanel = () => {
    return (
        <div
            style={{
                backgroundColor: '#7B83EB',
                padding: '2rem',
                minHeight: '100vh',
                color: 'white',
                minWidth: '275px',
                height: '100%',
            }}
        >
            <UserPanel />
            <Favorite />
            <ChatRooms />
            <DirectMessages />
        </div>
    );
};

export default SidePanel;
