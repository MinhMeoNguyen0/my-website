import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { withStyles } from '@mui/styles';

const CustomTabs = withStyles({
  root: {
    borderRadius: '30px',
    backgroundColor: '#222', // Dark background color
    padding: '4px 8px', // Padding around the tabs
  },
  indicator: {
    display: 'none',
  },
})(Tabs);

const CustomTab = withStyles({
  root: {
    textTransform: 'none',
    minWidth: 72,
    margin: '0 8px',
    color: '#fff', // Inactive tab color
    fontSize: '16px',
    '&:hover': {
      color: '#00d1b2', // Hover color
      opacity: 1,
    },
    '&$selected': {
      color: '#00d1b2', // Active tab color
      fontWeight: 'bold',
    },
    '&:focus': {
      color: '#00d1b2',
    },
  },
  selected: {},
})((props) => <Tab disableRipple {...props} />);

const NavTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <CustomTabs value={value} onChange={handleChange}>
      <CustomTab label="About" />
      <CustomTab label="Projects" />
      <CustomTab label="Apps" />
    </CustomTabs>
  );
};

export default NavTabs;
