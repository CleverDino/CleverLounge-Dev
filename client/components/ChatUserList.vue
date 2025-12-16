<template>
	<aside
		ref="userlist"
		class="userlist"
		:aria-label="'User list for ' + channel.name"
		@mouseleave="removeHoverUser"
	>
		<div class="count">
			<input
				ref="input"
				:value="userSearchInput"
				:placeholder="
					channel.users.length + ' user' + (channel.users.length === 1 ? '' : 's')
				"
				type="search"
				class="search"
				aria-label="Search among the user list"
				tabindex="-1"
				@input="setUserSearchInput"
				@keydown.up="navigateUserList($event, -1)"
				@keydown.down="navigateUserList($event, 1)"
				@keydown.page-up="navigateUserList($event, -10)"
				@keydown.page-down="navigateUserList($event, 10)"
				@keydown.enter="selectUser"
			/>
		</div>
		<div class="names">
			<div
				v-for="(users, mode) in groupedUsers"
				:key="mode"
				:class="['user-mode', getGroupClass(String(mode))]"
			>
				<!-- Add group header when using MAM classes or queue mode -->
				<div v-if="shouldGroupByMAMClass || isQueueChannel" class="user-group-header">
					{{ getGroupLabel(String(mode)) }}
				</div>

				<template v-if="userSearchInput.length > 0">
					<!-- eslint-disable vue/no-v-text-v-html-on-component -->
					<Username
						v-for="user in users"
						:key="user.original.nick + '-search'"
						:on-hover="hoverUser"
						:active="user.original === activeUser"
						:user="user.original"
						v-html="user.string"
					/>
					<!-- eslint-enable -->
				</template>
				<template v-else>
					<Username
						v-for="user in users"
						:key="user.nick"
						:on-hover="hoverUser"
						:active="user === activeUser"
						:user="user"
					/>
				</template>
			</div>
		</div>
	</aside>
</template>

<style scoped>
.user-group-header {
	padding: 4px 8px;
	margin-top: 8px;
	font-weight: bold;
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	background: rgba(255, 255, 255, 0.05);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	color: rgba(255, 255, 255, 0.7);
	position: sticky;
	top: 0;
	z-index: 1;
}

/* First group shouldn't have top margin */
.user-mode:first-child .user-group-header {
	margin-top: 0;
}
</style>

<script lang="ts">
import {filter as fuzzyFilter} from "fuzzy";
import {computed, defineComponent, nextTick, PropType, ref} from "vue";
import type {UserInMessage} from "../../shared/types/msg";
import type {ClientChan, ClientUser} from "../js/types";
import {hostmaskCache} from "../js/hostmaskCache";
import Username from "./Username.vue";

const modes = {
	"~": "owner",
	"&": "admin",
	"!": "admin",
	"@": "op",
	"%": "half-op",
	"+": "voice",
	"": "normal",
};

