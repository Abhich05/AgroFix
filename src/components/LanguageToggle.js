import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import TranslateIcon from '@mui/icons-material/Translate';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' }
];

function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <FormControl size="small" variant="outlined" sx={{ ml: 2, minWidth: 120 }}>
      <InputLabel id="lang-select-label">
        <TranslateIcon style={{ verticalAlign: 'middle', marginRight: 4 }} />
        {t('language') || 'Language'}
      </InputLabel>
      <Select
        labelId="lang-select-label"
        value={lang}
        label={t('language') || 'Language'}
        onChange={e => setLang(e.target.value)}
        sx={{ background: '#fff' }}
      >
        {languages.map(l => (
          <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageToggle;
