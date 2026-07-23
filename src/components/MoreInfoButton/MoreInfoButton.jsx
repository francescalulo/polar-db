import './MoreInfoButton.scss';

function MoreInfoButton({ className, onClick }) {
  return (
    <button className={`moreInfoButton ${className || ''}`} type="button" onClick={onClick}>
      More Info
    </button>
  );
}

export default MoreInfoButton;