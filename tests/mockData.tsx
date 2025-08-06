import { Backend, Frontend } from "#/lib/store/slice/types";

export const mockBackendIdentifier = "backend-1";
export const mockFrontendIdentifier = "frontend-1";

export const mockBackendData: Backend = {
  Identifier: mockBackendIdentifier,
  Name: "Backend 1",
  Hostname: "localhost",
  Port: 43411,
  Ssl: false,
  UnhealthyThreshold: 3,
  HealthyThreshold: 3,
  HealthCheckMethod: "GET",
  HealthCheckUrl: "/health",
  MaxParallelRequests: 10,
  RateLimitRequestsThreshold: 100,
  LogRequestFull: true,
  LogRequestBody: true,
  LogResponseBody: true,
  Active: true,
  CreatedUtc: "2021-01-01",
  LastUpdateUtc: "2021-01-01",
};

export const mockFrontendData: Frontend = {
  Identifier: mockFrontendIdentifier,
  Name: "Frontend 1",
  Hostname: "localhost",
  TimeoutMs: 1000,
  LoadBalancing: "round_robin",
  BlockHttp10: false,
  MaxRequestBodySize: 1000000,
  Backends: ["1"],
  RequiredModels: ["model1", "model2"],
  LogRequestFull: true,
  LogRequestBody: true,
  LogResponseBody: true,
  Active: true,
  CreatedUtc: "2021-01-01",
  LastUpdateUtc: "2021-01-01",
};

export const mockBackendListData = [mockBackendData];