// MAM Class labels (tracker user classes)
const mamClassLabels: {[key: string]: string} = {
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

// MAM Class display priority order (staff at top, regular users at bottom)
const mamClassPriority: {[key: string]: number} = {
	dev: 0,
	sysop: 1,
	"sr-admin": 2,
	admin: 3,
	"sr-mod": 4,
	mod: 5,
	"t-mod": 6,
	"f-mod": 7,
	"uploaders-c": 8,
	support: 9,
	entry: 10,
	uploader: 11,
	mouseketeer: 12,
	supporter: 13,
	elite: 14,
	"e-vip": 15,
	vip: 16,
	"p-user": 17,
	user: 18,
	mouse: 19,
	// Queue-specific groups
	"support-queue": 50,
	"invite-queue": 51,
	// IRC mode fallbacks
	"~": 60,
	"&": 61,
	"@": 62,
	"%": 63,
	"+": 64,
	"": 65,
	normal: 65,
};

export default defineComponent({
	name: "ChatUserList",
	components: {
		Username,
	},
	props: {
		channel: {type: Object as PropType<ClientChan>, required: true},
	},
	setup(props) {
		const userSearchInput = ref("");
		const activeUser = ref<UserInMessage | null>();
		const userlist = ref<HTMLDivElement>();

		// Check if this is a queue channel
		const isQueueChannel = computed(() => {
			const channelName = props.channel.name.toLowerCase();
			return channelName === "#help" || channelName === "#anonamouse.net";
		});

		// Get queue type for the channel
		const getQueueType = computed(() => {
			const channelName = props.channel.name.toLowerCase();
			if (channelName === "#help") return "support-queue";
			if (channelName === "#anonamouse.net") return "invite-queue";
			return null;
		});

		// Extract MAM class from hostmask (same logic as Username.vue)
		const getMamClassFromHostmask = (nick: string): string | null => {
			// Try to get hostmask from user object first
			const user = props.channel.users.find((u) => u.nick === nick);
			let hostmask = (user as any)?.hostmask;

			// Fall back to cache
			if (!hostmask) {
				hostmask = hostmaskCache.get(nick.toLowerCase());
			}

			if (!hostmask) {
				return null;
			}

			// Match pattern: user@CLASS.TYPE.mam
			// Examples: user@elite.member.mam, user@mod.staff.mam
			const match = hostmask.match(/@([^.]+)\.([^.]+)\.mam/);

			if (match) {
				return match[1]; // Return the class (elite, mod, user, etc.)
			}

			return null;
		};

		// Determine if we should group by MAM class
		const shouldGroupByMAMClass = computed(() => {
			// Queue channels use special grouping
			if (isQueueChannel.value) {
				return false;
			}

			// Check metadata first
			if (props.channel.metadata?.groupBy === "mamclass") {
				return true;
			}

			// Auto-detect: Check if any user has a MAM hostmask
			const hasMamUsers = props.channel.users.some((user) => {
				const hostmask =
					(user as any).hostmask || hostmaskCache.get(user.nick.toLowerCase());
				return hostmask && hostmask.includes(".mam");
			});

			if (hasMamUsers) {
				return true;
			}

			// Also check channel name patterns
			const channelName = props.channel.name.toLowerCase();
			if (
				channelName.includes("announce") ||
				channelName.includes("mam") ||
				channelName.includes("tracker")
			) {
				return true;
			}

			return false;
		});

		const filteredUsers = computed(() => {
			if (!userSearchInput.value) {
				return;
			}

			return fuzzyFilter(userSearchInput.value, props.channel.users, {
				pre: "<b>",
				post: "</b>",
				extract: (u) => u.nick,
			});
		});

		const groupedUsers = computed(() => {
			const groups: {[key: string]: any[]} = {};

			if (userSearchInput.value && filteredUsers.value) {
				const result = filteredUsers.value;

				for (const user of result) {
					let groupKey: string;

					if (isQueueChannel.value) {
						// Queue channel: +v users go to queue, staff by MAM class, others by IRC mode
						const hasVoice = user.original.modes?.includes("+");
						const mamClass = getMamClassFromHostmask(user.original.nick);

						if (hasVoice && !mamClass) {
							// User with +v and no MAM class = in queue
							groupKey = getQueueType.value || "queue";
						} else if (mamClass) {
							// Staff with MAM class
							groupKey = mamClass;
						} else {
							// Regular user by IRC mode
							const ircMode = user.original.modes?.[0] || "";
							groupKey = ircMode || "normal";
						}
					} else if (shouldGroupByMAMClass.value) {
						// MAM class grouping
						const mamClass = getMamClassFromHostmask(user.original.nick);

						if (mamClass) {
							groupKey = mamClass;
						} else {
							const ircMode = user.original.modes?.[0] || "";
							groupKey = ircMode || "normal";
						}
					} else {
						// Standard IRC mode grouping
						groupKey = user.original.modes?.[0] || "";
					}

					if (!groups[groupKey]) {
						groups[groupKey] = [];
					}

					groups[groupKey].push(user);
				}
			} else {
				for (const user of props.channel.users) {
					let groupKey: string;

					if (isQueueChannel.value) {
						// Queue channel: +v users go to queue, staff by MAM class, others by IRC mode
						const hasVoice = user.modes?.includes("+");
						const mamClass = getMamClassFromHostmask(user.nick);

						if (hasVoice && !mamClass) {
							// User with +v and no MAM class = in queue
							groupKey = getQueueType.value || "queue";
						} else if (mamClass) {
							// Staff with MAM class
							groupKey = mamClass;
						} else {
							// Regular user by IRC mode
							const ircMode = user.modes?.[0] || "";
							groupKey = ircMode || "normal";
						}
					} else if (shouldGroupByMAMClass.value) {
						// MAM class grouping
						const mamClass = getMamClassFromHostmask(user.nick);

						if (mamClass) {
							groupKey = mamClass;
						} else {
							const ircMode = user.modes?.[0] || "";
							groupKey = ircMode || "normal";
						}
					} else {
						// Standard IRC mode grouping
						groupKey = user.modes?.[0] || "";
					}

					if (!groups[groupKey]) {
						groups[groupKey] = [user];
					} else {
						groups[groupKey].push(user);
					}
				}
			}

			// Sort groups by priority
			if (shouldGroupByMAMClass.value || isQueueChannel.value) {
				const sortedGroups: {[key: string]: any[]} = {};
				Object.keys(groups)
					.sort((a, b) => {
						const priorityA = mamClassPriority[a] ?? 999;
						const priorityB = mamClassPriority[b] ?? 999;
						return priorityA - priorityB;
					})
					.forEach((key) => {
						sortedGroups[key] = groups[key];
					});
				return sortedGroups;
			}

			return groups as {
				[mode: string]: (ClientUser & {
					original: UserInMessage;
					string: string;
				})[];
			};
		});

		const setUserSearchInput = (e: Event) => {
			userSearchInput.value = (e.target as HTMLInputElement).value;
		};

		// Handle both IRC modes and MAM classes
		const getGroupClass = (group: string) => {
			if (shouldGroupByMAMClass.value || isQueueChannel.value) {
				// Return CSS-friendly class name for MAM classes or queue
				return "mam-" + group;
			}
			// Return traditional mode class
			return modes[group] as typeof modes;
		};

		// Get display label for group header
		const getGroupLabel = (group: string) => {
			// Queue-specific labels
			if (group === "support-queue") {
				return "Support Queue";
			}
			if (group === "invite-queue") {
				return "Invite Queue";
			}

			if (shouldGroupByMAMClass.value || isQueueChannel.value) {
				// Check if it's a MAM class
				if (mamClassLabels[group]) {
					return mamClassLabels[group];
				}

				// It's an IRC mode fallback
				const modeMap: {[key: string]: string} = {
					"~": "IRC: Owner",
					"&": "IRC: Admin",
					"@": "IRC: Operator",
					"%": "IRC: Half-Op",
					"+": "IRC: Voice",
					normal: "IRC: Regular Users",
					"": "IRC: Regular Users",
				};

				return modeMap[group] || "IRC: " + group;
			}
			return "";
		};

		const selectUser = () => {
			// Simulate a click on the active user to open the context menu.
			// Coordinates are provided to position the menu correctly.
			if (!activeUser.value || !userlist.value) {
				return;
			}

			const el = userlist.value.querySelector(".active");

			if (!el) {
				return;
			}

			const rect = el.getBoundingClientRect();
			const ev = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true,
				clientX: rect.left,
				clientY: rect.top + rect.height,
			});
			el.dispatchEvent(ev);
		};

		const hoverUser = (user: UserInMessage) => {
			activeUser.value = user;
		};

		const removeHoverUser = () => {
			activeUser.value = null;
		};

		const scrollToActiveUser = () => {
			// Scroll the list if needed after the active class is applied
			void nextTick(() => {
				const el = userlist.value?.querySelector(".active");
				el?.scrollIntoView({block: "nearest", inline: "nearest"});
			});
		};

		const navigateUserList = (event: Event, direction: number) => {
			// Prevent propagation to stop global keybind handler from capturing pagedown/pageup
			// and redirecting it to the message list container for scrolling
			event.stopImmediatePropagation();
			event.preventDefault();

			let users = props.channel.users;

			// Only using filteredUsers when we have to avoids filtering when it's not needed
			if (userSearchInput.value && filteredUsers.value) {
				users = filteredUsers.value.map((result) => result.original);
			}

			// Bail out if there's no users to select
			if (!users.length) {
				activeUser.value = null;
				return;
			}

			const abort = () => {
				activeUser.value = direction ? users[0] : users[users.length - 1];
				scrollToActiveUser();
			};

			// If there's no active user select the first or last one depending on direction
			if (!activeUser.value) {
				abort();
				return;
			}

			let currentIndex = users.indexOf(activeUser.value as ClientUser);

			if (currentIndex === -1) {
				abort();
				return;
			}

			currentIndex += direction;

			// Wrap around the list if necessary. Normaly each loop iterates once at most,
			// but might iterate more often if pgup or pgdown are used in a very short user list
			while (currentIndex < 0) {
				currentIndex += users.length;
			}

			while (currentIndex > users.length - 1) {
				currentIndex -= users.length;
			}

			activeUser.value = users[currentIndex];
			scrollToActiveUser();
		};

		return {
			filteredUsers,
			groupedUsers,
			userSearchInput,
			activeUser,
			userlist,
			shouldGroupByMAMClass,
			isQueueChannel,

			setUserSearchInput,
			getGroupClass,
			getGroupLabel,
			selectUser,
			hoverUser,
			removeHoverUser,
			navigateUserList,
		};
	},
});
</script>
