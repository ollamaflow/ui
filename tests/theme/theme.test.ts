import '@testing-library/jest-dom';
import { LightGraphTheme, primaryTheme, darkTheme } from '#/theme/theme';

describe('Theme', () => {
  describe('LightGraphTheme', () => {
    test('should have all required color properties', () => {
      expect(LightGraphTheme.primary).toBe('#0d8064');
      expect(LightGraphTheme.primaryLight).toBe('#10a37f');
      expect(LightGraphTheme.primaryExtraLight).toBe('#13d4a4');
      expect(LightGraphTheme.primaryRed).toBe('#B2B0E8');
      expect(LightGraphTheme.secondaryBlue).toBe('#b1e5ff');
      expect(LightGraphTheme.secondaryYellow).toBe('#ffe362');
      expect(LightGraphTheme.borderGray).toBe('#C1C1C1');
      expect(LightGraphTheme.borderGrayDark).toBe('#666666');
      expect(LightGraphTheme.white).toBe('#ffffff');
      expect(LightGraphTheme.fontFamily).toBe('"Inter", "serif"');
      expect(LightGraphTheme.colorBgContainerDisabled).toBe('#E9E9E9');
      expect(LightGraphTheme.colorBgContainerDisabledDark).toBe('#555555');
      expect(LightGraphTheme.textDisabled).toBe('#bbbbbb');
      expect(LightGraphTheme.subHeadingColor).toBe('#666666');
    });
  });

  describe('primaryTheme', () => {
    test('should have correct structure', () => {
      expect(primaryTheme.cssVar).toBe(true);
      expect(primaryTheme.algorithm).toBeDefined();
      expect(primaryTheme.token).toBeDefined();
      expect(primaryTheme.components).toBeDefined();
    });

    test('should have correct token values', () => {
      expect(primaryTheme.token.colorBgElevated).toBe('#f5f5f5');
      expect(primaryTheme.token.colorBgBase).toBe('#ffffff');
      expect(primaryTheme.token.colorPrimary).toBe(LightGraphTheme.primary);
      expect(primaryTheme.token.fontFamily).toBe(LightGraphTheme.fontFamily);
      expect(primaryTheme.token.colorBorder).toBe(LightGraphTheme.borderGray);
      expect(primaryTheme.token.colorTextDisabled).toBe(LightGraphTheme.textDisabled);
      expect(primaryTheme.token.colorBgContainerDisabled).toBe(LightGraphTheme.colorBgContainerDisabled);
    });

    test('should have correct component configurations', () => {
      expect(primaryTheme.components.Tabs).toBeDefined();
      expect(primaryTheme.components.Typography).toBeDefined();
      expect(primaryTheme.components.Layout).toBeDefined();
      expect(primaryTheme.components.Menu).toBeDefined();
      expect(primaryTheme.components.Button).toBeDefined();
      expect(primaryTheme.components.Table).toBeDefined();
      expect(primaryTheme.components.Collapse).toBeDefined();
      expect(primaryTheme.components.Input).toBeDefined();
      expect(primaryTheme.components.Select).toBeDefined();
      expect(primaryTheme.components.Pagination).toBeDefined();
      expect(primaryTheme.components.Form).toBeDefined();
    });

    test('should have correct Tabs configuration', () => {
      expect(primaryTheme.components.Tabs.cardBg).toBe('#F2F2F2');
      expect(primaryTheme.components.Tabs.titleFontSize).toBe(12);
    });

    test('should have correct Button configuration', () => {
      expect(primaryTheme.components.Button.borderRadius).toBe(4);
      expect(primaryTheme.components.Button.primaryColor).toBe(LightGraphTheme.white);
      expect(primaryTheme.components.Button.defaultColor).toBe('#333333');
      expect(primaryTheme.components.Button.colorLink).toBe(LightGraphTheme.primary);
      expect(primaryTheme.components.Button.colorLinkHover).toBe(LightGraphTheme.primary);
    });
  });

  describe('darkTheme', () => {
    test('should have correct structure', () => {
      expect(darkTheme.cssVar).toBe(true);
      expect(darkTheme.algorithm).toBeDefined();
      expect(darkTheme.token).toBeDefined();
      expect(darkTheme.components).toBeDefined();
    });

    test('should have correct token values', () => {
      expect(darkTheme.token.colorBgElevated).toBe('#353535');
      expect(darkTheme.token.colorBgBase).toBe('#222222');
      expect(darkTheme.token.colorPrimary).toBe(LightGraphTheme.primaryLight);
      expect(darkTheme.token.fontFamily).toBe(LightGraphTheme.fontFamily);
      expect(darkTheme.token.colorBorder).toBe(LightGraphTheme.borderGrayDark);
      expect(darkTheme.token.colorTextDisabled).toBe(LightGraphTheme.textDisabled);
      expect(darkTheme.token.colorBgContainerDisabled).toBe(LightGraphTheme.colorBgContainerDisabledDark);
    });

    test('should have correct component configurations', () => {
      expect(darkTheme.components.Tabs).toBeDefined();
      expect(darkTheme.components.Typography).toBeDefined();
      expect(darkTheme.components.Layout).toBeDefined();
      expect(darkTheme.components.Menu).toBeDefined();
      expect(darkTheme.components.Button).toBeDefined();
      expect(darkTheme.components.Table).toBeDefined();
      expect(darkTheme.components.Collapse).toBeDefined();
      expect(darkTheme.components.Input).toBeDefined();
      expect(darkTheme.components.Select).toBeDefined();
      expect(darkTheme.components.Pagination).toBeDefined();
      expect(darkTheme.components.Form).toBeDefined();
    });

    test('should have correct Menu configuration', () => {
      expect(darkTheme.components.Menu.itemSelectedBg).toBe('#222222');
      expect(darkTheme.components.Menu.itemSelectedColor).toBe(LightGraphTheme.primaryExtraLight);
    });

    test('should have correct Button configuration', () => {
      expect(darkTheme.components.Button.borderRadius).toBe(4);
      expect(darkTheme.components.Button.primaryColor).toBe(LightGraphTheme.white);
      expect(darkTheme.components.Button.defaultColor).toBe('var(--ant-color-text-base)');
      expect(darkTheme.components.Button.colorLink).toBe(LightGraphTheme.primaryLight);
      expect(darkTheme.components.Button.colorLinkHover).toBe(LightGraphTheme.primaryLight);
    });
  });
});
