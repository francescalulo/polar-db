import shareOutline from '../../assets/icons/share-icon-outline.svg';
import './ShareButton.scss';

function ShareButton({ movie, className }) {
  const handleClick = async () => {
    const shareData = {
      title: movie.title,
      text: 'Check out ' + movie.title + ' on Polar DB!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user closed the share sheet without choosing anything — nothing to do
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button
      className={'shareButton ' + (className || '')}
      type="button"
      aria-label="Share"
      onClick={handleClick}
    >
      <img src={shareOutline} alt="" />
    </button>
  );
}

export default ShareButton;
