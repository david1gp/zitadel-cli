import { buildApplication, buildRouteMap, help, version } from "@stricli/core"
import { PACKAGE_VERSION } from "../packageVersion.js"
import { apiCallCommand } from "./apiCallCommand.js"
import { apiDescribeCommand } from "./apiDescribeCommand.js"
import { apiListCommand } from "./apiListCommand.js"
import { actionsExecutionFunctionsListCommand } from "./actionsExecutionFunctionsListCommand.js"
import { actionsExecutionMethodsListCommand } from "./actionsExecutionMethodsListCommand.js"
import { actionsExecutionServicesListCommand } from "./actionsExecutionServicesListCommand.js"
import { actionsExecutionsListCommand } from "./actionsExecutionsListCommand.js"
import { actionsExecutionsSetCommand } from "./actionsExecutionsSetCommand.js"
import { actionsPublicKeysListCommand } from "./actionsPublicKeysListCommand.js"
import { actionsRemovePublicKeyCommand } from "./actionsRemovePublicKeyCommand.js"
import { actionsTargetsActivatePublicKeyCommand } from "./actionsTargetsActivatePublicKeyCommand.js"
import { actionsTargetsAddPublicKeyCommand } from "./actionsTargetsAddPublicKeyCommand.js"
import { actionsTargetsCreateCommand } from "./actionsTargetsCreateCommand.js"
import { actionsTargetsDeactivatePublicKeyCommand } from "./actionsTargetsDeactivatePublicKeyCommand.js"
import { actionsTargetsDeleteCommand } from "./actionsTargetsDeleteCommand.js"
import { actionsTargetsGetCommand } from "./actionsTargetsGetCommand.js"
import { actionsTargetsListCommand } from "./actionsTargetsListCommand.js"
import { actionsTargetsUpdateCommand } from "./actionsTargetsUpdateCommand.js"
import { applicationsCreateCommand } from "./applicationsCreateCommand.js"
import { applicationsCreateKeyCommand } from "./applicationsCreateKeyCommand.js"
import { applicationsDeactivateCommand } from "./applicationsDeactivateCommand.js"
import { applicationsDeleteCommand } from "./applicationsDeleteCommand.js"
import { applicationsDeleteApplicationKeyCommand } from "./applicationsDeleteApplicationKeyCommand.js"
import { applicationsGenerateClientSecretCommand } from "./applicationsGenerateClientSecretCommand.js"
import { applicationsGetCommand } from "./applicationsGetCommand.js"
import { applicationsGetApplicationKeyCommand } from "./applicationsGetApplicationKeyCommand.js"
import { applicationsListCommand } from "./applicationsListCommand.js"
import { applicationsKeysListCommand } from "./applicationsKeysListCommand.js"
import { applicationsReactivateCommand } from "./applicationsReactivateCommand.js"
import { applicationsUpdateCommand } from "./applicationsUpdateCommand.js"
import { deviceAuthorizationCommand } from "../protocol/deviceAuthorizationCommand.js"
import { adminListIDPsCommand } from "../legacy_v1/adminListIDPsCommand.js"
import { adminAddGoogleProviderCommand } from "./adminAddGoogleProviderCommand.js"
import { internalPermissionsCreateAdministratorCommand } from "./internalPermissionsCreateAdministratorCommand.js"
import { internalPermissionsDeleteAdministratorCommand } from "./internalPermissionsDeleteAdministratorCommand.js"
import { internalPermissionsListAdministratorsCommand } from "./internalPermissionsListAdministratorsCommand.js"
import { internalPermissionsUpdateAdministratorCommand } from "./internalPermissionsUpdateAdministratorCommand.js"
import { organizationsActivateCommand } from "./organizationsActivateCommand.js"
import { organizationsAddCommand } from "./organizationsAddCommand.js"
import { organizationsAddOrganizationDomainCommand } from "./organizationsAddOrganizationDomainCommand.js"
import { organizationsDeleteCommand } from "./organizationsDeleteCommand.js"
import { organizationsDeleteOrganizationDomainCommand } from "./organizationsDeleteOrganizationDomainCommand.js"
import { organizationsDeleteOrganizationMetadataCommand } from "./organizationsDeleteOrganizationMetadataCommand.js"
import { organizationsDeactivateCommand } from "./organizationsDeactivateCommand.js"
import { organizationsDomainsListCommand } from "./organizationsDomainsListCommand.js"
import { organizationsGenerateOrganizationDomainValidationCommand } from "./organizationsGenerateOrganizationDomainValidationCommand.js"
import { organizationsListCommand } from "./organizationsListCommand.js"
import { organizationsListOrganizationMetadataCommand } from "./organizationsListOrganizationMetadataCommand.js"
import { organizationsSetOrganizationMetadataCommand } from "./organizationsSetOrganizationMetadataCommand.js"
import { organizationsUpdateCommand } from "./organizationsUpdateCommand.js"
import { organizationsVerifyOrganizationDomainCommand } from "./organizationsVerifyOrganizationDomainCommand.js"
import { projectsActivateCommand } from "./projectsActivateCommand.js"
import { projectsActivateProjectGrantCommand } from "./projectsActivateProjectGrantCommand.js"
import { projectsAddRoleCommand } from "./projectsAddRoleCommand.js"
import { projectsCreateGrantCommand } from "./projectsCreateGrantCommand.js"
import { projectsCreateCommand } from "./projectsCreateCommand.js"
import { projectsDeleteCommand } from "./projectsDeleteCommand.js"
import { projectsDeleteProjectGrantCommand } from "./projectsDeleteProjectGrantCommand.js"
import { projectsDeactivateCommand } from "./projectsDeactivateCommand.js"
import { projectsDeactivateProjectGrantCommand } from "./projectsDeactivateProjectGrantCommand.js"
import { projectsGetCommand } from "./projectsGetCommand.js"
import { projectsListCommand } from "./projectsListCommand.js"
import { projectsListProjectGrantsCommand } from "./projectsListProjectGrantsCommand.js"
import { projectsRolesListCommand } from "./projectsRolesListCommand.js"
import { projectsRemoveProjectRoleCommand } from "./projectsRemoveProjectRoleCommand.js"
import { projectsRolesUpdateCommand } from "./projectsRolesUpdateCommand.js"
import { projectsUpdateCommand } from "./projectsUpdateCommand.js"
import { projectsUpdateProjectGrantCommand } from "./projectsUpdateProjectGrantCommand.js"
import { oauthTokenRequestCommand } from "../protocol/oauthTokenRequestCommand.js"
import { oidcDiscoveryCommand } from "./oidcDiscoveryCommand.js"
import { oidcUserInfoCommand } from "./oidcUserInfoCommand.js"
import { usersAddIDPLinkCommand } from "./usersAddIDPLinkCommand.js"
import { usersAddKeyCommand } from "./usersAddKeyCommand.js"
import { usersAddOTPEmailCommand } from "./usersAddOTPEmailCommand.js"
import { usersAddOTPSMSCommand } from "./usersAddOTPSMSCommand.js"
import { usersAddPersonalAccessTokenCommand } from "./usersAddPersonalAccessTokenCommand.js"
import { usersAddSecretCommand } from "./usersAddSecretCommand.js"
import { usersCreateCommand } from "./usersCreateCommand.js"
import { usersCreateInviteCodeCommand } from "./usersCreateInviteCodeCommand.js"
import { usersCreatePasskeyRegistrationLinkCommand } from "./usersCreatePasskeyRegistrationLinkCommand.js"
import { usersDeactivateCommand } from "./usersDeactivateCommand.js"
import { usersDeleteCommand } from "./usersDeleteCommand.js"
import { usersDeleteUserMetadataCommand } from "./usersDeleteUserMetadataCommand.js"
import { usersGenerateRecoveryCodesCommand } from "./usersGenerateRecoveryCodesCommand.js"
import { usersGetCommand } from "./usersGetCommand.js"
import { usersHumanMFAInitSkippedCommand } from "./usersHumanMFAInitSkippedCommand.js"
import { usersListAuthenticationFactorsCommand } from "./usersListAuthenticationFactorsCommand.js"
import { usersListAuthenticationMethodTypesCommand } from "./usersListAuthenticationMethodTypesCommand.js"
import { usersListIDPLinksCommand } from "./usersListIDPLinksCommand.js"
import { usersListKeysCommand } from "./usersListKeysCommand.js"
import { usersListCommand } from "./usersListCommand.js"
import { usersListPasskeysCommand } from "./usersListPasskeysCommand.js"
import { usersListPersonalAccessTokensCommand } from "./usersListPersonalAccessTokensCommand.js"
import { usersListUserMetadataCommand } from "./usersListUserMetadataCommand.js"
import { usersLockCommand } from "./usersLockCommand.js"
import { usersReactivateCommand } from "./usersReactivateCommand.js"
import { usersRegisterPasskeyCommand } from "./usersRegisterPasskeyCommand.js"
import { usersRegisterTOTPCommand } from "./usersRegisterTOTPCommand.js"
import { usersRegisterU2FCommand } from "./usersRegisterU2FCommand.js"
import { usersRemoveIDPLinkCommand } from "./usersRemoveIDPLinkCommand.js"
import { usersRemoveKeyCommand } from "./usersRemoveKeyCommand.js"
import { usersRemoveOTPEmailCommand } from "./usersRemoveOTPEmailCommand.js"
import { usersRemoveOTPSMSCommand } from "./usersRemoveOTPSMSCommand.js"
import { usersRemovePasskeyCommand } from "./usersRemovePasskeyCommand.js"
import { usersRemovePersonalAccessTokenCommand } from "./usersRemovePersonalAccessTokenCommand.js"
import { usersRemoveRecoveryCodesCommand } from "./usersRemoveRecoveryCodesCommand.js"
import { usersRemoveSecretCommand } from "./usersRemoveSecretCommand.js"
import { usersRemoveTOTPCommand } from "./usersRemoveTOTPCommand.js"
import { usersRemoveU2FCommand } from "./usersRemoveU2FCommand.js"
import { usersResendEmailCodeCommand } from "./usersResendEmailCodeCommand.js"
import { usersResendPhoneCodeCommand } from "./usersResendPhoneCodeCommand.js"
import { usersRetrieveIdentityProviderIntentCommand } from "./usersRetrieveIdentityProviderIntentCommand.js"
import { usersSendEmailCodeCommand } from "./usersSendEmailCodeCommand.js"
import { usersSetPasswordCommand } from "./usersSetPasswordCommand.js"
import { usersSetUserMetadataCommand } from "./usersSetUserMetadataCommand.js"
import { usersStartIdentityProviderIntentCommand } from "./usersStartIdentityProviderIntentCommand.js"
import { usersUnlockCommand } from "./usersUnlockCommand.js"
import { usersUpdateCommand } from "./usersUpdateCommand.js"
import { usersVerifyEmailCommand } from "./usersVerifyEmailCommand.js"
import { usersVerifyInviteCodeCommand } from "./usersVerifyInviteCodeCommand.js"
import { usersVerifyPasskeyRegistrationCommand } from "./usersVerifyPasskeyRegistrationCommand.js"
import { usersVerifyPhoneCommand } from "./usersVerifyPhoneCommand.js"
import { usersVerifyTOTPRegistrationCommand } from "./usersVerifyTOTPRegistrationCommand.js"
import { usersVerifyU2FRegistrationCommand } from "./usersVerifyU2FRegistrationCommand.js"

