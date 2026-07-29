import { useState } from 'react';
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

function SubmenuTabBar({ isVisible = false }) {
  const [activeTab, setActiveTab] = useState('popular');

  return (
    <div
      className={
        'submenuTabBar__wrapper ' +
        (isVisible ? 'submenuTabBar__wrapper--visible' : '')
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
              onClick={() => setActiveTab(tab.key)}
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
  );
}

export default SubmenuTabBar;
