"use client";

import PageContainer from "#/components/base/pageContainer/PageContainer";
import styles from "./api-explorer.module.scss";

export default function ApiExplorerPage() {
  return (
    <PageContainer pageTitle="Api Explorer">
      <iframe
        src="/api-explorer/index.html"
        width="100%"
        height="100%"
        className={styles.apiExplorerIframe}
      ></iframe>
    </PageContainer>
  );
}
