import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import dayjs from 'dayjs';
import { Icon } from '@blueprintjs/core';
import { Text } from '@blueprintjs/core/lib/esm/components/text/text';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { ItemRenderer } from '@blueprintjs/select/lib/esm/common/itemRenderer';
import { ItemPredicate } from '@blueprintjs/select/lib/esm/common/predicate';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from '../../../locales/i18n';

interface DateItem {
  key: number;
  label: string;
  date: Date;
}
interface Props {
  className?: string;
  title: string;
  kickoffTs: number;
  onClick: (value: number) => void;
  value?: number;
  startTs?: number;
  stakes?: string[];
  prevExtend?: number;
  autoselect?: boolean;
  delegate?: boolean;
}

// const MAX_PERIODS = 78;
const MAX_PERIODS_YEAR = 2;
const ms = 1e3;

export function StakingDateSelector(props: Props) {
  const { t } = useTranslation();
  const [dates, setDates] = useState<Date[]>([]);
  const currentDate = useMemo(() => {
    return new Date();
  }, []);

  const currentUserOffset = currentDate.getTimezoneOffset() / 60;
  const onItemSelect = (item: { key: number }) =>
    props.onClick(
      Number(dayjs(item.key).subtract(currentUserOffset, 'hour')) / ms,
    );
  const [currentYearDates, setCurrenYearDates] = useState<DateItem[]>([]);
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availableYears, availableMonth] = useMemo(() => {
    const availableYears = filteredDates
      .map(yearDate => dayjs(yearDate.date).format('YYYY'))
      .filter((year, index, arr) => arr.indexOf(year) === index);

    const availableMonth = currentYearDates
      .map(yearDate => dayjs(yearDate.date).format('MMM'))
      .filter((month, index, arr) => arr.indexOf(month) === index);
    return [availableYears, availableMonth];
  }, [currentYearDates, filteredDates]);

  const getDatesByYear = useCallback(
    year => {
      let theBigDay = new Date();
      theBigDay.setFullYear(year);
      return setCurrenYearDates(
        filteredDates.filter(
          item => new Date(item.date).getFullYear() === theBigDay.getFullYear(),
        ),
      );
    },
    [filteredDates],
  );

  useEffect(() => {
    setFilteredDates(
      dates.map(item => ({
        key: item.getTime(),
        label: item.toLocaleDateString(),
        date: item,
      })),
    );

    if (props.stakes) {
      const mappedStakes = props.stakes.map(item => ({
        key: Number(item) * ms,
        label: dayjs(new Date(Number(item) * ms)).format('L'),
        date: new Date(Number(item) * ms),
      }));
      props.delegate && setFilteredDates(mappedStakes);
    }
  }, [dates, props.startTs, props.stakes, props.delegate]);

  useEffect(() => {
    if (props.kickoffTs) {
      const contractDate = dayjs(props.kickoffTs * ms).toDate();
      const contractOffset = contractDate.getTimezoneOffset() / 60;
      const currentUserOffset = currentDate.getTimezoneOffset() / 60;

      let contractDateDeployed = dayjs(props.kickoffTs * ms).add(
        contractOffset,
        'hour',
      ); // get contract date in UTC-0

      const dates: Date[] = [];
      const datesFutured: Date[] = [];

      const startDateUTC = dayjs(
        new Date(currentDate.getUTCFullYear(), 0, 1),
      ).add(currentUserOffset, 'hour');
      const endDateUTC = dayjs(
        new Date(currentDate.getUTCFullYear() + MAX_PERIODS_YEAR, 11, 31),
      )
        .add(currentUserOffset, 'hour')
        .subtract(2, 'week');

      // getting the first BIG date in this year.
      for (let i = 1; contractDateDeployed.unix() > startDateUTC.unix(); i++) {
        const intervalDate = contractDateDeployed.subtract(2, 'week');
        contractDateDeployed = intervalDate;
      }

      for (let i = 1; contractDateDeployed.unix() < endDateUTC.unix(); i++) {
        const date = contractDateDeployed.add(2, 'week');
        contractDateDeployed = date;
        if (!props.prevExtend) dates.push(date.toDate());
        if (
          props.prevExtend &&
          dayjs(props.prevExtend * ms)
            .add(contractOffset, 'hour')
            .toDate()
            .getTime() /
            ms <
            date.unix()
        ) {
          datesFutured.push(date.toDate());
        }
      }
      if (datesFutured.length) {
        setDates(datesFutured);
      } else {
        setDates(dates);
      }
    }
  }, [props.kickoffTs, props.value, props.prevExtend, currentDate]);

  const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon icon="chevron-right" iconSize={25} color="white" />
      </div>
    );
  };

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon icon="chevron-left" iconSize={25} color="white" />
      </div>
    );
  };

  const settingsSliderMonth = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 12,
    slidesToScroll: 12,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className={props.className}>
      {availableYears.length > 0 && (
        <label className="tw-block tw-mt-6 tw-text-sov-white tw-text-md tw-font-medium tw-uppercase tw-text-center tw-mb-6">
          {props.delegate
            ? t(translations.stake.dateSelector.selectDelegate)
            : t(translations.stake.dateSelector.selectYear)}
        </label>
      )}
      <div className="tw-flex tw-flex-row tw-justify-center">
        {availableYears.map((year, i) => {
          return (
            <div className="tw-mr-3" key={i}>
              <button
                type="button"
                onClick={() => {
                  getDatesByYear(year);
                  setSelectedYear(year);
                }}
                className={classNames(
                  'tw-leading-7 tw-font-normal tw-rounded-lg tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-opacity-30 tw-px-8 tw-py-3 tw-text-center tw-border-r tw-text-xl tw-tracking-tighter',
                  {
                    'tw-bg-gray-3 tw-text-primary': selectedYear !== year,
                    'tw-bg-primary tw-text-black': selectedYear === year,
                  },
                )}
              >
                {year}
              </button>
            </div>
          );
        })}
      </div>
      <div className="sliderMonth tw-mt-5 tw-pr-0">
        {selectedYear && (
          <p className="tw-font-rowdies tw-text-xl tw-font-light tw-text-center tw-uppercase tw-white tw-mt-12 tw-mb-6">
            {t(translations.stake.dateSelector.selectNewStakingDate)}:
          </p>
        )}
        <Slider {...settingsSliderMonth}>
          {availableMonth.map(monthName => (
            <StakingMonthDates
              currentDate={currentDate}
              monthName={monthName}
              dateItems={currentYearDates.filter(
                item => dayjs(item.date).format('MMM') === monthName,
              )}
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              onClick={item => {
                onItemSelect(item);
                setSelectedDay(dayjs(item.date).format('D'));
                setSelectedMonth(dayjs(item.date).format('MMM'));
              }}
            />
          ))}
        </Slider>
      </div>
      {availableYears.length <= 0 && (
        <p className="tw-block tw-mt-4 tw-text-warning tw-text-sm tw-font-medium tw-mb-2">
          {t(translations.stake.dateSelector.noneAvailable)}
        </p>
      )}
    </div>
  );
}

