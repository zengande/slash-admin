import { GLOBAL_CONFIG } from "@/global-config";
import { type OidcConfiguration, TokenAutomaticRenewMode, TokenRenewMode } from "@axa-fr/react-oidc";

export const configuration: OidcConfiguration = {
	authority: GLOBAL_CONFIG.authority,
	client_id: "bedrock-adminui",
	redirect_uri: `${window.location.origin}/auth/callback`,
	silent_redirect_uri: `${window.location.origin}/auth/silent-callback`,
	scope: "openid email address phone profile offline_access roles bedrock-api",
	storage: localStorage,
	refresh_time_before_tokens_expiration_in_second: 40,
	token_renew_mode: TokenRenewMode.access_token_invalid,
	token_automatic_renew_mode: TokenAutomaticRenewMode.AutomaticBeforeTokenExpiration,
	service_worker_only: false,
};