const actionsTargetsRoute = buildRouteMap({
  routes: {
    activatePublicKey: actionsTargetsActivatePublicKeyCommand,
    addPublicKey: actionsTargetsAddPublicKeyCommand,
    create: actionsTargetsCreateCommand,
    deactivatePublicKey: actionsTargetsDeactivatePublicKeyCommand,
    delete: actionsTargetsDeleteCommand,
    get: actionsTargetsGetCommand,
    list: actionsTargetsListCommand,
    update: actionsTargetsUpdateCommand,
  },
  docs: {
    brief: "Action target operations",
  },
})

const actionsExecutionFunctionsRoute = buildRouteMap({
  routes: {
    list: actionsExecutionFunctionsListCommand,
  },
  docs: {
    brief: "Action execution function operations",
  },
})

const actionsExecutionMethodsRoute = buildRouteMap({
  routes: {
    list: actionsExecutionMethodsListCommand,
  },
  docs: {
    brief: "Action execution method operations",
  },
})

const actionsExecutionServicesRoute = buildRouteMap({
  routes: {
    list: actionsExecutionServicesListCommand,
  },
  docs: {
    brief: "Action execution service operations",
  },
})

const actionsExecutionsRoute = buildRouteMap({
  routes: {
    list: actionsExecutionsListCommand,
    set: actionsExecutionsSetCommand,
  },
  docs: {
    brief: "Action execution operations",
  },
})

