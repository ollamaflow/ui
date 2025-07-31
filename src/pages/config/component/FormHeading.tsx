import OllamaFlowText from "#/components/base/typograpghy/Text";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import { CloudServerOutlined } from "@ant-design/icons";
import React from "react";

const FormHeading = ({
  title,
  description,
  icon,
  type = "default",
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  type?: "default" | "section" | "sub-section";
}) => {
  return (
    <div>
      <OllamaFlowFlex align="center" gap="small" className="mb-0">
        {icon || <CloudServerOutlined />}
        <OllamaFlowText
          fontSize={type === "section" ? 20 : type === "sub-section" ? 18 : 16}
          weight={600}
          className="mb-0"
        >
          {title}
        </OllamaFlowText>
      </OllamaFlowFlex>
      {description && <OllamaFlowText>{description}</OllamaFlowText>}
    </div>
  );
};

export default FormHeading;
