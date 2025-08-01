import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query";
import apiSlice, { ApiBaseQueryArgs } from "../rtk/rtkApiInstance";
import { Frontend } from "./types";

export enum SliceTags {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
}

const enhancedApiSlice = apiSlice.enhanceEndpoints({
  addTagTypes: [SliceTags.FRONTEND, SliceTags.BACKEND],
});

const apiPathSlice = enhancedApiSlice.injectEndpoints({
  endpoints: (
    builder: EndpointBuilder<
      BaseQueryFn<ApiBaseQueryArgs, unknown, unknown>,
      SliceTags,
      "api"
    >
  ) => ({
    validateConnectivity: builder.mutation<boolean, void>({
      query: () => ({
        url: "/",
        method: "HEAD",
      }),
      transformResponse: (response: any) => (response === "" ? true : false),
    }),
    getFrontendTest: builder.mutation<boolean, void>({
      query: () => ({
        url: "v1.0/frontends",
      }),
      transformResponse: (response: Frontend[]) => {
        console.log(response);
        return response.length > 0;
      },
    }),
    getFrontend: builder.query({
      query: (arg: any) => ({
        url: "v1.0/frontends",
      }),
      providesTags: [SliceTags.FRONTEND],
      transformResponse: (response: any) => response,
    }),
    getBackend: builder.query({
      query: (arg: any) => ({
        url: "v1.0/backends",
      }),
      providesTags: [SliceTags.BACKEND],
      transformResponse: (response: any) => response,
    }),
  }),
});

export const {
  useGetFrontendQuery,
  useValidateConnectivityMutation,
  useGetFrontendTestMutation,
  useGetBackendQuery,
} = apiPathSlice;