const actionsPublicKeysRoute = buildRouteMap({
  routes: {
    list: actionsPublicKeysListCommand,
  },
  docs: {
    brief: "Action public key operations",
  },
})

const actionsRoute = buildRouteMap({
  routes: {
    executionFunctions: actionsExecutionFunctionsRoute,
    executionMethods: actionsExecutionMethodsRoute,
    executionServices: actionsExecutionServicesRoute,
    executions: actionsExecutionsRoute,
    publicKeys: actionsPublicKeysRoute,
    removePublicKey: actionsRemovePublicKeyCommand,
    targets: actionsTargetsRoute,
  },
  docs: {
    brief: "Action operations",
  },
})

const applicationsKeysRoute = buildRouteMap({
  routes: {
    list: applicationsKeysListCommand,
  },
  docs: {
    brief: "Application key operations",
  },
})

const applicationsRoute = buildRouteMap({
  routes: {
    create: applicationsCreateCommand,
    createKey: applicationsCreateKeyCommand,
    deactivate: applicationsDeactivateCommand,
    delete: applicationsDeleteCommand,
    deleteApplicationKey: applicationsDeleteApplicationKeyCommand,
    generateClientSecret: applicationsGenerateClientSecretCommand,
    get: applicationsGetCommand,
    getApplicationKey: applicationsGetApplicationKeyCommand,
    keys: applicationsKeysRoute,
    list: applicationsListCommand,
    reactivate: applicationsReactivateCommand,
    update: applicationsUpdateCommand,
  },
  docs: {
    brief: "Application operations",
  },
})

