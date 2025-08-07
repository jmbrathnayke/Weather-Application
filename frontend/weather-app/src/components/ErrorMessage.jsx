import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <FaExclamationTriangle className="error-icon" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
