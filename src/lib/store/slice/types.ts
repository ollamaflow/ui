export interface Frontend {
  Identifier: string;
  Name: string;
  Hostname: string;
  TimeoutMs: number;
  LoadBalancing: string;
  BlockHttp10: boolean;
  MaxRequestBodySize: number;
  Backends: string[];
  RequiredModels: string[];
  LogRequestFull: boolean;
  LogRequestBody: boolean;
  LogResponseBody: boolean;
  Active: boolean;
  CreatedUtc: string;
  LastUpdateUtc: string;
}

export interface Backend {
  Identifier: string;
  Name: string;
  Hostname: string;
  Port: number;
  Ssl: boolean;
  UnhealthyThreshold: number;
  HealthyThreshold: number;
  HealthCheckMethod: { Method: string };
  HealthCheckUrl: string;
  MaxParallelRequests: number;
  RateLimitRequestsThreshold: number;
  LogRequestFull: boolean;
  LogRequestBody: boolean;
  LogResponseBody: boolean;
  Active: boolean;
  CreatedUtc: string;
  LastUpdateUtc: string;
}
