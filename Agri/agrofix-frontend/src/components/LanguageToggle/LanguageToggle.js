import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MenuItem, Select, FormControl } from '@mui/material';
import './LanguageToggle.css';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' }
];

function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <FormControl size="small" variant="outlined" sx={{ minWidth: 100, background: '#fff', borderRadius: 2, ml: 1 }}>
      <Select
        value={lang}
        onChange={e => setLang(e.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Select language' }}
        sx={{ fontWeight: 700, fontSize: 14 }}
      >
        {languages.map(l => (
          <MenuItem key={l.code} value={l.code}>
            {l.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageToggle;
