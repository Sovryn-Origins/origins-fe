import React, { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import OriginsLogo from 'assets/images/sovryn-origin-logo-dark.png';
import styles from './index.module.scss';

interface IImportantInformationStepProps {
  tierId: number;
  onSubmit?: () => void;
}

export const ImportantInformationStep: React.FC<IImportantInformationStepProps> = ({
  tierId,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const onCheckboxClick = useCallback(
    () => setChecked(prevValue => !prevValue),
    [setChecked],
  );

  const baseTranslations =
    tierId > 2
      ? translations.originsLaunchpad.saleDay.importantInformationStep
          .publicSale
      : translations.originsLaunchpad.saleDay.importantInformationStep
          .privateSale;

  return (
    <>
      <div className={styles.dialogWrapper}>
        <div className="tw-flex tw-items-center">
          <img src={OriginsLogo} alt="Sovryn Origins" />
          <span className="tw-ml-5 tw-text-lg tw-font-consolas tw-uppercase">
            Sovryn Origins
          </span>
        </div>
        <div className={styles.dialogTitle}>{t(baseTranslations.title)}</div>

        <div className="tw-text-left">
          <div className={styles.listItem}>
            {t(baseTranslations.information[1])}
          </div>
          <div className={styles.listItem}>
            {t(baseTranslations.information[2])}
          </div>
          <div className={styles.listItem}>
            <Trans
              i18nKey={baseTranslations.information[3]}
              components={[
                <a
                  className="tw-text-primary tw-font-rowdies"
                  href="http://discord.com/invite/J22WS6z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  x
                </a>,
              ]}
              tOptions={{ FAQ: 'FAQ' }}
            />
          </div>
          <div className={styles.listItem}>
            <Trans
              i18nKey={baseTranslations.information[4]}
              components={[
                <a
                  className="tw-text-primary tw-font-rowdies"
                  href="http://discord.com/invite/J22WS6z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  x
                </a>,
              ]}
              tOptions={{ WIKI: 'WIKI' }}
            />
          </div>
        </div>

        <div className="tw-mt-12 tw-flex tw-flex-col">
          <Checkbox
            checked={checked}
            onChange={onCheckboxClick}
            label={t(baseTranslations.checkboxText)}
            className="tw-text-left tw-uppercase tw-font-rowdies"
          />

          <ActionButton
            text={t(baseTranslations.submitButtonText)}
            onClick={onSubmit}
            className="tw-block tw-h-10 tw-px-10 tw-mt-6 tw-mx-auto tw-rounded-lg tw-bg-primary tw-max-w-xs"
            textClassName="tw-text-sm tw-text-black tw-uppercase tw-font-rowdies tw-tracking-normal tw-font-normal tw-leading-snug"
            disabled={!checked}
          />
        </div>
      </div>
    </>
  );
};