const apiRoute = buildRouteMap({
  routes: {
    call: apiCallCommand,
    describe: apiDescribeCommand,
    list: apiListCommand,
  },
  docs: {
    brief: "Policy-filtered API discovery and invocation",
  },
})

const legacyV1Route = buildRouteMap({
  routes: {
    addGoogleProvider: adminAddGoogleProviderCommand,
    "list-idps": adminListIDPsCommand,
  },
  docs: {
    brief: "Legacy v1 compatibility operations",
  },
})

const internalPermissionsAdministratorsRoute = buildRouteMap({
  routes: {
    create: internalPermissionsCreateAdministratorCommand,
    delete: internalPermissionsDeleteAdministratorCommand,
    list: internalPermissionsListAdministratorsCommand,
    update: internalPermissionsUpdateAdministratorCommand,
  },
  docs: {
    brief: "Administrator operations",
  },
})

const internalPermissionsRoute = buildRouteMap({
  routes: {
    administrators: internalPermissionsAdministratorsRoute,
  },
  docs: {
    brief: "Internal permission operations",
  },
})

const organizationsDomainsRoute = buildRouteMap({
  routes: {
    list: organizationsDomainsListCommand,
  },
  docs: {
    brief: "Organization domain operations",
  },
})

const organizationsRoute = buildRouteMap({
  routes: {
    activate: organizationsActivateCommand,
    add: organizationsAddCommand,
    addOrganizationDomain: organizationsAddOrganizationDomainCommand,
    deactivate: organizationsDeactivateCommand,
    delete: organizationsDeleteCommand,
    deleteOrganizationDomain: organizationsDeleteOrganizationDomainCommand,
    deleteOrganizationMetadata: organizationsDeleteOrganizationMetadataCommand,
    domains: organizationsDomainsRoute,
    generateOrganizationDomainValidation: organizationsGenerateOrganizationDomainValidationCommand,
    list: organizationsListCommand,
    listOrganizationMetadata: organizationsListOrganizationMetadataCommand,
    setOrganizationMetadata: organizationsSetOrganizationMetadataCommand,
    update: organizationsUpdateCommand,
    verifyOrganizationDomain: organizationsVerifyOrganizationDomainCommand,
  },
  docs: {
    brief: "Organization operations",
  },
})

const projectsGrantsRoute = buildRouteMap({
  routes: {
    activate: projectsActivateProjectGrantCommand,
    create: projectsCreateGrantCommand,
    deactivate: projectsDeactivateProjectGrantCommand,
    delete: projectsDeleteProjectGrantCommand,
    list: projectsListProjectGrantsCommand,
    update: projectsUpdateProjectGrantCommand,
  },
  docs: {
    brief: "Project grant operations",
  },
})

const projectsRolesRoute = buildRouteMap({
  routes: {
    add: projectsAddRoleCommand,
    list: projectsRolesListCommand,
    remove: projectsRemoveProjectRoleCommand,
    update: projectsRolesUpdateCommand,
  },
  docs: {
    brief: "Project role operations",
  },
})

const projectsRoute = buildRouteMap({
  routes: {
    activate: projectsActivateCommand,
    create: projectsCreateCommand,
    deactivate: projectsDeactivateCommand,
    delete: projectsDeleteCommand,
    get: projectsGetCommand,
    grants: projectsGrantsRoute,
    list: projectsListCommand,
    roles: projectsRolesRoute,
    update: projectsUpdateCommand,
  },
  docs: {
    brief: "Project operations",
  },
})

