import React, { useCallback, useState } from 'react';
import { DialogTitle, DialogWrapper, ListItem } from './styled';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Checkbox } from '@blueprintjs/core';
import { ActionButton } from 'app/components/Form/ActionButton';
import OriginsLogo from 'assets/images/sovryn-origin-logo-dark.png';

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
      <DialogWrapper>
        <div className="tw-flex tw-items-center">
          <img src={OriginsLogo} alt="Sovryn Origins" />
          <span className="tw-ml-5 tw-text-lg tw-font-consolas tw-uppercase">
            Sovryn Origins
          </span>
        </div>
        <DialogTitle className="tw-font-rowdies tw-uppercase tw-my-11">
          {t(baseTranslations.title)}
        </DialogTitle>

        <div className="tw-text-left">
          <ListItem>{t(baseTranslations.information[1])}</ListItem>
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
            className="tw-block tw-h-10 tw-px-10 tw-mt-24 tw-mx-auto tw-rounded-lg tw-bg-primary tw-max-w-xs"
            textClassName="tw-text-sm tw-text-black tw-uppercase tw-font-rowdies tw-tracking-normal tw-font-normal tw-leading-snug"
            disabled={!checked}
          />
        </div>
      </DialogWrapper>
    </>
  );
};
