import { useState, useRef, useEffect } from 'react';
import shareOutline from '../../assets/icons/share-icon-outline.svg';
import './ShareButton.scss';

function ShareButton({ movie, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const shareUrl = window.location.href;
  const shareText = 'Check out ' + movie.title + ' on Polar DB!';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl,
      external: true,
    },
    {
      label: 'X',
      href:
        'https://twitter.com/intent/tweet?url=' +
        encodedUrl +
        '&text=' +
        encodedText,
      external: true,
    },
    {
      label: 'Email',
      href:
        'mailto:?subject=' +
        encodeURIComponent(movie.title) +
        '&body=' +
        encodedText +
        '%20' +
        encodedUrl,
      external: false,
    },
    {
      label: 'Message',
      href: 'sms:?&body=' + encodedText + '%20' + encodedUrl,
      external: false,
    },
  ];

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
    setIsOpen(false);
  };

  return (
    <div
      className={'shareButton__wrapper ' + (className || '')}
      ref={wrapperRef}
    >
      <button
        className="shareButton"
        type="button"
        aria-label="Share"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img src={shareOutline} alt="" />
      </button>

      {isOpen && (
        <ul className="shareButton__menu">
          {shareLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={handleCopyLink}>
              Copy Link
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ShareButton;
