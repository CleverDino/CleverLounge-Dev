<template>
	<span
		:class="[
			'user',
			nickColor(store.state.settings.coloredNicks),
			{ active: active },
			displayClass
		]"
		:data-name="user.nick"
		:data-mam-class="mamClass?.class"
		role="button"
		@mouseenter="onHover ? hover : null"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
	>
		<slot>{{ mode }}{{ user.nick }}</slot>
		
		<!-- Show MAM class icon/badge -->
		<span v-if="mamClassIcon && mamClassShort" class="mam-class-badge" :title="mamClassName">
			{{ mamClassIcon }} {{ mamClassShort }}
		</span>
	</span>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import type {UserInMessage} from "../../../shared/types/msg";
import eventbus from "../js/eventbus";
import colorClass from "../js/helpers/colorClass";
import type {ClientChan, ClientNetwork} from "../js/types";
import {useStore} from "../js/store";
import {hostmaskCache, updateCache} from "../js/hostmaskCache";

type UsernameUser = Partial<UserInMessage> & {
	mode?: string;
	nick: string;
};

export default defineComponent({
	name: "Username",
	props: {
		user: {
			type: Object as PropType<UsernameUser | UserInMessage>,
			required: true,
		},
		active: Boolean,
		onHover: {
			type: Function as PropType<(user: UserInMessage) => void>,
			required: false,
		},
		channel: {
			type: Object as PropType<ClientChan>,
			required: false,
		},
		network: {
			type: Object as PropType<ClientNetwork>,
			required: false,
		},
	},
	setup(props) {
		const store = useStore();
		
		// IRC mode detection
		const mode = computed(() => {
			if (props.user.modes) {
				return props.user.modes[0];
			}
			return props.user.mode;
		});

		// IRC role class
		const ircModeClass = computed(() => {
			const userMode = mode.value;
			if (!userMode) return "user-mode-normal";

			const modeMap: Record<string, string> = {
				"~": "user-mode-owner",
				"&": "user-mode-admin",
				"@": "user-mode-op",
				"%": "user-mode-half-op",
				"+": "user-mode-voice",
			};
			return modeMap[userMode] || "user-mode-normal";
		});

		// Get hostmask (with caching)
		const getHostmask = computed(() => {
			// First check if user object has hostmask (from messages)
			const directHostmask = (props.user as any).hostmask;
			
			if (directHostmask) {
				// Cache it for future use with persistence
				updateCache(props.user.nick, directHostmask);
				return directHostmask;
			}
			
			// Try to get from cache (from WHOIS or previous messages)
			const cachedHostmask = hostmaskCache.get(props.user.nick.toLowerCase());
			if (cachedHostmask) {
				return cachedHostmask;
			}
			
			return "";
		});

		// MAM class detection
		const mamClass = computed(() => {
			const hostmask = getHostmask.value;
			
			if (!hostmask) {
				return null;
			}
			
			// Match pattern: user@CLASS.TYPE.mam
			// Examples: user@elite.member.mam, user@mod.staff.mam, user@entry.staff.mam
			const match = hostmask.match(/@([^.]+)\.([^.]+)\.mam/);

			if (match) {
				return {
					class: match[1],
					type: match[2],
				};
			}

			return null;
		});

		// MAM class CSS class
		const mamClassCssClass = computed(() => {
			if (!mamClass.value) return "";
			return `mam-class-${mamClass.value.class}`;
		});

		// MAM class icons
		const mamClassIcon = computed(() => {
			if (!mamClass.value) return "";

			const icons: Record<string, string> = {
				mouse: "🐭",
				user: "👤",
				"p-user": "⚡",
				vip: "💎",
				"e-vip": "💎✨",
				elite: "⭐",
				supporter: "❤️",
				mouseketeer: "🎭",
				uploader: "📤",
				entry: "🛡️",
				support: "🆘",
				"f-mod": "📝",
				"t-mod": "🎬",
				mod: "🛡️",
				"sr-mod": "⚔️",
				admin: "👑",
				"sr-admin": "👑✨",
				sysop: "⚙️",
				dev: "💻",
				"uploaders-c": "📤👑",
			};

			return icons[mamClass.value.class] || "";
		});

		// MAM class display name
		const mamClassName = computed(() => {
			if (!mamClass.value) return "";

			const names: Record<string, string> = {
				mouse: "Mouse",
				user: "User",
				"p-user": "Power User",
				vip: "VIP",
				"e-vip": "Elite VIP",
				elite: "Elite",
				supporter: "Supporter",
				mouseketeer: "Mouseketeer",
				uploader: "Uploader",
				entry: "Entry Level Staff",
				support: "Support Staff",
				"f-mod": "Forum Moderator",
				"t-mod": "Torrent Moderator",
				mod: "Moderator",
				"sr-mod": "Senior Moderator",
				admin: "Administrator",
				"sr-admin": "Senior Administrator",
				sysop: "SysOp",
				dev: "Developer",
				"uploaders-c": "Uploader Coordinator",
			};

			return names[mamClass.value.class] || mamClass.value.class;
		});

		// Short name for badge
		const mamClassShort = computed(() => {
			if (!mamClass.value) return "";

			const shorts: Record<string, string> = {
				mouse: "Mouse",
				user: "User",
				"p-user": "PU",
				vip: "VIP",
				"e-vip": "E-VIP",
				elite: "Elite",
				supporter: "Sup",
				mouseketeer: "MK",
				uploader: "UL",
				entry: "ELS",
				support: "Sup",
				"f-mod": "F-Mod",
				"t-mod": "T-Mod",
				mod: "Mod",
				"sr-mod": "Sr-Mod",
				admin: "Admin",
				"sr-admin": "Sr-Admin",
				sysop: "SysOp",
				dev: "Dev",
				"uploaders-c": "UL-C",
			};

			return shorts[mamClass.value.class] || "";
		});

		// Display class
		const displayClass = computed(() => {
			return `${ircModeClass.value} ${mamClassCssClass.value}`;
		});

		// nickColor as function
		const nickColor = (enabled: boolean) => {
			return enabled ? colorClass(props.user.nick!) : "";
		};

		const hover = () => {
			if (props.onHover) {
				return props.onHover(props.user as UserInMessage);
			}
			return null;
		};

		const openContextMenu = (event: Event) => {
			eventbus.emit("contextmenu:user", {
				event: event,
				user: props.user,
				network: props.network,
				channel: props.channel,
			});
		};

		return {
			mode,
			displayClass,
			mamClassIcon,
			mamClassShort,
			mamClassName,
			mamClass,
			nickColor,
			hover,
			openContextMenu,
			store,
		};
	},
});
</script>

<style scoped>
.mam-class-badge {
	font-size: 0.75em;
	margin-left: 4px;
	opacity: 0.9;
}
</style>
