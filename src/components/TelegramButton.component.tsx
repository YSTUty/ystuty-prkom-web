import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button, { ButtonTypeMap } from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TelegramIcon from '@mui/icons-material/Telegram';

import { telegramBotUsername } from '../utils/env.utils';

const TelegramButton: React.FC<{ uid?: string; showText?: boolean } & ButtonTypeMap<{}, 'button'>['props']> = (
  props,
) => {
  const { uid, showText, ...restProps } = props;
  const { formatMessage } = useIntl();
  const [isFirst, setFirst] = React.useState(true);
  const regexPattern = /[0-9]{3}\-[0-9]{3}-[0-9]{3} [0-9]{2}/;

  if (!uid || !regexPattern.test(uid)) {
    return null;
  }

  const getLink = (uid: string, v = false) =>
    (v ? `tg://resolve?domain=${telegramBotUsername}&start=` : `https://t.me/${telegramBotUsername}?start=`) +
    encodeURIComponent(`uid--${uid.replace(/\s/, '_')}`);

  const handleButtonClick = () => {
    window.open(getLink(uid, isFirst), '_blank');
    setFirst(false);
  };

  if (showText) {
    return (
      <Button
        onClick={handleButtonClick}
        title={formatMessage({ id: 'component.telegramButton.title' })}
        endIcon={<TelegramIcon />}
        color={isFirst ? 'primary' : 'warning'}
        {...restProps}
      >
        <FormattedMessage id="component.telegramButton.text" />
      </Button>
    );
  }

  return (
    <IconButton
      size="small"
      onClick={handleButtonClick}
      title={formatMessage({ id: 'component.telegramButton.title' })}
      {...restProps}
    >
      <TelegramIcon />
    </IconButton>
  );
};

export default TelegramButton;
