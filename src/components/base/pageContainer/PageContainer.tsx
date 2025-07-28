import React from 'react';
import classNames from 'classnames';
import OllamaFlowFlex from '../flex/Flex';
import OllamaFlowText from '../typograpghy/Text';
import styles from './pageContainer.module.scss';
import { Content } from 'antd/es/layout/layout';
import { useAppDispatch } from '@/lib/store/hooks';

const PageContainer = ({
  children,
  className,
  withoutWhiteBG = false,
  id,
  pageTitle,
  pageTitleRightContent,
}: {
  children: React.ReactNode;
  className?: string;
  withoutWhiteBG?: boolean;
  id?: string;
  pageTitle?: JSX.Element | string;
  pageTitleRightContent?: JSX.Element;
  showGraphSelector?: boolean;
}) => {
  const dispatch = useAppDispatch();

  return (
    <Content className={classNames(className, !withoutWhiteBG && styles.pageContainer)} id={id}>
      {(pageTitle || pageTitleRightContent) && (
        <>
          <OllamaFlowFlex className={styles.pageTitleContainer} wrap gap="small" align="center" justify="space-between">
            <OllamaFlowText fontSize={16} weight={600} data-testid="heading">
              {pageTitle}
            </OllamaFlowText>
            {pageTitleRightContent}
          </OllamaFlowFlex>
        </>
      )}
      <div className={styles.pageContent}>{children}</div>
    </Content>
  );
};

export default PageContainer;
