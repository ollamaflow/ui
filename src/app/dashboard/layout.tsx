"use client";
import DashboardLayout from "#/components/layout/DashboardLayout";
import { withAdminAuth } from "#/hoc/hoc";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default withAdminAuth(layout);
