/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    LoggerOptions,
    INetworkModule,
    LogLevel,
    ProtocolMode,
    ICachePlugin
} from "@azure/msal-common";
import { NetworkUtils } from "../utils/NetworkUtils";

/**
 * - clientId               - Client id of the application.
 * - authority              - Url of the authority. If no value is set, defaults to https://login.microsoftonline.com/common.
 * - knownAuthorities       - Needed for Azure B2C and ADFS. All authorities that will be used in the client application. Only the host of the authority should be passed in.
 * - clientSecret           - Secret string that the application uses when requesting a token. Only used in confidential client applications. Can be created in the Azure app registration portal.
 * - clientAssertion        - Assertion string that the application uses when requesting a token. Only used in confidential client applications. Assertion should be of type urn:ietf:params:oauth:client-assertion-type:jwt-bearer.
 * - clientCertificate      - Certificate that the application uses when requesting a token. Only used in confidential client applications. Requires hex encoded X.509 SHA-1 thumbprint of the certificiate, and the PEM encoded private key (string should contain -----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY----- )
 * - protocolMode           - Enum that represents the protocol that msal follows. Used for configuring proper endpoints.
 */
export type NodeAuthOptions = {
    clientId: string;
    authority?: string;
    clientSecret?: string;
    clientAssertion?:string;
    clientCertificate?: {
        thumbprint: string,
        privateKey: string,
    };
    knownAuthorities?: Array<string>;
    cloudDiscoveryMetadata?: string;
    clientCapabilities?: [];
    protocolMode?: ProtocolMode;
};

/**
 * Use this to configure the below cache configuration options:
 *
 * - cachePlugin   - Plugin for reading and writing token cache to disk.
 */
export type CacheOptions = {
    cachePlugin?: ICachePlugin;
};

/**
 * Type for configuring logger and http client options
 *
 * - logger                       - Used to initialize the Logger object; TODO: Expand on logger details or link to the documentation on logger
 * - networkClient                - Http client used for all http get and post calls. Defaults to using MSAL's default http client.
 */
export type NodeSystemOptions = {
    loggerOptions?: LoggerOptions;
    networkClient?: INetworkModule;
};

/**
 * Use the configuration object to configure MSAL and initialize the client application object
 *
 * - auth: this is where you configure auth elements like clientID, authority used for authenticating against the Microsoft Identity Platform
 * - cache: this is where you configure cache location
 * - system: this is where you can configure the network client, logger
 */
export type Configuration = {
    auth: NodeAuthOptions;
    cache?: CacheOptions;
    system?: NodeSystemOptions;
};

const DEFAULT_AUTH_OPTIONS: NodeAuthOptions = {
    clientId: "",
    authority: "",
    clientSecret: "",
    clientAssertion: "",
    clientCertificate: {
        thumbprint: "",
        privateKey: "",
    },
    knownAuthorities: [],
    cloudDiscoveryMetadata: "",
    clientCapabilities: [],
    protocolMode: ProtocolMode.AAD
};

const DEFAULT_CACHE_OPTIONS: CacheOptions = {};

const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    loggerCallback: (): void => {
        // allow users to not set logger call back
    },
    piiLoggingEnabled: false,
    logLevel: LogLevel.Info,
};

const DEFAULT_SYSTEM_OPTIONS: NodeSystemOptions = {
    loggerOptions: DEFAULT_LOGGER_OPTIONS,
    networkClient: NetworkUtils.getNetworkClient(),
};

/**
 * Sets the default options when not explicitly configured from app developer
 *
 * @param auth
 * @param cache
 * @param system
 *
 * @returns Configuration
 */
export function buildAppConfiguration({
    auth,
    cache,
    system,
}: Configuration): Configuration {
    return {
        auth: { ...DEFAULT_AUTH_OPTIONS, ...auth },
        cache: { ...DEFAULT_CACHE_OPTIONS, ...cache },
        system: { ...DEFAULT_SYSTEM_OPTIONS, ...system },
    };
}
