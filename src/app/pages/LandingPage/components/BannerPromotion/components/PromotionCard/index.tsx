import React from 'react';

import { AppSection, PromotionColor } from '../../types';
import { getBackgroundImageUrl, getSectionTitle } from './utils';
import styles from './index.module.scss';

interface IBannerPromotionProps {
  appSection?: AppSection;
  title: string;
  linkText: string;
  linkUrl: string;
  backgroundColor: PromotionColor;
}

export const PromotionCard: React.FC<IBannerPromotionProps> = ({
  appSection,
  title,
  linkText,
  linkUrl,
  backgroundColor,
}) => {
  const sectionTitle = getSectionTitle(appSection!);
  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: `url(${getBackgroundImageUrl(backgroundColor)})`,
      }}
    >
      <p className={styles.sectionTitle}>{appSection ? sectionTitle : ' '}</p>
      <p className={styles.title}>{title}</p>
      <div className={styles.link}>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      </div>
    </div>
  );
};