const usersRoute = buildRouteMap({
  routes: {
    "add-idp-link": usersAddIDPLinkCommand,
    addKey: usersAddKeyCommand,
    "add-otp-email": usersAddOTPEmailCommand,
    "add-otp-sms": usersAddOTPSMSCommand,
    addPersonalAccessToken: usersAddPersonalAccessTokenCommand,
    addSecret: usersAddSecretCommand,
    create: usersCreateCommand,
    createInviteCode: usersCreateInviteCodeCommand,
    createPasskeyRegistrationLink: usersCreatePasskeyRegistrationLinkCommand,
    deactivate: usersDeactivateCommand,
    delete: usersDeleteCommand,
    deleteUserMetadata: usersDeleteUserMetadataCommand,
    generateRecoveryCodes: usersGenerateRecoveryCodesCommand,
    get: usersGetCommand,
    "human-mfa-init-skipped": usersHumanMFAInitSkippedCommand,
    listAuthenticationFactors: usersListAuthenticationFactorsCommand,
    listAuthenticationMethodTypes: usersListAuthenticationMethodTypesCommand,
    "list-idp-links": usersListIDPLinksCommand,
    listKeys: usersListKeysCommand,
    list: usersListCommand,
    listPasskeys: usersListPasskeysCommand,
    listPersonalAccessTokens: usersListPersonalAccessTokensCommand,
    listUserMetadata: usersListUserMetadataCommand,
    lock: usersLockCommand,
    reactivate: usersReactivateCommand,
    registerPasskey: usersRegisterPasskeyCommand,
    "register-totp": usersRegisterTOTPCommand,
    "register-u2f": usersRegisterU2FCommand,
    "remove-idp-link": usersRemoveIDPLinkCommand,
    removeKey: usersRemoveKeyCommand,
    "remove-otp-email": usersRemoveOTPEmailCommand,
    "remove-otp-sms": usersRemoveOTPSMSCommand,
    removePasskey: usersRemovePasskeyCommand,
    removePersonalAccessToken: usersRemovePersonalAccessTokenCommand,
    removeRecoveryCodes: usersRemoveRecoveryCodesCommand,
    removeSecret: usersRemoveSecretCommand,
    "remove-totp": usersRemoveTOTPCommand,
    "remove-u2f": usersRemoveU2FCommand,
    resendEmailCode: usersResendEmailCodeCommand,
    resendPhoneCode: usersResendPhoneCodeCommand,
    retrieveIdentityProviderIntent: usersRetrieveIdentityProviderIntentCommand,
    sendEmailCode: usersSendEmailCodeCommand,
    setPassword: usersSetPasswordCommand,
    setUserMetadata: usersSetUserMetadataCommand,
    startIdentityProviderIntent: usersStartIdentityProviderIntentCommand,
    unlock: usersUnlockCommand,
    update: usersUpdateCommand,
    verifyEmail: usersVerifyEmailCommand,
    verifyInviteCode: usersVerifyInviteCodeCommand,
    verifyPasskeyRegistration: usersVerifyPasskeyRegistrationCommand,
    verifyPhone: usersVerifyPhoneCommand,
    "verify-totp-registration": usersVerifyTOTPRegistrationCommand,
    "verify-u2f-registration": usersVerifyU2FRegistrationCommand,
  },
  docs: {
    brief: "User operations",
  },
})

const protocolRoute = buildRouteMap({
  routes: {
    deviceAuthorization: deviceAuthorizationCommand,
    discovery: oidcDiscoveryCommand,
    token: oauthTokenRequestCommand,
    userinfo: oidcUserInfoCommand,
  },
  docs: {
    brief: "OIDC and OAuth protocol operations",
  },
})

export const zitadelCliApplication = buildApplication(
  buildRouteMap({
    routes: {
      api: apiRoute,
      actions: actionsRoute,
      applications: applicationsRoute,
      internalPermissions: internalPermissionsRoute,
      legacyV1: legacyV1Route,
      organizations: organizationsRoute,
      protocol: protocolRoute,
      projects: projectsRoute,
      users: usersRoute,
    },
    docs: {
      brief: "Typed ZITADEL API CLI",
    },
  }),
  {
    name: "zitadel-cli",
    documentation: {
      caseStyle: "convert-camel-to-kebab",
    },
    scanner: {
      caseStyle: "allow-kebab-for-camel",
    },
  },
  {
    help: help({
      brief: "Print help information and exit",
      formatting: {
        caseStyle: "convert-camel-to-kebab",
        onlyRequiredInUsageLine: false,
        useAliasInUsageLine: false,
      },
    }),
    version: version({
      brief: "Print version information and exit",
      info: {
        currentVersion: PACKAGE_VERSION,
      },
    }),
  },
)