interface IStakingMonthDatesProps {
  monthName: string;
  dateItems: DateItem[];
  selectedDay: string;
  selectedMonth: string;
  currentDate: Date;
  onClick: (item: DateItem) => void;
}

const StakingMonthDates: React.FC<IStakingMonthDatesProps> = ({
  monthName,
  dateItems,
  selectedDay,
  selectedMonth,
  currentDate,
  onClick,
}) => {
  const currentUserOffset = currentDate.getTimezoneOffset() / 60;

  const isSelectedDay = useCallback(
    (item: DateItem) =>
      selectedDay === dayjs(item.date).format('D') &&
      selectedMonth === dayjs(item.date).format('MMM'),
    [selectedDay, selectedMonth],
  );

  const isSelectable = useCallback(
    item => item.date.getTime() >= currentDate.getTime(),
    [currentDate],
  );

  const handleOnClick = useCallback(
    item => {
      if (item.date.getTime() < currentDate.getTime()) return;
      onClick(item);
    },
    [currentDate, onClick],
  );

  return (
    <div>
      <div className="tw-mb-1 tw-font-light tw-text-sm tw-text-center tw-text-sov-white">
        <p className="tw-text-lg tw-font-rowdies tw-uppercase tw-mb-2">
          {monthName}
        </p>
        {dateItems.map(item => (
          <div
            key={item.key}
            onClick={() => handleOnClick(item)}
            className={classNames(
              'tw-w-12 tw-mr-1 tw-mb-1 tw-h-10 tw-leading-10 tw-rounded-lg tw-border tw-border-primary tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out tw-px-1 tw-py-0 tw-text-center tw-border-r tw-text-md tw-tracking-tighter',
              {
                'tw-bg-primary tw-text-black': isSelectedDay(item),
                'tw-text-primary': !isSelectedDay(item),
                'tw-opacity-50': !isSelectable(item),
                'hover:tw-bg-primary hover:tw-bg-opacity-30': isSelectable(
                  item,
                ),
              },
            )}
          >
            {dayjs(item.date).subtract(currentUserOffset, 'hour').format('D')}
          </div>
        ))}
        {dateItems.length < 3 && (
          <div
            className={classNames(
              'tw-w-12 tw-mr-1 tw-mb-1 tw-h-10 tw-leading-10 tw-rounded-lg tw-border tw-border-primary tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out tw-px-1 tw-py-0 tw-text-center tw-border-r tw-text-md tw-text-primary tw-opacity-50 tw-tracking-tighter',
            )}
          >
            -
          </div>
        )}
      </div>
    </div>
  );
};

export const renderItem: ItemRenderer<DateItem> = (
  item,
  { handleClick, modifiers, query },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.key}
      onClick={handleClick}
      text={<Text ellipsize>{highlightText(item.label, query)}</Text>}
    />
  );
};

export const filterItem: ItemPredicate<DateItem> = (
  query,
  item,
  _index,
  exactMatch,
) => {
  const normalizedTitle = item.label.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

export function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

export function escapeRegExpChars(text: string) {
  // eslint-disable-next-line no-useless-escape
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
