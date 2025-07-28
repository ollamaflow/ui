import { theme, ThemeConfig } from 'antd';

export const OllamaFlowTheme = {
  primary: '#558f42', //95DB7B
  primaryLight: '#86d96a',
  primaryRed: '#d9383a',
  secondaryBlue: '#b1e5ff',
  secondaryYellow: '#ffe362',
  borderGray: '#C1C1C1',
  borderGrayDark: '#666666',
  white: '#ffffff',
  fontFamily: '"Inter", "serif"',
  colorBgContainerDisabled: '#E9E9E9',
  colorBgContainerDisabledDark: '#555555',
  textDisabled: '#bbbbbb',
  subHeadingColor: '#666666',
};

export const primaryTheme: ThemeConfig = {
  cssVar: true,
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: OllamaFlowTheme.primary,
    fontFamily: OllamaFlowTheme.fontFamily,
    colorBorder: OllamaFlowTheme.borderGray,
    colorTextDisabled: OllamaFlowTheme.textDisabled,
    colorBgContainerDisabled: OllamaFlowTheme.colorBgContainerDisabled,
  },
  components: {
    Tabs: {
      cardBg: '#F2F2F2',
      titleFontSize: 12,
    },
    Typography: {
      fontWeightStrong: 400,
    },
    Layout: {
      fontFamily: OllamaFlowTheme.fontFamily,
    },
    Menu: {
      itemSelectedBg: '#fff',
    },
    Button: {
      borderRadius: 4,
      primaryColor: OllamaFlowTheme.white,
      defaultColor: '#333333',
      colorLink: OllamaFlowTheme.primary,
      colorLinkHover: OllamaFlowTheme.primary,
    },
    Table: {
      headerBg: '#ffffff',
      padding: 18,
      borderColor: '#d1d5db',
    },
    Collapse: {
      headerBg: OllamaFlowTheme.white,
    },
    Input: {
      borderRadiusLG: 3,
      borderRadius: 3,
      borderRadiusXS: 3,
    },
    Select: {
      borderRadiusLG: 3,
      borderRadius: 3,
      borderRadiusXS: 3,
      optionSelectedColor: OllamaFlowTheme.white,
      optionSelectedBg: OllamaFlowTheme.primary,
    },
    Pagination: {
      fontFamily: OllamaFlowTheme.fontFamily,
    },
    Form: {
      labelColor: OllamaFlowTheme.subHeadingColor,
      colorBorder: 'none',
      verticalLabelPadding: 0,
      itemMarginBottom: 10,
    },
  },
};

export const darkTheme: ThemeConfig = {
  cssVar: true,
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgBase: '#222222',
    colorPrimary: OllamaFlowTheme.primaryLight,
    fontFamily: OllamaFlowTheme.fontFamily,
    colorBorder: OllamaFlowTheme.borderGrayDark,
    colorTextDisabled: OllamaFlowTheme.textDisabled,
    colorBgContainerDisabled: OllamaFlowTheme.colorBgContainerDisabledDark,
  },
  components: {
    Tabs: {
      cardBg: '#F2F2F2',
      titleFontSize: 12,
    },
    Typography: {
      fontWeightStrong: 400,
    },
    Layout: {
      fontFamily: OllamaFlowTheme.fontFamily,
    },
    Menu: {
      itemSelectedBg: '#222222',
      itemSelectedColor: 'var(--ant-color-primary)',
    },
    Button: {
      borderRadius: 4,
      primaryColor: OllamaFlowTheme.white,
      defaultColor: 'var(--ant-color-text-base)',
      colorLink: OllamaFlowTheme.primaryLight,
      colorLinkHover: OllamaFlowTheme.primaryLight,
    },
    Table: {
      headerBg: 'var(--ant-color-bg-container)',
      padding: 18,
      borderColor: 'var(--ant-color-border)',
    },
    Collapse: {
      headerBg: OllamaFlowTheme.white,
    },
    Input: {
      borderRadiusLG: 3,
      borderRadius: 3,
      borderRadiusXS: 3,
    },
    Select: {
      borderRadiusLG: 3,
      borderRadius: 3,
      borderRadiusXS: 3,
      optionSelectedColor: OllamaFlowTheme.white,
      optionSelectedBg: OllamaFlowTheme.primary,
    },
    Pagination: {
      fontFamily: OllamaFlowTheme.fontFamily,
    },
    Form: {
      labelColor: 'var(--ant-color-text-base)',
      colorBorder: 'none',
      verticalLabelPadding: 0,
      itemMarginBottom: 10,
    },
  },
};
