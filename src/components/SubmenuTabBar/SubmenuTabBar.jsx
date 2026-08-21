import { useEffect, useRef, useState } from 'react';
import popularOutline from '../../assets/icons/popular-icon-outline.svg';
import popularFilled from '../../assets/icons/popular-icon-filled.svg';
import upcomingOutline from '../../assets/icons/upcoming-icon-outline.svg';
import upcomingFilled from '../../assets/icons/upcoming-icon-filled.svg';
import nowPlayingOutline from '../../assets/icons/nowPlaying-icon-outline.svg';
import nowPlayingFilled from '../../assets/icons/nowPlaying-icon-filled.svg';
import topRatedOutline from '../../assets/icons/topRated-icon-outline.svg';
import topRatedFilled from '../../assets/icons/topRated-icon-filled.svg';
import './SubmenuTabBar.scss';

const TABS = [
  {
    key: 'popular',
    label: 'Popular',
    outline: popularOutline,
    filled: popularFilled,
  },
  {
    key: 'upcoming',
    label: 'Upcoming',
    outline: upcomingOutline,
    filled: upcomingFilled,
  },
  {
    key: 'nowPlaying',
    label: 'Now Playing',
    outline: nowPlayingOutline,
    filled: nowPlayingFilled,
  },
  {
    key: 'topRated',
    label: 'Top Rated',
    outline: topRatedOutline,
    filled: topRatedFilled,
  },
];

function SubmenuTabBar({
  isVisible = false,
  activeTab,
  onTabChange,
  onVisibilityChange,
}) {
  const [isFooterReached, setIsFooterReached] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const stuckSentinelRef = useRef(null);

  // Detects when the bar has reached its sticky position under the header,
  // so we only show the desktop background once it's actually stuck there
  useEffect(() => {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: '-' + headerHeight + 'px 0px 0px 0px', threshold: 0 },
    );

    if (stuckSentinelRef.current) {
      observer.observe(stuckSentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Hide the bar again once the very end of the footer scrolls into view
  useEffect(() => {
    // Footer lives in AppRouter, not inside Home/SubmenuTabBar's own tree,
    // so we can't reach it with a normal ref, query the DOM for it instead.
    const footerEnd = document.querySelector('.footer__copyright');
    if (!footerEnd) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterReached(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(footerEnd);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Only show the bar once the grid is reached (isVisible, from Home) AND
  // before the footer's end has scrolled into view (isFooterReached, above)
  const showBar = isVisible && !isFooterReached;

  // Report the actual visible/hidden state up to Home, so other elements
  // (like ScrollButton) can react to the same state instead of duplicating
  // this footer-detection logic themselves.
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(showBar);
    }
  }, [showBar, onVisibilityChange]);

  return (
    <>
      <div ref={stuckSentinelRef} />
      <div
        className={
          'submenuTabBar__wrapper ' +
          (showBar ? 'submenuTabBar__wrapper--visible ' : '') +
          (isStuck ? 'submenuTabBar__wrapper--stuck' : '')
        }
      >
        <div className="submenuTabBar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const tabClass = isActive
              ? 'submenuTabBar__tab submenuTabBar__tab--active'
              : 'submenuTabBar__tab';

            return (
              <button
                key={tab.key}
                type="button"
                className={tabClass}
                onClick={() => onTabChange(tab.key)}
                aria-label={tab.label}
              >
                <img
                  src={isActive ? tab.filled : tab.outline}
                  alt=""
                  className="submenuTabBar__icon"
                />
                <span className="submenuTabBar__label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SubmenuTabBar;
