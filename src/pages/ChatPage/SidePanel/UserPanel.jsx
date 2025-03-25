import { getAuth, signOut } from 'firebase/auth';
import { Dropdown, Image } from 'react-bootstrap';
import { IoIosChatboxes } from 'react-icons/io';
import { useSelector } from 'react-redux';
import app from '../../../../firebase';

const UserPanel = () => {
    const { currentUser } = useSelector((state) => state.user);
    const auth = getAuth(app);
    const handleLogout = () => {
        signOut(auth)
            .then(() => {})
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <h3 style={{ color: 'white' }}>
                <IoIosChatboxes /> Chat App
            </h3>

            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <Image
                    src={currentUser.photoURL}
                    roundedCircle
                    style={{ whith: 30, height: 30, marginTop: 3 }}
                />

                <Dropdown>
                    <Dropdown.Toggle
                        style={{ backgroundColor: 'transparent', border: 0 }}
                    >
                        {currentUser.displayName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>프로필 사진 변경</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default UserPanel;
