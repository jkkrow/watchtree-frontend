import Button from 'components/Common/Element/Button/Button';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Modal from 'components/Common/UI/Modal/Modal';
import { useAppDispatch, useAuthSelector } from 'hooks/store-hook';
import { sendVerifyEmail, clearResponse } from 'store/actions/auth';
import './AccountProfile.scss';

const AccountProfile: React.FC = () => {
  const { userData, loading, error, message } = useAuthSelector();
  const dispatch = useAppDispatch();

  const verifyEmailHandler = () => {
    dispatch(sendVerifyEmail(userData!.email));
  };

  const closeModalHandler = () => {
    dispatch(clearResponse());
  };

  return (
    <>
      <Modal
        on={!!error || !!message}
        header={error ? 'Error' : 'Email has sent'}
        content={error || message || ''}
        onClose={closeModalHandler}
      />
      <div className="account-profile">
        <div className="account-profile__picture">
          <Avatar width="5rem" height="5rem" />
        </div>
        <div className="account-profile__info">
          <div data-label="Name">{userData!.name}</div>
          <div data-label="Email">{userData!.email}</div>
          <span className="link">Edit</span>
        </div>
        <div className="account-profile__buttons">
          {!userData!.isVerified && (
            <Button loading={loading} onClick={verifyEmailHandler}>
              Verify Email
            </Button>
          )}
          {userData!.isVerified && !userData!.isPremium && (
            <Button>Upgrade to Premium</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountProfile;
